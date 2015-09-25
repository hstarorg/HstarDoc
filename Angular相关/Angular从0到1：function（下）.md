## 1、前言

## 2、function（下）

### 2.13、angular.isArray(★★)

``angular.isArray``用于判断对象是不是数组，等价于``Array.isArray``

	console.log(angular.isArray([])); // true
	console.log(angular.isArray({0: '1', 1: '2', length: 2})); // false

### 2.14、angular.isDate(★★)

通过判断toString.call(value)是不是等于'[object Date]' 来判断对象是个是一个Date对象.

	console.log(angular.isDate(new Date())); // true
	console.log(angular.isDate(223)); // false

### 2.15、angular.isDefined(★★)

判断对象或者属性是否定义

	var obj = {a: 1, b: null, c: undefined};
	console.log(angular.isDefined(obj.a)); // true
	console.log(angular.isDefined(obj.b)); // true
	console.log(angular.isDefined(obj.c)); // false
	console.log(angular.isDefined(obj.d)); // false

### 2.16、angular.isElement(★★)

此方法判断元素是不是一个元素（包含dom元素，或者jquery元素）

	console.log(angular.isElement(document.getElementsByTagName('body')[0])); // true
	console.log(angular.isElement($('body'))); // true

### 2.17、angular.isFunction(★★)

此方法判断对象是不是一个function ，等价于 typeof fn === 'function'

	console.log(angular.isFunction(new Function('a', 'return a'))); // true
	console.log(angular.isFunction(function(){})); // true
	console.log(angular.isFunction({})); // false

### 2.18、angular.isNumber(★★)

判断数字是否为number

	function isNumber(value) {
	  return typeof value === 'number';
	}

### 2.19、angular.isObject(★★)

	function isObject(value) {
	  return value !== null && typeof value === 'object';
	}

### 2.20、angular.isString(★★)

	function isString(value) {
		return typeof value === 'string';
	}

### 2.21、angular.isUndefined(★★)

	function isUndefined(value) {
		return typeof value === 'undefined';
	}

### 2.22、angular.lowercase(★★)

转换字符串为小写模式，如果参数不是字符串，那么原样返回

	var lowercase = function(string) {
	  return isString(string) ? string.toLowerCase() : string;
	};
	
	console.log(angular.lowercase(1)); // 1
	console.log(angular.lowercase('ABCdef')); // 'abcdef'

### 2.23、angular.uppercase(★★)

转换字符串为大写模式，如果参数不是字符串，那么原样返回

	var uppercase = function(string) {
	  return isString(string) ? string.toUpperCase() : string;
	};
	
	console.log(angular.uppercase(1)); // 1
	console.log(angular.uppercase('ABCdef')); // 'ABCDEF'

### 2.24、angular.merge(★★)

将多个对象进行深度复制，与extend()不同，merge将会递归进行深度拷贝。该拷贝是完全深拷贝，就连对象引用也不一样。

	var o = {};
	var obj1 = {a1: 1, a2: 2, a3: [1]};
	var obj2 = {b1: [2], b2: /abc/};
	var obj3 = [o];
	var obj4 = {d: o};
	var result = angular.merge({}, obj1, obj2, obj3);
	console.log(result);
	console.log(result[0] === o); // false
	console.log(result.d === o); // false

### 2.25、angular.noop(★★)

一个空函数，调试时非常有用。可以避免callback未定义引发的error。

	function foo(callback) {
	  var result = calculateResult();
	  (callback || angular.noop)(result);
	}


### 2.26、angular.reloadWithDebugInfo(★★)

启用DebugInfo，该设置优先级高于``$compileProvider.debugInfoEnabled(false)``