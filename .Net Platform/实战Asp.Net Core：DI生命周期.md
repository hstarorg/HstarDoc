---
title: 实战Asp.Net Core：DI生命周期
date: 2018-11-30 21:54:52
---

# 1、前言

`Asp.Net Core` 默认支持 `DI（依赖注入）` 软件设计模式，那使用 `DI` 的过程中，我们势必会接触到对象的生命周期，那么几种不同的对象生命周期到底是怎么样的呢？我们拿代码说话。

**关于 DI 与 IOC：**

个人理解：`IOC（控制反转）` 是目的（降低代码、服务间的耦合），而 `DI` 是达到该目的的一种手段（具体办法）。

# 2、DI生命周期

DI的生命周期，根据框架、库的不同，会略有差异。此处，我们就以微软的DI扩展为例，来说下DI中常用的几种生命周期。

首先，我们想象一个这样一个场景。假设我们有寄快递的需求，那么我们会致电快递公司：“我们要寄快递，派一个快递员过来收货”。接着，快递公司会如何做呢？

1. 一直派遣同一个快递员来收货。
2. 第一周派遣快递员A、第二周派遣快递员B收货。
3. 每次都派遣一个新的快递员收货。

这对应到生命周期就是：

1. 单例（Singleton），单一实例，每次使用都是该实例。
2. 作用域实例（Scoped），在一个作用域（比如单次请求）内是同一个实例，不同的作用域实例不同。
3. 瞬时实例（Transient），每次使用都创建新的实例。

快递公司也就是我们在DI中常说的容器（Container）了。

## 2.1、验证准备

首先，我们需要三个Services（Service1\Service2\Service3）内容一致，如下：

```c#
// Service1.cs，Service2、Service3除类名以外，内容一致
public class Service1
{
    private int value = 0;

    public int GetValue()
    {
        this.value++;
        return this.value;
    }
}
```

然后，我们需要一个业务类，再一次注入这三个Service，内容如下：

```c#
// DefaultBusiness.cs 
public class DefaultBusiness
{
    private readonly Service1 s1;
    private readonly Service2 s2;
    private readonly Service3 s3;

    public DefaultBusiness(Service1 s1, Service2 s2, Service3 s3)
    {
        this.s1 = s1;
        this.s2 = s2;
        this.s3 = s3;
    }

    public int GetS1Value()
    {
        return this.s1.GetValue();
    }

    public int GetS2Value()
    {
        return this.s2.GetValue();
    }

    public int GetS3Value()
    {
        return this.s3.GetValue();
    }
}
```

最后，还需要在Startup.cs进行注入

```c#
// Startup.cs
public void ConfigureServices(IServiceCollection services)
{
  // 单例模式
  services.AddSingleton<Service1>();
  // 作用域模式
  services.AddScoped<Service2>();
  // 瞬时模式
  services.AddTransient<Service3>();
  // 为了保证结果，将Business类注册为瞬时模式，每次注入都是全新的。
  services.AddTransient<Business.DefaultBusiness>();
}
```

## 2.2、验证单例（Singleton）

对于单例来说，我们期望，在整个程序启动期间，都是同一个实例，所以，我们只需要在Service中，增加一个局部变量，做累加就可以验证。

```c#
// DefaultController.cs
[Route("singleton")]
public IActionResult SingletonTest()
{
    this.defaultBiz.GetS1Value();
    return Json(new
    {
        s1 = s1.GetValue()
    });
}
```
然后我们访问 `http://localhost:5000/singleton` 多次，输入如下：

```c#
// 第一次
{ s1: 2 }
// 第二次
{ s1: 4 }
// 第三次
{ s1: 6 }
```

可以发现，每请求一次，value都会增加2。分析下怎么来的呢？

1. 首先是执行  `defaultBiz.GetValue()` 中，根据内部代码，此处会对注入的实例，value + 1。
2. 之后，`Json()`中的，`s1 = s1.GetValue()`，此处再一次增加了1。
3. 综上，一次请求，s1 中的value值会增加2，由于是单例模式，在整个服务运行期间，都是一个实例，所以，每次请求都会累加2。


