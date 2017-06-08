---
title: Docker容器管理平台Humpback进阶-私有仓库
date: 2017-6-8 19:20:54
---

# Docker私有仓库

在 `Docker` 中，当我们执行 `docker pull xxx` 的时候，可能会比较好奇，`docker` 会去哪儿查找并下载镜像呢？

它实际上是从 `registry.hub.docker.com` 这个地址去查找，这就是Docker公司为我们提供的公共仓库，上面的镜像，大家都可以看到，也可以使用。

**所以，我们也可以带上仓库地址去拉取镜像，如：`docker pull registry.hub.docker.com/library/alpine`，不过要注意，这种方式下载的镜像的默认名称就会长一些。**

如果要在公司中使用 `Docker`，我们基本不可能把商业项目上传到公共仓库中，那如果要多个机器共享，又能怎么办呢？

正因为这种需要，所以私有仓库也就有用武之地了。

所谓私有仓库，也就是在本地（局域网）搭建的一个类似公共仓库的东西，搭建好之后，我们可以将镜像提交到私有仓库中。这样我们既能使用 `Docker` 来运行我们的项目镜像，也避免了商业项目暴露出去的风险。

想想如下场景：

有一个商业项目，需要部署到N台机器上（也就是分布式部署）。

**1、常规做法**：生成部署文件，手动拷贝到各个服务器，调整各项配置，挨个运行。（大致耗时半小时）

**2、常规做法高级版**：在每台服务器上安装FTP Server（实际上除非静态，否则不够用），或者是SVN Server（相对FTP Server，可以还原版本），相对常规做法，优化了手动拷贝这个部署。（大致耗时20分钟）

**3、使用Docker的做法（前提是要部署的服务器要安装好docker环境）**：在某台服务器上构建好镜像，拷贝镜像到其他机器，启动镜像（大致耗时10分钟）。

其中拷贝镜像的方式如下：
```bash
# 将docker镜像保存为tar文件。
docker save <image name> > <tar file address>
# 如
docker save node-test > /tmp/node-test.tar

# 拷贝这个tar文件到需要使用该镜像的服务器上（FTP，SCP等等）

# 将tar文件文件加载为镜像
docker load < /tmp/node-test.tar

# 接下来就可以通过镜像运行容器了。
```

**这种方式中，用到了Docker的优势，但是拷贝文件这个，实在是山寨。**

**4、使用Docker+私有仓库的做法**：在某台服务器上构建好镜像，推送到私有仓库，在其他要部署的服务器上，拉取镜像，然后运行。

**对比以上的几种方式，我们可以知道前三种都无法逃避拷贝文件，并登录到服务器这个操作，这也是操作慢的根源，当我们有了私有仓库之后，所有的步骤都差不多可以自动化了，可以说是大大提交的效率。**

看到私有仓库有这么大的优势，肯定要一探究竟了吧。别急，接下来，我们就来看看如何部署和使用私有仓库，并利用 `Humpback` 来再次提高部署效率。

# 搭建私有仓库

既然是使用 `Docker` ，那毫无意外，私有仓库也是个容器化的东西。Docker官方早就为我们考虑了私有化部署的场景，所以，它提供了官方的私有仓库镜像：`registry`。接下来，我们就使用这个镜像来搭建私有仓库。

首先，按照常规思路，我们先拉取镜像：`docker pull registry:2.6.1`。（建议带上Tag拉取）

一般来说，有了镜像，我们就可以直接运行它就行了。

为了定制一些配置，和在 `Humpback` 中使用，我们还需要提供一个定制化的配置文件（使用yml来编写配置文件），如下：

```yml
# config.yml 内容
version: 0.1
log:
  fields:
    service: registry
storage:
  cache:
    blobdescriptor: inmemory
  filesystem:
    rootdirectory: /var/lib/registry
http:
  addr: :7000
  secret: docker-registry
  headers:
    X-Content-Type-Options: [nosniff]
    Access-Control-Allow-Headers: ['*']
    Access-Control-Allow-Origin: ['*']
    Access-Control-Allow-Methods: ['GET,POST,PUT,DELETE']
health:
  storagedriver:
    enabled: true
    interval: 10s
    threshold: 3
```

其中 `storage` 设置提交到仓库的镜像，应该存储在什么地方；`http` 节点中需要配置端口和安全码，其中关键的地方在于 `http.headers` 的配置。如上的配置，是为了能够跨域访问仓库API，这是要让仓库搭配 `Humpback` 必须的设置，Humpback会在浏览器端对仓库发起请求。

