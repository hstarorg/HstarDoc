## 0、前言

当下Angular2是比较值得关注的技术了，想要把Angular2跑起来，还是比较容易的。但

在这里，我要做的是搭建一个Angular2的开发环境，那么就一步一步来尝试下。

## 1、搭建开发环境

### 1.1、创建项目

新建目录 ``webpack-in-angular2``，然后进入目录执行 ``npm init -f`` 创建好 ``package.json`` 文件。

打开package.json文件。新建属性 ``dependencies`` ，并赋值如下：

```json
{
  "dependencies": {
    "@angular/common": "^2.0.0-rc.1",
    "@angular/compiler": "2.0.0-rc.1",
    "@angular/core": "2.0.0-rc.1",
    "@angular/http": "2.0.0-rc.1",
    "@angular/platform-browser": "2.0.0-rc.1",
    "@angular/platform-browser-dynamic": "2.0.0-rc.1",
    "@angular/router": "^2.0.0-rc.1",
    "@angular/router-deprecated": "2.0.0-rc.1",
    "@angular/upgrade": "2.0.0-rc.1",
    
    "es6-shim": "^0.35.0",
    "reflect-metadata": "^0.1.3",
    "rxjs": "5.0.0-beta.6",
    "zone.js": "^0.6.12"
  }
}
```

目录下打开控制台，执行 ``npm i`` 安装依赖。

至此，Angular2项目已经创建完成。

### 1.2、安装webpack

首先要确保已经全局安装了 ``webpack``

接着安装所需要包 ``npm install --save-dev webpack typescript ts-loader ts-helpers``

### 1.3、配置webpack

在根目录创建 ``webpack.config.js`` 文件，用于编写webpack的相关配置项。

在配置 ``webpack`` 之前，我们先在 ``src`` 目录下创建好我们需要的 ``polyfills.ts`` 和 ``vendor.ts``，内容如下：

```typescript
//polyfills.ts

import 'es6-shim';
import 'reflect-metadata';
require('zone.js/dist/zone');

import 'ts-helpers';
```

```typescript
//vendor.ts

// Angular 2
import '@angular/platform-browser';
import '@angular/platform-browser-dynamic';
import '@angular/core';
import '@angular/common';
import '@angular/http';
import '@angular/router';
import '@angular/router-deprecated';

//RxJS
import 'rxjs';
```

接下来，我们再配置webpack的配置项，如下：

```javascript
//webpack.config.js

'use strict';

let webpack = require('webpack');

module.exports = {
  debug: true,
  entry: {
    polyfills: './src/polyfills.ts',
    vendor: './src/vendor.ts'
  },
  output: {
    path: 'dist/assets/js',
    filename: '[name].js',
    chunkFilename: '[id].chunk.js'
  },
  module: {
    loaders: [
      {test: /\.ts$/, loader: 'ts'}
    ]
  }
};
```

此时，通过控制台执行 ``webpack`` 会提示找不到路径错误。

这个时候，我们需要新建一个 ``tsconfig.json`` 文件，内容如下：

```json
//tsconfig.json

{
  "compilerOptions": {
    "module": "commonjs",
    "target": "es5"
  }
}
```

之后再执行 ``webpack``，可以看到在dist/assets/js目录下，已经生成了我们需要的 ``polyfills.js`` 和 ``vendor.js`` 两个文件。

至此，简单的webpack使用，已经ok，同时也可以生成我们需要的来个库文件了。

### 1.4、Angular2 Hello World

接下来，我们实现一个Angular2的Hello App。

在 ``src/`` 下创建 ``bootstrap.ts`` 文件，内容如下：

```typescript
import {Component} from '@angular/core';
import {bootstrap} from '@angular/platform-browser-dynamic';

@Component({
  selector: 'demo-app',
  template: `
<h3>Hello, Angular2 and Webpack.</h3>
  `
})

export class AppComponent{
  constructor(){
    
  }
}

bootstrap(AppComponent);
```

然后在 ``webpack.config.js`` 中添加入口点：

```javascript
entry: {
  polyfills: './src/polyfills.ts',
  vendor: './src/vendor.ts',
  bootstrap: './src/bootstrap.ts' //新增的入口文件
}
```

再次执行 ``webpack`` 命令，就可以找到 ``dist/assets/js/bootstrap.js`` 文件了。但打开该文件一看，似乎不对，把angular都已经打包进去了。其实我们已经把angular打包到 ``vendor.js`` 中了，根本就不需要再打包到 ``bootstrap.js`` 。

此时，我们可以修改webpack的config文件，添加公共代码块引用，配置如下：

```javascript
'use strict';

let webpack = require('webpack');
let CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;

module.exports = {
  debug: true,
  entry: {
    polyfills: './src/polyfills.ts',
    vendor: './src/vendor.ts',
    bootstrap: './src/bootstrap.ts'
  },
  output: {
    path: 'dist/assets/js',
    filename: '[name].js',
    chunkFilename: '[id].chunk.js'
  },
  module: {
    loaders: [
      {test: /\.ts$/, loader: 'ts'}
    ]
  },
  plugins: [
    new CommonsChunkPlugin({
      name: ['vendor', 'polyfills'] //vendor和polyfills设置为公共代码块
    })
  ]
};
```

再次执行 ``webpack`` ，发现已经达到我们想要的效果了（bootstrap.js只包含了必须的代码）。

接着，我们在 ``src/`` 创建 ``index.html`` 文件，内容如下：

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Webpack in Angular2 demo</title>
</head>
<body>
  <demo-app></demo-app>
  <script src="assets/js/polyfills.js"></script>
  <script src="assets/js/vendor.js"></script>
  <script src="assets/js/bootstrap.js"></script>
</body>
</html>
```

同时，修改 ``webpack.config.js`` ，使用 ``copy-webpack-plugin`` 将 ``index.html`` 复制到 ``dist/`` 目录下。

先通过 ``npm install copy-webpack-plugin --save-dev`` 安装该插件，然后修改配置节点如下：

```javascript
plugins: [
  new CommonsChunkPlugin({
    name: ['vendor', 'polyfills'] //vendor和polyfills设置为公共代码块
  }),
  new CopyWebpackPlugin([
    //将src/index.html复制到dist目录。
    {form: 'src/index.html', to: path.join(__dirname, 'dist')}
  ])
]
```

完成以上步骤之后，打开dist目录，使用 ``anywhere`` 命令打开 ``web server``，可以在自动打开的浏览器中看到 Hello, Angular2 and Webpack.

至此，我们已经将Angular2和Webpack结合起来使用了。








