# 什么是Humpback？

在回答这个问题前，我们得先了解下什么的 `Docker`（哦，现在叫 `Moby`，文中还是继续称 ` Docker`）。

在 [Docker-百度百科](http://baike.baidu.com/item/Docker) 中，对 `Docker` 已经解释得很清楚了。

简单来说，Docker可以帮助我们以容器的方式快速运行APP。

由于一个镜像就是一个完整的 `APP`，只要我们构建好镜像，我们就可以快速，一致的在多个地方运行同样的 `APP`。这虽然解决了 `APP` 一致性的这个问题，但是，我们在部署的时候，依然要远程到服务器上，拖镜像，通过一长串命令（端口映射，磁盘映射，环境变量等的配置）来启动Docker容器。

这是一个重复而容易出错的过程，`Humpback` 就是为了解决该问题而生（当然，我们已经扩展了更多的功能：如集群管理，镜像构建，私有仓库管理等）。

那现在来回答什么是 `Humpback`，`Humpback` 是一个简单易用的轻量级容器管理平台，一个私有仓库管理平台，一个容器调度平台。

那它能做什么呢？

1. 以 `Web界面` 的方式，来进行容器的创建/运行以及管理（启动，停止，重启，监控，应用版本升级/回退）。 ★★★★★
2. 镜像构建，将镜像所需文件和Dockfile打包为 `.tar.gz` 文件，就可以打包为一个镜像 ★★
3. 管理私有仓库，将自己部署好的私有仓库，纳入到humpback的管理中。 ★★★★
4. 集群容器调度，当我们部署一个app时，只需要告诉humpback，我要部署多少个实例，humpback会自动根据配置进行集群部署，并通过WebHook通知部署结果。 ★★★
5. 对容器管理进行权限设定。 ★★

**注：星级表示功能的常用程度，五星为最常用的功能。**

差点忘了贴官方文档和Github地址，罪过！

[Humpback官方文档](https://humpback.github.io/humpback/)

[Github 开源汇总地址](https://github.com/humpback/humpback)

[Github Humpback 组织](https://github.com/humpback)

# 部署Humbpack

说了这个多，有没有想尝试下使用 `Humbpack` 进行容器管理？易用，不仅体现在真正的使用上，还需要能够简单部署。

接着，我们就看一下应该如何部署 `Humpback`：

1. 安装 `Docker` （如果是Windows机器，那通过虚拟机（Hyper-V or Vmware）安装Linux就算是第0步吧）

这是前置条件（需要1.8.3以上），关于Docker的安装，我就不详细说明了，我相信有兴趣体验Humbpack的，Docker安装肯定不在话下。

2. 部署 `Humpback` 管理站点

既然是用的Docker，那毫无疑问，我们已经把Humpback-web打包成了一个镜像，只需要pull下来即可使用。在确认docker已经安装成功的前提下，执行如下命令，即可安装好 Humbpack 的管理站点。

```bash
# 创建一个目录，用来存储humpback-web的数据库文件
mkdir -p /opt/app/humpback-web

# 完整粘贴即可，利用docker启动容器。其中如果要修改监听端口，就把8000改掉。
docker run -d --net=host --restart=always \
-e HUMPBACK_LISTEN_PORT=8000 \
-v /opt/app/humpback-web/dbFiles:/humpback-web/dbFiles \
--name humpback-web \
humpbacks/humpback-web:1.0.0 
```

启动成功之后，访问 `http://localhost:8000` 来确定是否部署成功。
如果要在宿主机访问，请使用虚拟机绑定的IP地址，另外，需要注意防火墙。
如果能够在浏览器中看到登录界面，那么就可以输入默认超级管理员账户：`admin`，密码：`123456` 进行登录。

3. 部署 `Humpback-agent`

从项目名称就很容易看出，这货就是一个代理，为Humpback管理站点提供数据的。

需要先在要被管理的机器上安装Docker环境（如果就在humpback这台虚拟机中试验，可以跳过，因为已经安装Docker），之后输入 `docker version` 查看一下版本号，我们主要关注其中的 `API Version`（待会要用）。

老规矩，我们的 `humpback-agent` 也必然是一个镜像，那么执行如下方式安装下：

```bash
# 为了简单使用，先不考虑集群功能
# 注意，之前我们在 docker version 中记录的 API Version 要排上用场了，
# 以下命令中有个环境变量 DOCKER_API_VERSION ，需要被设定为我们记录的API VERSION的值。
docker run -d -ti --net=host --restart=always \
-e DOCKER_API_VERSION=v1.21 \
-v /var/run/:/var/run/:rw \
--name=humpback-agent \
humpbacks/humpback-agent:1.0.0
```

当启动成功之后，我们的 `humpback-agent` 也部署成功了。

4. 将机器（虚拟机）纳入Humpback管理

打开我们第2步运行起来的Web管理平台，登录之后，创建一个Group:
![Humpback Group List](http://img.hstar.org/humpback-demo-img-1.png)
并将部署了 `humpback-agent` 的机器IP，添加到Servers属性中，如图：
![Humpback Add Group](http://img.hstar.org/humpback-demo-img-2.jpg)
，然后进入我们的Group就能看到我们的机器和容器了。
![Humpback Add Group](http://img.hstar.org/humpback-demo-img-3.jpg)
**至此，我们的Humback已经可用了，当然，这仅仅部署了一部分功能。如果需要私有仓库和集群，参考官方文档进行部署即可。**


# 举个栗子

光说不练，等于白干。现在，我们已经部署好 `Humpback` 了，那我们就来简单使用下。

## 场景一

假设有如下场景，我们想要部署一个Redis来做缓存。

官方提供的操作过程：

```bash
# 远程登录到服务器之后
$ wget http://download.redis.io/releases/redis-3.2.8.tar.gz
$ tar xzf redis-3.2.8.tar.gz
$ cd redis-3.2.8
$ make
```

其中可能会遇到的问题：
1. wget没装，手动安装wget。
2. make redis 出错，需要安装依赖项
3. 需要先登录到服务器
4. 等等

但是如果用Humpback呢？

1. 打开Web管理界面的添加容器页面
2. 填写容器相关信息如下：
3. 点击确定，OK，妥了。

>在这样的场景下，两者的差距并不大。

接着，我想临时停一下Redis：

常规做法：
1. 登录到服务器（又要登录，烦不烦）
2. 找到这个服务（通过名称找，哎呀，命令记不住了）
3. 停止

如果用Humpback呢？

1. 在容器管理界面，点击Stop，OK，妥了

>此时有 `Humpback` 就简单多了。

再接着，发现一台redis不够了，又一台服务器，需要部署redis。

常规做法：只能把之前的部署步骤再做一次。

如果这台服务器也被Humpback管理中，那么用Humpback仅仅是创建一个容器的事情。


## 场景二

在场景一中，我们是使用三方库，那这个场景呢，我们用来部署一个Web程序。

常规部署过程：

1. 打包程序
2. 登录服务器，把程序拷贝到服务器上
3. 修改配置文件
4. 运行程序

> 如果有多台，那么就要重复N次这样的步骤

那如果是Humpback呢？

1. 构建镜像
2. 创建容器并运行

> 如果有多台要部署，只需要批量创建容器即可，一次搞定

第二天，发布了一个新版本

常规部署过程：

1. 重新打包程序，拷贝到服务器上（还要担心覆盖出错）
2. 修改配置文件
3. 重新启动程序

Humpback中：
1. 构建新版本镜像
2. 在容器管理中，点击升级，选择新版本即可。

> 在这个过程，差异还不是太明显，不过明显humpback更快

第三天，发现新版本程序，有个严重bug（没有bug的程序不是好程序）

这下常规部署过程就折腾了，相当于重新发布一个历史版本，而且此时还不能保证和历史版本一致。

但，如果是humpback，在容器管理界面，点击升级（实际可以升级/降级），然后选中历史版本，点击确定，就完完整整的还原到历史版本上去了。


# 总结

总之，Humpback好用，有需要就赶紧体验下吧。暂时不需要，也可以体验下，吹牛也能多一些套路，而且，万一以后用得到呢。

当然，此文提到的仅仅的基础用法，但我觉得，这足够了。要想体验更复杂的玩法，强烈建议参考官方文档。

另附上几张操作图：

创建容器界面：
![创建容器界面](http://img.hstar.org/humpback-demo-img-4.jpg) 

容器详细信息界面：
![容器详细信息界面：](http://img.hstar.org/humpback-demo-img-5.jpg) 

容器版本升级界面
![容器版本升级界面](http://img.hstar.org/humpback-demo-img-6.jpg)  

容器监控界面
![容器监控界面](http://img.hstar.org/humpback-demo-img-7.jpg)  
