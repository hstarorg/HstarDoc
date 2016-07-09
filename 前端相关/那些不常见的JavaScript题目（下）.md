## 0、导言

JavaScript超乎寻常的灵活性，让JavaScript可以有很多特殊的用法，让我们来领略一下它们的风采吧。

此为下篇，上篇请查阅：[上篇](那些不常见的JavaScript题目（上）.md)

## 1、那些不常见（好玩）的题目（下）

---
### 1.21、

```javascript
Number.MIN_VALUE > 0
```
**解析：** 此题考察数字的最小值，它的最小值是大于0的浮点数。

**答案：** ``true``

---
### 1.22、

```javascript
[1 < 2 < 3, 3 < 2 < 1]
```

**解析：** 此题考察运算顺序。直接从左往右计算，即可。等价于：

```javascript
[true < 3, false < 1]
=>
[1 < 3, 0 < 1]
```

**答案：** ``[true, true]``

---
### 1.23、

```javascript
2 == [[[2]]]
```

**解析：** 此题考察类型转化，全部调用toString(),转换为了``'2'``

**答案：** ``true``

---
### 1.24、

```javascript
3.toString();
3..toString();
3...toString();
```

**解析：** 此题考察.的结合性问题，对于到底属于数字还是函数调用呢，其实只能是数字。三个点是什么语法？

**注意：这也导致了整数字面量无法直接调用toString()**

**答案：** ``error, '3', error``

---

### 1.25、

```javascript
(function(){
  var x = y = 1;
})();
console.log(y);
console.log(x);
```

**解析：** 此题考察作用域问题和var定义变量问题。当没有用var定义变量时，变量会成为全局变量。

**答案：** ``1, error``

---

### 1.26、

```javascript
var a = /123/, b = /123/;
a == b
a === b
```

**解析：** 此题考察正则表达式比较，即使字面量相等，它们也不相等。

**答案：** ``false, false``

---

### 1.27、

```javascript
var a = [1, 2, 3],
    b = [1, 2, 3],
    c = [1, 2, 4];
a ==  b;
a === b;
a > c;
a < c;
```

**解析：** 此题同样考察对象比较。当比较相等时，引用不同，所以皆不等。当比较大小时，会按照数组元素，依次比较字典序。

**答案：** ``false, false, false, true``

---

### 1.28、

```javascript
var a = {}, b = Object.prototype;
[a.prototype === b, Object.getPrototypeOf(a) === b]
```

**解析：** 此题比较有误导性，对于一个对象实例来说，获取原型的方法是：``a.constructor.prototype`` 或者是 ``Object.getPrototypeOf(a)``，对于 ``a.prototype``，直接当成一个属性访问，由于未定义，所以会产生 ``undefined``。

**答案：** ``false, true``

---

### 1.29、

```javascript
function f() {}
var a = f.prototype, b = Object.getPrototypeOf(f);
a === b
```

**解析：** 此题同样考察原型相关知识，前者是f的原型，后者是f的构造函数（Function）的原型。

**答案：** ``false``

---

### 1.30、

```javascript
function foo() { }
var oldName = foo.name;
foo.name = "bar";
[oldName, foo.name]
```

**解析：** 函数的名称为常量，但需要注意，赋值不会报错。

**答案：** ``['foo', 'foo']``

---

### 1.31、

```javascript
"1 2 3".replace(/\d/g, parseInt)
```

**解析：** 此题考察 ``String.replace()`` 的回调函数，它的回调函数定义是 ``funcation(matchValue, group, valueIndex, sourceStr){}``，依次为匹配到的值、正则分组，该值在字符串中的index，字符串本身。由于在该题中，正则没有分组，所以，调用了三次 ``parseInt`` 如下:

```javascript
parseInt('1', 0, '1 2 3');
parseInt('2', 2, '1 2 3');
parseInt('3', 4, '1 2 3');
```

**答案：** ``'1 NaN 3'``

---

### 1.32、

```javascript
function f() {}
var parent = Object.getPrototypeOf(f);
f.name // ?
parent.name // ?
typeof eval(f.name) // ?
typeof eval(parent.name) //  ?   
```
**解析：** 通过 ``Object.getPrototypeOf()`` 获取原型，参数是实例，当f为实例的时候，获取实例f的原型就等于 ``Function.prototype``，由于Function的原型还是一个function。所以 ``parent = Function.prototype 是一个没有名字的function``。

因此:
```javascript
f.name // f
parent.name // ''
```
使用 ``eval``，执行f，会返回f这个函数，执行'',会返回 ``undefined``。

**答案：** ``'f', '', 'function', 'undefined'``

---

### 1.33、

```javascript
var lowerCaseOnly =  /^[a-z]+$/;
[lowerCaseOnly.test(null), lowerCaseOnly.test()]
```

**解析：** 正则 ``test()`` 方法，会把参数当成字符串来使用，但要注意，``null`` 会被当成 ``'null'``来使用，无参则为 ``undefined``。 

**答案：** ``[true, true]``

---

### 1.34、

```javascript
[,,,].join(", ")
```

**解析：**  由于JS的Array本质也是对象，所以具有对象的一个特点，会忽略最后一个单引号，``[,,,].length // 3``。

另外，这种方式定义，实际上是没有产生真正的key的。``[,,,] // [undefined * 3]``

**答案：** ``[, , ]``

---

### 1.35、

```javascript
var a = {class: "Animal", name: 'Fido'};
a.class
```

**解析：** 此题理应考察 ``class`` 为JS中的保留字，由于JS版本升级，此种写法已经可以正常返回属性值了。

**注意：在IE8-的浏览器中，会有语法错误，使用了保留字** 

**答案：** ``'Animal'``

---
### 1.36、
```javascript
var a = new Date("epoch")
```

**解析：** 日期通过new返回的一定是一个Date对象，如果参数格式不合理，则会返回 ``Invalid Date`` 的日期对象。

**答案：** ``Invalid Date``

---
### 1.37、

```javascript
var a = Function.length,
    b = new Function().length
a === b
```

**解析：** ``Function.length`` 默认为1，``Function`` 实例的 ``length`` 属性等于 ``function``的参数个数。

**答案：** ``false``

---
### 1.38、

```javascript
var a = Date(0);
var b = new Date(0);
var c = new Date();
[a === b, b === c, a === c]
```

**解析：** 直接函数调用，不关心参数是啥，都会返回当前日期字符串。

通过 ``new Date()``，如果无参数，返回当前日期对象。

通过 ``new Date(0)``，就有一个参数，并且是数字，则参数含义为long类型的UTC时间。

**答案：** ``[false, false, false]``

---
### 1.39、

```javascript
var min = Math.min(), max = Math.max()
min < max
```

**解析：** 此题考察 ``Math.min()`` 和 ``Math.max()`` 的用法。

当 ``Math.min()`` 无参数时，返回 ``Infinity``，参考：[MDN Math.min](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/min)

当 ``Math.max()`` 无参数时，返回 ``-Infinity``，参考：[MDN Math.min](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/max)


**答案：** ``false``

---
### 1.40、

```javascript
var a = new Date("2014-03-19"),
    b = new Date(2014, 03, 19);
[a.getDay() === b.getDay(), a.getMonth() === b.getMonth()]
```

**解析：** 此题考察使用年月日构造函数时，月份是从0开始计算的。

**答案：** ``[false, false]``


## 2、参考资料

[MDN](https://developer.mozilla.org/en-US) -- Mozilla 开发者网络

[MDN Javascrpt](https://developer.mozilla.org/en-US/docs/Web/JavaScript) --MDN JavaScript目录