## 2.3、验证作用域实例（Scoped）

```c#
// DefaultController.cs
[Route("scoped")]
public IActionResult ScopedTest()
{
    this.defaultBiz.GetS2Value();
    return Json(new
    {
        s2 = s2.GetValue()
    });
}
```
然后我们访问 `http://localhost:5000/scoped` 多次，输入如下：

```c#
// 第一次
{ s2: 2 }
// 第二次
{ s2: 2 }
// 第三次
{ s2: 2 }
```

从结果可以看出，每次请求的返回值是固定的，都为2，也就是证明了Service2中，value++执行了两次。对于执行value++的代码，只有 `defaultBiz.GetS2Value()` 和 `s2 = s2.GetValue()`，所以这两处操作的是同一个实例。这也就证明了，对于 `Scoped` 生命周期，在作用域（可以简单理解为单次请求，实际上并不准确，**注意，此处为考虑多线程的情况**）内，都是使用的同一个实例。在不同的请求之间，则是不同的实例。

## 2.4、验证瞬时实例（Transient）

```c#
// DefaultController.cs
[Route("transient")]
public IActionResult TransientTest()
{
    return Json(new
    {
        s3 = s3.GetValue()
    });
}
```
然后我们访问 `http://localhost:5000/transient` 多次，输入如下：

```c#
// 第一次
{ s3: 1 }
// 第二次
{ s3: 1 }
// 第三次
{ s3: 1 }
```

从结果来看，每次请求的都是相同的返回值，`s3 = 1`，这说明了，两次操作的value++,是针对的不同实例。也就是每次使用 Service1，都是全新的实例。

# 3、扩展（Autofac DI 类库）

Asp.Net Core中默认的DI，相对还是比较简单的，只有三个生命周期。对于时下比较的依赖注入库，一般都会有更多的生命周期，有些还会有生命周期事件可以监控。

以 `Autofac` 为例，该类库提供了如下一些生命周期，可以做到更精细化的控制：

1. 单次依赖（Instance Per Dependency）- 也就是Transient，每次获取实例都是全新的。
2. 单例（Single Instance） - 也就是单例，整个服务周期都是一个实例。
3. 作用域隔离的实例（Instance Per Lifetime Scope） - 也就是一个作用域一个，示例代码如下：

```c#
// 先创建作用域
using(var scope1 = container.BeginLifetimeScope())
{
  
  for(var i = 0; i < 100; i++)
  {
    // 在作用域内，Resolve 的都是同一个实例
    var w1 = scope1.Resolve<Worker>();
  }
}

// 创建另一个作用域
using(var scope2 = container.BeginLifetimeScope())
{
  for(var i = 0; i < 100; i++)
  {
    // 在作用域内，Resolve 的都是同一个实例，但是这个实例和 scope1 作用域中的 w1 不是同一个。
    var w2 = scope2.Resolve<Worker>();
  }
}
```
4. 带标签的作用域隔离实例（Instance Per Matching Lifetime Scope）
5. 单次请求作用域实例（Instance Per Request） - 每个请求作为一个作用域。
6. 指定Owner的作用域实例（Instance Per Owned）- 对于同一个Owner，实例保持一致
7. 线程作用域实例（Thread Scope）

**更多 Autofac 生命周期相关内容，请参考：[https://autofac.readthedocs.io/en/latest/lifetime/instance-scope.html](https://autofac.readthedocs.io/en/latest/lifetime/instance-scope.html)**


# 4、总结

本文主要简单演示了 Asp.Net Core 中默认的几种服务生命周期效果，也抛砖引玉的说了下 Autofac 中的服务生命周期。合理的利用生命周期，可以减少对象的创建，提交程序性能。但是，用错了生命周期，则容易产生隐含的bug。在使用 DI 类库的时候，一定要理解清楚不同的生命周期的应用场景。

本文示例代码：[https://github.com/hstarorg/HstarDemoProject/tree/master/dotnet_demo/servicelifttime-demo/ServicelifttimeDemo](https://github.com/hstarorg/HstarDemoProject/tree/master/dotnet_demo/servicelifttime-demo/ServicelifttimeDemo)
