---
title: Windows下把Nginx，PM2包装为服务
date: 2017-2-25 09:55:26
---

# 0x0、前言

在 `Windows` 上部署 `Node` 或者前后端分离的静态Web程序时，我们一般会使用到 `PM2` 和 `Nginx`。

`PM2` 用于管理 `Node` 程序。

`Nginx` 用于托管静态文件或者反向代理。

# 0x1、遇到的问题

在使用 `PM2` 和 `Nginx` 的时候，我们不能包装服务器一直不关机。只要一关机，我们就需要手动去重新启动我们的服务，这种方式非常不友好。

所以，我们需要它们能开机自动启动。虽然有多种方式，但最佳的无疑是包装为 `Windows Service` 。

# 0x2、winsw

在寻找方案的过程中，我们发现了 [winsw](https://github.com/kohsuke/winsw)，它是一个可以将可执行程序包装为 `Windows Service` 的包装程序。

接下来就用它来演示如何将 `Nginx` 和 `PM2` 包装为 `Windows Service`

## 将 `Nginx` 包装为 `Windows Service`

首先，我们要先准备好 `Windows` 版本的 `Nginx`，[Nginx Donwload Page](http://nginx.org/en/download.html)，选择合适的版本后，下载解压到目录中。

接着我们从 [https://github.com/kohsuke/winsw](https://github.com/kohsuke/winsw) 上找到 `winsw` 的可执行文件，实际是：[http://repo.jenkins-ci.org/releases/com/sun/winsw/winsw/](http://repo.jenkins-ci.org/releases/com/sun/winsw/winsw/)。

选择合适的版本后（建议用2.x版本），进行下载。如 [winsw-2.0.2-bin.exe](http://repo.jenkins-ci.org/releases/com/sun/winsw/winsw/2.0.2/winsw-2.0.2-bin.exe) 。

将下载好的文件放到 `nginx` 的目录下（和nginx.exe同级），并改名为 `nginx-service.exe`（名字可以自定义）。

之后，我们需要创建对应的服务配置文件 `nginx-service.xml` （该文件对应上一步骤的名称），并输入以下内容：

```xml
<service>
  <id>nginx</id>
  <name>Nginx</name>
  <description>High Performance Nginx Service.</description>
  <logpath>D:\GreenSoft\nginx-1.11.5\logs\</logpath>
  <logmode>rotate</logmode>
  <executable>D:\GreenSoft\nginx-1.11.5\nginx.exe</executable>
  <stopexecutable>D:\GreenSoft\nginx-1.11.5\nginx.exe -s stop</stopexecutable>
</service>
```

最后我们就可以使用 `nginx-service install` 来安装服务，并通过 `net start nginx` 来启动了。

如果要重启服务呢？使用 `net stop nginx & net start nginx`

## 将 `PM2` 包装为 `Windows Service` （公司权限限制，暂未测试通过）

和 `Nginx` 类似，我们只需要将wrapper程序改名，然后创建匹配的`xml`配置文件即可。

```xml
<service>
  <id>pm2</id>
  <name>PM2</name>
  <description>Node applications management tools.</description>
  <logmode>rotate</logmode>
  <executable>%AppData%\npm\pm2 resurrect</executable>
  <stopexecutable>%AppData%\npm\pm2 save &amp; %AppData%\npm\pm2 delete all</stopexecutable>
</service>
```