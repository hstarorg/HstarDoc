---
title: 02_Dotnet Core V2
date: 2017-05-20 09:14:21
---

# 前言

时隔三个月，再来看 `.Net Core`，已经到 `2.x preview` 了，虽然这个版本有赶工的嫌疑，但并不妨碍它成为当前的主力版本（可用API翻倍，API相对更稳定）。

在 `.Net Core` 的开发中，可以采用 `VSC` 或者是 `VS`，在我个人体验来看，如果要开发稍大的（一个解决方案，多个子项目）项目，还是选择VS吧。对于`.Net Core` ，一个简单的编辑器，体验还是太弱了。

**注意：要在VS中使用Core2.x Preview，请安装 [VS 15.3 Preview](https://www.visualstudio.com/vs/preview/) 版本。**

# V2命令行

在安装好 [.Net Core 2.0 Preview 1](https://www.microsoft.com/net/core/preview#windowscmd) 之后，通过 `dotnet new -h` 可以发现可以创建更多的模板了，其中一部分是项目模板：

1. Console Application （控制台应用程序）
2. Class Library （类库）
3. Unit Test Project （使用微软测试库的单元测试）
4. xUnit Test Project （使用xUnit作为测试库的单元测试）
5. ASP.NET Core Empty （Core的空项目）
6. ASP.NET Core Web App(MVC) （网站项目-Application）
7. ASP.NET Core Web App(Razor Pages) （网站项目 - WebPage，和Application不一样的是一个cshtml对应一个.cs，两者之前的区别类似.Net的WebApplication和WebPage）
8. ASP.NET Core Web API （Web API项目）

还有另外一部分是一些其他的单个文件，如：

1. Nuget Config
2. Web Config
3. Solution Config
4. Razor Page
5. MVC ViewImports
6. MVC ViewStart

我们最常用的还是上面的一些项目模板（如果用VS，这都不是事~）

除了这些，还提供了不少的命令行，不用去死记硬背，用的时候通过帮助命令查看使用说明即可，如 `dotnet -h` 列出所有的命令， `dotnet build -h` 列出命令的具体用法。

# Console App

在升级到2.0之后，曾今的 `project.json` 就不再使用了，回归到了 `.csproj` 这样的项目文件，但这个和 `.Net` 中的 `.csproj` 并不一样，最大的一个区别是，`.Net Core` 中，并不会将文件路径映射到 `.csproj` 中。这对于开发Web非常有好处（现代Web有构建等一大套工具链）。

通过 `dotnet new console -o ConsoleDemo` （创建一个控制台项目，并输出到ConsoleDemo目录中）创建一个项目，我们可以看到一个基本的 `ConsoleDemo.csproj` 内容如下：

```
<Project Sdk="Microsoft.NET.Sdk">

  <PropertyGroup>
    <OutputType>Exe</OutputType>
    <TargetFramework>netcoreapp2.0</TargetFramework>
  </PropertyGroup>

</Project>
```

仅仅是标记一下我们的Framework版本。

**Console不做过多尝试，相信和.Net差不多。更多的，我们还是使用 `.Net Core` 来做Web应用。``

# Web Application

我们还是先使用常用的MVC方式创建一个WebApplication，`dotnet new mvc -o MvcDemo`，创建好之后，可以看到如下结构：

```
Controllers/ --标准MVC三大目录
Models/ --标准MVC三大目录
Views/ --标准MVC三大目录
wwwroot/ --此处用来放置静态资源
.bowerrc --Bower配置文件
appsettings.Development.json 特定环境配置文件（Development环境）
appsettings.json 标准配置文件
bower.json  -- Bower项目文件
bundleconfig.json -- 资源打包配置
MvcDemo.csproj -- 项目文件
Program.cs -- 自托管入口文件
Startup.cs -- 启动配置
```

其中，`bower` 相关和 `bundleconfig`，并没有什么大用，直接干掉。至于 `bower` 是什么，查看这里：[Bower官网](https://bower.io/)。

抛开MVC三大目录不说，我是建议创建一个src目录，用于放置相关的前端资源文件（JS,CSS,LESS,TS等），然后通过构建打包工具（gulp，webpack这类），将代码生成到 `wwwroot` 中。

另，需要注意项目配置文件 `appsettings.json` 是采用的类似继承的方式读取值，也就是说：最终的配置 = (appSettings.json).extend(appsettings.<Env>.json)。如果将环境设置为 `Development`，那么会根据节点，先从 `appsettings.Development.json` 中找，找不到则从 `appsettings.json` 中找。 

注意看 `Program.cs` 和 `Startup.cs` 的内容。其中 `Program.cs` 是非常独立的一个文件，仅依赖 `Startup.cs`，而 `Startup.cs` 则全是Web相关的配置文件。

看一下 `Program.cs` 的关键代码：

```csharp
namespace MvcDemo
{
    public class Program
    {
        public static void Main(string[] args)
        {
            BuildWebHost(args).Run();
        }

        public static IWebHost BuildWebHost(string[] args) =>
            WebHost.CreateDefaultBuilder(args)
                .UseStartup<Startup>()
                .Build();
    }
}
```

为什么是这样的结构呢？`.Net Core` 支持IIS托管和自托管。在 `.Net` 中，我们知道Web程序是不会有 `Program.cs`，也就没有 `Main` 方法的。

实际上，这个文件在 `.Net Core` 中的作用就是自托管Web程序，从它的内容中，可以理解到自托管就是利用控制台程序创建了一个WebHost，然后将我们Web程序的真正入口文件 `Startup` 传递到Web容器中运行。

在IIS中托管程序的话，这个 `Program.cs` 通过调试，发现也会执行，但其中的一些配置则不会生效，如：`.UseUrls("http://*:5000")`。

**注意：具体在IIS中是如何执行的，还有待分析。**

## Web Application QA

1、如何设置环境？

在上面的内容中，有提到实际配置和环境是有关系的，那我们如何设定环境呢？最简单的方式，就是在 `Program.cs` 中，通过如下方式设置：

```csharp
public static IWebHost BuildWebHost(string[] args) =>
    WebHost.CreateDefaultBuilder(args)
    .UseEnvironment("Development") // 设置环境
        .UseStartup<Startup>()
        .Build();
```

2、如果在自托管的时候设置多个IP/端口绑定？

同上，也是在 `Program.cs` 中进行配置:

```csharp
public static IWebHost BuildWebHost(string[] args) =>
    WebHost.CreateDefaultBuilder(args)
    .UseUrls("http://*:5000;http://*:6000") // 多个用分号隔开
        .UseStartup<Startup>()
        .Build();
```

3、如何在视图中根据不同的环境加载不同的内容？

MVC为我们提供了相关的Helper，所以我们可以在View（一般是Layout视图）中，通过 `<environment></environment>` 来实现不同的内容加载，如下：

```html
<environment include="Development">
    <!-- 当环境是Development时加载 -->
    <link rel="stylesheet" href="~/static/mdl/material.css">
</environment>
<environment exclude="Development">
    <!-- 当环境不是Development时加载 -->
    <link rel="stylesheet" href="~/static/mdl/material.css">
</environment>
```

4、既然有配置文件，那我们就需要读取配置，应该如何读取呢？

在 `.Net Core` 中，配置是以JSON字符串的方式存在的，那么我们怎么来读取呢？

在 `Startup.cs` 中，构造函数中，注入了一个 `IConfiguration` 对象，并赋值到了这个类的 `Configuration` 属性上，这个属性就类似于 `.Net` 下的 `ConfigurationManager`。所以我们可以用它来进行读取，

假设有如下配置文件：

```json
{
    ...忽略默认配置,
    "v1": "xxx",
    "s2": {
        "v2": 1
    },
    "s3": {
        "Key1": "key1",
        "Key2": "key2"
    }
}
```

那么读取方式如下：

```csharp
Configuration.GetValue<string>('v1'); // 读取指定的配置项，返回 "xxx"

Configuration.GetSection('s2').GetValue<int>('v2'); // 从嵌套对象中读取配置项, 返回 1
```

当配置项过多的时候，这种方式可以比较麻烦，这个时候，我们可以创建一个配置类来映射，如下：

```csharp
public class S3
{
    public string Key1{ get; set; }

    public string Key2{ get; set; }
}

// 然后我们可以获取到s3这个节点，然后绑定到S3上。
var s3 = new S3();
Configuration .GetSection("s3").Bind(s3);
Console.WriteLine(s3.Key1); // 可以打印出 "key1" 了。
```

# 总结

`.Net Core` 正在变得越来越好，赶紧跟上吧~
