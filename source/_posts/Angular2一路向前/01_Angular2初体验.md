## 0、关于Angular2

Angualr2是前端最流行的MV*框架AngularJS的革命性更新版本，官网：[https://angular.io/](https://angular.io/)，号称一个框架统一移动版和桌面。

## 1、背景

将AngularJS升级为Angular2，是大势所趋。在之前，我们就必须要对Angular2有足够的了解。所以这一系列文章，希望从各个点将angular2分而破之。

另外，由于Angular2当前处于Beta阶段，所以代码的时效性不高。所以每篇都会注明相关版本。

Angular2推荐的开发语言是TypeScript [http://www.typescriptlang.org/](http://www.typescriptlang.org/)，所以我们这一系列文章也使用TypeScript开发（实际是使用JavaScript，半天没弄成功，丧气ing...）。

不要害怕TypeScript，因为TypeScript是ES6的超集，我们完全可以使用ES6的方式来编写TypeScript代码。对我们来说，仅仅是文件名后缀变化了。

## 2、Angular2 Hello-World

Angular2并不仅仅只有一个JS文件，要想成功运行Angular2，需要包含如下内容：

1. systemjs --模块加载器
2. Rxjs   --对Js的扩展，至今不知道它是做什么的
3. angular2

如果要支持IE，那么还需要

1. es6-shim
2. systemjs 中的system-polyfills.js文件
3. angular2中的shims_for_IE.js文件

接着就直接创建项目吧，结构如下：

```
<root folder>
  components/
    hello_world.html
    hello_world.ts
  bootstrap.ts
  index.html
  package.json
```

首先第一步，我们要通过npm安装我们的依赖项：
``npm install angular2 rxjs systemjs es6-shim typescript --save``

接着，实现我们的``index.html``内容：

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <title>Angular2 Hello World</title>
</head>

<body>
  
  <!-- Angular2组件标记 -->
  <hello_world></hello_world>
  
  <!-- IE required polyfills -->
  <script src="node_modules/es6-shim/es6-shim.js"></script>
  <script src="node_modules/systemjs/dist/system-polyfills.js"></script>
  <script src="node_modules/angular2/es6/dev/src/testing/shims_for_IE.js"></script>

  <!-- Compile TypeScript -->
  <script src="node_modules/typescript/lib/typescript.js"></script>

  <!-- Angular2 required -->
  <script src="node_modules/systemjs/dist/system.js"></script>
  <script src="node_modules/angular2/bundles/angular2-polyfills.js"></script>
  <script src="node_modules/rxjs/bundles/Rx.js"></script>
  <script src="node_modules/angular2/bundles/angular2.js"></script>

  <!-- startup app -->
  <script>
    System.config({
      transpiler: 'typescript',
      typescriptOptions: { emitDecoratorMetadata: true },
      packages: {'components': {defaultExtension: 'ts'}} //配置components目录下的请求，默认格式为ts
    });
    //注意：此处import的时候，必须要指明后缀，因为我们是把bootstrap.ts放在index平级的，在System的config中没有配置默认扩展名
    System.import('bootstrap.ts').then(null, console.error.bind(console));
  </script>
</body>

</html>
```

然后是我们的``hello_world.html``和``hello_world.ts``，内容如下：

```html
<h1>Hello Angular2</h1>

My name is: <input type="text" [(ngModel)]="username">
<br>
Angular2: <span *ngIf="username">Hello, {{username}}</span>
```

```javascript
import {Component} from 'angular2/core';

@Component({
  selector: 'hello_world', //此处指明了组件的标记，我们就可以使用<hello_world></hello_world>来使用这个组件了。
  templateUrl: 'components/hello_world.html'
})
//export的意思是导出这个组件，在使用的地方，就可以使用import {xx} from 'xxx'来获取到了。
export class HelloWorldComponent{
  constructor(){
    
  }
}
```

最后，是我们的``bootstrap.ts``入口JS：

```javascript
import {bootstrap} from 'angular2/platform/browser';

import {HelloWorldComponent} from 'components/hello_world';
bootstrap(HelloWorldComponent);
```

通过``anywhere``启动静态服务器，就可以看到我们的页面了。

**But，理想很丰满，现实很骨感，为嘛不兼容IE11？？？**

错误提示如下：

```
"'Symbol' is undefined"
```

**坑你没商量*！最终发现是Rx的版本必须用angular2提供的那个版本**

地址是：[https://code.angularjs.org/2.0.0-beta.12/Rx.js](https://code.angularjs.org/2.0.0-beta.12/Rx.js)

所以把Rx.js文件替换下，就可以在IE11中跑起来了。

**另外，经测试，Angular2可兼容IE9及以上版本。**

## 3、结尾

[Demo源码](https://github.com/hstarorg/HstarDemoProject/tree/master/angular2_demo/04)