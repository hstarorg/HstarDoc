## JavaScript的数据类型

### 简单数据类型

1. string
2. number
3. boolean
4. function
5. null
6. undefined

### 复杂数据类型

1. String
2. Number
3. Boolean
3. Function
4. Date
5. Array
6. RegExp 
7. Object 

## 各种类型的深复制方式：

先来看看简单类型的复制方式：

	//string
	var s1 = 'abc';
	var s2 = s1;
	s2 = 'ccc';
	console.log(s1);
	
	//number
	var n1 = 12.1;
	var n2 = n1;
	n2 = 7410;
	console.log(n1);
	
	//boolean
	var b1 = true;
	var b2 = b1;
	b2 = false;
	console.log(b1);

	//null
	var nu1 = null;
	var nu2 = nu1;
	nu2 = 'abc';
	console.log(nu1);
	
	//undefined
	var u1 = undefined;
	var u2 = u1;
	u2 = 'abc';
	console.log(u1);

从以上的代码可以看出，简单类型，只需要直接赋值就是深复制了。但是也有一个例外，那就是function。

接着来看看String、Number、Boolean、Date的深复制：
	
	//String
	var s1 = new String('s1');
	var s2 = new String(s1);
	console.log(s2);
	
	//Number
	var n1 = new Number('1');
	var n2 = new Number(n1);
	console.log(n2);
	
	//Boolean
	var b1 = new Boolean(1);
	var b2 = new Boolean(b1);
	console.log(b2);

	//Date
	var d1 = new Date();
	var d2 = new Date(d1);
	console.log(d2);

除以上的做法之外，还需要对实例属性进行拷贝。那么剩下的Function、function、RegExp和Array还有Object又该怎么拷贝呢？这几个比较特殊，我们一个一个来：

对于Function和function的深拷贝，我们可以按照如下的方式来做：

	var f1 = new Function('a', 'console.log("f1" + a);');
	var f2 = function(b){console.log('f2' + b);};
	
	//通过toString获取源代码(有浏览器兼容问题)
	var code = f1.toString();
	//利用eval进行复制
	var f1_copy = (function(functionCode){
	  eval('var f = ' + functionCode);
	  return f;
	})(code);
	
	f1_copy('abc');
	
	//当然f2也可以用同样的方式来复制。

接着，我们来看下RegExp，可以同样同时eval来执行拷贝，也可以使用如下方式：

	var reg1 = /abc/g;
	var reg2 = new RegExp('abc', 'gmi');
	
	var reg1_copy = (function(reg){
	  var pattern = reg.valueOf();
	  var flags = (pattern.global ? 'g' : '') + 
	    (pattern.ignorecase ? 'i' : '') + (pattern.multiline ? 'm' : '');
	  return new RegExp(pattern.source, flags);
	})(reg1);

最后，我们来说一说Array的复制，有的人可以说，直接用slice复制一份出来就是了，那我们来看看，是否真的达到效果的呢？

	var o = {name: 'Jay'};
	var arr1 = [o, '22', 1];
	var arr2 = arr1.slice(0);
	arr2[0].name = 'Arr2';
	console.log(arr1[0].name);

很简短的代码，直接就把slice抛弃了，slice只能保证Array是新的，并不意味着内部的元素是深拷贝的，那么如何做呢？就是遍历元素，对每个元素进行深拷贝了。代码如下：

	var o = {name: 'Jay'};
	var arr1 = [o, '22', 1];
	
	var arr2 = [];
	for(var i = 0, len = arr1.length; i < len; i++){
	  //注意，deepClone还未实现
	  arr2.push(deepClone(arr1[i]));
	}

以上对针对不同的类型，特殊的代码，那么如何来拷贝实例属性呢？代码如下：

	var o = {p1: '1', p2: 2, p3: function(){}};
	
	var copy = {};
	for(var p in o){
	  //注意deepClone还未实现
	  copy[p] = deepClone(o[p]);
	}

**注意：针对复杂类型，还需要同时copy.constructor = source.constructor来保证构造函数一致。**

## 最终的深复制代码

通过以上的分析与代码示例，那么我们最终的代码又是怎样的呢？详细代码如下：

	//自调用函数，防御性编程
	;
	(function (window) {
	  'use strict';
	
	  function getCustomType(obj) {
	    var type = typeof obj,
	      resultType = 'object';
	    //简单类型
	    if (type !== 'object' || obj === null) {
	      resultType = 'simple';
	    } else if (obj instanceof String || obj instanceof Number || obj instanceof Boolean || obj instanceof Date) {
	      resultType = 'complex';
	    } else if (obj instanceof Function) {
	      resultType = 'function';
	    } else if (obj instanceof RegExp) {
	      resultType = 'regexp';
	    } else if (obj instanceof Array) {
	      resultType = 'array';
	    }
	    return resultType;
	  }
	
	  function cloneProperties(dest, source) {
	    dest.constructor = source.constructor;
	    for (var p in source) {
	      dest[p] = deepClone(source[p]);
	    }
	    return dest;
	  }
	
	  function cloneSimple(obj) {
	    return obj;
	  }
	
	  function cloneComplex(obj) {
	    var result = new obj.constructor(obj);
	    return cloneProperties(result);
	  }
	
	  function cloneFunction(obj) {
	    var funCopy = (function (f) {
	      eval('var abcdefg_$$$$ = ' + obj.toString());
	      return abcdefg_$$$$;
	    })(obj);
	    return cloneProperties(funCopy);
	  }
	
	  function cloneRegExp(obj) {
	    var pattern = obj.valueOf();
	    var flags = (pattern.global ? 'g' : '') +
	      (pattern.ignorecase ? 'i' : '') + (pattern.multiline ? 'm' : '');
	    var reg = new RegExp(pattern.source, flags);
	    return cloneProperties(reg);
	  }
	
	  function cloneArray(obj) {
	    var resultArr = [];
	    for (var i = 0, len = obj.length; i < len; i++) {
	      resultArr.push(deepClone(obj[i]));
	    }
	    for (var p in obj) {
	      if (typeof p === 'number' && p < len) {
	        continue;
	      }
	      resultArr[p] = deepClone(obj[p]);
	    }
	    return resultArr;
	  }
	
	  function cloneObject(obj) {
	    var result = {};
	    result.constructor = obj.constructor;
	    for (var p in obj) {
	      result[p] = deepClone(obj[p]);
	    }
	    return result;
	  }
	
	  function deepClone(obj) {
	    var f = undefined;
	    switch (getCustomType(obj)) {
	    case 'simple':
	      f = cloneSimple;
	      break;
	    case 'complex':
	      f = cloneComplex;
	      break;
	    case 'function':
	      f = cloneFunction;
	      break;
	    case 'regexp':
	      f = cloneRegExp;
	      break;
	    case 'array':
	      f = cloneArray;
	      break;
	    case 'object':
	      f = cloneObject;
	      break;
	    }
	    return f.call(undefined, obj);
	  }
	
	  //挂载到window对象上
	  window.deepClone = deepClone;
	})(window);
