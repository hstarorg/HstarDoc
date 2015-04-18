## 前言

前端模块化能解决什么问题？

1. 模块的版本管理
2. 提高可维护性 -- 通过模块化，可以让每个文件职责单一，非常有利于代码的维护
3. 按需加载 -- 提高显示效率
4. 更好的依赖处理 -- 传统的开发模式，如果B依赖A，那么必须在B文件前面先加载好A。如果使用了模块化，只需要在模块内部申明依赖即可。

## AMD规范 & CMD规范

说到前端模块化，就不得不提**AMD规范**（[中文版](https://github.com/amdjs/amdjs-api/wiki/AMD-(%E4%B8%AD%E6%96%87%E7%89%88))、[英文版](https://github.com/amdjs/amdjs-api/wiki/AMD)）和**CMD规范**（[英文版](https://github.com/cmdjs/specification/blob/master/draft/module.md)）

它们的区别：

[http://www.zhihu.com/question/20351507](http://www.zhihu.com/question/20351507)

[http://www.cnblogs.com/tugenhua0707/p/3507957.html](http://www.cnblogs.com/tugenhua0707/p/3507957.html)

AMD规范是 RequireJS 在推广过程中对模块定义的规范化产出，所以我在这里重点介绍下 AMD规范。

AMD规范全名异步模块定义（Asynchronous Module Definition）规范，让模块和依赖可以异步加载。

主要API：

	define(id?, dependencies?, factory);

id,字符串，定义中模块的名字，可选参数（没有提供，则默认为模块加载器请求的指定脚本的名字），如果提供，那么模块名必须是顶级和绝对的（不允许相对名字）

dependencies，数组，模块的依赖，可选参数

factory，函数或对象，必选参数。

## RequireJS

RequireJS是一个JS的文件和模块加载器。专门为浏览器优化，同时也支持其他JS环境。


### 使用RequireJS 

要想使用requireJS，首先需要在页面引入脚本：

	<script src="assets/vendor/require/require.js"></script>

接下来，书写脚本：

	<script>
        requirejs(['js/a'], function(a){
            alert(a.test);
        });  
    </script>

再来看看a.js:

	define({
	  test: 'aa'
	});

html代码如下：

	<!DOCTYPE html>
	<html>
	    <head>
	        <title>RequireJS Demo</title>
	        <meta name="viewport" content="width=device-width, initial-scale=1">
	        <meta http-equiv="X-UA-Compatible" content="chrome=1">
	        <script src="assets/vendor/require/require.js"></script>
	    </head>
	    <body>
	        <script>
	            requirejs(['assets/js/a'], function(a){
	                alert(a.test);
	            });  
	        </script>
	    </body>
	</html>

在浏览器中打开后，弹出aa。

在实践这个简单示例的时候，需要注意requireJS的``baseUrl`` 设置：

**细节之处**

1、RequireJS 加载文件/模块都是相对于baseUrl的

2、baseUrl默认使用data-main属性指定的脚本目录

	//baseUrl="assets/"
	<script data-main="assets/main" src="assets/vendor/require/require.js"></script>

	//baseUrl="assets/js/"
	<script data-main="assets/js/main" src="assets/vendor/require/require.js"></script>

3、如果没有data-main属性，那么baseUrl等于该html所在的目录

4、baseUrl可以通过RequireJS config进行设置

5、优先级：config > data-main属性 -> html目录

6、RequireJS加载JS时，可以不写js后缀

7、加载文件/模块时，会自动包含前缀http或者https

8、可以在config中使用paths配置，指定相对目录

	//这是我的项目目录结构
	www/
	  index.html
	  assets/
	    js/
	      a.js
	    vendor/
	      require/
	        require.js
	    main.js

	//配置文件
	requirejs.config({
		baseUrl: 'assets',
		paths: {
			js: 'js'
		}
	});
	
	//可以直接使用js来映射目录，进行文件引用
	requirejs(['js/a'], function(a){
	  alert(a.test);
	}); 

**注意：**一定要保证使用paths的时候，一定要放在config之后。通过在配置paths时，如果是直接子目录，不需要斜杠。

9、data-main指定的文件，是requirejs的入口点

### 定义模块

在requirejs中，我们可以采用多种方式定义模块，如下：

1、简单的键值对:

	define({
	  color: 'black',
	  size: '18px'
	});

2、定义函数：

	define(function(){
	  return {
	    color: 'black',
	    size: '18px'
	  };
	});

3、定义函数并使用依赖：

	define(['a', 'b'], function(a, b){
	  return {
	    color: 'black',
	    size: '18px',
	    alert: function(){
	      return a.num + b.num;
	    }
	  };
	});

4、将函数定义为模块：

	define(['a', 'b'], function(a, b){
	  return function(title){
	    return title ? title : a.title + b.title;
	  };
	});

5、通过简单的CommonJs包装器定义模块：

	define(function(require, exports, module){
	  var a = require('a'),
	      b = require('b');
	  return function(){}; 
	});

6、定义包含名字的模块：

	define('moduleA', ['a', 'b'], function(a, b){
	  //do something...
	});

### 配置项

	requirejs.config({
	  baseUrl: '', //基地址
	  paths: { //路径映射
	    'js': '../js'
	  },
	  bundles: { //
	    primary: ['main', 'util'],
	    secondary: ['text!secondary.html']
	  },
	  shim: { //从非模块的js中，导出模块
	    jquery: {
	      deps: [],
	      exports: 'jQuery'
	    }
	  },
	  map: { //方便版本控制
	    'some/newmodule': {
	      'foo': 'foo1.2'
	    },
	    'some/oldmodule': {
	      'foo': 'foo1.0'
	    }
	  },
	  config: { //配置module
	    bar: {
	      size: 'large'
	    }
	  },
	  packages: [], //需要从CommonJS packages中加载的模块
	  nodeIdCompat: true,
	  waitSeconds: 15, // 加载脚本超时时间（秒）
	  context: '', //设置上下文名称
	  deps:[], //需要加载的依赖
	  callback: function(){}, //当deps加载完时执行
	  enforceDefine: false, // 是否当脚本没有define时抛出错误
	  xhtml: false, //是否使用xhtml创建脚本元素
	  urlArgs: 'test=' + (new Date()).getTime(), //配置url参数
	  scriptType: 'text/javascript', //设置加载脚本的脚本类型
	  skipDataMain: false //是否使用data-main属性
	});