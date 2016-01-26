## 0、导言

JavaScript的生态系统一直在稳步增长，当各种组件混合使用时，就可能会发现不是所有的组件都能“和平共处”，为了解决这些问题，各种模块规范就出来了。

## 1、AMD（Asynchromous Module Definition - 异步模块定义）

AMD是RequireJS在推广过程中对模块定义的规范化产出，AMD是异步加载模块，推崇依赖前置。

	define('module1', ['jquery'], ($) => {
	  //do something...
	});

代码中依赖被前置，当定义模块（module1）时，就会加载依赖（jquery）

## 2、CMD（Common Module Definition - 公共模块定义）

CMD是SeaJS在推广过程中对模块定义的规范化产出，对于模块的依赖，CMD是延迟执行，推崇依赖就近。

	define((require, exports, module) => {
	  module.exports = {
	    fun1: () => {
	       var $ = require('jquery');
	       return $('#test');
	    } 
	  };
	});

如上代码，只有当真正执行到fun1方法时，才回去执行jquery。

同时CMD也是延自CommonJS Modules/2.0规范

## CommonJS

提到CMD，就不得不提起CommonJS，CommonJS是服务端模块的规范，由于Node.js被广泛认知。

根据CommonJS规范，一个单独的文件就是一个模块。加载模块使用require方法，该方法读取一个文件并执行，最后返回文件内部的module.exports对象。

	//file1.js
	moudle.exports = {
	  a: 1
	};
	
	//file2.js
	var f1 = require('./file1');
	var v = f1.a + 2;
	module.exports ={
	  v: v
	};

CommonJS 加载模块是同步的，所以只有加载完成才能执行后面的操作。像Node.js主要用于服务器的编程，加载的模块文件一般都已经存在本地硬盘，所以加载起来比较快，不用考虑异步加载的方式，所以CommonJS规范比较适用。但如果是浏览器环境，要从服务器加载模块，这是就必须采用异步模式。所以就有了 AMD  CMD 解决方案。

## UMD（Universal Module Definition - 通用模块定义）

UMD又是个什么玩意呢？UMD是AMD和CommonJS的一个糅合。AMD是浏览器优先，异步加载；CommonJS是服务器优先，同步加载。

既然要通用，怎么办呢？那就先判断是否支持node.js的模块，存在就使用node.js；再判断是否支持AMD（define是否存在），存在则使用AMD的方式加载。这就是所谓的UMD。

	((root, factory) => {
	  if (typeof define === 'function' && define.amd) {
	    //AMD
	    define(['jquery'], factory);
	  } else if (typeof exports === 'object') {
	    //CommonJS
	    var $ = requie('jquery');
	    module.exports = factory($);
	  } else {
	    //都不是，浏览器全局定义
	    root.testModule = factory(root.jQuery);
	  }
	})(this, ($) => {
	  //do something...  这里是真正的函数体
	});