**如果不设置 `http.secret`，会遇到如下错误：**
```
No HTTP secret provided - generated random secret. 
```

**还需要注意，`http.addr` 的写法，`:7000` 并不是错误的写法，不要省略了 `:` ，这代表使用所有地址的 `7000` 端口。**

接着我们把这个配置文件放在 `/etc/docker/registry/` 目录下，然后就可以创建容器并运行了，命令如下: 

```bash
# -p映射端口，格式为：主机端口:容器内部端口
# -v映射volumn(目录或者文件)，格式为：主机目录:容器内目录
# --name 设置容器名称
# 最后的 `registry:2.6.1` 则是镜像名称
docker run -d -p 7000:7000 --restart=always \
 -v /var/lib/registry/:/var/lib/registry/ \
 -v /etc/docker/registry/config.yml:/etc/docker/registry/config.yml \
 --name humpback-registry \
 registry:2.6.1
```

运行好容器后，我们通过直接访问地址 `http://192.168.1.200:7000/v2/` 来检查仓库是否正常运行，当返回 `{}` 时，表示部署成功。

## 推送镜像到私有仓库

要推送镜像到私有仓库，需要先根据私有仓库地址来设定新标签。根据我的环境，我进行的操作如下：

```bash
# pull image from docker hub（从官方仓库拉取一个镜像）
docker pull alpine:3.6

# 根据私有仓库，设定标签（必须） 
# 为镜像 `alpine:3.6` 创建一个新标签 `192.168.1.200:7000/alpine:3.6`
docker tag alpine:3.6 192.168.1.200:7000/alpine:3.6

# 推送到私有仓库中
docker push 192.168.1.200:7000/alpine:3.6
```

**在推送到的时候，可能会遇到问题：`http: server gave HTTP response to HTTPS client`，因为默认是提交到 `https`，但我们的仓库是使用的http，此时要么创建一个https映射，要么将仓库地址加入到不安全的仓库列表中。**

*如何将仓库地址配置到不安全仓库列表中？*

使用如下步骤：

```bash
# 编辑 /etc/docker/daemon.json
vi /etc/docker/daemon.json
# 增加配置项
{
  ... # 其他配置项
  "insecure-registries":[ # 关键配置项，将仓库将入到不安全的仓库列表中
    "192.168.1.200:7000"
  ]
}
# 重启Docker服务（CentOS 7.2）
systemctl restart docker
```

之后，再次执行 `docker push 192.168.1.200:7000/alpine:3.6` 就没问题了。

通过访问 `http://192.168.1.200:7000/v2/alpine/tags/list` 就能看到刚才提交的镜像了。

也可以通过 `http://192.168.1.200:7000/v2/_catalog` 来列出仓库中的镜像列表。

# Humpback中使用私有仓库

至此，我们已经安装好了私有仓库，接着，我们就需要在 `Humpback` 中来使用私有仓库。

首先，需要在系统配置中启用私有仓库，并设置好我们的仓库地址，如下：

![启用仓库](http://img.hstar.org/humpback-md-21.jpg)

之后，我们就可以查看 `Hub` 功能了，截图如下：

![查看私有仓库](http://img.hstar.org/humpback-md-22.jpg)

接着，重点来了，我们来创建容器的时候，可以使用私有仓库的镜像了：

![从私有仓库拉取镜像](http://img.hstar.org/humpback-md-23.jpg)


# 结语

`Humbpack` 已经在我公司稳定迭代1年多，是一套比较简单易用，又不失强大的Docker管理平台。

有 `Docker` 运维需求，而又因为命令行的 `Swarm` 不够易用，强大的 `K8S`(Kubernetes) 难以部署和运维，那就赶快来尝试下 `Humpback`，**够用，易用，易部署**。

同时，用来作为本地开发部署环境也是极好的。比如我就喜欢把各种数据库，各种尝鲜的程序让 `Humpback` 来管理，用之即来挥之即去。

## 最后：**Humpback开源免费，Github地址是：[https://github.com/humpback/humpback](https://github.com/humpback/humpback)，要是喜欢，还望不吝给个 `Star`；如果觉得不好用，或者不够用，也欢迎给我们提 `Issue`，当然，能够有 `PR` 那就更好了。**

