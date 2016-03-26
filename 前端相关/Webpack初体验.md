## 0、关于webpack

Webpack是灵活的、可扩展的、开源的模块打包工具。[https://webpack.github.io/](https://webpack.github.io/)。
Webpack获取模块和它们之间的依赖关系，然后将这些内容打包为静态资源。

### 0.1、 Webpack有如下几大特点：

1. 插件 --利用webpack提供的多功能插件接口，使得它可以被添加很多新特性，实现了webpack的高扩展性。
2. 加载器（Loaders） -- webpack通过加载器来预处理文件，所以它不仅仅只能打包javascript。同时，使用node程序可以很容易的实现自己的加载器。
3. 代码分割 -- webpack允许你将代码分块，按需加载，减少初始加载时间。
4. 开发工具 --webpack支持SourceUrl和相关调试，同时可以通过开发中间件和开发服务器来实现自动化。
5. 高性能 --通过异步IO和多级缓存支持，实现了webpack的高性能。
6. 多支持 -webpack支持amd和commonjs风格的代码，并且还可以静态分析和拥有一个评价引擎来评估简单表达式。
7. 资源优化 --webpack能够实现多层优化来减少输出大小，还能使用散列还关注请求缓存。
8. 多目标 --webpack的主要目标是在Web上，但是它还支持WebWorks和node.js。

### 0.2、为什么要webpack？(webpack形成的动机)

1. 多种模块加载的方式，AMD、CommonJS、ES6 modules，各有优点，也各有缺陷。
2. 传输方式的两个极端，每次请求一个模块和一个请求所有模块，都并不能达到很好的效果。
3. 资源不仅仅是JavaScript，也有可能是字体、图片，多语言，模板等。

## 1、Webpack功能

### 1.1、加载器（Loaders）

Loader是把资源文件进行转换的一种程序，使用资源文件做为参数，然后返回新的资源文件。比如，将CoffeeScript代码处理为JS代码。

**Loader有哪些特点呢？**

1. Loader可以链接，通过管道方式传输。
2. Loader可以是同步或者是异步的。
3. Loader使用nodeJs运行，而且能够做更多。
4. Loader接受查询参数，可以用来传递配置。
5. Loader可以在配置中绑定到扩展货正则表达式。
6. Loader可以使用npm发布。
7. 普通模块可以通过package.json来转换为loader。
8. Loader可以访问配置。
9. 插件可以为Loader添加更多特性。

Loader采用``xxx-loader``这样的名字命令。``xxx``就是上下文的名称。在使用loader的时候，可以忽略``-loader``，只需要使用上下文名称就可以了。

**有如下三种方式可以使用loader，**

1. 通过require来使用

```javascript
  // 使用当前目录的loader.js处理指定的文件
  require("./loader!./dir/file.txt");
  // 使用jade-loader来处理.jade模板文件
  require("jade!./template.jade");
```

2. 通过配置

```javascript
{
  module: {
    loaders: [
      { test: /\.jade$/, loader: "jade" },
      // => 针对.jade文件使用jade-loader

      { test: /\.css$/, loader: "style!css" },
      // => 针对.css文件使用style和css两种loader
      // 另外的一种配置语法
      { test: /\.css$/, loaders: ["style", "css"] },
    ]
  }
}
```

3. 通过cli

```
webpack --module-bind jade --module-bind 'css=style!css'
```

**如何使用查询参数？**

在require中

```javascript
require("url-loader?mimetype=image/png!./file.png");
```

在配置中

```javascript
//方式一
{ test: /\.png$/, loader: "url-loader?mimetype=image/png" }

//方式二
{
    test: /\.png$/,
    loader: "url-loader",
    query: { mimetype: "image/png" }
}
```

在CLI中

```javascript
webpack --module-bind "png=url-loader?mimetype=image/png"
```

### 1.1、插件

使用插件一般都涉及到webpack的打包功能，比如使用[BellOnBundlerErrorPlugin](https://github.com/senotrusov/bell-on-bundler-error-plugin)，来提示在打包过程的错误。

webpack包含部分内置插件，可以在config中进行配置：

```javascript
var webpack = require("webpack");

module.exports = {
  plugins: [
    new webpack.ResolverPlugin([
        new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin("bower.json", ["main"])
    ], ["normal", "loader"])
  ]
};
```

也可以通过以下代码使用外部插件：

```javascript
var ComponentPlugin = require("component-webpack-plugin");
module.exports = {
  plugins: [
      new ComponentPlugin()
  ]
}
```

### 1.3 开发工具

开发工具相关配置通过通过[Configuration](http://webpack.github.io/docs/configuration.html)进行查看。

提供开发服务器的包：[webpack-dev-server](http://webpack.github.io/docs/webpack-dev-server.html)

用于高级用户的中间件：[webpack-dev-middleware](http://webpack.github.io/docs/webpack-dev-middleware.html)

## 2、使用Webpack

我们一般采用配置文件加webpack.config的方式来使用webpack，那具体应该如何用呢？

首先，通过 ``npm install webpack -g`` 和 ``npm install webpack --save-dev`` 全局和在项目中安装webpack。

然后通过 ``npm install xxx`` 来安装webpack所需要的插件和加载器（Loader）

接下来，就是编写webpack的配置文件：

```javascript
var webpack = require('webpack'); //引入webpack

//webpack配置
module.exports = {
  entry: {
    app: 'index.js'
  },
  output: {
    path: './dist', //输出目录
    filename: '[name][hash]bundle.js' //输出文件名
  },
  resolve: {
    root: __dirname
  },
  module: {
    noParse: [],
    loaders: [ //针对不同的文件，采用不同的加载器来处理
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel'}, //js文件除开node_modules,通过babel来处理
      { test: /\.html$/, loader: 'raw' }, //html文件通过raw-loader处理
      { test: /\.css$/, loader: 'style!css'} //css文件通过style-loader和css-loader来处理
    ]
  },
  plugins: [
    //Banner插件，合并时增加注释
    new webpack.BannerPlugin('Hello' + new Date())
  ]
};
```
最后，执行webpack，就能够启动了，在执行webpack的时候，可以附加很多参数，这些参数可以通过 ``webpack -h`` 来查看

**当前只能简单使用，等理解了webpack的核心思想，再写一篇《webpack深度解析》，敬请期待...**

## 3、参考文档

1. [Webpack官方文档](http://webpack.github.io/docs/)
2. [在一个真实的项目中使用Webpack](http://blog.madewithlove.be/post/webpack-your-bags/)