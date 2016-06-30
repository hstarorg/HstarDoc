# 0、About Dotnet Core

``Dotnet Core`` 是新一代的 ``.Net Framework``，是一个具有跨平台能力的应用程序开发框架。它本身是由多个子项目组成的。包括 ``Core Fx``、``Core CLR``、``.Net Compiler Platform``等等。

``Dotnet Core`` 具有高效的开发效率，高性能和跨平台能力，是 ``.Net平台`` 的一次大跃进。

# 1、尝试 Dotnet Core

### 1.1、Install

``Dotnet Core`` 从发布至今，已经有很长一段时间了。期间也发布了beta，rc等版本。就在前不久，正式版也已经发布了，经过了之前大量的api变化，现在core已经非常稳定了。这个阶段，已经值得我们去尝试、去使用它了。

要尝试 ``Dotnet core``, 我们先进入它的网站[https://dotnet.github.io/](https://dotnet.github.io/)，[https://www.microsoft.com/net/core#windows](https://www.microsoft.com/net/core#windows) 。

根据我们的操作系统版本，选择合适的开发包。我这里是Windows下开发，理所当然的下载 [the .NET Core SDK for Windows](https://go.microsoft.com/fwlink/?LinkID=809122) 。

安装好之后，在命令行输入 ``dotnet --version`` ，如果输出了版本信息，那就表示安装成功了。

**注意：如果之前尝试过Dotnet Core，请保证在安装最新版本的SDK之前，先卸载干净。**

### 1.2、Console App

在安装好SDK之后，我们就可以开始创建项目了。新建一个文件夹，进入控制台，执行 ``dotnet new``，即可看到在目录下生成了如下文件结构：

```
Program.cs
project.json
```

内容如下：

```csharp
//Program.cs

using System;

namespace ConsoleApplication
{
    public class Program
    {
        public static void Main(string[] args)
        {
            Console.WriteLine("Hello World!");
        }
    }
}

```

```json
//project.json

{
  "version": "1.0.0-*",
  "buildOptions": {
    "debugType": "portable",
    "emitEntryPoint": true
  },
  "dependencies": {},
  "frameworks": {
    "netcoreapp1.0": {
      "dependencies": {
        "Microsoft.NETCore.App": {
          "type": "platform",
          "version": "1.0.0"
        }
      },
      "imports": "dnxcore50"
    }
  }
}

```

此时我们可以通过 ``dotnet restore`` 来安装依赖。

**注意：就算project.json中的dependencies属性为空对象，我们也要执行 ``dotnet restore``，该命令会生成project.lock.json文件。**

**注意2：如果我们的网络环境的走的代理，那么可能会在安装依赖这个步骤遇到407错误，此时我们需要配置Nuget的代理设置，找到 ``%AppData%/NuGet/NuGet.Config`` 文件，然后添加如下配置项：**

```xml
<configuration>
  <config>
    <add key="http_proxy" value="s1firewall:8080" />
    <add key="http_proxy.user" value="jh3r" />
    <add key="http_proxy.password" value="xxx" />
  </config>
</configuration>
```

**通过这样的设置，就可以使用代理来安装依赖了。**

当我们安装好依赖之后，通过执行 ``dotnet run`` 来编译和运行我们的程序，此时可以在控制台看到输出： ``Hello World!``

以上，就是我们使用 ``Dotnet Core`` 的一般步骤了。

### 1.3、Web App

在尝试了Console App之后，我们也来试试Web App 在 ``Dotnet Core`` 下是如何运行的。

首先，基本步骤如上，先创建一个项目模板。

接着，首先要使用Web功能，我们需要指定依赖，在project.json中的dependencies属性中增加依赖：

```
"dependencies": {
  "Microsoft.AspNetCore.Server.Kestrel": "1.0.0"
}
```

**注意：在设定依赖的时候，一定要注意版本号，如果依赖库的版本号不兼容Core的版本，那么很可能会出现一些莫名其妙的错误，而找不到原因。**

增加依赖之后，我们再次通过 ``dotnet restore`` 来安装依赖。

这个时候，我们来编写Web宿主程序，内容如下：

```csharp
//Program.cs

using System;
using Microsoft.AspNetCore.Hosting;
namespace WebApplication
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var host = new WebHostBuilder()
                .UseKestrel()
                .UseStartup<Startup>() //此处使用了类型Startup，来自于Startup.cs
                .UseUrls("http://localhost: 10000")
                .Build();
            host.Run();
        }
    }
}
```

```csharp
//Startup.cs

using System;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;

namespace WebApplication
{
    public class Startup
    {
        public void Configure(IApplicationBuilder app)
        {
            app.Run((context) => 
            {
                return context.Response.WriteAsync("Hello, From Core.");
            });
        }
    }
}
```

编写好如上代码之后，我们在执行 ``dotnet run``，访问 ``http://localhost:10000`` 就可以看到我们的Web程序已经成功运行起来了。

以上则是一个简单的Web程序所需要的代码。

# 2、Other

### 2.1、``Dotnet Core`` 与 ``Node.js`` 的性能测试。

在 ``Dotnet Core`` 的官方宣传中，号称比 ``Node.js`` 快8倍。实际上，通过计算从0到100000000的累加来看，两者的差距并不大（几十ms的差别，Node稍弱）。

由于时间环境关系，没有进行更复杂测试，但我想在高并发下，Node的机制可能会有更高的性能。在大量IO操作处理中，``Dotnet Core``会有绝对的优势【后续可验证】。

### 2.2、如何直接运行Dotnet Core程序？

在开发模式下，我们通过 ``dotnet run`` 来运行程序，那我们如何来运行发布好的程序呢？

首先，我们可以通过 ``dotnet publish`` 来生成好我们的应用程序（在Windows下生成的是dll，其他平台未测试）。

在发布模式，我们的程序所依赖的包，也会被一同发布到目录下，我们可以在 ``/appRoot/bin/Debug/netcoreapp1.0/publish`` 中找到我们发布好的文件。

此时，我们就可以将publish目录拷贝到其他电脑运行了。

由于发布好的文件入口点是 ``.dll`` 文件，我们要运行它的话，需要通过 ``dotnet xxx.dll`` 来进行启动。

**注意：在publish的时候，我们可以使用参数``dotnet publish -c Release`` 生成Release版本的发布包，目录对应变更为 ``bin/Release/``**

**注意2：请不要删除publish目录下的文件，否则可能导致无法运行。经测试，<appName>.deps.json 和 <appName>.pdb可以删除，但依赖和 <appName>.runtimeconfig.json是绝对不能删除的。**

### 2.3 后续

此文为 ``Dotnet Core`` 系列第一篇，后续计划将Web开发所需要用到的一些基本知识点，库等均在 ``Dotnet Core`` 调试通，且成文。

**加油，``Dotnet!``**

---

---
**【6.30号更新】**

### 2.4、如何创建web项目

在 1.3 中，我们知道如何把一个Console App 改造为一个Web项目，但这对应开发一个Web应用来说还不够。

其实，``dotnet new`` 可以默认创建 Web 项目开发模板。

通过 ``dotnet new -t --help`` 我们可以看到 ``dotnet new`` 能帮我们创建的项目类型有如下四种：

1. Console
2. Web
3. Lib
4. xunittest

我们可以直接通过 ``dotnet new -t Web`` 来创建一个 Web 项目模板，简单快捷。

### 2.5、如果在Linux下发布（CentOS7）

``Dotnet Core`` 开发的程序，具有跨平台能力，那如何在非Windows上发布呢？各大操作系统方式并不同。

在CentOS7（仅支持7+）上发布非常简单。

首先是在CentOS7上安装 ``Dotnet Core``，不知道如何安装？请查阅 [https://www.microsoft.com/net/core#centos](https://www.microsoft.com/net/core#centos) 。

安装好之后，只需要在Windows把开发好的程序，通过 ``dotnet publish`` 生成发布目录，然后将该目录拷贝到CentOS上即可。

最后，在CentOS上执行 ``dotnet xxx.dll`` 即可运行项目了。

**注意： xxx.dll是你开发的项目的主程序**