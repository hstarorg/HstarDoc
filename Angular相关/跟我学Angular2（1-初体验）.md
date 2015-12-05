## 0、导言

Angular1作为最流行的前端MV*框架，给前端开发带来了极大的便利性。但是，仍然有许多不好的地方已经很难再改变了。Angular团队根据WEB发展的趋势和Angular1中积累的经验来开发了一个全新的Angular，也就是Angular2。

## 1、优势

Angular2做了很激进的变化，带来的成果也是显而易见的。

1. 极大的提高了性能
2. 更强大的模块化
3. 改进的依赖注入
4. 对Web Component友好
5. 原生移动支持 - iOS 和 Android
6. 服务端渲染，搜索引擎优化

## 2、工具链

由于Angular2面向未来，使用了太多还不被当前主流浏览器支持的技术，跑起来还真不是一个容易的事情，所以我们需要一个工具链：

![http://www.hubwiz.com/course/5599d367a164dd0d75929c76/img/toolchain.jpg](http://www.hubwiz.com/course/5599d367a164dd0d75929c76/img/toolchain.jpg)

systemjs - 通用模块加载器，支持AMD、CommonJS、ES6等各种格式的JS模块加载 

es6-module-loader - ES6模块加载器，systemjs会自动加载这个模块 

traceur - ES6转码器，将ES6代码转换为当前浏览器支持的ES5代码。systemjs会自动加载 这个模块。

## 3、Angular2 Hello world

### Step1、下载angular2

[https://angular.io/](https://angular.io/)是angular2的官网，我们需要通过npm进行下载angular2： npm install angular2 [https://www.npmjs.com/package/angular2](https://www.npmjs.com/package/angular2)。

### Step2、引入angular2

	<!DOCTYPE html>
	<html lang="en">
	
	<head>
	  <meta charset="UTF-8">
	  <title></title>
	  <script src="../node_modules/angular2/bundles/angular2.sfx.dev.js"></script>
	</head>
	
	<body>
	</body>
	
	</html>

### Step3、 Hello angular
	
	<body>
	  <app></app>
	  <script>
	  var App = ng.Component({
	    selector: 'app',
	    template: '<h1>Hello {{name}}.</h1>'
	  }).Class({
	    constructor: function() {
	      this.name = 'Angular2';
	    }
	  });
	  ng.bootstrap(App);
	  </script>
	</body>

	
	
	
	
	
