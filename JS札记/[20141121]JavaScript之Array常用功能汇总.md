**导语：**在JavaScript中，Array是一个使用比较频繁的对象，那么它到底有哪些常用的方法呢？

首先，我们先看一下Array对象的类型：

	typeof Array // 'function'
	Array instanceof Object // true

从上可以看出，Array本质是一个function，同样派生自Object，定义如下：

	function Array(args) {}

###接下来，我们来看Array自身的方法：

#### #1、concat()

定义：原型方法，连接两个或更多的数组，并返回结果（新数组）。

	Array.prototype.concat = function(items) {};

示例：

	var arr1 = [1, 2];
	var arr2 = arr1.concat([3, 4]);
	var arr3 = arr2.concat([5, 6], [7, 8] ,10, {});
	console.log(arr1); // [1, 2]
	console.log(arr2); // [1, 2, 3, 4]
	console.log(arr3); // [1, 2, 3, 4, 5, 6, 7, 8,  10, Object]

**注意：**concat不仅可以连接单个对象，也可以连接多个对象，同时如果是参数为数组，那么会将数组元素拆分并连接，如果是对象，则直接将对象连接。<span style="color:red;"><b>该方法不会改变原始数组</b></span>

#### #2、join()

定义：原型方法，把数组的所有元素放入一个字符串。元素通过指定的分隔符进行分隔。

	Array.prototype.join = function(separator) {};

示例：

	var arr = [1, 2, 3];
	console.log(arr.join('|')); // '1|2|3'
	console.log(arr.join(''));  // '123'
	console.log(arr.join('---'));  // '1---2---3'

**注意：**太常用了，没什么可注意的~

#### #3、pop()

定义：原型方法，删除并返回数组的最后一个元素。

	Array.prototype.pop = function() {};

示例：

	var arr1 = [1, 2, 3, 4];
	var lastOne = arr1.pop();
	console.log(lastOne);  // 4
	console.log(arr1);     // [1, 2, 3]

**注意：**该方法无参数，有返回值，返回数组最后一个元素。<span style="color:red;"><b>该方法会改变原始数组</b></span>

#### #4、push()

定义：原型方法，向数组的末尾添加一个或更多元素，并返回新的长度。

	Array.prototype.push = function(items) {};

示例：

	var arr1 = [1, 2];
	var len = arr1.push(3);
	var arr2 = arr1.push(4, 5);
	console.log(len);
	console.log(arr1);
	console.log(arr2);

**注意：**该方法的返回值会返回数组的新长度。<span style="color:red;"><b>该方法会改变原始数组</b></span>

#### #5、reverse()

定义：原型方法，颠倒数组中元素的顺序。

	Array.prototype.reverse = function() {};

示例：

	var arr1 = [1, 2, 3, 4, 5];
	var res = arr1.reverse();
	console.log(res);
	console.log(arr1);

**注意：**该方法的返回值为自身（翻转后的值），<span style="color:red;"><b>该方法会改变原始数组</b></span>

#### 6、shift()

定义：原型方法，删除并返回数组的第一个元素。

	Array.prototype.shift = function() {};

示例：

	var arr1 = [1, 2, 3];
	var res = arr1.shift();
	console.log(res);
	console.log(arr1);

**注意：**该方法返回数组第一个元素，和pop()方法对应（返回并删除最后一个元素）。<span style="color:red;"><b>该方法会改变原始数组</b></span>

#### #7、slice()

定义：原型方法，从某个已有的数组返回选定的元素。

	Array.prototype.slice = function(start,end) {};

示例：

	var arr = [1, 2, 3, 4, 5, 6, 7, 8, 9];
	var res1 = arr.slice(0, 3);
	var res2 = arr.slice(0, 100);
	var res3 = arr.slice(-1,-6);
	var res4 = arr.slice(-6, -1);
	console.log(res1);
	console.log(res2);
	console.log(res3);
	console.log(res4);
	console.log(arr)

**注意：**该方法支持逆向索引，同时索引采取区间左闭右开的原则。<span style="color:red;"><b>该方法不会改变原始数组</b></span>

#### #8、sort()

定义：原型方法，对数组的元素进行排序。

	Array.prototype.sort = function(compareFn) {};

示例：
	
	var arr = [1, 5, 2, 3, 4, 7, 8, 6, 9];
	var res1 = arr.sort(); //如果是数字，默认从小到大排序
	console.log(res1);
	var arr2 = ['a', 'c', 'b'];
	var res2 = arr2.sort();//如果是字符，按照字符顺序（ASCII，字符串同）排序
	console.log(res2);
	//遇到复杂数据，经过测试是按照数组<正则<数字<对象<字符串<函数 这个顺序
	var arr3 = [{name:'name'}, 134, 'aaa', function(){}, [], /a/];
	var res3 = arr3.sort();
	console.log(arr3);
	
	//可以通过自定义规则实现复杂的排序
	var res4 = arr.sort(function(a1, a2){
		if(a1 === a2){ // 两者相等，那么就算想等
			return 0;
		}
		if(a1%3 === 0){ //如果a1被3整除，那么a1小
			return -1;
		}
		if(a2%3 === 0){ //如果a2被3整除，那么a2小
			return 1;
		}
		return a2%3-a2%3; //不满足以上条件，那么根据余数比大小，余数小的元素小
	})
	console.log(res4);

**注意：**该方法返回自身（排序后数组）。可通过function(a1, a2){}实现非常复杂的排序规则。<span style="color:red;"><b>该方法会改变原始数组</b></span>

#### #9、splice()

定义：原型方法，删除元素，并向数组添加新元素。（该方法相等较复杂，悠着点用）

	Array.prototype.splice = function(start,deleteCount,items) {};

示例：

	var arr1 = [1, 2, 3, 4, 5, 6, 7, 8, 9];
	var res1 = arr1.splice(0, 3, 'new1', 'new2');
	console.log(res1);  // [1, 2, 3] 
	console.log(arr1);  // ['new1', 'new2', 4, 5, 6, 7, 8, 9] 

	arr1 = [1, 2, 3, 4, 5, 6, 7, 8, 9];
	res1 = arr1.splice(-6, 3, 'new1', 'new2');
	console.log(res1);  // [4, 5, 6]
	console.log(arr1);  // [1, 2, 3, 'new1', 'new2', 7, 8, 9]

**注意：**splice()函数支持倒叙索引，同时第二个参数是长度（不是下标），新插入的数据会插入在start下标位置。返回值为删除的元素数组。<span style="color:red;"><b>该方法会改变原始数组</b></span>


#### #10、unshift()

定义：原型方法，向数组的开头添加一个或更多元素，并返回新的长度。

	Array.prototype.unshift = function(items) {};

示例：

	var arr1= [1, 2, 3];
	var res1 = arr1.unshift('new1', 'new2');
	console.log(res1); // 5
	console.log(arr1); // ["new1", "new2", 1, 2, 3] 

**注意：**该方法和push相对(在末尾添加元素，返回新长度)，该方法的返回值是新数组长度。<span style="color:red;"><b>该方法会改变原始数组</b></span>

### 我们还可以为Array添加更多的常用功能，比如：
	
	Array.prototype.where = function(predicateFn){
	    var parameterIsFn = typeof predicateFn === 'function'
	    var result = [];
	    for(var i = 0, len = this.length; i < len; i++){
	        if(!parameterIsFn || predicateFn(this[i])){
	            result.push(this[i]);
	        }
	    }
	    return result;
	};
	
	var arr = ['new1', 'new2', 1, 2, 3];
	var res = arr.where(function(item){
	    return typeof item === 'number';
	});
	console.log(res);
	


