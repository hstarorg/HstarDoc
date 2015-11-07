## 0、导言

最近从coffee切换到js，代码量一下子变大了不少，也多了些许陌生感。为了在JS代码中，更合理的使用ES6的新特性，特在此对ES6的特性做一个简单的总览。


## 1、模块（Module) --Chrome测试不可用

在ES6中，有class的概念，不过这只是语法糖，并没有解决模块化问题。Module功能则是为了解决模块化问题而提出的。

我们可以使用如下方式定义模块：

11_lib.js文件内容

	// 导出属性和方法
	export var PI = 3.1415926;
	export function calcCircularArea(r){
	  return PI * r * r;
	}

app.js文件内容

	//导出所有，使用别名调用
	import * as lib from '11_lib';
	console.log(lib.calcCircularArea(2));
	console.log(lib.PI);
	
	//导出属性和方法
	import {calcCircularArea, PI} from '11_lib';
	console.log(calcCircularArea(2));
	console.log(PI);


## 2、模块加载器（Module Loaders） --Chrome测试不可用

既然用了定义module的规范，那么也就需要一个模块加载器，需要支持如下内容：

1. 动态加载
2. 状态隔离
3. 全局命名空间隔离
4. 编译钩子
5. 嵌套虚拟化

---
	System.import('11_lib').then(function(m) {
	  console.log(m.calcCircularArea(2));
	  console.log(m.PI);
	});

## 3、图 + 集合 + 弱引用图 + 若引用集合(Map + Set + WeakMap + WeakSet)

在ES6中，新增了几种数据结构。

**Map**是一种类似于Object的结构，Object本质上是键值对的集合，但是只能是字符串当做键，所以有一定的使用限制。Map的话，则可以拿任意类型来作为key。具体使用如下：

	var map = new Map();
	var key = {key: 'hah'};
	map.set(key, '1'); //设置key-value
	map.set(key, 2); //对已有key进行设置，表示覆盖
	console.log(map.get(key)); //获取key的值
	console.log(map.size);//获取map的元素个数
	map.has(key); //判断map中有指定的key
	map.delete(key); //删除map中指定的key
	map.clear(); //清空map

**WeakMap**和Map是比较类似的，唯一的区别是只接受对象作为键名（null除外），而且键名所指向的对象，不计入垃圾回收机制。

**Set**是一种类似于数组，但成员的值都是唯一（引用唯一）的一种数据结构。具体使用如下：

	var set = new Set();//定义set
	set.add(1).add(2).add(1).add('2'); //添加数据
	console.log(set.size);//查看set中元素的数量，结果应该是3，因为重复添加不计算，2和'2'不等。
	set.delete(1); //删除set的值（通过value删除）。
	set.has(1); //set是否包含某个value
	set.keys(); //返回set的所有key
	set.values(); //返回set的所有value
	set.clear();//清空set

**WeakSet**和Set也是比较类型的，和Set有两个区别，一个是成员只能是对象；二个是WeakSet是不可遍历的。


## 4、代理（Proxies） --Chrome测试不可用

代理允许用宿主的行为来创建对象，能够实现拦截，对象的虚拟化，日志和分析等功能。

## 5、数据类型Symbols

在ES5中，JS只有6中原始类型，在ES6中，新增了Symbols类型，成为了JS中的第7种原始类型。
该类型表示独一无二的值。使用如下：

var key = Symbol(); //定义Symbol对象
console.log(typeof key); //symbol ，表示为类型，而且不是string类型的。
key = Symbol('这是一个说明'); //可以在定义Symbol的时候，添加一个说明

Symbol不能与其他类型值进行运算，但是可以显式转换为字符串，和转换为布尔值

	console.log(key.toString());
	console.log(String(key));
	
	if(key){
	  console.log('key is true');
	}

在对象的内部，要使用Symbol值定义属性时，必须放在方括号中。

	var obj = {
	  [key]: 'abc'
	};

## 6、可以子类化的内置对象

在ES6中，我们可以自定义类型来继承内置对象，这个时候，如果要自定义构造函数，必须要在构造函数中调用super(),来呼叫父类的构造。

	'use strict';
	class MyArray extends Array {
	    // 如果要定义constuctor，那么就必须要使用super来执行父类的构造
	    constructor(){
	      super();
	    }
	}
	
	var arr = new MyArray();
	arr[1] = 12;
	console.log(arr.length === 2);

## 7、新增的API（Math + Number + String + Array + Object APIs）

如下代码，一目了然：

	//数字类api
	Number.EPSILON; //增加常量e
	Number.isInteger(Infinity) // false
	Number.isNaN("NaN") // false
	
	//数学类api
	Math.acosh(3) // 1.762747174039086
	Math.hypot(3, 4) // 5
	Math.imul(Math.pow(2, 32) - 1, Math.pow(2, 32) - 2) // 2
	
	//字符串类api
	"abcde".includes("cd") // true
	"abc".repeat(3) // "abcabcabc"
	
	//数组api
	Array.from(document.querySelectorAll('*')) // Returns a real Array
	Array.of(1, 2, 3) // Similar to new Array(...), but without special one-arg behavior
	[0, 0, 0].fill(7, 1) // [0,7,7]
	[1, 2, 3].find(x => x == 3) // 3
	[1, 2, 3].findIndex(x => x == 2) // 1
	[1, 2, 3, 4, 5].copyWithin(3, 0) // [1, 2, 3, 1, 2]
	["a", "b", "c"].entries() // iterator [0, "a"], [1,"b"], [2,"c"]
	["a", "b", "c"].keys() // iterator 0, 1, 2
	["a", "b", "c"].values() // iterator "a", "b", "c"
	
	//对象api
	Object.assign(Point, { origin: new Point(0,0) })

## 8、二进制和八进制字面量（Binary and Octal Literals）

直接上示例：

	var n1 = 0b111110101; //0b前缀，表示二进制字面量
	console.log(n1); //输出的时候，直接用10进制展示
	
	var n2 = 0o12345; //0o前缀，表示八进制字面量
	console.log(n2);

## 9、承诺（Promises）

**Promise**是ES6中新增的异步编程库。

	//使用承诺定义一个异步任务
	var p = new Promise((resolve, reject)=>{
	  return setTimeout(function(){
	    reject('ok');
	  }, 2000);
	});
	
	p.then((data)=>{
	  console.log(data);
	}, (data)=>{
	  console.log('error' + data);
	}).then(()=>{
	  console.log('throw err');
	  throw 'Error';
	}).catch(err => {
	  console.log(err);
	});


## 10、参考资料

1、ECMAScript 6 features [https://github.com/lukehoban/es6features](https://github.com/lukehoban/es6features)

2、ECMAScript 6 入门 [http://es6.ruanyifeng.com/](http://es6.ruanyifeng.com/)