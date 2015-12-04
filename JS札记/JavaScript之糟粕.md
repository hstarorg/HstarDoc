## 0、导言

在上篇《JavaScript之毒瘤》中，列举了一些在JavaScript中难以避免的问题特性。本篇将会展示JavaScript中有问题的特性，但我们很容易就能便面它们。通过这些简单的做法，让JavaScript称为一门更好的语言。

## 1、==

JavaScript有两组相等运算符。 === 和 !==，以及 == 和 !==。 === 和 !== 不会进行类型转换，一般会按照你期望的方式工作。由于JavaScript的类型转换系统相当复杂，如果要确保==和 != 不出错，就必须要牢记转换规则。另外==运算符缺乏传递性。

	//关于传递性
	if a === b, b === c then a === c;
	if a == b, b == c then a 不一定等于 c，破坏了传递性

**小测验**：

	'' == '0'
	0 == ''
	0 == '0'
	
	false == 'false'
	false == '0'
	
	false == undefined
	false == null
	null == undefined
	
	'\t\t\n' == 0

**总结**：推荐使用===和!==，尽量避免使用==和!=。

## 2、with语句

JavaScript提供了一个with语句，本意是用它来快速访问对象，不幸的是，它的结果可能有时不可预料。

**小测验**：

	window.a = 1;
	var obj={};
	with(obj){
	  console.log(a);
	}
	obj.a = 2;
	with(obj){
	  console.log(a);
	}

**结论**：避免使用with。

## 3、eval

eval函数传递一个字符串给JavaScript*编译器*，并且执行结果。有问题问题呢？首先是代码难以阅读，另外需要运行编译器，导致性能低下；同时，还减弱了程序的安全性。**注：**Function构造函数，setTimeout、setInterval的字符串参数形式和eval是执行方式一致。

**结论**：避免使用eval，setTimeout、setInterval的字符串参数和Function构造函数。

## 4、continue

continue语句跳到循环顶部，性能比较低下。

**小测验**：

	var counter = 10;
	console.time('t1');
	var sum = 0;
	for(var i = 0; i < counter; i++){
	  if(i % 3 !== 0){
	    continue;
	  }
	  sum = sum + i;
	}
	console.log(sum);
	console.timeEnd('t1');
	
	console.time('t2');
	var sum = 0;
	for(var i = 0; i < counter; i++){
	  if(i % 3 === 0){
	    sum = sum + i;
	  }
	}
	  
	console.log(sum);
	console.timeEnd('t2');

**结论**：尽量优化代码，减少continue的使用。

## 5、switch

switch语句中，除非明确的中断流程，否则每次条件判断后，都可以穿越到下一个case条件。这很容易造成bug。

**小测验**：

	var a = 15;
	switch(a){
	  case a * 1 :
	    console.log('a*1');
	  case a / 1:
	    console.log('a/1');
	  default:
	    console.log('a');
	}

**结论**：不要刻意的使用case条件穿越。

## 6、缺少块的语句

if、while、do或for可以接受代码块，也可以接受单行语句。单行语句的形式是一种带刺的玫瑰。虽然它可以节约2个字节，但它模糊了程序的结构。

**小测验**：

	if(1 == '0')
	  console.log('1 == 0');
	  console.log('my god');
	
	// VS
	if(1 == '0'){
	  console.log('1 == 0');
	}
	console.log('my god');

**结论**：避免使用模糊程序结构的单行语句。

## 7、++ --

递增和递减使得可以用非常简洁的风格去编码。但是它可能造成缓冲区溢出、同时往往让代码变得拥挤也不易于理解。

**小测验**：

	var a = 1;
	a = a++ + ++a;
	console.log(a);
	a = 1;
	a = a++ + a++;
	console.log(a);
	

**结论**：避免使用++ --。

## 8、位运算符

JavaScript有着和Java相同的一套位运算符。Java中位运算符处理整数，非常快。在JavaScript中，只有双精度浮点数，所以位运算非常慢。另外，&非常容易误写为&&，使得bug容易被隐藏起来。

**小测验**：

	var counter = 10000;
	var a = 5;
	var sum = 0;
	console.time('t1');
	for(var i = 0; i < counter; i++){
	  sum += a << 1;
	}
	console.log(sum);
	console.timeEnd('t1');
	
	sum = 0;
	console.time('t2');
	for(var i = 0; i < counter; i++){
	  sum += a * 2;
	}
	console.log(sum);
	console.timeEnd('t2');

**结论**：避免使用位运算符。

## 9、function语句 与 function表达式

JavaScript中既有function语句，也有function表达式，这令人困惑，似乎看起来也差不多。function语句在解析时会产生变量提升，放宽了函数必须先申明后使用的的要求。同时，JS在if语句中使用function语句也是被禁止的，但实际上大多数浏览器允许在if中使用function语句，这有可能会导致兼容性问题。

由于一个语句不能以一个函数表达式开头，如下如下写法，可以改写为另外一种形式。
	
	function (){}(); //Error 
	
	(function(){}()); // Right

**小测验**：

	// function语句
	function fun(){}
	
	// function表达式
	var fun = function(){};

**结论**：合理使用function语句和function表达式。

## 10、类型的包装对象

JavaScript有一种类型的包装对象，如 new Number(1);这很容易令人困惑。

**小测验**:

	var num1 = new Number(1);
	var num2 = 1;
	console.log(typeof num1);
	console.log(num1 === num2);

**结论**：避免使用包装对象，如new Boolean(),new String(),new Number()等

## 11、new

new运算符创建一个继承于其原型的新对象，并将新创建的对象绑定给this。但是，如果忘记使用new，那么就得到一个普通的函数调用，对象属性也会被绑定到全局对象上。这不会导致什么编译警告，也没有运行警告。

根据惯例，需要用new的函数，以首字母大写命名。这能部分程度上便于我们发现错误。

**小测验**：

	function Person(){
	  this.name = 'Default';
	  this.sex = undefiend;
	}
	
	Person();
	new Person();
	
	//更好的实现
	function Person(){
	  if(this === window){
	    return new Person();
	  }
	  this.name = 'Default';
	  this.sex = undefiend;
	}


**结论**：合理的避免使用new。另外可以先判断this，再做对应处理。

## 12、void

大部分语言中，void是一种类型，在Js中，void是一种运算符，接收一个运算数，并返回undefined

**小测验**：
	void 0
	void true

**结论**：有限的使用void






