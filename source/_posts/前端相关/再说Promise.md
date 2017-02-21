## 0、导言

在JavaScript，由于天生的回调机制，当业务逻辑嵌套较多的时候，就很容易产生回调地狱。

为了避免回调地狱，在JS中可以使用 ``co``, ``Promise``, ``async await`` 等等方式。

在当前ES6开始流行的情况下，``Promise`` 则是主流，就算是 ``async await`` ，也需要和Promise搭配，那我们就来看下 ``Promise`` 到底是怎么工作的！

## 1、原生Promise

打开Chrome控制台，输入 ``Promise.`` 然后可以看到Promise的一些静态方法如下：

```javascript
Promise.accept(); // 【非标准】等价于Promise.resolve()
Promise.all(); // 同时执行多个Promise，所有Promise都执行完毕（resolve, reject都算）之后，才会调用then方法。
Promise.defer(); // 【非标准】返回一个Deferred对象
Promise.race(); // 通过执行多个Promise，有一个成功就继续下一步。
Promise.reject(); // 返回一个rejected的Promise
Promise.resolve(); // 返回一个resolved的Promise
```

通过 ``let p = Promise.defer().promise`` 之后，使用 ``p.``，可以看到 ``Promise`` 实例可用的一些方法（实际是原型方法）

```javascript
catch(); // 是onRejected的语法糖，注册onRejected方法。
chain(); // 【非标准】
then(); // 注册onFulfilled和onRejected方法。
```

至于具体如何用，看 [Promise Book](http://liubin.org/promises-book)。

## 2、Promise原理浅析

光用还不够，在这里我们来分解一下Promise背后的原理。

要去分析Promise的原理，首先就不得不提到两个规范。一个是 Promise A+ 规范（ES6 Promise的前身，是一个社区规范）和 ECMA Promise规范（标准化之后的规范）。它们约定了Promise的规则。

在这里，我们就不按部就班的来对应该问题，我们就通过TDD的方式来实现一个Promise-polyfills。

测试工具采用了 [ava]()。

为了避免浏览器干扰，我们把Promise取别名为Promise2。目录结构如下：

```
Promise2.js
test/
  promise.test.js
```

我们先完成第一个测试，验证Promise应该有的静态方法和原型方法。

```
//promise.test.js

'use strict';

let test = require('ava');
let Promise2 = require('./../Promise2');

// Promise2 is a function. 
test(t => t.is('function', typeof Promise2));

// Promise2 has static function resolve
test(t => t.is('function', typeof Promise2.resolve));

// Promise2 has static function reject
test(t => t.is('function', typeof Promise2.reject));

// Promise2 has static function race
test(t => t.is('function', typeof Promise2.race));

// Promise2 has static function all
test(t => t.is('function', typeof Promise2.all));

let p1 = new Promise2();

// new Promise2 is a Promise2 instance
test(t => t.is(true, p1 instanceof Promise2));

// Promise2 instace muse has function catch
test(t => t.is('function', typeof p1.catch));

// Promise2 instace muse has function then
test(t => t.is('function',  typeof p1.then));
```

要让这些测试用例通过，编写了如下代码：

```javascript
class Promise2 {
  constructor() {

  }

  static all() {

  }

  static race() {

  }

  static reject() {

  }

  static resolve() {

  }


  then() {

  }

  catch() {

  }
}

module.exports = Promise2;
```

至此，我们的一个程序基架已经ok了。接下来我们一步步的来继续完善测试和实现代码。

接下来，我们看一下Promise的常规用法：

```javascript
let p = new Promise((resolve, reject) => {
  setTimeout(() => {
    console.log('before resolve');
    resolve();
    console.log('after resolve');
  }, 1000);
});
```

## 参考资料

1. [MDN Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
2. [Promise Book](http://liubin.org/promises-book)
3. [Promise A+ 规范](https://promisesaplus.com/)
4. [ECMA262 Promise](https://tc39.github.io/ecma262/#sec-promise-objects)