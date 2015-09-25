## 1、前言

Angular作为最流行的前端MV*框架，在WEB开发中占据了重要的地位。接下来，我们就一步一步从官方api结合实践过程，来学习一下这个强大的框架吧。

Note：每个function描述标题之后的★标明了该function的重要程度（1~5星）。

## 2、function（上）

Angular封装了一系列公共方法，帮助我们更简单的使用JS。这些就是Angular的function。

### 2.1、angular.bind(★)

angular.bind类似于Function.prototype.bind，实现函数柯里化，返回一个函数代理。eg:

	函数原型
	angular.bind(/*this对象*/self, /*要封装的function*/fn, /*参数列表*/args);

	//原始函数
	function fun(arg1, arg2, arg3) {
	  console.log(this);
	  console.log(arg1);
	  console.log(arg2);
	  console.log(arg3);
	}
	fun('arg1', 'arg2', 'arg3');
	//如果几个常用参数都是固定的，而且该函数被调用频繁，那么就可以包装一下
	var fun2 = angular.bind(window, fun, 'arg1', 'arg2');
	//新的调用方式
	fun2('arg3');

### 2.2、angular.bootstrap(★★★★)

用于使用angular执行渲染元素。也是angular的启动方法，如果没有在页面上指定ng-app,必须要手动调用该函数进行启动。

	angular.bootstrap(/*Dom元素*/element, /*Array/String/Function*/[modules], /*Object*/[config]);
	
	//常规用法
	angular.bootstrap(document, ['app'])
	//带配置项
	angular.bootstrap(document, ['app'], {strictDi: true/*Defaults: false*/})

### 2.3、angular.copy(★★★★★)

Angular.copy用于复制对象，由于angular的双向绑定特点，那么如果直接操作$scope对象，那么很容易就会改变ui的显示，这个时候就需要借助angular.copy来创建一个对象副本，并进行操作。

	//原型
	angular.copy(source, [destination]);

	var obj = {a: 1};
	var obj2 = angular.copy(obj);
	var obj3;
	angular.copy(obj, obj3);
	console.log(obj2 === obj) //false
	console.log(obj3 === obj) //false
	var obj4;
	//第二个和参数和返回值是相等的，而且第二个参数不管以前是什么，都会被重新赋值
	var obj5 = angular.copy(obj, obj4);
	console.log(obj4 === obj5); //true

### 2.4、angular.element(★★★★)

等价与jQuery的选择器，如果在angular之前没有引入jQuery，那么就使用jqLite包装.

	angular.element('body');
	//等价于
	$('body');
	
	//用法
	var $body = angular.element('body');

### 2.5、angular.equals(★★)

用于比较两个对象是否相等，如下示例的规则和JS有区别，注意识别。

	var obj1 = {a: 1};
	var obj2 = obj1;
	//引用一致，则相等
	console.log(angular.equals(obj1, obj2)); // true
	
	obj2 = {a: 1};
	//引用不一致，对象表现一致，则相等
	console.log(angular.equals(obj1, obj2)); // true
	
	obj2 = {a: 1,$a: 2};
	//对象比较时，忽略以$开头的属性
	console.log(angular.equals(obj1, obj2)); // true
	
	obj1 = /aa/;
	obj2 = /aa/;
	//正则表达式表现相等，则相等
	console.log(angular.equals(obj1, obj2)); // true
	
	//NaN与NaN比较，则相等
	console.log(angular.equals(NaN, NaN)); // true

### 2.6、angular.extend(★★)

功能上和jQuery.extend没多大差异

	//原型-第一个参数为目标，之后的参数为源，同时返回dst
	angular.extend(dst, src);
	
	//示例
	var obj1 = {a: 1};
	var obj2 = angular.extend(obj1, {a: 2}, {b: 3});
	console.log(obj1)
	console.log(obj1 === obj2); //true

### 2.7、angular.forEach(★★★★★)

angular.forEach用于遍历对象或者数组，类似于ES5的Array.prototype.forEach

	//原型
	angular.forEach(obj, iterator, [context]);

	var values = {name: 'misko', gender: 'male'};
	var arr = ['misko', 'male'];
	angular.forEach(values, function (value, key) {
	  console.log(key + ' = ' + value);
	});
	angular.forEach(arr, function (value, i) {
	  console.log(i + ' = ' + value);
	});
	//还可以传递this
	var obj = {};
	angular.forEach(values, function (value, key) {
	  obj[key] = value;
	}, obj);
	console.log(obj);


### 2.8、angular.fromJson(★★★)

angular.fromJson将JSON字符串转换为JSON对象，注意，必须严格满足JSON格式，比如属性必须双引号，该函数内部实现是利用JSON.parse()。

	//原型
	angular.fromJson(/*string*/ jsonString)

	var jsonString = '{"p1": "xx", "p2": 1, "p3": true}';
	var jsonObj = angular.fromJson(jsonString);
	console.log(jsonObj);


### 2.9、angular.toJson(★★★)

angular.toJson可以将对象，数组，日期，字符串，数字转换为json字符串

	//原型
	angular.toJson(obj, pretty);

	var obj = {p1: 1, p2: true, p3: '2'};
	var jsonString = angular.toJson(obj);
	console.log(jsonString);
	//美化输出格式（设置为true，默认采用2个字符缩进）
	jsonString = angular.toJson(obj, true);
	console.log(jsonString);
	//还可以设置缩进字符数
	jsonString = angular.toJson(obj, 10);
	console.log(jsonString);

### 2.10、angular.identity(★)

angular.identity返回该函数参数的第一个值。编写函数式代码时，非常有用（待使用）。

	//官方示例
	function transformer(transformationFn, value) {
	  return (transformationFn || angular.identity)(value);
	};
	//简单演示
	var value = angular.identity('a', 1, true);
	console.log(value); // 'a'

### 2.11、angular.injector(★★)

angular.injector能够创建一个injector对象，可以用于检索services以及用于依赖注入。

	//原型，[strictDi]默认false，如果true，表示执行严格依赖模式，
	//angular则不会根据参数名称自动推断类型，必须使用['xx', function(xx){}]这种形式。
	angular.injector(modules, [strictDi]); 

	//定义模块A
	var moduleA = angular.module('moduleA', [])
	  .factory('F1', [function () {
	    return {
	      print: function () {
	        console.log('I\'m F1 factory');
	      }
	    }
	  }]);
	var $injector = angular.injector(['moduleA'])
	$injector.invoke(function (F1) {
	  console.log(F1.print());
	});
	//此种写法会报错，因为是严格模式
	var $injector2 = angular.injector(['moduleA'], true)
	$injector2.invoke(function (F1) {
	  console.log(F1.print());
	});
	//可以采用如下写法
	$injector2.invoke(['F1', function (F1) {
	  console.log(F1.print());
	}]);

### 2.12、angular.module(★★★★★)

angular.module可以说是最常用的function了。通过它，可以实现模块的定义，模块的获取。

	//定义模块A
	var moduleA = angular.module('moduleA', []);
	//定义模块B，模块B依赖moduleA
	var moduleB = angular.module('moduleB', ['moduleB']);
	
	//可以在第三个参数上设置配置函数
	var moduleB = angular.module('moduleB', ['moduleB'], ['$locationProvider', function ($locationProvider) {
	  console.log($locationProvider);
	}]);
	//等价于
	var moduleB = angular.module('moduleB', ['moduleB'])
	.config(['$locationProvider', function ($locationProvider) {
	  console.log($locationProvider);
	}]);
	
	//获取模块
	angular.bootstrap(document, ['moduleB']);