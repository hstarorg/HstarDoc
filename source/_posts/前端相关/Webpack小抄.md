---
title: Webpack小抄
date: 2017/02/21 14:47:11
---

## 0、前言

此文用于记载在使用webpack打包过程中的点点滴滴！（仅适用于 `webpack1.x`）

## 1、动态指定loader

``webpack`` 的config文件中的loader，一般针对特定的后缀文件，当我们要对单个文件进行独立配置的时候，就不太好满足需求了，此时我们就需要在 ``import`` 或者 ``require`` 中指定文件的loader。

指定loader的时候，有如下几种场景：

1. 需要使用自定义loader，此时的import应该按照如下方式编写：``require('./loader!./xxx.js)`` ，使用当前目录下的 ``loader.js`` 来处理 ``xxx.js`` 。
2. 需要在全局loader（这里指在config中配置的loader）之前做一些处理（插入loader），那我们可以如下处理：``import 'jade!./template.jade'``，使用 ``jade-loader`` 来处理template.jade文件。
3. 需要覆盖全局的loader，可以如下使用：``import '!style!css!less!./test.less'``，使用 ``less-loader`` ``css-loader`` ``style-loader`` 来处理test.less文件。

**注意1：插入loader与覆盖loader，差别在于第一个字符是不是!(感叹号)。**

**注意2：当指定loader的时候，需要记住loader是从右往左依次执行的，一定要注意顺序。**

## 2、打包项目为类库

当我们要把项目打包为类库的时候，我们需要在entry中进行如下配置：

```json
{
  entry: {
    libraryTarget: 'umd', //可选var：直接全局变量，amd: AMD风格的库，cmd: CMD风格的库
    library: 'xxx' //挂载到window上的名称
  }
}
```

## 3、webpack-dev-server部署IP访问

使用默认的选项，只能使用 ``localhost`` 访问，如果想通过 ``IP`` 访问，那么需要设定配置如下：

```javascript
devServer: {
  contentBase: './',
  port: 7410,
  host: '0.0.0.0' // 设定host属性，绑定到 0.0.0.0，则可允许IP访问
}
```

## 4、Webpack使用外部依赖

```javascript
externals: {
  '@angular/common' : 'ng.common',
  '@angular/compiler' : 'ng.compiler',
  '@angular/core' : 'ng.core',
  '@angular/http' : 'ng.http',
  '@angular/platform-browser' : 'ng.platformBrowser',
  '@angular/platform-browser-dynamic' : 'ng.platformBrowserDynamic',
  '@angular/router' : 'ng.router',
  '@angular/forms' : 'ng.forms',
  'rxjs' : 'Rx'
}
```

## 5、Webpack多入口点，打包为library

```javascript
output: {
  path: './dist',
  publicPath: 'http://10.16.85.170:9999/',
  filename: 'newkit.[name].js',
  library: ['newkit', '[name]'],
  liabraryTarget: 'umd'
},
```

## 6、和gulp配合使用

尽量使用 `const webpack = require('webpack')` 。

用法如下：

```javascript
const showWebpackError = (err, stats) => {
  if (err) {
    throw new gutil.PluginError('webpack', err);
  }
  let statColor = stats.compilation.warnings.length < 1 ? 'green' : 'yellow';
  if (stats.compilation.warnings.length > 0) {
    stats.compilation.errors.forEach(error => {
      statColor = 'red';
    });
  } else {
    gutil.log(stats.toString({
      colors: gutil.colors.supportsColor,
      hash: false,
      timings: true,
      chunks: true,
      chunkModules: false,
      modules: false,
      children: false,
      version: true,
      cached: true,
      cachedAssets: true,
      reasons: false,
      source: false,
      errorDetails: false
    }));
  }
};

webpack(opt).watch(200, (err, stats) => {
	showWebpackError(err, stats);
});
```