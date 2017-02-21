##章节一：Angular 禅道##
###本章生词###
	serve = 提供
	take a brief = 先简要的
	introduction = 介绍
	concept = 概念
	a lot of = 许多
	material = 材料
	cover = 概括
	painless = 无痛的
	plenty = 丰富、大量
	unique = 独特的
	doubt = 疑问
	shape = 塑造
	explain = 解释
	expect = 预计
	get familiar with = 熟悉
	become aware = 察觉
	sophisticated = 复杂
	dependency injection = 依赖注入nuance
	nuance = 细微之处
	general = 一般
	purpose = 目的
	shines = 耀眼
	recent = 最近
	addition = 此外
	mostly = 主要的
	due = 由于
	innovative = 创新
	yet = 但
	attract = 吸引
	ease = 缓解
	solid = 扎实
	engineering = 工程
	practice = 实践
	indeed = 的确
	respects = 方面
	explicit = 明确的
	capable = 能
	figure out = 弄清楚
	interesting = 有趣的
	interpret = 解析
	mistaken = 错误，谬
	several = 几个，数个
	typically = 通常
	treasure = 宝藏
	testability = 可测试性
	built-in support 内置支持
	thoroughly = 彻底的
	relatively = 比较的
	actor = 演员
	personal = 个人的
	turned out = 横空出世

---
这个章节介绍了AngularJS，包括框架和它背后的项目。首先，我们先简要的了解项目本身：谁become aware驱动了它，在哪儿可以找到源代码和文档，如何寻求帮助等等。

这个章节的大部分是介绍AngularJS框架，它的核心概念和编码模式。包含有许多概括（总结）性的材料，使得学习进程快速无障碍，同时也有丰富的代码示例。

AngularJS是一个独特的框架，毫无疑问的引领一个Web开发潮流。这也是为什么章节的最后部分解释了是什么让AngularJS如此特别，它和其它外部框架之间的差异和我们能在未来如何设想它。

这个章节包含了以下几个主题：

1. 如何用AngularJS书写一个简单的Hello World 程序。在做这个的过程中，你将了解到在哪儿找到框架源代码、文档以及社区。
2. 熟悉AngularJS应用程序的基本构造块：Templates、Directives、Scopes和Controllers。
3. 察觉AngularJS复杂的依赖注入系统以及它所有的细微之处。
4. 理解AngularJS与其他框架或库（特别是jQuery）之间的差异，是什么使得它如此特别。

###AngularJS简介###
AngularJS是一个用JavaScript编写的客户端MVC框架，它运行于Web浏览器，能够极大的帮助我们（开发者）编写模块化，单页面，Ajax风格的Web Applications。它是一个平常的框架，不过如果用于编写CRUD类型的web app，那么它将非常耀眼。

###熟悉框架###
AngularJS是最近的客户端mvc框架的例外，但是它吸引了许多注意力，主要是由于它创新的模板系统，减轻了开发，同时有很扎实的工程实践。的确，它的模板系统独特于许多方面：

1. 使用HTML作为模板语言
2. 不要求明确的DOM刷新，AngularJS 能跟踪用户操作、浏览器事件和模型变化，来选择何时和那个模板将被刷新
3. 它有非常有趣的和可扩展的组件子系统，它能教会浏览器如何解析新的HTML标签和属性

模板子系统可能是AngularJS中最常见的部分，但是不要错误的认为AngularJS是单页Web程序所需要的包含数个工具和常用服务的完整框架包。

AngularJS同样有一些隐藏的宝藏，依赖注入（DI=dependency injection）和可测试特性的强烈关注。DI的内置支持能够非常容易的访问从一个极小的、彻底的可测试服务创建的web app。

###项目发展路线###
AngularJS是客户端MVC框架中比较新的成员；它的1.0版本发布于2012年6月。实际上，这个框架作为谷歌雇员Misko Hevery的个人项目开始于2009年。最初的idea是如此的好，在写作本文的同时，这个项目已经被Google正式支持，并且有Google的完整团队全职维护这个框架。

AngularJS是托管在[GitHub](https://github.com/angular/angular.js)上的，基于MIT协议的开源项目

###社区###