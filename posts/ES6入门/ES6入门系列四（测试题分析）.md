## 0、导言

ES6中新增了不少的新特性，来点测试题热热身。具体题目来源请看：[http://perfectionkills.com/javascript-quiz-es6/](http://perfectionkills.com/javascript-quiz-es6/)。

以下将一题一题来解析what和why。

## 1、题目一

	(function(x, f = () => x) {
	  var x;
	  var y = x;
	  x = 2;
	  return [x, y, f()];
	})(1)

	A、 [2, 1, 1]
	B、 [2, undefined, 1]
	C、 [2, 1, 2]
	D、 [2, undefined, 2]

**解析：**本题主要考察的知识点是1、参数值与函数体内定义的重名变量的优先级；2、ES6的默认参数；3、箭头函数。
在本题中，先执行x的定义，然后函数参数x=1，接着是y = x = 1,接着再x = 2，第三个是执行f函数，箭头函数如果只是表达式，那么等价于return 表达式，由于箭头函数的作用域等于定义时的作用域，那么函数定义时x=1，所以最后的return x 等价于 return 1

## 2、题目二

	(function() {
	  return [
	    (() => this.x).bind({ x: 'inner' })(),
	    (() => this.x)()
	  ]
	}).call({ x: 'outer' });
	
	A、 ['inner', 'outer']
	B、 ['outer', 'outer']
	C、 [undefined, undefined]
	D、 Error

**解析：**本题主要考察的是箭头函数的作用域问题，箭头函数的作用域等于定义时的作用域，所以通过bind设置的this是无效的。那么结果就显而易见了。

## 3、题目三

	let x, { x: y = 1 } = { x }; y;
	
	A、 undefined
	B、 1
	C、 { x: 1 }
	D、 Error

**解析：**本题主要考察的是对象赋值，先定义x，然后在赋值的时候会执行一次y=1，最后返回y的值。

## 4、题目四

	(function() {
	  let f = this ? class g { } : class h { };
	  return [
	    typeof f,
	    typeof h
	  ];
	})();
	
	A、 ["function", "undefined"]
	B、 ["function", "function"]
	C、 ["undefined", "undefined"]
	D、 Error

**解析：**本题主要考察定义函数变量时，命名函数的名称作用域问题。在定义函数变量时，函数名称只能在函数体中生效。

## 5、题目五

	(typeof (new (class { class () {} })))
	
	A、 "function"
	B、 "object"
	C、 "undefined"
	D、 Error

**解析：**本题主要考察对象的类型，和原型方法。该提可以分解如下：

	// 定义包含class原型方法的类。
	var Test = class{
	  class(){}
	};
	var test = new Test(); //定义类的实例
	typeof test; //出结果

## 6、题目六

	typeof (new (class F extends (String, Array) { })).substring
	
	A、 "function"
	B、 "object"
	C、 "undefined"
	D、 Error

**解析：**本题主要考察ES6中class的继承，以及表达式的返回值和undefined的类型。题目其实可以按照如下方式分解：

	//由于JS的class没有多继承的概念，所以括号被当做表达式来看
	(String, Array) //Array,返回最后一个值
	(class F extends Array); //class F继承成Array
	(new (class F extends Array)); //创建一个F的实例
	(new (class F extends (String, Array) { })).substring; //取实例的substring方法，由于没有继承String，Array没有substring方法，那么返回值为undefined
	typeof (new (class F extends (String, Array) { })).substring; //对undefined取typeof

## 7、题目七

	[...[...'...']].length
	
	A、 1
	B、 3
	C、 6
	D、 Error

**解析：**本题主要考察的是扩展运算符...的作用。扩展运算符是将后面的对象转换为数组，具体用法是：

	[...<数据>] 比如 [...'abc']等价于["a", "b", "c"]


## 8、题目八

	typeof (function* f() { yield f })().next().next()
	 
	A、 "function"
	B、 "generator"
	C、 "object"
	D、 Error

**解析：**本题主要考察ES6的生成器。题目可以如下分解：

	function* f() { yield f }; //定义一个生成器
	var g = f(); //执行生成器
	var temp = g.next(); //返回第一次yield的值
	console.log(temp); //测试，查看temp，其实是一个object
	temp.next()；//对对象调用next方法，无效


## 9、题目九

	typeof (new class f() { [f]() { }, f: { } })[`${f}`]
	
	A、 "function"
	B、 "undefined"
	C、 "object"
	D、 Error

**解析：**本题主要考察ES6的class，以及动态属性和模板字符串等。 实际上这个题动态属性和模板字符串都是烟雾弹，在执行new class f()的时候，就已经有语法错误了。


## 10、题目十

	typeof `${{Object}}`.prototype
	
	A、 "function"
	B、 "undefined"
	C、 "object"
	D、 Error

**解析：**本题考察的知识点相对单一，就是模板字符串。分解如下：

	var o = {Object},
	  str = `${o}`;
	typeof str.prototype; 


## 11、题目十一

	((...x, xs)=>x)(1,2,3)
	
	A、 1
	B、 3
	C、 [1,2,3]
	D、 Error

**解析：**本题主要考察的是Rest参数的用法，在ES6中，Rest参数只能放在末尾，所以该用法的错误的。

## 12、题目十二

	let arr = [ ];
	for (let { x = 2, y } of [{ x: 1 }, 2, { y }]) { 
	  arr.push(x, y);
	}
	arr;
	
	A、 [2, { x: 1 }, 2, 2, 2, { y }]
	B、 [{ x: 1 }, 2, { y }]
	C、 [1, undefined, 2, undefined, 2, undefined]
	D、 Error

**解析：**本题看起来是考察let的作用域和of迭代的用法。实则是考察let的语法，let之后是一个参数名称。所以，语法错误

## 13、题目十三

	(function() {
	  if (false) {
	    let f = { g() => 1 };
	  }
	  return typeof f;
	})()

	A、 "function"
	B、 "undefined"
	C、 "object"
	D、 Error

**解析：**本题非常有迷惑性，看似考察的let的作用域问题，实则考察了箭头函数的语法问题。

## 14、题目答案

相信大家看过题目的解析，对题目答案已经了然。为了完善本文，还是在最后贴出所有题目的答案：

ABBAB CBDDB DDD

