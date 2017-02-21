##1、let命令
**Tips:**

1. 块级作用域（只在当前块中有效）
2. 不会变量提升（必须先申明在使用）
3. 让变量独占该块，不再受外部影响
4. 不允许重复声明

**总之：let更像我们熟知的静态语言的的变量声明指令**

ES6新增了let命令，用来声明变量。用法类似于var，但所声明的变量，只能在let命令所在的代码块内有效。

let声明的变量只有块级作用域

	'use strict'
	{
	  let a = 1;
	}
	console.log(a); //结果是什么？

看一段熟悉的代码：

	var a = [];
	for (var i = 0; i < 10; i++) {
	  a[i] = function () {
	    console.log(i);
	  };
	}
	console.log(a[6]()); //结果是什么？

如果改用let的话，那么看以下代码输出什么？

	'use strict'
	var a = [];
	for (let i = 0; i < 10; i++) {
	  a[i] = function () {
	    console.log(i);
	  };
	}
	console.log(a[6]()); // ?

同时，在使用let的时候，必须先申明再使用，不像var会变量提升：

	'use strict'
	console.log(a);
	let a = 1;

ES6中明确规定，如果区块存在let和const，那么该区块就形成封闭作用域，凡是在声明致歉就使用这些变量，就会报错。简称“暂时性死区”（temporal dead zone，简称TDZ）。

看一个不太容易发现的死区：（注：该代码未测试）

	function bar(x=y, y=2) {
	  return [x, y];
	}
	
	bar(); // 报错

调用bar之所以报错，是因为参数x默认值等于另一个参数y，而此时y还没有声明，属于“死区”。

需要注意，函数参数作用域和函数体的作用域是分离的：

	let foo = 'outer';
	
	function bar(func) {
	  let foo = 'inner';
	  console.log(func()); // outer
	}
	
	bar(function(){
	  console.log(foo);
	});

同时，let还不允许重复声明
	
	{
	  let a = 1;
	  var a = 1;
	}
	{
	  let a = 1;
	  let a = 2;
	}

##2、const命令
**Tips：**

1. const用于声明常量，一旦声明，值就不能改变
2. const具有块级作用域
3. const不能变量提升（先声明后使用）
4. 不可重复声明

**const看起来很像我们熟知的静态语言的只读对象**

const声明常量，一旦声明，值将是不可变的。

	'use strict'
	const PI = 3.1415;
	PI // 3.1415
	PI = 3; //Error

const指令指向变量所在的地址，所以对该变量进行属性设置是可行的（未改变变量地址），如果想完全不可变化（包括属性），那么可以使用冻结。

	'use strict'
	const C1 = {};
	C1.a = 1;
	console.log(C1.a); // 1 

	//冻结对象，此时前面用不用const都是一个效果
	const C2 = Object.freeze({}); 
	C2.a = 1; //Error,对象不可扩展
	console.log(C2.a);

##3、全局对象属性

JavaScript中，全局对象是最顶层的对象，浏览器中是window对象，Node中是global对象，ES5规定，所有全局变量都是全局对象的属性。

在ES6中，var和function申明的变量，属于全局对象的属性，let和const则不是全局对象的属性。

	'use strict'
	let b = 2;
	console.log(global.b); // undefined