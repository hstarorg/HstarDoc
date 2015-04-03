## 前言

前端模块化能解决什么问题？

1. 模块的版本管理
2. 提高可维护性 -- 通过模块化，可以让每个文件职责单一，非常有利于代码的维护
3. 按需加载 -- 提高显示效率
4. 更好的依赖处理 -- 传统的开发模式，如果B依赖A，那么必须在B文件前面先加载好A。如果使用了模块化，只需要在模块内部申明依赖即可。

## AMD规范 & CMD规范

说到前端模块化，就不得不提**AMD规范**（[中文版](https://github.com/amdjs/amdjs-api/wiki/AMD-(%E4%B8%AD%E6%96%87%E7%89%88))、[英文版](https://github.com/amdjs/amdjs-api/wiki/AMD)）和**CMD规范**（[英文版](https://github.com/cmdjs/specification/blob/master/draft/module.md)）

它们的区别：

[http://www.zhihu.com/question/20351507](http://www.zhihu.com/question/20351507)

[http://www.cnblogs.com/tugenhua0707/p/3507957.html](http://www.cnblogs.com/tugenhua0707/p/3507957.html)

AMD规范是 RequireJS 在推广过程中对模块定义的规范化产出，所以我在这里重点介绍下 AMD规范。

AMD规范全名异步模块定义（Asynchronous Module Definition）规范，让模块和依赖可以异步加载。

主要API：

	define(id?, dependencies?, factory);

id,字符串，定义中模块的名字，可选参数（没有提供，则默认为模块加载器请求的指定脚本的名字），如果提供，那么模块名必须是顶级和绝对的（不允许相对名字）

dependencies，数组，模块的依赖，可选参数

factory，函数或对象，必选参数。

## RequireJS

RequireJS是一个JS的文件和模块加载器。专门为浏览器优化，同时也支持其他JS环境。

### Require的优点


### RequireJS Demo

最简单的使用：

