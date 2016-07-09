## 0、导言

JavaScript超乎寻常的灵活性，让JavaScript可以有很多特殊的用法，让我们来领略一下它们的风采吧。

此为上篇，下篇请查阅：[下篇](那些不常见的JavaScript题目（下）.md)

## 1、那些不常见（好玩）的题目

---
### 1.1、

```javascript
["1", "2", "3"].map(parseInt)
```
**解析：** 该题考察数组的 ``Array.map()`` 函数和 ``parseInt()``的用法。

``Array.map()``，接受两个两个，第一个是回调函数 ``function(currentValue, index, array)``，第二个是可选参数 ``thisArg``，用来指定回调函数的 ``this`` 对象，默认是 ``window``。

```javascript
['1', '2', '3'].map(function(currentValue, index, array){
  console.log(currentValue, index, array, this);
  return '1';
}, {});
```
通过上面的代码可以验证 ``Array.map()`` 的用法，想更详细了解，请参考 [MDN Array.map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map)。

接着看 ``parseInt``，``parseInt`` 默认接受两个函数，第一个要是要转化的元素，第二个是进制，默认2~36，0的话，就当成10进制处理。如果超过则会返回 ``NaN``。把它作为map的回调函数时，相当于给parseInt传递了三个参数。多余的参数对结果不影响，所以问题可以变形为：``[parseInt('1', 0), parseInt('2', 2), parseInt('3',2)]``，所以就能得出答案了。

**答案：** ``[1, NaN, NaN]``

---
### 1.2、

```javascript
[typeof null, null instanceof Object]
```

**解析：** 该题考察了对``null``的认识。 ``null`` 本身是一个类型（并不是Object的实例），但对它进行 ``typeof`` 会返回 ``object``。

**答案：** ``['object', false]``

---
### 1.3、

```javascript
[ [3,2,1].reduce(Math.pow), [].reduce(Math.pow)] ]
```

**解析：**此题和1.1比较类似，考察 ``Array.reduce()`` 和 ``Math.pow()`` 方法的使用。

``Array.reduce()`` 用于将数组的多个值根据指定的处理函数，合并为一个值。它的回调函数定义为 ``function(previousValue, currentValue, currentIndex, array){}``，其中：

1. previousValue // 上一次的运算结果（注意：该变量的初始值为数组的第一个元素）
2. currentValue // 当前数组元素
3. currentIndex // 当前数组索引
4. array //数组本身

另外，需要注意，由于默认 ``previousValue`` 的初始值是第一个数组元素，那么实际的回调函数调用次数为：``arr.length - 1``。如果数组元素小于1，就会因为无法提供初始值，而导致方法异常（报错）。想了解更多，参考：[MDN Array.reduce()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce)。

``Math.pow()`` 用于计算指定值的次方，接受两个参数，前者为基数，后者为几次方，如：``Math.pow(2, 3) // 8``。

**答案：** ``[9, error]``

---
### 1.4、

```javascript
var val = 'smtg';
console.log('Value is ' + (val === 'smtg') ? 'Something' : 'Nothing');
```

**解析：** 此题比较简单，考察+号运算符和?号运算符的优先级问题，+优先级大于?。

**答案：** ``'Something'``

---

### 1.5、

```javascript
var name = 'World!';
(function () {
  if (typeof name === 'undefined') {
    var name = 'Jack';
    console.log('Goodbye ' + name);
  } else {
    console.log('Hello ' + name);
  }
})();
```

**解析：** 此题考察函数作用域、变量提前、全局变量和局部变量相关的知识点。JS默认是函数作用域，并且函数申明，变量申明会提前到函数体开头。所以题目代码等价于：

```javascript
var name = 'World!';
(function () {
  var name;
  if (typeof name === 'undefined') {
    name = 'Jack';
    console.log('Goodbye ' + name);
  } else {
    console.log('Hello ' + name);
  }
})();
```

再结合局部变量，会隐藏全局变量，所以答案就出来。


**答案：** ``Goodbye Jack``

---

### 1.6、

```javascript
var END = Math.pow(2, 53);
var START = END - 100;
var count = 0;
for (var i = START; i <= END; i++) {
  count++;
}
console.log(count);
```

**解析：** 此题考察的知识比较偏门，考察了JS中**能正确计算且不失精度的最大整数**，当达到这个数之后，++（自加）操作将不会产生变化了。所以<=将永远满足条件。

**答案：** ``死循环``

---

### 1.7、

```javascript
var ary = [0,1,2];
ary[10] = 10;
ary.filter(function(x) { return x === undefined;});
```

**解析：** 此题考察了数组自动补齐元素和 ``Array.filter()`` 的用法。

数组自动补齐的元素为 ``undefined``，示例如下：

```javascript
var arr = [];
arr[9] = 1;
console.log(arr); // [undefined * 9, 1]
```

``Array.filter()`` 用于筛选满足条件的数组元素，接受回调函数 ``function(currentValue, currentIndex, array){}``。但是一定要注意：**它会忽略自动填充的undefined的元素**

**再次警告：是仅仅忽略自动填充的undefined元素，如果不是自动填充的undefined，是不会被忽略的。**

```javascript
var arr = [1, 'str', undefined, null];
arr.filter(function(item){console.log(item)}); //执行四次，没有忽略

var arr = [];
arr[9] = 1;
arr.filter(function(item){console.log(item)}); //执行1次，忽略了自动填充的9个元素
```

**为什么有这种现象呢？**

因为filter在判断的时候，是通过key来进行的，对比一下一下两种方式的key：

