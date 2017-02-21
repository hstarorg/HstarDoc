## 引言

JavaScript是一套灵活的语言，所以我们可以用各种风格来编写代码。但为了更好的编写JavaScript代码，有些共同的规范是需要我们去遵循的。以下是Google提供的JavaScript代码风格指南，值得我们学习。
可以到 [原文链接](http://google.github.io/styleguide/javascriptguide.xml) 查看原文英文版。

## JavaScript 语言规则
1、 ``var``

总是使用 ``var`` 来定义变量，如果你没这样做，那么定义的变量很可能会污染全局变量，导致不必要的问题。

**注：在ES6中，我们还可以使用let来定义变量，该方式定义的变量具有词法作用域，没有变量提升的风险。**

2、Constants（常量）

1. 使用NANES_LIKE _THIS这种全大写，下划线分割风格来定义常量
2. 使用@const来注释你的常量
3. 不要使用 ``const`` 关键字来定义常量，IE不支持

**注：在支持ES6的环境下，建议直接通过 ``const`` 关键字来定义常量**

3、Semicolons（分号）

由于JavaScript的自动补全分号机制，可能会导致意料之外的结果，所以建议总是使用分号。

错误实例：

```javascript
// Error 1
var fun1 = function(){
  return 1;
} //此处缺少分号，由于JavaScript的优先级，会导致优先和后面的括号结果，当成函数调用。
(function(){
  console.log('abc');
})();

// Error 2
var arr = [1, 2, 3]
-1 == 0 || 1;
console.log(arr); //输出1
```
**注：函数和分号，函数申明不需要分号，函数表达式需要使用分号**
```javascript
var foo = function() {
  return true;
};  //函数表达式需要分号

function foo2() {
  return true;
}  //函数申明不需要分号
```
4、嵌套函数

嵌套函数在大多数时候是非常有用的，可以随意的使用给它们。
```javascript
function f() {
  var x = 'local';
  function g() {
    console.log(x);
  }
  g(); //可以在函数内部访问到，但没有对外公开
}
f();
```

5、在块中定义函数

不要在块中定义函数，JavaScript是函数作用域。

**注：我们可以在块中使用函数表达式**

```javascript 
//就算if为false，foo函数同样会被申明
if(false){
  function foo(){
    console.log('foo');
  }
}
foo && foo(); 

//此处满足需求，if为false，则bar未定义
if(false){
  var bar = function(){
    console.log('bar');
  }
}
bar && bar();
```

6、异常

异常基本上是无法避免的，可以考虑使用完善的开发框架。

7、自定义异常

建议使用自定义异常，如果没这样做，函数返回的异常信息可能是很不友好的。同时会暴露原始异常信息，所以建议使用自定义异常来屏蔽技术细节。

8、标准功能

标准功能总是由于非标准功能，为了最大的可移植性和兼容性，尽量使用标准功能。

9、基本类型的包装对象

没必要对基本类型进行包装，而且很容易产生错误。

```javascript
var x = new Boolean(false);
if (x) { //此处x为真，所以会执行到内部的代码
  alert('hi');
}
```

10、多级层次原型

多级原型继承不是首选，建议使用 [Closure](https://github.com/google/closure-library/) 或者类似的库。

11、方法和属性定义

虽然有很多种方式可以创建函数，但是优先选择使用函数表达式，以属性或者变量的方式存在。如果是要定义类，那么还是采用方法申明的方式。

**注：ES6可以使用 ``class`` 关键字定义类**

```javascript
//常规使用函数
var bar = function(){
  
};
//类函数定义
function Foo(){
  
}
//使用class申明类
class Foo2{
  constructor(){
    
  }
}
```
11、delete（关键字）

优先将无用的属性设置为null，而不是delete。因为在JavaScript引擎中，改变一个对象的属性数目要比重新设置属性值慢得多。

12、闭包

可以使用，但是要当心。闭包使用不当，容易导致内存泄露。实例如下：

```javascript
// 内存泄露，每次点击将使用到a和b，导致循环引用（ERROR）
function foo(element, a, b) {
  element.onclick = function() { 
    /* uses a and b */ 
  };
}
// 内存泄露修复
function foo(element, a, b) {
  element.onclick = bar(a, b);
}
//通过函数隔离，onclick事件不在对原始的a和b引用，所以避免的循环引用。
function bar(a, b) {
  return function() { 
    /* uses a and b */ 
  };
}
```

13、eval()

尽量避免使用eval，一个是性能低下，二个是很容易被攻击

14、with(){}

不要使用with，with会让你的代码难以理解，而且结果具有不确定性。

```javascript
//foo是否包含x属性，将会导致不同的结果
var foo = {x1: 1}; // {x: 1}
var x = 3;
with (foo) {
  console.log(x);
}
```

15、this

建议仅在对象构造函数，方法和配置闭包中使用 ``this`` 。因为this在不同的地方，指向的对象不一样，这些很容易引发错误。

16、for-in 循环

建议在object/map/hash这种key-value结构中使用 for-in 循环，其他地方还是用for吧。另外for-in循环并不能保证key的顺序，所以在要顺序要求的地方也不要使用for-in。

**注：ES5中新增了Object.keys可以用来替代for-in，在ES6中可以用for of遍历可迭代对象**

17、关联数组

不要使用数组作为 ``map/hash/关联数组`` 。关联数组不允许使用非数字索引。

```javascript
//关联数组
var arr = {};
//添加元素
arr['one'] = 'abc';
arr['two'] = 'def';
//删除元素
delete arr['one'];
//访问元素
console.log(arr['two']);
```

18、多行字符（行尾\反斜杠）

应避免使用多行字符，在每行开始处的空白无法被编译，反斜杠也可能会导致错误的空白，另外，它不是ECMAScript的一部分。我们可以使用字符串连接来替代

```javascript
var str1 = 'AA \
            BB';
var str2 = 'AA ' + 
           'BB';
//ES6用法
var str3 = `AA
BB`;

console.log(str1);
console.log(str2);
console.log(str3);
```

19、数组和对象字面量

总是使用数组和对象字面量。数组构造是很容易出错的，new Array('a')表示一个长度的数组，new Array(5)表示5个长度的数组。具体如何返回结果，取决于第一个参数的类型。

20、不要修改内置对象的原型

对于Object和Array原型的修改是严格禁止的。修改其他内置对象的原型虽然不那么危险，但仍然会导致难以调试，应当避免。

21、IE条件注释

不要使用IE条件注释。会阻碍自动化工具处理js代码，也有可能会在运行时改变语法树。

```javascript
var f = function () {
    /*@cc_on if (@_jscript) { return 2* @*/  3; /*@ } @*/
};
console.log(f());
```

## 未完，待续