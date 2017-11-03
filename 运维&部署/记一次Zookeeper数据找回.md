---
title: 记一次Zookeeper数据找回
date: 2017-11-3 09:25:22
---

# 1、关于Zookeeper

`ZooKeeper` 是可用于维护配置信息，命名，提供分布式同步分组服务的集中式服务。了解更多，请查看 [官网](https://zookeeper.apache.org/)

`Zookeeper` 在我们这的用途，主要是提供分布式配置管理服务。并且我们有一套UI可以管理这些配置。

# 2、PRD事故

某一天，某个误操作，导致把一个System（配置是树形结构的，system下面包含有多个具体的key，每个key对应的value才是具体给某个app的配置）全部删除了。由于该System很庞大，我们很难采取手工方式恢复。

考虑到数据存储在 `Zookeeper` 中，那么是否 `Zookeeper` 有相关的日志机制，可以恢复呢？

> 由于配置读取后，会缓存在应用中，只要应用不重启，所以短时间内还不会受到配置丢失的影响，这也是为什么在短时间内，并没有影响具体业务。

**由于配置不会经常变，所以就算日志备份不够及时，基本上也是可接受的**

# 3、探索恢复方案

## Round 1

首先，我们先确认了 `Zookeeper` 是否有日志备份机制。很幸运，`Zookeeper` 在默认配置下运行是有进行定期快照和日志备份的。这也就为恢复提供了极大的可能性。

接着，我们从 `${dataDir}/version-2/` 下找到了很多 `snapshot.{hash}` 的快照文件。

拷贝其中最新的快照（如果判断最新？看创建时间）出来，等待测试。

通过查阅资料，我们在Zookeeper源代码中打开 `cmd`， 执行如下命令:

> 我下载的Zookeeper是3.4.9，所以以此版本为例

```bash
java -cp dist-maven/zookeeper-3.4.9.jar;lib/log4j-1.2.16.jar;lib/slf4j-log4j12-1.6.1.jar;lib/slf4j-api-1.6.1.jar org.apache.zookeeper.server.SnapshotFormatter snapshot.4115cad8bf
```
**注意：其中需要的jar文件，都可以在 zookeeper source 下找到。最后一个是具体的快照文件路径**

> 执行之后，控制台刷出一堆数据，欣喜，似乎有戏。

But，仅仅是看起来很好，发现只有Path信息，并没有具体的数据。

## Round 2

别慌，除了快照文件，我们还发现有日志文件，而且单个体积都比快照大（极大可能性有数据）。

接着，我们从 `${dataLogDir}/version-2/` 下找到最新的日志文件，通过执行以下命令查看：

```bash
java -cp dist-maven/zookeeper-3.4.9.jar;lib/log4j-1.2.16.jar;lib/slf4j-log4j12-1.6.1.jar;lib/slf4j-api-1.6.1.jar org.apache.zookeeper.server.LogFormatter log.4115cad8c1
```

通过观察控制台，确实发现有相关数据。

But，数据长这样：

```
session 0x15f5889137c260d cxid 0x3a3 zxid 0x4115caed1f setData '/cloudtask_v2/WORKER-0c6aaa48-8938-4249-8e12-99b71c06b616,#7b2274797065223a322c2
2686f73746e616d65223a224531315745423138222c226c6f636174696f6e223a224531315f45435f584d4c4d616b65725f575757222c226f73223a2277696e646f7773222c22706c6174666f726d223a22616d643634222c22697061646472223a223137322e31362e3134302e323138222c22706964223a313536342c2273696e67696e223a747275652c2274696d657374616d70223a313530393434303732312c22617474616368223a2265794a4b62324a4e5958684462335675644349364d48304b227da,921
```

看起来很难从这里解析出数据。

## Round 3

继续翻资料，发现Zookeeper启动时可以从日志和快照中自动加载数据。

有路就要尝试，把快照和日志拷贝到对应的目录下，然后重启Zookeeper。

> 如何重启？

进入Zookeeper目录，执行 "bin/zkServr.cmd"

看起来有戏，应该加载没有报错。

> 该如何验证呢？

此时，我们尝试使用 `Node` 编写代码，来读取这个Zookeeper的数据。

```js
const zookeeper = require('node-zookeeper-client');

const client = zookeeper.createClient('localhost:2181');

const listChildren = (client, path) => {
  client.getChildren(path, event => {
    // listChildren(client, path);
  }, (error, children, stat) => {
    if (error) {
      console.log('Failed to list children of %s due to: %s.', path, error);
      return;
    }
    // 打印出所有的子节点
    console.log('Children of %s are: %j.', path, children);
  });
};

client.once('connected', function () {
  console.log('Connected to the server.');
  listChildren(client, '/');
});

client.connect();
```

发现确实能查询到正确的数据，接着通过操作该实例，读取到丢失节点的数据，恢复到了产线环境。

# 4、总结

1. 我们在用 `Zookeeper` 的时候，因为差不多是业界标准，所以直接就上了。并没有进行深入研究，导致出了问题再去查，有一定的时间（万一解决得慢）风险
2. 没有预演过程，有较高的不可预测风险
3. 对于这种危险操作，在PRD环境，仅仅是有二次提示，误操作的可能性较高
4. 没有相关的重要数据备份机制，完全依靠了Zookeeper自身的日志（要是Zookeeper没有日志备份，那就麻烦了）