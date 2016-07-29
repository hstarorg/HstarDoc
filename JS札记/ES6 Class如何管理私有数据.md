## 0、前言

在ES5时代，要模拟对象的私有变量，是比较容易的，代码如下：

```javascript
function Person(){
  var _age = 20; //定义一个私有变量，外部无法访问。
  this.setAge = function(value){
    _age = value;
  }
  this.getAge = function(){
    return _age;
  }
}
```

在ES6中，虽然可以在 ``Class`` 的 ``constructor`` 中实现类似function的私有方法，但是实际上，ES6中并不推荐这种做法。这样极大的加重了对象的实例。

那我们就来看看在ES6中有多少方法可以实现私有数据管理。

## 1、在构造函数中存储私有数据

该方式，和在ES5中，没有什么区别。

```javascript
class Person{
  constructor(){
    var _age = 20;
    this.setAge = value => _age = value;
    this.getAge = _ => _age;
  }
}
```

该方式有一个变种，就是利用构造参数来存储，减少重新定义变量。

```javascript
class Person{
  constructor(age){
    this.setAge = value => age = value;
    this.getAge = _ => age;
  }
}
```

**优点：**
1. 数据绝对安全，外部无法直接通过属性访问到。
2. 不会与其他私有属性有任何冲突。如 
```javascript
let p = new Person(); 
p.age = 10; 
p.getAge(); //20
```

**缺点：**
1. 代码不怎么优雅，需要把方法设置为实例方法，才能访问到私有数据。
2. 实例方法，比较浪费内存（每个实例都会拷贝一份）。

## 2、通过命名约定来使用私有数据

该方式是在ES6 Class 中，我个人比较推荐的一个方式，实现代码如下：

```javascript
class Person{
  constructor(){
    this._age = 0;
  }

  setAge(value){
    this._age = value;
  }
  getAge(){
    return this._age;
  }
}
```

**优点：**
1. 代码看起来非常不错，简单易懂。
2. 能否在原型方法中访问。

**缺点：**
1. 并不安全，如果不遵守约定，直接操作_age，也是可行的，如：
```javascript
let p = new Person();
p._age = 555;
p.getAge(); // 555
```
2. 如果在对象上设置同名属性，会覆盖掉原本是私有属性。

## 3、利用WeakMap来存储私有数据

该方式是利用WeakMap可以用Object来做key的特点，把this当做key来存储具体的私有属性。具体实现如下：

```javascript
let dataStore = new WeakMap();
class Person{
  constructor(){
    dataStore.set(this, {age: 20});
  }

  setAge(value){
    let oldObj = dataStore.get(this);
    let newObj = Object.assign(oldObj, {age: value});
    dataStore.set(this, newObj);
  }

  getAge(){
    return dataStore.get(this).age;
  }
} 
```

如何使用？

```javascript
let p1 = new Person();
p1.getAge(); // 20
p1.setAge(25);
p1.getAge(); // 25
```

**优点：**
1. 能够使用原型方法，内存占用小；
2. 比命名约定属性名称安全性更高；
2. 不会有命名冲突（允许同名实例属性）；

**缺点：**
1. 代码没有命名约定方式（方式2）优雅；
2. 依赖外部对象；

## 4、利用Symbol来生成私有属性key。

该方式和命名约定方式没有本质区别，只是用 ``Symbol`` 来生成key，提高了key的安全性。具体实现代码如下：

```javascript
const keyForAge = Symbol('age'); 
class Person{
  constructor(){
    this[keyForAge] = 20;
  }
  
  setAge(value){
    this[keyForAge] = value;
  }

  getAge(){
    return this[keyForAge];
  }
}
```

**优点：**
1. 能够使用原型方法，内存占用小；
2. 比命名约定属性名称安全性更高，但也并不安全；
```javascript
let p1 = new Person();
Object.keys(p1); // []，无法直接访问到属性名
p1[keyForAge] = 30;
p1.getAge(); // 30
Reflect.ownKeys(p1); // [Symbol(age)]，通过能方式能遍历Key
```
2. 不会有命名冲突（允许同名实例属性）；

**缺点：**
1. 代码没有命名约定方式（方式2）优雅；
2. 依赖外部对象；
3. 不是绝对安全；

## 5、Other

能够达到的目的的方式有很多，也没有那个有绝对优势，根据实际的需求，来选择合适的方式才是最佳的方式。

**参考资料**

1. [http://www.2ality.com/2016/01/private-data-classes.html](http://www.2ality.com/2016/01/private-data-classes.html)