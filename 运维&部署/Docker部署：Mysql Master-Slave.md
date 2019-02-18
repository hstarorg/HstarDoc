---
title: Docker部署：Mysql主从
date: 2019-2-18 20:21:32
---

# 0、前言

博主有个应用，为了提高可用性，打算使用 Mysql 的主从复制。同时，由于 DB 也是部署在容器中的，所以在操作之后，也已此文记录一下。

# 1、环境准备

## 1.1、基础环境

博主主力机为 Windows10，所以是直接 Hyper-V 创建的虚拟机安装 CentOS 7.6 操作系统。

下文出现的宿主机命令，仅针对 Redhat/CentOS ，其他 Linux 系统，需要自行使用同类的命令。

## 1.2、Docker 环境

可直接根据：[https://docs.docker.com/install/linux/docker-ce/centos/](https://docs.docker.com/install/linux/docker-ce/centos/) 完成 Docker 安装。

通过命令行：docker info 进行验证。

## 1.3、目录规划

**推荐将 mysql 的数据和配置放在宿主机目录上，所以需要提前规划目录。**

为了演示，我们准备在一台机器上直接部署三个 mysql 实例，实现一主两从。那么目录准备如下：

1. 首先 `mkdir /opt/db_storage` 创建数据库相关目录（我个人喜欢把/opt 作为存储目录）
2. 按需创建三个目录，用于映射到容器。

```bash
/opt/db_storage/
  mysql01/
    data/ # 用于存放DB数据
    conf/
      my.cnf # 配置文件
  mysql02/ # 子目录同 mysql01
  mysql03/ # 子目录同 mysql01
```

# 2、配置、部署容器

首先，提前准备好 mysql 镜像（也可以直接 docker run 的时候自动下载），如：mysql:8.0.15 mysql:5.7.22

## 2.1、配置 my.cnf

对于 Mysql Master-Salve 来说，第一个要点就是配置 my.cnf。

假设我们把 mysql01 目录作为 Master，那么配置文件简化内容如下：

```bash
# mysql01/conf/my.cnf Master实例的配置
[mysqld]
log-bin=mysql-bin # 开启二进制日志
server_id=1 # 配置server_id，经测试 server-id=1 也可以

# mysql02/conf/my.cnf Slave1 实例的配置
[mysqld]
server-id=12 # 根据个人喜好设置，但必须要唯一

# mysql03/conf/my.cnf Slave2 实例的配置
[mysqld]
server-id=13 # 根据个人喜好设置，但必须要唯一
```

**注意：主要就是 master 实例开启日志，然后 slave 实例配置唯一的 ID。**

## 2.2、创建容器

由于是一台机器上，运行三个实例，所以用 host 网络模式就不是太合适，所以我们选择使用桥接网络模式。

因此，我们执行的命令如下：

```bash
# 创建 Master 容器
docker run --name mysql-master \
-v /opt/db_storage/mysql01/conf:/etc/mysql/conf.d \
-v /opt/db_storage/mysql01/data:/var/lib/mysql \
-p 8001:3306
-e MYSQL_ROOT_PASSWORD=mima \
-d mysql:8.0.15

# 创建 Slave1 容器
docker run --name mysql-master \
-v /opt/db_storage/mysql02/conf:/etc/mysql/conf.d \
-v /opt/db_storage/mysql02/data:/var/lib/mysql \
-p 8002:3306
-e MYSQL_ROOT_PASSWORD=mima \
-d mysql:8.0.15

# 创建 Slave2 容器
docker run --name mysql-master \
-v /opt/db_storage/mysql03/conf:/etc/mysql/conf.d \
-v /opt/db_storage/mysql03/data:/var/lib/mysql \
-p 8003:3306
-e MYSQL_ROOT_PASSWORD=mima \
-d mysql:8.0.15
```

**这里面主要的区别，就是映射到容器的目录以及端口映射有差异。**

至此，我们的容器也准备好了。

# 3、启用主从复制

经过前两个步骤的准备，现在我们只需要连接到 Mysql 实例，然后开启主从复制即可。

**对于 Master 实例**，我们只需要确认下 log-bin 是否正常启用即可。所以连接到 Server 之后，执行如下命令即可：

```sql
show master status;
```

结果如下图：

![master result](https://blog-store.oss-cn-beijing.aliyuncs.com/201902/20190218233701.png)

**对于 Slave 实例**，略麻烦一些，简单思考一下，如果我们要去复制（备份）一个 DB 的内容，很明显需要知道要到什么地方去复制。那么这个动作对应的语句就是：

```sql
CHANGE MASTER TO
MASTER_HOST='192.168.1.201', -- Master 实例的IP
MASTER_PORT=8001, -- Master 实例的端口
MASTER_USER='root', -- Master 实例的用户名
MASTER_PASSWORD='mima', -- Master 实例的用户名
MASTER_LOG_FILE='mysql-bin.000003', -- 注意，此处很关键，需要配置 bin log 文件的名称，如上图 Master 状态。
MASTER_LOG_POS=0; -- 这个更重要，标记从日志的哪个位置开始复制。
```

**注意，此处为了简单直接以 root 用户连接到 master，实际使用中，建议单独创建一个账号用于同步。**

> 如何创建一个账号用于同步呢？

```sql
-- 创建用户，其中 mima 是登录密码，其中 % 表示不限制客户端IP。
CREATE USER 'for-slave'@'%' IDENTIFIED WITH mysql_native_password BY 'mima';
--也可以使用IP，限制客户端访问
CREATE USER 'for-slave'@'192.168.1.201' IDENTIFIED WITH mysql_native_password BY 'mima';

-- 对账户授权
GRANT REPLICATION SLAVE ON *.* TO 'for-slave'@'%'

-- 刷新授权表
flush privileges;
```

**注意：以上操作需要在 Master 实例上执行。**

以上仅仅是配置了从哪儿同步数据，那么要开始同步，则需要执行：

```sql
start slave; -- 开始同步

--当然，猜测一下， 停止同步就应该是
-- stop slave;
```

接着，我们还是要确认下 Slave 的状态：

```sql
show slave status;
```

结果如图：

![slave status](https://blog-store.oss-cn-beijing.aliyuncs.com/201902/20190218234809.jpg)

对于多个 Slave 实例，用同样的方式处理即可。

**测试就比较直接，操作 Master 实例，查看 Slave 实例，是否也有同样的变化即可。**

# 4、常见场景

## 4.1、我想只复制指定的 DB，应该如何实现？

这是一个非常常见的需求，一个 Server 下一般都会有很多的 DB，我们需要选择我们关注的 DB 来进行复制即可。可以有如下两种方式。

### 方案一：让 master 服务器只记录指定 DB 的 binlog

这个方案比较容易理解，直接从源头上只记录需要复制的表的日志。这样从库也只能复制这些变化。实现如下：

```bash
# 编辑 master 实例的 my.cnf 配置文件。加入如下节点
[mysqld]
log-bin=mysql-bin
server_id=1
binlog-do-db=要复制的DB # 如果是有多个，多复制几行即可。

# 那如果我只是想要排除几个DB呢？
binlog-ignore-db=要排除的DB # 如果是有多个，同样多复制几行。
```

**很明显，这个方案是从源头切掉了 binlog，如果后续要多复制几个 DB，那就不好处理，因为压根没有记录 binlog。**

**遗留问题一：都配置上会有什么效果呢？**

### 方案二：在 slave 服务器上设置需要复制的 DB（个人推荐）

做法也和方案一比较类似，不过是在 slave 的配置中增加类似配置：

```bash
# 编辑 slave 实例的 my.cnf 配置
replicate-do-db=要复制的DB # 如果是有多个，多复制几行即可。
replicate-ignore-db=要排除的DB # 如果是有多个，多复制几行即可。
```

> 为了避免操作从库，建议在从库的配置中，增加 read_only=true，此配置对 root 账户无效。参考[https://dev.mysql.com/doc/refman/8.0/en/server-system-variables.html#sysvar_read_only](https://dev.mysql.com/doc/refman/8.0/en/server-system-variables.html#sysvar_read_only)。

## 4.2、如果我一个 DB 已经有数据了（未开 binlog），现在想设置为 master-slave，怎么实现呢？

这个也是博主实际的场景。我的做法是，现再现有的实例上，启用 binlog。然后再使用 mysqldump 将数据同步到从库（注意，此时从库还没有 start slave），同步完成后，再执行 start slave 来启用。

# 5、一些过程中的问题

1. Docker 报错： `WARNING: IPv4 forwarding is disabled. Networking will not work.`

这是由于宿主机没有配置 IPV4 转发导致的，解决方案如下：

```bash
sudo vi /usr/lib/sysctl.d/00-system.conf # 修改配置

# 添加如下行
net.ipv4.ip_forward=1

# 保存好之后，重启网络服务
systemctl restart network
```

2. 使用 mysqldump 备份 DB 时，出现 `Table 'xxx' doesn't exist when using LOCK TABLES`

这是由于 DB 中已经删除中该表，在该表的物理文件还在，进入 DB 表存储目录，对指定的 table 进行删除即可（慎重，不要误删）。

3. 使用 mysqldump 备份时，出现 `Authentication plugin 'caching_sha2_password' cannot be loaded: /usr/lib64/mysql/plugin/caching_sha2_password.so: cannot open shared object file: No such file or directory" when trying to connect`

这是由于 Mysql 8.x 的安全策略，导致无法直接使用密码进行备份。解决办法就是直接连接到该 Mysql Server，执行如下修改：

```sql
-- 允许使用native password
ALTER USER 'root'@'%' IDENTIFIED WITH mysql_native_password BY 'root';
-- 刷新授权表
flush privileges;
```
