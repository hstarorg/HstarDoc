---
title: MOCHA测试代码汇总
date: 2017/02/21 14:47:11
---

# 0x0、导言

Mocha是应用最广泛的JS测试框架，但是现在，它的维护者公开说，Mocha快死了，[原文Twitter地址](https://twitter.com/b0neskull/status/820848476393091072)。

死不死的理我们太远，我们先来回味一波。。。

# 0x1、关于单元测试

*什么是单元测试？*

**维基百科：** 单元测试（英语：Unit Testing）又称为模块测试, 是针对程序模块（软件设计的最小单位）来进行正确性检验的测试工作

**个人理解：** 编写测试代码/脚本，通过执行测试代码来保证某一功能（一般是方法）的结果可预期。

*如何做单元测试？*

抛开 `mocha`, 我们应该怎么做单元测试呢？

我们会考虑书写一段代码或者脚本，来调用我们写好的方法，通过 `Console` 输出来查看最终结果。

使用单元测试，能够有效的保证代码的正确性，并且有利于我们之后的大胆重构。必须有用例保证，就不怕改出大量新bug。

当然，这仅仅是最原始的测试方式，一般情况下，我们会选择使用单元测试工具。

# 0x2、Mocha

`Mocha(摩卡)` 是一个多功能的，支持浏览器和 Node 的 JavaScript 测试工具。仅仅是测试工具，当然还不能满足我们的需要，我们一般还会结合一些插件来进行使用，如下：

1. chai BDD/TDD风格的断言库
2. chai-http Http请求包

*如何用 `Mocha` 来做单元测试呢？*

首先是引入断言库，然后定义测试块，如下：

```javascript
const assert = require('assert');

describe('Test object exist', () => {
  it('first test', () => {
    assert.equal(1, 2, '实际值和期望值不一致');
  });
});
```

*多种风格断言演示*

测试本身比较容易理解，就我来说，我比较容易忘记断言库的写法，接下来就以 `chai` 为例，体验下几种方式的断言代码：

第一步，我们要先引入断言库，允许多种风格的断言：

```javascript
const chai = require('chai');
const assert = chai.assert; // TDD
const expect = chai.expect; // BDD
chai.should(); // BDD
```

接着，我们来一一演示断言的使用：

1. 判断类型

```javascript
const chai = require('chai');
const assert = chai.assert; // TDD
const expect = chai.expect; // BDD
chai.should(); // BDD

describe('Test object exist', () => {
  it('object is exist', () => {
    let a = 'abc';
    let b = 1;
    let c = true;
    let d = /xxx/;
    let e = new Date();
    let f = function () { };
    let g = {};
    let h = [];
    assert.isString(a); // a必须是字符串
    assert.isNotString(f); // f必须不是字符串
    expect(b).to.be.a('number'); // b必须是一个数字
    expect(c).to.be.a('boolean'); // c必须是boolean
    d.should.be.a('RegExp'); // d必须是正则
    e.should.be.a('date'); // e必须是Date
    assert.isArray(h); // h必须是Array
    assert.isObject(g); // g必须是对象
  });
});

```

2. 判断属性存在与否/属性值是否满足预期

```javascript
const chai = require('chai');
const assert = chai.assert; // TDD
const expect = chai.expect; // BDD
chai.should(); // BDD

describe('Test Property', () => {
  it('property and value', () => {
    let a = {
      b: 1,
      c: false,
      deep: {
        test: '1'
      }
    };

    // 对象a必须包含属性b
    assert.property(a, 'b');
    expect(a).has.property('b');
    a.should.has.property('b');

    // 对象a不能包含属性d
    assert.notProperty(a, 'd');
    expect(a).not.has.property('d');
    a.should.not.has.property('d');

    // 对象必须有嵌套属性deep.test
    assert.deepProperty(a, 'deep.test');
    expect(a).has.deep.property('deep.test');
    expect(a).has.property('deep').has.property('test');
    a.should.has.deep.property('deep.test');
    a.should.has.property('deep').has.property('test'); 

    // 对象必须不包含嵌套属性deep.test2
    assert.notDeepProperty(a, 'deep.test2');
    expect(a).not.has.deep.property('deep.test2');
    a.should.not.has.deep.property('deep.test2');

    // 对象属性值必须等于指定值，注意，是===判断
    assert.propertyVal(a, 'b', 1);
    expect(a).has.property('b', 1);
    a.should.has.property('b', 1);

    // 对象属性值必须不等于指定值
    assert.propertyNotVal(a, 'c', true);
    expect(a).not.has.property('c', 0);
    a.should.not.has.property('c', undefined);

    // 对象必须包含多个指定的属性
    assert.property(a, 'b').property('c').property('deep.test2')
    expect(a).has.property('a').has.property('c');
  });
});
```

3. 比较目标值与期望值

```javascript
const chai = require('chai');
const assert = chai.assert; // TDD
const expect = chai.expect; // BDD
chai.should(); // BDD

describe('Test Value', () => {
  it('value equal or not equal', () => {
    let a = 'abc';
    let b = [1, '2', false];
    let c = { a: 1, b: { c: 2 } };

    // 直接比较
    assert.equal('abc', a);
    expect(a).eql('abc');
    a.should.eq('abc');

    let cCopy = Object.assign({}, c);

    assert.deepEqual(cCopy, c);
    expect(cCopy).deep.equal(c);
    cCopy.should.be.deep.equal(c);
  });

  it('test multi equal function', () => {
    let c = { a: { b: 'str' } };
    let cCopy = Object.assign({}, c);

    cCopy.should.be.eql({ a: { b: 'str' } }); // 内容相等即可，不判断引用（别名：eqls, deep.equal, deep.eq, deep.equals）
    cCopy.should.be.equal(a = cCopy); // 严格完全相等， === 判断（别名：eq, equals）
  });
});

```

4. 目标是否存在

```javascript
const chai = require('chai');
const assert = chai.assert; // TDD
const expect = chai.expect; // BDD
const should = chai.should(); // BDD

describe('Test Value', () => {
  it('value exist', () => {
    let a = 'hi';
    let b = null;
    let c;

    // 对象存在
    assert.isOk(a);
    expect(a).to.be.exist;
    a.should.to.be.exist;

    // 对象不存在
    assert.isNotOk(b);
    assert.isNotOk(c);
    expect(b).to.be.not.exist;
    expect(c).to.be.not.exist;
    should.not.exist(b);
    should.not.exist(c);
  });
});
```

5. 判断数组长度

```javascript
const chai = require('chai');
const assert = chai.assert; // TDD
const expect = chai.expect; // BDD
const should = chai.should(); // BDD

describe('Test Length', () => {
  it('array length', () => {
    let arr = [1, 2, 3];

    // 判断数组长度
    assert.lengthOf(arr, 3);
    expect(arr).length(3);
    arr.should.length(3);

    // 小于4
    expect(arr).length.below(4);
    expect(arr).length.lessThan(4);
    arr.should.length.below(4);

    // 大于2
    expect(arr).length.above(2);
    arr.should.length.above(2);
  });
});
```

6. 空判断

```javascript
const chai = require('chai');
const assert = chai.assert; // TDD
const expect = chai.expect; // BDD
const should = chai.should(); // BDD

describe('Test Empty', () => {
  it('array|string|object empty', () => {
    let arr = [];
    let a = '';
    let b = {};

    // 判断数组为空
    assert.isTrue(arr.length === 0); // assert没有直接空判断，需要转换一下思路
    expect(arr).empty;
    arr.should.empty;
    // 其他类型判断（注意：null和undefined不能用此方式判断）
    expect(a).empty;
    b.should.be.empty;
  });
});
```

**注意：还有其他较多的用法，如果理解了上面的这几种，按照同样的思路，结合api就基本能使用其他的模式了。一般情况下，以上的几种断言也足够我们使用了。**

**注意2：更多断言，请参考： [chai断言API](http://chaijs.com/api/)**