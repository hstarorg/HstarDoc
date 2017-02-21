##前言##
随着ES6标准的定稿，众多的特性也趋于稳定，各大浏览器也在逐步实现这些特性，那么对ES6有更多的了解就无可厚非了。

##准备##
在学习ES6之前，我们需要有一个环境来测试ES6代码。在这里我推荐使用node的分支io.js。

1. 如何安装？
  1. 下载地址：[https://iojs.org/en/index.html](https://iojs.org/en/index.html)，如果各位小伙伴不习惯英文，可以把url中的en修改为cn。
  2. 然后根据自己的操作系统版本，下载合适的安装包（主要指Windows系统）进行安装。
  3. 安装过程就不一一赘述了，和一般软件一样。

2. 如何验证安装成功？
  1. 打开cmd，然后输入``iojs -v``,如果输出一个版本号，那么就代表io.js安装成功。（PS：我现在使用的是v1.2.0）
  2. 也可以输入``iojs -p process.versions.v8``查看iojs所使用的V8（PS：不是V8发动机）的版本。（PS:我这儿显示4.1.0.14）

##小窥ES6##
在测试ES6代码前，我们可以先看下io.js对ES6的支持：[https://iojs.org/cn/es6.html](https://iojs.org/cn/es6.html)。

**接下来，开始我们的ES6-Class之旅：**

###1、class 基础 ###

大家应该知道，在大部分面向对象的语言中，都有class的说法，那么在早期的Js中，面向对象的实现比较特殊，我们必须要用function来模拟。如：

	//ES5及以下
	function Point(x, y){
	  this.x = x;
	  this.y = y;
	}
	var p1 = new Point(100, 100);

然而在ES6中，我们可以直接使用class关键字，如：

	//ES6
	'use strict' //不能去掉，要不然iojs会提示不认识class。
	class Point{
	  constructor(x, y){
	    this.x = x;
	    this.y = y;
	  }
	}
	var p1 = new Point(100, 100);
	console.log(p1);

将以上代码保存为1.js,那么执行如下命令：**``iojs --es_staging 1.js``** 就可以看到"{x:100, y: 100}"这个结果了。（PS:注意要在1.js的目录打开cmd）。

接下来，看一个复杂点的，继承：

	//ES6
	'use strict'
	class Point{
	  constructor(x, y){
	    this.x = x;
	    this.y = y;
	  }
	}
	var p1 = new Point(100, 100);
	console.log(p1);
	
	class ColorPoint extends Point{
	  constructor(x, y, color){
	    super(x, y);
	    this.color = color;
	  }
	}
	var cp = new ColorPoint(50, 50, 'red');
	console.log(cp);

	//输出继承关系
	console.log(cp instanceof ColorPoint); //true
	console.log(cp instanceof Point);  //true

可以看到，和大部分语言的继承都很类似，如果你有其他面向对象语言的基础，那么很容易就能理解。

对Point和ColorPoint进行typeof，结果很明显也能看到是function。

	console.log(typeof Point);  // function
	console.log(typeof ColorPoint);  // function

那如果对class进行函数调用呢？

	Point(100, 100); //Error

如上，必须通过new调用class，直接使用函数调用则会报错。

再来对比以下代码：

	//标准的函数可以先写调用语句，后写申明语句。因为会定义前置
	foo();
	function foo(){}
	//如果是class呢?
	new Foo(); //Error,Foo is not defined
	class Foo{}

如上，如果是定义的class，那么必须要定义语句在前，调用在后。

再来看以下的情形：

	function funThatUseBar(){
	  new Bar();
	}
	//funThatUseBar(); //Error,Bar is not defined
	class Bar{}
	funThatUseBar(); //ok

如上，如果先使用了Bar，那么也是会报错的。必须要优先定义class。

附上以上所有的js，会报错的语句，进行了注释。

	//ES6
	'use strict'
	class Point{
	  constructor(x, y){
	    this.x = x;
	    this.y = y;
	  }
	}
	var p1 = new Point(100, 100);
	console.log(p1);
	
	class ColorPoint extends Point{
	  constructor(x, y, color){
	    super(x, y);
	    this.color = color;
	  }
	}
	var cp = new ColorPoint(50, 50, 'red');
	console.log(cp);
	
	//*********************************************
	
	//输出继承关系
	console.log(cp instanceof ColorPoint); //true
	console.log(cp instanceof Point);  //true
	
	console.log(typeof Point);  // function
	console.log(typeof ColorPoint);  // function
	
	//Point(100, 100); //Error
	
	//************************************
	//标准的函数可以先写调用语句，后写申明语句。因为会定义前置
	foo();
	function foo(){}
	
	//如果是class呢?
	//new Foo(); //Error,Foo is not defined
	class Foo{}
	
	
	//*******************************************
	
	function funThatUseBar(){
	  new Bar();
	}
	//funThatUseBar(); //Error,Bar is not defined
	class Bar{}
	funThatUseBar(); //ok

###2、类中的主体

ES6中、class的主体只能包含方法，不能包含数据属性。如果在类中包含变量定义，则会报错。class中的方法有三种类型：构造函数、静态方法、原型方法，如：

	class Class1{
	  //构造
	  constructor(options){
	
	  }
	
	  // 静态方法，静态方法用static修饰
	  static staticMethod(){
	    return 'static method';
	  }
	
	  prototypeMethod(){
	    return 'prototype method';
	  }
	}

其中，每个class和class原型的constructor都是相等的，同时class本质也是function

	console.log(Class1 === Class1.prototype.constructor) // true
	console.log(typeof Class1)  // function

然后我们对类中的方法做测试

	var p = console.log;
	p(typeof Class1.prototype.prototypeMethod); 
	Class1.prototype.prototypeMethod() // 原型方法调用方式
	p(typeof Class1.staticMethod);  
	Class1.staticMethod() //静态方法调用方式

Getters 和 Setters 的用法

	class Class2{
	  get name(){
	    return 'jay';
	  }
	  set name(value){
	    console.log('set name = ' + value);
	  }
	}
	
	var c2 = new Class2();
	c2.name = 'hu';  // "set name = hu"
	console.log(c2.name); // "jay"

当使用了get和set时，那么针对属性的get和set会自动调用class中相关的方法。

贴出所有Js代码：

	'use strict'
	class Class1{
	  //构造
	  constructor(options){
	
	  }
	
	  // 静态方法
	  static staticMethod(){
	    return 'static method';
	  }
	
	  prototypeMethod(){
	    return 'prototype method';
	  }
	}
	
	console.log(Class1 === Class1.prototype.constructor);
	console.log(typeof Class1);
	
	var p = console.log;
	p(typeof Class1.prototype.prototypeMethod);
	p(typeof Class1.staticMethod);
	
	class Class2{
	  get name(){
	    return 'jay';
	  }
	  set name(value){
	    console.log('set name = ' + value);
	  }
	}
	
	var c2 = new Class2();
	c2.name = 'hu';
	console.log(c2.name);

###3、类的继承

简单的继承关系，如下：

	'use strict'
	class Class1{
	  toString(){
	    return 'parent class.';
	  }
	}
	
	class SubClass extends Class1{
	  toString(){
	    return 'sub class.';
	  }
	}
	
	var sc = new SubClass();
	console.log(sc.toString()); // "sub class"

其中，sc是Class1的实例，也是SubClass的实例：

	console.log(sc instanceof Class1); //true
	console.log(sc instanceof SubClass); //true

如果要调用父类的方法，怎么办呢？

	class SubClass2 extends Class1{
	  toString(){
	    return super.toString();
	  }
	}
	
	var sc2 = new SubClass2();
	console.log(sc2.toString());

在继承关系中，子类的原型等于父类：

	console.log(Object.getPrototypeOf(SubClass2) === Class1); //true

在子类中访问父类构造，使用super即可。

##其他##
1. 如果想一览所有的ES6新特性，可以参考[https://github.com/lukehoban/es6features](https://github.com/lukehoban/es6features)
2. 如果想系统的学习ES6，那么推荐[http://es6.ruanyifeng.com/](http://es6.ruanyifeng.com/)
3. 想了解更多Classes in ECMAScript 6，可参考[http://www.2ality.com/2015/02/es6-classes-final.html](http://www.2ality.com/2015/02/es6-classes-final.html)