```javascript
var arr = [1, 'str', undefined, null];
Object.keys(arr); //一共有四个。

var arr = [];
arr[9] = 1;
Object.keys(arr); //一共只有一个。
```

**引申：该判断逻辑也适合大多数数组方法，如reduce，map等等。**

**答案：** ``[]``

---

### 1.8、

```javascript
var two   = 0.2
var one   = 0.1
var eight = 0.8
var six   = 0.6
[two - one == one, eight - six == two]
```

**解析：** 该题考察了JS中的浮点数运算有误差的知识点。这个到底规则是什么，I don't know.

**答案：** ``[true, false]``

---

### 1.9、

```javascript
function showCase(value) {
  switch(value) {
    case 'A':
      console.log('Case A');
      break;
    case 'B':
      console.log('Case B');
      break;
    case undefined:
      console.log('undefined');
      break;
    default:
      console.log('Do not know!');
  }
}
showCase(new String('A'));
```

**解析：** 此题考察 ``new String('A')`` 产生的结果为 ``object``，另外switch判断分支是使用 ``===``，所以只能到default分支。

**答案：** ``'Do not know!'``

---

### 1.10、

```javascript
function showCase2(value) {
  switch(value) {
  case 'A':
    console.log('Case A');
    break;
  case 'B':
    console.log('Case B');
    break;
  case undefined:
    console.log('undefined');
    break;
  default:
    console.log('Do not know!');
  }
}
showCase(String('A'));
```

**解析：** 此题和1.9考察点类似，不过不适用new的 ``String('A')``，返回的是字符串的 ``'A'``。

**注意，以此类推，Number(1), 也返回数字 1 。**

**答案：** ``'Case A'``

---

### 1.11、

```javascript
function isOdd(num) {
  return num % 2 == 1;
}
function isEven(num) {
  return num % 2 == 0;
}
function isSane(num) {
  return isEven(num) || isOdd(num);
}
var values = [7, 4, '13', -9, Infinity];
values.map(isSane);
```

**解析：** 此题没有什么难点，只需要记得 ``Infinity % 2 //NaN``就可以了。其他直接根据传入的值，运算即可。

**答案：** ``[true, true, true, false, false]``

---

### 1.12、

```javascript
parseInt(3, 8)
parseInt(3, 2)
parseInt(3, 0)    
```
**解析：** 此题的考察点，在1.1就考察过了。

**答案：** ``3, NaN, 3``

---

### 1.13、

```javascript
Array.isArray(Array.prototype)
```

**解析：** 此题考察Array的原型。

```javascript
Array.prototype // []
```

**答案：** ``true``

---

### 1.14、

```javascript
var a = [0];
if ([0]) { 
  console.log(a == true);
} else { 
  console.log("wut");
}
```

**解析：**  死记硬背吧。[参考图](https://dorey.github.io/JavaScript-Equality-Table/)

**答案：** ``false``

---

### 1.15、

```javascript
[]==[]
```

**解析：** 此题如上，也可以理解没有类型转换，引用不同。

**答案：** ``false``

---

### 1.16、

```javascript
'5' + 3  
'5' - 3
```

**解析：** 此题考察类型转换，和 + 号的作用。当有字符串操作数时，+ 表示字符串连接。

**答案：** ``'53', 2``

---

### 1.17、

```javascript
1 + - + + + - + 1 
```

**解析：** 此题，个人根据结果归纳了一套规则：

1. 首先，忽略所有的+号， 得到： ``1 - - 1``
2. 然后 - - 得正，成为 + 号，得到：``1 1``
3. 把最后的操作数相加，即为结果

测试代码：

```javascript
5 + 1 - 1 + 2 + 3 + 1 // 11
5 - 1 - 1 - 1 - 1 - 10 - 5 - 20 // -34
1 - - - - - - 1 // 2
```

**答案：** ``2``

---

### 1.18、

```javascript
var ary = Array(3);
ary[0]=2
ary.map(function(elem) { return '1'; });
```

**解析：** 此题的考察点在1.7就考察过了。但是需要注意，map函数，并不改变结果数组的长度。

**答案：** ``['1', undefined*2]``

---

### 1.19、

```javascript
function sidEffecting(ary) { 
  ary[0] = ary[2];
}
function bar(a,b,c) { 
  c = 10
  sidEffecting(arguments);
  return a + b + c;
}
bar(1,1,1)
```

**解析：** 此题考察改变 ``arguments``的属性值，会不会影响该对象。由于 ``arguments`` 是个对象，实际上是会影响的。**注意：使用 ``use strict`` 可以避免此种情况。**

**答案：** ``21``

**注意：当使用ES6语法，参数有rest parameters的时候，结果就不在一样了。**

```javascript
function sidEffecting(ary) {
  ary[0] = ary[2];
}
function bar(a, b, c=3) {
  c = 10;
  sidEffecting(arguments);
  return a + b + c;
}
bar(1,1,1); // 12
```

---

### 1.20、

```javascript
var a = 111111111111111110000,
b = 1111;
a + b;
```

**解析：** 当数值超过**JS能正确计算且不失精度的最大整数**时，会产生缺少精度问题。导致结果不太可预料。

基本上，超过16位数的整数都有这个问题了。很多时候，超过16位之后的数字会被补0。如下：

```javascript
// 一共20个2，超过16位之后的，将会为0。
22222222222222222222 // 22222222222222220000

98765432109876543210 // 98765432109876540000

//当从1开始时，超过17位才为0。
12345678901234567890 // 12345678901234567000

```

**答案：** ``111111111111111110000``