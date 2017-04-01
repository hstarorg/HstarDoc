---
title: 02_RxJS之Observable
date: 2017-3-31 17:25:52
---

# 0x0、Observable（可观察对象）

`Observable` 含义是可观察对象，那什么是可观察对象呢？这就涉及到 `Observer Pattern`（观察者模式） 和 `Iterator Pattern`（迭代模式）了。

我们先来实现一个简单的观察者：

```javascript
class Subject {
  constructor() {
    this.listeners = [];
  }

  // 添加观察者
  addListener(listener) {
    this.listeners.push(listener);
    return true;
  }

  // 移除观察者
  removeListener(listener) {
    let listenerIdx = this.listeners.indexOf(listener);
    if (listenerIdx >= 0) {
      this.listeners.splice(listenerIdx, 1);
      return true;
    }
    return false;
  }

  // 通知
  notify(msg) {
    this.listeners.forEach(listener => listener(msg));
  }
}
```

如何用？

```javascript
const sub = new Subject();
sub.addListener(msg => console.log('观察者1', msg));
sub.addListener(msg => console.log('观察者2', msg));

sub.notify('Subject变化了');
```

当有变更时，会通知到所有的观察者。这就是简单的观察者模式实现。

接着，我们来看一下迭代器模式在JS的使用：

```javascript
let arr = [1, 2, 3];
// 数组实现迭代器，我们可以通过如下方式获取到
let arrIterator = arr[Symbol.iterator]();
arrIterator.next(); // {value: 1, done: false}
arrIterator.next(); // {value: 2, done: false}
arrIterator.next(); // {value: 3, done: false}
arrIterator.next(); // {value: undefined, done: true}
```

当我们手动 `next()` 的时候，才会返回给我们结果，当迭代完成后，始终返回 `{value: undefined, done: true}`。

再来看 `Obsrevable`，其实就是这两者的结合。能够主动向订阅者推送，通过又能有顺序的推送（当next被调用的时候进行推送）。

# 0x1、简单实现一个可观察对象

```javascript
class Observable {
  constructor(fn) {
    this.observer = {};
    fn(this.observer);
  }
  subscribe(next) {
    this.observer.next = next;
  }
}
```

调用代码如下：

```javascript
var ob = new Observable(ob => {
  setInterval(() => {
    ob.next(new Date());
  }, 5000);
});

ob.subscribe(msg => console.log('订阅者1', msg));
```

执行代码，我们可以看到，每间隔5s就会输出订阅者和对应的消息（当前时间）。由于 `Observable` 的类别有很多，我们就不在一一模拟。

# 0x2、RxJs之Observable

在 `RxJS` 中，核心就是 `Observable` ，当然，肯定不会像以上实现的那么简单。

我们接着就来看下在 `RxJS` 中如何创建 `Observable` 对象。

能够创建 `Observable` 的操作有如下几种：

* create
* of
* from
* fromEvent
* fromEventPattern
* fromPromise
* never
* empty
* throw
* interval
* timer

### 2.1 使用 `create` 创建 `Observable` 实例

```javascript
let source = Rx.Observable.create(observer => {
  observer.next(1);
  observer.next(2);
  observer.next(3);
  observer.complete(); // 当调用complete之后，就不会再输出之后的next了。
  observer.next(4);
});

source.subscribe(v => {
  console.log(v);
});
```

### 2.2 使用 `fromEvent` 创建 `Observable` 实例

可以用如下方式，来简化对原生事件的使用。当点击页面时，会执行订阅的方法。

```javascript
var source = Rx.Observable.fromEvent(document, 'click');

var sub =source.subscribe(e => {
  console.log(e);
});

sub.unsubscribe();
```

### 2.3 使用 `fromPromise` 创建 `Observable` 实例

此时只需要传入一个 `Promise` 对象即可，用法如下：

```javascript
var p = Promise.resolve('ab');

Rx.Observable.fromPromise(p)
  .subscribe(v => {
    console.log('当Promise resolve的时候执行', v);
  }, reason => {
    console.log('当Promise reject的时候执行', reason);
  });
```

### 2.4 使用 `interval` 创建 `Observable` 实例

顾名思义，就是和setTimeout类似，但是可以用 `Observable` 统一的 `subscribe` 和 `unscbscribe`。

```javascript
Rx.Observable.interval(1000)
  .subscribe(idx => {
    console.log('我每秒都会输出', idx); // idx是下标，从0开始
  });
```

### 2.5 使用 `timer` 创建 `Observable` 实例

当给 `timer` 传递1个整数时，表示等待多少秒之后执行，当传递两个整数时，表示等待多少秒后执行，然后间隔多少秒后再次执行。

```javascript
Rx.Observable.timer(5000, 2000)
  .subscribe(idx => {
    console.log('我每秒都会输出', idx); // idx是下标，从0开始
  });
```

### 2.6 使用 `from` 创建 `Observable` 实例

`from` 是一个超级强大的创建方式，可以接受任意可枚举的参数，还能接受字符串。

```javascript
Rx.Observable.from('我是字符串');
Rx.Observable.from([1, 2, 3, 4, 5]);
Rx.Observable.from(new Set());
Rx.Observable.from(new Map());
Rx.Observable.from(new Promise(resolve, reject){
  resolve('abc');
});
```

### 2.6 使用 `never, empty, throw` 创建 `Observable` 实例

这三者都是创建一个比较特殊的流。 

`never` 表示没有结束，无法收到任何效应。

`empty` 表示一个空的 `observable`，订阅的话，会立即打印执行完成。

```javascript
var source = Rx.Observable.empty();
source.subscribe(v => {
  console.log(v);
}, err => {
  console.log(err);
}, c => {
  console.log('complete'); // 会输出该行
});
```

`throw` 就很明显，订阅就会抛出错误。

```javascript
var source = Rx.Observable.throw(new Error('Error'));
source.subscribe(v => {
  console.log(v);
}, err => {
  console.log(err); // 执行这行。
}, c => {
  console.log('complete');
});
```

那这些有啥用呢？当然是为了组合其他 `observable` 进行操作了。

### 2.7 使用 `of` 创建 `Observable` 实例

`of` 主要是接收 `List` 类型的参数，主要是 `Array`

```javascript
var source = Rx.Observable.of([1, 2, 3, 4, 5]);
```

### 2.8 使用 `fromEventPattern` 创建 `Observable` 实例

`fromEventPattern` 是用于给 `类Event（有addListener, removeListener类似的API）` 来使用的。

```javascript
var subject = {
  listeners: [],
  addListener(fn) {
    this.listeners.push(fn);
  },
  removeListener(fn) {
    let idx = this.listeners.indexOf(fn);
    if (idx >= 0) {
      this.listeners.splice(idx, 1);
    }
  },
  notify(msg) {
    this.listeners.forEach(listener => listener(msg));
  }
};

Rx.Observable.fromEventPattern(subject.addListener.bind(subject), subject.removeListener.bind(subject))
  .subscribe(console.log); // 输出 'hello, observable'
subject.notify('hello, observable');
```

**至此，我们已经了解如何创建 observable 对象了。**