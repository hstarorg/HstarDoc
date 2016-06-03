## 0、导言

**PHP** 是啥，我想应该不用解释了吧。

最近发布的最新版本 ``PHP7`` ，提供之前版本的2倍速度提升，感觉很有吸引力哈。在看到2016年编程语言趋势和想到之前也想体验一下 ``PHP`` 的情况下，就说干就干，直接来简单学习下这门语言。

## 1、PHP简易环境搭建

### 1.1、PHP安装

``PHP`` 的安装相当简单，打开 ``PHP`` 的下载地址：[http://php.net/downloads.php](http://php.net/downloads.php)，可以看到它的版本下载。

我这里是 Windows 环境，就点击 【Windows downloads】 进入Windows版本的PHP下载地址： [http://windows.php.net/download#php-7.0](http://windows.php.net/download#php-7.0) 。在这里找到对应的版本下载即可。

**注意：请下载对应x86,x64的zip包，不要下载Debug Pack包。至于Non Thread Safe 与 Thread Safe，由于本人刚接触，不知道有什么区别，随意下载一个就行。** 

我是Win10 x64版本，所以直接下载的：【VC14 x64 Non Thread Safe (2016-May-25 23:02:13)】（有最新版本下载最新版本即可）。

下载好之后，是一个压缩包。解压到目录中，在环境变量中配置 ``Path`` 为该目录。

打开 ``cmd`` 窗口，执行 ``php -v`` ，如果输出 ``PHP`` 的版本号，则表示安装成功！

### 1.2、IDE的选择

PHP有比较多IDE，这里推荐 [PhpStorm](https://www.jetbrains.com/phpstorm/) 和 [VsCode](https://code.visualstudio.com/)。

本人使用的 ``VsCode``，足够轻量。

### 1.3、依赖管理工具

一个成熟的语言，一定会有很多现成的包，如C#的Nuget，Node的npm。在PHP中，也有同样的工具：Composer。

*如何在Windows下使用：Composer？*

首先，进入Composer下载地址：[https://getcomposer.org/download/](https://getcomposer.org/download/)，找到【Composer-Setup.exe】，然后下载安装。

安装成功之后在控制台执行：``composer`` 会输出一系列命令，则证明安装成功。

然后就可以通过 ``composer install <package>`` 来安装依赖包了。 想了解更多 ``composer`` 命令，请查询：[https://getcomposer.org/doc/](https://getcomposer.org/doc/)。

**注意，我在Windows中使用composer安装时，先使用了 ``composer config disable-tls true`` 和 ``composer config secure-http false`` 才得以成功安装依赖。**

### 1.4、Server程序

PHP自带有一个命令行的Server，用于开发测试已经足够使用了。所以，我直接使用了该Server。

只需要在php项目的根目录，打开cmd，执行 ``php -S localhost:9999`` 就可以启动一个PHP Server了。

想了解更多关于PHP自带的Web Server，请参考 [http://php.net/features.commandline.webserver](http://php.net/features.commandline.webserver)


## 2、Hello PHP

新建一个目录，创建 ``index.php``，输入以下内容：

```php
<?php
  mb_internal_encoding('UTF-8');

  mb_http_output('UTF-8');
?>
<!doctype html>
<html>
  <head>
    <title>Php Info</title>
  </head>
  <body>
    <?php
      phpinfo();
    ?>
  </body>
</html>
```

打开控制台，使用 ``php -S localhost:9999`` 启动WebServer。

用浏览器访问 [http://localhost:9999](http://localhost:9999)，就可以看到当前服务器的PHP环境信息了。

## 3、Other

3.1、推荐资料： [PHP之道](http://laravel-china.github.io/php-the-right-way/)

3.2、PHP的编码问题，一般在php的页面上，我们都需要设置：

```php
<?php
  mb_internal_encoding('UTF-8'); //内部编码为UTF-8

  mb_http_output('UTF-8'); //服务器输出内容编码为UTF-8
?>
```

要想用Server运行含有该代码的PHP页面。需要特别配置一下 ``php.ini`` 文件。

在PHP的解压目录，找到 ``php.ini-development``，复制一份为 ``php.ini``，然后找到 ``extension_dir``，设置为：``extension_dir = "你的PHP解压目录\ext"``，然后找到 ``;extension=php_mbstring.dll`` 去掉前面的注释。

3.3、PHP框架推荐

* Yaf 官方框架，超高性能

http://www.laruence.com/manual/index.html

http://php.net/manual/zh/yaf.installation.php

* LazyPHP 超级简单的框架，建议读源码

https://github.com/easychen/LazyPHP

* Slim 据说还不错

http://www.slimframework.com/

* Laravel 高人气框架

https://laravel.com/

https://lumen.laravel.com/  专注API开发的PHP。

* ThinkPHP 中文

http://www.thinkphp.cn/

* InitPHP (A PHP Framework) - (from github)

http://www.initphp.com/

* TinyMVC (from github)

https://github.com/mohrt/tinymvc-php

