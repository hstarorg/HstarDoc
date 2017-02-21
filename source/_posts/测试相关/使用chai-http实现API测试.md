---
title: 使用chai-http实现API测试
date: 2017/02/21 14:47:11
---

# 0x1、导言

一个前后端分离的完整的项目中，一般少不了 `API TEST`，那我们如何来做API相关的测试呢？

我们可以使用客户端工具（如PostMan），来进行模拟请求，还可以写一个小程序来请求待测试的API。

既然也算是测试，为什么我们不直接和一般的 `unit test` 使用同样的工具呢？

在我们使用 `mocha` 测试工具函数的同时，我们也可以结合 `chai-http` 来实现API的测试。

# 0x2、关于 `chai-http`

`chai-http` 官方定义是：一个HTTP响应的断言库，是 `Chai` 断言库的一个补充。（原文：HTTP Response assertions for the Chai Assertion Library. ）

使用它，我们可以模拟发起HTTP请求，然后使用断言语法来判断响应是否满足需求。

```javascript
chai.request('rootpath')
  .put('/user/me')
  .send({ password: '123', confirmPassword: '123' })
  .end(function (err, res) {
     expect(err).to.be.null;
     expect(res).to.have.status(200);
  });
```

# 0x3、API测试演示