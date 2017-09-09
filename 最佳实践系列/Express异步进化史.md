# 1、导言

在 `Javascript` 的世界里，异步（由于JavaScript的单线程运行，所以JavaScript中的异步是可以阻塞的）无处不在。

[Express](http://expressjs.com/) 是 `node` 环境中非常流行的Web服务端框架，有很大比例的 `Node Web应用` 采用了 `Express`。

当使用 `JavaScript` 编写服务端代码时，我们无可避免的会大量使用到异步。随着 `JavaScript、Node` 的进化，我们的异步处理方式，也就随之进化。

接下来，我们就来看看 `Express` 中异步处理的进化过程。

# 2、JavaScript的异步处理

在异步的世界里，我们需要想办法获取的异步方法完毕的通知，那在 `JavaScript` 中，会有哪些方式呢？

## 2.1、回调

回调是 `JS` 中最原始，也是最古老的异步通知机制。

```js
function asyncFn(callback) {
  // 利用setTimeout模拟异步
  setTimeout(function () {
    console.log('执行完毕');
    callback(); // 发通知
  }, 2000);
}

asyncFn(function () {
  console.log('我会在2s后输出');
});
```

## 2.2、事件监听

要获取结果的函数，监听某个时间。在异步方法完成后，触发该事件，达到通知的效果。

## 2.3、发布/订阅

通过观察者模式，在异步完成时，修改发布者。这个时候，发布者会把变更通知到订阅者。

## 2.4、Promise

`Promise` 是回调函数的改进。使用它， 我们可以将异步平行化，避免回调地狱。

```js
function asyncFn() {
  return new Promise((resolve, reject) => {
    // 利用setTimeout模拟异步
    setTimeout(function () {
      console.log('执行完毕');
      resolve(); // 发通知（是否有感觉到回调的影子？）
    }, 2000);
  });
}

asyncFn()
  .then(function () {
    console.log('我会在2s后输出');
  });
```

## 2.5、生成器（Generator）

Generator 函数是 ES6 提供的一种异步编程解决方案。

以下代码只是简单演示，实际上 `Generator` 的使用过程，相对是比较复杂的，这是另外一个话题，本文暂且不表。

```js
function asyncFn() {
  return new Promise((resolve, reject) => {
    // 利用setTimeout模拟异步
    setTimeout(function () {
      console.log('执行完毕');
      resolve(); // 发通知（是否有感觉到回调的影子？）
    }, 2000);
  });
}

function* generatorSync() {
  var result = yield asyncFn();
}

var g = generatorSync();
g.next().value.then(()=>{
  console.log('我会在2s后输出');
});
```

## 2.6、async...await

可以说是当前 `JavaScript` 中，处理异步的最佳方案。

```js
function asyncFn() {
  return new Promise((resolve, reject) => {
    // 利用setTimeout模拟异步
    setTimeout(function () {
      console.log('执行完毕');
      resolve(); // 发通知（是否有感觉到回调的影子？）
    }, 2000);
  });
}

async function run(){
  await asyncFn();
  console.log('我会在2s后输出');
}

run();
```

# 3、Express中的异步处理

在Express中，我们一般常用的是方案是：`回调函数、Promise、以及async...await`。

为了搭建演示环境，通过 `express-generator` 初始化一个express项目。一般的服务端项目，都是路由调用业务逻辑。所以，我们也遵循这个原则：

打开 `routs/index.js`，我们会看到如下内容，以下Demo就以此文件来做演示。
```js
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
```

## 3.1、回调函数处理Express异步逻辑

在 `Express` 中，路由可以加载多个中间件，所以我们可以把业务逻辑按照中间件的写法进行编写。这样通过一层层的next，就能非常方便的拆分异步逻辑。

```js
var express = require('express');
var router = express.Router();

function asyncFn(req, res, next) {
  setTimeout(() => {
    req.user = {}; // 设置当前请求的用户
    next();
  }, 2000);
}

function asyncFn2(req, res, next) {
  setTimeout(() => {
    req.auth = {}; // 设置用户权限
    next();
  }, 2000);
}

function asyncFn3(req, res, next) {
  setTimeout(() => {
    res.locals = { title: 'Express Async Test' }; // 设置数据
    res.render('index');  // 响应
  }, 2000);
}

/* GET home page. */
router.get('/', asyncFn, asyncFn2, asyncFn3); // 一步步执行中间件

module.exports = router;
```

## 3.2、Promise 处理Express异步逻辑

该方案中，将多个业务逻辑，包装为返回 `Promise` 的函数。通过业务方法进行组合调用，以达到一进一出的效果。

```js
var express = require('express');
var router = express.Router();

function asyncFn(req, res) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      req.user = {}; // 设置当前请求的用户
      resolve(req);
    }, 2000);
  });
}

function asyncFn2(req) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      req.auth = {}; // 设置用户权限
      resolve();
    }, 2000);
  });
}

function asyncFn3(res) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      res.locals = { title: 'Express Async Test' }; // 设置数据
      res.render('index');  // 响应
    }, 2000);
  });
}

function doBizAsync(req, res, next) {
  asyncFn(req)
    .then(() => asyncFn2(req))
    .then(() => asyncFn3(res))
    .catch(next); // 统一异常处理
};

/* GET home page. */
router.get('/', doBizAsync);

module.exports = router;

```

## 3.3、async...await 处理Express异步逻辑

实际上，该方案也是需要 `Promise` 的支持，只是写法上，更直观，错误处理也更直接。

**需要注意的是，Express是早期的方案，没有对async...await进行全局错误处理，所以可以采用包装方式，进行处理。**

```js
var express = require('express');
var router = express.Router();

function asyncFn(req) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      req.user = {}; // 设置当前请求的用户
      resolve(req);
    }, 2000);
  });
}

function asyncFn2(req) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      req.auth = {}; // 设置用户权限
      resolve();
    }, 2000);
  });
}

function asyncFn3(res) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {

    }, 2000);
  });
}

async function doBizAsync(req, res, next) {
  var result = await asyncFn(req);
  var result2 = await asyncFn2(req);
  res.locals = { title: 'Express Async Test' }; // 设置数据
  res.render('index');  // 响应
};

const tools = {
  asyncWrap(fn) {
    return (req, res, next) => {
      fn(req, res, next).catch(next); // async...await在Express中的错误处理
    }
  }
};

/* GET home page. */
router.get('/', tools.asyncWrap(doBizAsync)); // 需要用工具方法包裹一下

module.exports = router;
```

# 4、总结

虽然 `koa` 对更新、更好的用法（koa是generator，koa2原生async）支持的更好。但作为从 `node 0.x` 开始跟的我，对 `Express` 还是有特殊的好感。

以上的一些方案，已经与 `koa` 中使用无异，配合 `Express` 庞大的生态圈，无异于如虎添翼。

