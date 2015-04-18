## 1、简介

TypeScript 是一种由微软开发的自由和开源的编程语言。它是JavaScript的一个超集，而且本质上向这个语言添加了可选的静态类型和基于类的面向对象编程。

TypeScript是一种Compile-to-JavaScript的语言

TypeScript扩展了JavaScript的句法，所以现有的JavaScript程序可以不加修改，直接在TypeScript下工作。同时，TypeScript编译产生JavaScript以确保兼容性。

## 2、特点&优势

2.1、兼容现有JS代码

2.2、类型系统，面向对象设计，保证程序的健壮性（编译检查）

2.3、良好的语法，良好的工具支持

2.4、良好的社区支持

## 3、快速开始

3.1、 **工具**

如果是VS开发，安装 [TypeScript 1.4 for Visual Studio 2013](https://portal.qiniu.com/signup?code=3lo24xqrim8gi)，版本随时变化，建议下载最新版本。

如果是NPM用户，那么直接 ``npm install -g typescript``

3.2、 **Hello Jay**

使用VS的用户，直接新建项（TypeScript File即可）；使用其他IDE的用户，如果IDE支持TypeScript，那么直接新建TypeScript；其他则新建文本文件，后缀名为ts。如果是不能在IDE中编译，那么可以直接通过npm安装typescript之后，使用tsc fileName.ts，进行编译。

打开1.ts文件，输入：

	function hello(name: string){
	  return 'Hello,' + name;
	}
	
	var res = hello('Jay');
	console.log(res);

执行``tsc 1.ts``之后，生成一个1.js文件（具有可读性的标准js文件）：

	function hello(name) {
	    return 'Hello,' + name;
	}
	var res = hello('Jay');
	console.log(res);

## 4、参考资料

1、 [官网：http://www.typescriptlang.org/](http://www.typescriptlang.org/)

2、 [入门指南： https://github.com/vilic/typescript-guide](https://github.com/vilic/typescript-guide)
