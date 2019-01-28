# 1、前言

某一刻，你已经把 .Net Core 的程序写好了。接下来，还可以做什么呢？那就是部署了。

作为一名开发工程师，如果不会部署自己开发的应用，那么这也是不完整的。接下来，我们就来说说，如何部署我们的 .Net Core 应用程序（主要是 Asp.Net Core 应用）。

# 2、Asp.Net Core 的部署方式

对于虚拟机中执行的语言来说，大都会有 SDK(Software Development Kit) 以及 XRE(X Runtime Environment)。对于 C#来说，也不例外。在 C#中，这两者的区别在于：

- .Net Core SDK 用于开发者构建 App，包含有较多开发相关的工具包（实际上，SDK 也是包含 Runtime）
- .Net Core Runtime 仅作为运行时使用，不包含开发工具包，体积较小。

既然要部署 Asp.Net Core，自然离不开 Runtime（如果装 SDK 也能跑，不过不推荐在运行环境装 SDK）。以下的部署方式的前提都是已经安装 Runtime 环境。

**下载地址：[https://dotnet.microsoft.com/download](https://dotnet.microsoft.com/download)**

## 2.1、控制台直接运行

Asp.Net Core 程序在发布后，会产生一个入口 dll 文件，要运行该程序，只需要通过 dotnet 命令执行该 dll 文件。所以，第一种方式就是直接找到 dll 文件，并使用 dotnet 命令来运行。（你说 dotnet 命令哪来的？安装了 Runtime 就有了。）

```bash
# 进行控制台执行
dotnet xxx.dll
```

**优势：**

1. 足够简单，拷贝文件就开整。
2. 兼容多平台部署。

**缺陷：**

1. 想象一下，如果控制台关掉了，服务器重启了会怎样？此时需要手动重新去重新执行。（你说，可不可以设置为开机启动？如果创建一个批处理，放在启动项中，还是能做到的）

## 2.2、IIS 部署

用 .Net Framework 开发的应用，大家都比较熟悉用 IIS 来部署。那 .Net Core 呢？虽然两者的运行模式并不相同，但微软为了减少迁移难度，自然也提供了用 IIS 的部署方法。

与 Asp.Net 不同，ASP.NET Core 不再是由 IIS 工作进程（w3wp.exe）托管，而是使用自托管 Web 服务器（Kestrel）运行，IIS 则是作为反向代理的角色转发请求到 Kestrel 不同端口的 ASP.NET Core 程序中，随后就将接收到的请求推送至中间件管道中去，处理完你的请求和相关业务逻辑之后再将 HTTP 响应数据重新回写到 IIS 中，最终转达到不同的客户端（浏览器，APP，客户端等）。

如果要使用 IIS 部署 Asp.Net Core 程序，步骤如下：

1. 首先，需要安装 .Net Core 托管捆绑包，[点此下载捆绑包](https://www.microsoft.com/net/permalink/dotnetcore-current-windows-runtime-bundle-installer)
2. 进行 IIS 控制台，确保能在模块中找到 AspNetCoreModule 托管模块。(如果执行了步骤 1，未找到，可以尝试控制台执行 `iisreset`)
3. 按照常规部署 .Net Framework 程序的方式，创建应用，在选择应用程序池的时候，注意，一定要选择`无托管代码`，如图：![img](https://docs.microsoft.com/en-us/aspnet/core/host-and-deploy/iis/index/_static/edit-apppool-ws2016.png?view=aspnetcore-2.2)
4. 至此，就算部署成功了。

**优势：**

1. 学习成本低，和 .Net Framework 应用的部署方式保持类似。
2. 能够自动开机自启。
3. 可以在可视化界面中，配置端口域名绑定。

**劣势：**

1. 该方式仅能在 Windows 服务器上使用。
2. 通过 IIS 桥接一层，有性能损失。

**了解更多，请参考：[IIS 部署.Net Core 应用](https://docs.microsoft.com/zh-cn/aspnet/core/host-and-deploy/iis/?view=aspnetcore-2.2#install-the-net-core-hosting-bundle)**

## 2.3、部署为 Windows Service

在 2.2 的部署方式中，较大的缺陷就是性能损失。那么，有没有什么办法能够可以避开这个问题呢？。答案就是 Windows Service，通过 Windows Service，我们能够解决 2.1 中的开机启动和持久运行问题，也能避开 2.2 中的性能损失。具体如何做呢？如下提供一种方式（当然，也可以用其他方式来部署 Windows Service）：

1. 借助 nssm 来管理 Windows Service，[Nssm](https://nssm.cc/)，用法，请参考：[https://nssm.cc/usage](https://nssm.cc/usage)
2. 配置 Service 开机启动。

**优势：**

1. 高性能部署，稳定性好。
2. 支持开机启动。

**劣势：**

1. 仅能用于 Windows 服务器。
2. 引入了一个外包依赖 NSSM。

## 2.4、Linux 部署

由于 .Net Core 天生支持跨平台，如果在廉价又稳定的 Linux 上部署 .Net Core 程序逐渐成为主流。对于 Linux 上的部署，和 Windows 上并没有什么区别。首先是安装 Runtime 环境，然后拷贝程序，并通过命令行运行。

再进一步，可以使用后台模式，让程序在后台运行。

更进一步，也可以效仿 Windows，把程序启动管理作为一个服务，来达到开机启动和灵活管理的目的。

## 2.5、Docker 部署

作为当前个人认为的最棒的 .Net Core 应用部署方式，建议大家都了解下。

首先，是 Docker 的基本使用：

1. 编写 Dockerfile
2. 使用 `docker build` 构建镜像
3. 使用 `docker run` 创建容器并运行

好，我们来依次说明，对于 Docker 来说，需要先安装 Docker 环境。

接着，我们假设发布包路径如下：

```bash
root-folder/
  app/ # 发布包目录
    xxx.dll # 程序入口点 
  Dockerfile # Dockerfile文件
```

然后针对该程序，编写如下 Dockerfile：

```bash
# 根镜像
FROM microsoft/dotnet:2.2-runtime

# 拷贝程序发布包
COPY app /app

# 设置工作目录
WORKDIR /app

# 导出的端口
EXPOST 80

# 程序运行命令
CMD ["dotnet", "xxx.dll"]
```

接下来，通过在 `root-folder` 中执行 `docker build -t xxx:0.0.1 .` 来构建一个镜像。

接着，再通过 `docker run -it -p 8000:80 --name xxx-demo xxx:0.0.1` 来创建并运行容器。

这样，就可以通过 `http://localhost:8000` 来访问到你的应用程序了。

此处只是大概写下 Docker 部署的步骤，抛砖引玉。真正需要将其用于产线，还需要去学习下足够的 Docker 知识。

**额外提一下，如何选择基础镜像**

> 对于 .Net Core 来说，一般有如下几类基础镜像：

* sdk -- 相信这个都比较容易理解，就是包含了 .Net Core SDK。
* runtime -- 这个也相对容易理解，包含了.Net Core Runtime。
* runtime-deps --这个就不是很好理解， runtime? deps? 什么意思呢？就是说，这个连 Runtime都不是全的，需要你在打包的时候，选择自寄宿模式，把Runtime也打进去。

**综上，我个人推荐大家选择 runtime 这类作为基础镜像。**

# 参考文档

1. [https://docs.microsoft.com/zh-cn/aspnet/core/host-and-deploy/iis/?view=aspnetcore-2.2#install-the-net-core-hosting-bundle](https://docs.microsoft.com/zh-cn/aspnet/core/host-and-deploy/iis/?view=aspnetcore-2.2#install-the-net-core-hosting-bundle)
2. [https://hub.docker.com/r/microsoft/dotnet](https://hub.docker.com/r/microsoft/dotnet)
3. [https://docs.microsoft.com/en-us/dotnet/core/docker/building-net-docker-images?view=aspnetcore-2.2](https://docs.microsoft.com/en-us/dotnet/core/docker/building-net-docker-images?view=aspnetcore-2.2)
