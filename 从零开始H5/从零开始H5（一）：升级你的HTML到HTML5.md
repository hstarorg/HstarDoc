## 现有的网页大部分还是基于HTML4开发的，那么如何简单的升级到HTML5呢？

### 1、从doctype定义开始

HTML4：
	
	<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" 
	"http://www.w3.org/TR/html4/loose.dtd">

HTML5：

	<!doctype html>

**注意：这不仅仅是HTML5的doctype，这也是HTML将来所有版本的doctype。不仅如此，它甚至在老版本的浏览器中也能正常工作。**

### 2、简化meta

HTML4：

	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />

HTML5：

	<meta charset="utf-8" />

### 3、简化link标记

HTML4：

	<link type="text/css" rel="stylesheet" href="index.css" />

HTML5：

	<link rel="stylesheet" href="index.css" />

**注意：升级到HTML5后，使用link不在需要指定type了，因为已经宣布CSS作为HTML5的标准样式，这也是HTML5的默认样式。**


### 4、简化script标记

HTML4：

	<script type="text/javascript" src="index.js"></script>

HTML5：

	<script src="index.js"></script>
	<script>
		console.log('html5');
	</sscript>

**注意：对于HTML5，JavaScript已经成为标准，所以不在需要指定type了，同时，对于script标签，结尾标记不能简写。**

## Q/A

### 1、为什么做了这些改变，在老式浏览器上也能用？

拿link和script来说，浏览器早已假定默认使用CSS和JavaScript，所以和标准一致。包括doctype和meta也是一样。

### 2、doctype以后也不会在变了，合适吗？

doctype的使用主要在于告诉浏览器采用它们的"标准模式"表现内容，所以不管以后HTML6或者其他，<!doctype html>已经足够表达意思了。

### 3、XHTML怎么了？很多年前听说它是未来的发展方向？

它夭折了。因为灵活性超过了严格语法。当然，如果你喜欢XML，那么还可以用严格模式编写HTML5。


