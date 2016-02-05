## 0、导言

jQuery作为前端最流行的类库（没有之一），有许多的优点和实现值得我们去学习，去借鉴。

## 1、什么是jsLib

jsLib是类似jQuery的一个前端库，是对jQuery的一次探索和学习，通过实现jsLib的代码来深入学习浏览器端JS和一个常用库的编写。

## 2、模块规范 & 冲突处理

在编写一个库的时候，首先要考虑它的适用范围。jsLib和jQuery类似，定位于浏览器端，所以要遵循当前流行的规范。

同时也要防止将其他第三方库覆盖，所以要提供方法，避免这种问题。

	((root, factory) => {
	  if (typeof define === 'function' && define.amd) {
	    //AMD
	    define('jsLib', [] factory);
	  } else if (typeof exports === 'object' && module.exports === 'object') {
	    //CommonJS
	    if (!root.document) {
	      throw new Error('jsLib erquires a window with a document');
	    }
	    module.exports = factory(root, true);
	  } else {
	    //都不是，浏览器全局定义
	    factory(root);
	  }
	})(typeof window !== "undefined" ? window : this, (window, noGlobal) => {
	  //do something...  这里是真正的代码实现
	  var jsLib = function(){};
	  //防止冲突代码
	  //先保存原本的内容
	  var _$ = window.$;
	  var _jsLib = window.jsLib;
	  //如果有冲突的话，还原（如何使用，window.jsLib2 = window.$$ = jsLib.noConflict(true)）
	  jsLib.noConflict = function(depp){
	    if(window.$ === jsLib){
	      window.$ = _$; //将$还原为以前的对象
	    }
	    //是否也要还原window.jsLib
	    if(deep && window.jsLib === jsLib){
	      window.jsLib = _jsLib;
	    }
	    return jsLib;
	  };
	  //如果是全局的
	  if(!noGlobal){
	    window.$ = window.jsLib = jsLib;
	  }
	  //整个方法返回jsLib对象
	  return jsLib;
	});