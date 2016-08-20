# 0、关于Vue

[Vue](https://vuejs.org.cn/) 是当前非常流行的一款前端 MV* 库（国人开发），结合 vue-router, vue-resource, vuex 等等，就形成了一套比较完善的前端 MV* 开发框架。

与它非常相似的框架是 [Avalon](http://avalonjs.coding.me/) ，都借鉴了当前流行的前端 MV* 库、框架，都是基于 ES5 getter setter 实现双向绑定。

与 ``Avalon`` 相比， ``Vue`` 在稳定性和文档方面更胜一筹。

但 ``Avalon`` 利用 ``VBScript`` 在IE6+上实现了双向绑定，不过文档和稳定性稍微有些欠缺。

那么如果没有IE9-的兼容性要求，有需要产线环境，那么Vue就是非常合适的一个东西了。

# 1、配套工具

``Vue`` 本身仅仅是一个双向绑定，组件化的库，要实现一个完整的应用，那么还需要其他的一些配套工具。

实际上，在 ``Vue`` 发布到流行的这几年间，它的配套工具已经相当完善了。特别是 [vue-cli](https://github.com/vuejs/vue-cli)，更是极大的减少了环境搭建的成本。

其他的路由，Ajax，数据流， [vuejs组织](https://github.com/vuejs) 也都提供了相应的package来支撑。

1. 路由  vue-router
2. Ajax/HTTP vue-resource
3. 数据流 vuex

# 2、开始一个项目

如果有Angular等前端框架使用经验，那么可以很轻松的切入vue的使用，因为有太多的似曾相识。

另外，通过vue-cli，我们可以不用自己去搭建开发环境，几条命令就足以让我们能够看到一个能跑起来的完整项目。特别是还自带热更新，自动编译，自动刷新等强大的构建功能。

来领略一下vue的魅力吧：

```
// 全局安装vue-cli命令行工具
$ npm install -g vue-cli  

// 在当前目录中创建一个demo1目录，并创建一个基于webpack的开发环境。
//（该命令是向导式方式，可以设置一些属性）
$ vue init webpack demo1 // vue-init <template-name> [project-name]

// 进入真正的项目目录
$ cd demo1 

// 安装依赖，你懂的~
$ npm install 

// 运行开发环境（注意：默认端口是8080，执行该命令后不会自动打开页面，
// 需要打开浏览器手动输入 http://localhost:8080 ）
$ npm run dev 
```

仅仅有开发环境，你满足了么？反正我是不满足的，``vue-cli`` 还提供了完善的命令，能够直接打包产线所需要的资源。

```
$ npm run build // 生产环境打包
```

# 3、认识.vue

``.vue`` 是vue特有的一种文件格式，一个 ``.vue`` 文件也是一个独立的组件。

它把内部内容分为三块，样式，模板和逻辑（JS），逻辑部分原生支持 ``ES2015``，简单的示例如下：

```
<style>
  <!-- 用于放置组件样式 -->
</style>
<template>
  <!-- 用于放置组件模板 -->
</template>
<script>
  // 用于放置组件逻辑代码
</script>
```

其中的 style 标记，还可以使用 ``scoped`` 标记来生成模块化CSS，也可以使用 ``lang="<lang>"`` 来选择使用一个CSS预处理器。

我喜欢的方式如下：

```html
<style scoped lang="stylus"></style>
```

**注意：如果选择了使用预处理器，那么需要安装特定的预处理器loader，如使用 ``npm install stylus-loader`` 来增加对 ``stylus`` 的支持。 **

# 4、其他

主流MVVM框架性能比较

![主流MVVM框架性能比较](http://avalonjs.coding.me/styles/performance.jpg)