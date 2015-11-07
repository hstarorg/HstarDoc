## 0、导言

最近从coffee切换到js，代码量一下子变大了不少，也多了些许陌生感。为了在JS代码中，更合理的使用ES6的新特性，特在此对ES6的特性做一个简单的总览。


## 1、箭头函数(Arrows)

使用 => 简写的函数称之为箭头函数，和C#的lambda，CoffeeScript的语法比较类似。

	var arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
	
	//简单使用
	var arr2 = arr.map(x => x + 1);
	console.log(arr2);
	//等价于
	arr2 = arr.map(function (x) {
	  return x + 1;
	});
	console.log(arr2);
	
	//此处必须用()包裹对象，否则语法错误
	var arr3 = arr.map((x, i) => ({
	  idx: i,
	  value: x
	}));
	console.log(arr3);
	//等价于
	arr3 = arr.map(function (x, i) {
	  return {
	    idx: i,
	    value: x
	  };
	});
	console.log(arr3);
	
	//如果函数是一个语句块
	var arr4 = [];
	arr.forEach(x => {
	  if (x % 3 === 0) {
	    arr4.push(x);
	  }
	});
	console.log(arr4);
	//等价于
	arr4.length = 0;
	arr.forEach(function (x) {
	  if (x % 3 === 0) {
	    arr4.push(x);
	  }
	});
	console.log(arr4);
	
	//此处this一直指向obj对象。和一般function不同，箭头函数共享词法作用域。
	var obj = {
	  name: 'test',
	  foods: ['fish', 'milk'],
	  eat() {
	    this.foods.forEach(x =>
	      console.log(this.name + 'like eat ' + x) //注意。此地不能有分号，因为属于表达式，不是语句块。
	    );
	  }
	};
	obj.eat();

## 2、类定义（classes）

在ES6中，可以直接使用class关键字定义类，并可以定义构造函数，静态方法，get/set 方法，实例方法等。

	'use strict';
	class Animal {
	  constructor(name) {
	    this.name = name;
	  }
	  eat() {
	    console.log(this.name + ' should eat food.');
	  }
	};
	
	class Dog extends Animal {
	  //构造函数
	  constructor(age) {
	      super('Dog');
	      this.age = age;
	      //实例方法
	      this.instanceFun = function () {
	        console.log('Instance Function.');
	      }
	    }
	    //静态方法
	  static go() {
	      console.log('Dog will go.');
	    }
	    //原型方法
	  prototypeFunc() {
	    console.log('Prototype Function.');
	  }
	
	  //get、set
	  get dogName() {
	    return 'Name: ' + this.name;
	  }
	  set dogName(value) {
	    this.name = value;
	  }
	
	  //get
	  get dogAge() {
	    return 'Age: ' + this.age;
	  }
	}
	
	var dog = new Dog(4);
	Dog.go();
	dog.eat();
	dog.instanceFun();
	dog.prototypeFunc();
	console.log(dog.dogName);
	dog.dogName = 'x';
	console.log(dog.dogName);
	console.log(dog.dogAge);
	dog.dogAge = 5; //会失败，属性没有getter。

## 3、增强的对象常量（Enhanced Object Literals）

	var obj = {
	  name: 'obj',
	  __proto__: {
	    name: 'parent'
	  },
	
	  toString() {
	    // 可以通过super直接取到原型对象的属性
	    return super.name + ':' + this.name;
	  },
	
	  ['prop_' + (() => 1)()]: 1 //动态属性
	};
	
	console.log(obj.toString());
	console.log(obj.prop_1);

## 4、模板字符串（Template Strings）

简化了字符串的构造，拼接等。

	//基本字符串，\n有效。
	var str = `Basic string '\n' in Javascript.`;
	console.log(str);
	// Basic string '
	// ' in Javascript.
	
	//多行字符串
	str = `Multiline 
	strings`;
	console.log(str);
	// Multiline
	// strings
	
	//字符串插值
	var name = 'Jay';
	str = `Hello, ${name}`;
	console.log(str); // 'Hello, Jay.'

## 5、解构（Destructuring）-- Node和Chrome中执行不成功，忽略

允许使用模式匹配，来匹配数组和对象。

## 6、Default + Rest + Spread -- Node和Chrome中执行不成功，忽略

## 7、局部变量+常量（Let + Const）

	'use strict'; //必须启用严格模式
	
	{
	  let x = 1;
	}
	console.log(x); //Error:x is not defined.
	
	const PI = 3.14;
	PI = 3.15; //Error: 无法对常量赋值
	console.log(PI); //3.14

## 8、迭代器 + For..Of（Iterators + For..Of）

比较类似于C#中的IEnumerable，使用for..of来访问迭代器。它不要求实现一个数组，而是使用和LINQ类似的懒加载。

	(function () {
	  'use strict';
	  let test = {
	    [Symbol.iterator]() {
	      let pre = 0,
	        cur = 1;
	      return {
	        next() {//此处方法名不能变
	          pre = cur;
	          cur = pre + cur;
	          console.log('pre = ' + pre);
	          console.log('cur = ' + cur);
			  //返回值的属性名也不能改变
	          return {
	            done: false,
	            value: cur
	          };
	        }
	      }
	    }
	  };
	
	  for (var n of test) {
	    if (n > 1000) {
	      break;
	    }
	    console.log(n);
	  }
	})();

	// 用于获取数组的键值
	for (var item of[1, 3, 5, 7, 9]) {
	  console.log(item);
	}


## 9、生成器（Generators）

允许在function*()函数中使用yield关键字。

	function* foo(x) {
	  var y = 2 * (yield(x + 1));
	  var z = yield(y / 3);
	  return (x + y + z);
	}
	
	var it = foo(5);
	
	console.log(it.next()); // { value:6, done:false }
	console.log(it.next(12)); // { value:8, done:false }
	console.log(it.next(13)); // { value:42, done:true }

## 10、unicode

增加了对unicode字符的支持。比如“𠮷”（这个和吉不一样哦！）

	console.log('𠮷'.length); //2
	
	// 正则表达式增加了u这个参数，匹配unicode字符。
	console.log("𠮷".match(/./u)[0].length) // 2
	
	// new form
	"\u{20BB7}"=="𠮷"=="\uD842\uDFB7"
	
	// new String ops
	"𠮷".codePointAt(0) == 0x20BB7
	
	// for-of iterates code points
	for(var c of "𠮷") {
	  console.log(c);
	}

## 11、参考资料

1、ECMAScript 6 features [https://github.com/lukehoban/es6features](https://github.com/lukehoban/es6features)

2、ECMAScript 6 入门 [http://es6.ruanyifeng.com/](http://es6.ruanyifeng.com/)