## 0、前言

Node作为时下流行的服务端运行时，我们就不得不接触另外一个方面的内容，那就是部署。此文就来说一下node的部署问题。

## 1、开发时部署

在开发阶段，我们可以随意部署，直接通过 ``node xxx.js`` 就能很方便的启动项目。

```
这种方式有一个弊端，每次代码变更之后，我们需要手动去重启。
这个时候，我们可以借助一些第三方工具来实现监控代码变更。
如： gulp-develop-server、nodeman、node-supervisor等等。
```

## 2、上线时如何部署？

### 2.1、原始做法

既然开发时，可以用 ``node xxx.js``，那上线时也一样。妥妥的。

```
弊端：会启动一个黑窗口，不能关闭，登录不能被注销
``` 

### 2.1、原始做法，升级版

在Windows下，通过 ``start /b node xxx.js`` ，让程序后台运行。

在Linux下，通过 ``node xxx.js &`` 或者 ``nohup node xxx.js > xxx.log &`` 来实现后台运行。

```
该方式，避免了阻塞当前控制台，但是其他弊端与2.1一致。
```

### 2.2、使用进程管理器工具

Node社区中，有比较多进程管理工具。如 [forever](https://github.com/foreverjs/forever) , [pm2](https://github.com/Unitech/pm2), [strongloop](https://github.com/strongloop/strongloop) 等等。

我这里推荐 ``pm2``，功能强大，操作简单，监控，自动重启，多进程都能支持。

以下以 ``pm2`` 为例，演示一下部署方式：

通过 ``npm install pm2 -g`` 安装 ``pm2``

通过 ``pm2 start xxx.js`` 启动程序

通过 ``pm2 stop|restart|delete`` 来停止，重启，删除程序。

通过 ``pm2 list`` 可以查看部署的程序。

更多操作，请参考：[http://pm2.keymetrics.io/](http://pm2.keymetrics.io/)

```
这种部署方式，还有一个问题，服务器重启后，无法自动启动。
```

### 2.3、使用进程管理器工具，升级版

在Linux上，通过 ``pm2 startup [platform]`` 就能默认生成一个开机启动项。

如果是Windows，我们可以通过 [pm2-windows-service](https://www.npmjs.com/package/pm2-windows-service) 或者是 [pm2-windows-startup](https://www.npmjs.com/package/pm2-windows-startup) 来把 ``pm2`` 做成Windows服务。

了解更多：[http://pm2.keymetrics.io/docs/usage/startup/](http://pm2.keymetrics.io/docs/usage/startup/)

### 2.4、Docker部署

借助Docker提供的独立环境，以上方式均可以在docker中实现，而且就算直接用 ``node xxx.js`` 来启动应用，在docker中也是没问题的。

自动开机启动，则成了docker的问题，而不是部署程序的问题。

### 2.5、更多部署方式待探索...

