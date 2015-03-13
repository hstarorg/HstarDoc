# AngularJSj教程：1W字指南（译）
**原文地址：**[http://www.airpair.com/angularjs](http://www.airpair.com/angularjs)

## 1、AngularJS简介
Angular 是用于编写引人注目的Web应用程序的是客户端 MVW JavaScript框架。它由Google创建好维护，（offers a futuristic spin on the web and its upcoming features and standards.
Read more at http://www.airpair.com/angularjs#tY7q00WpGrTLB71Z.99）

MVW 即 Model-View-Whatever,它是能在开发应用程序时，为我们提供灵活性的一种设计模式。我们可以选择MVC(Model-View-Controller)或者是MVVM(Model-View-ViewModel)方式。

本教程可以作为一个最终的资源来开始学习AngularJS,它的概念和它背后的API，同时能帮助您学习如何实现现代的Web应用程序。

AngularJS自身作为增强HTML的一个框架。它从多种语言包括JavaScript和服务端语言中获得灵感，使得HTML也成为了动态语言。这意味着我们获得了一个完全的数据数据方式来开发应用程序，不再需要刷新实体，更新DOM和其他费时任务如浏览器bug和不一致。我们可以只关注数据，让数据关心HTML的方式来编写我们的应用程序。

## 2、JavaScript框架中的工程概念
AngularJS在处理提供数据绑定和其他工程概念上，和其他框架如Backbone.js和Ember.js采取了不同了做法。我们坚持使用熟悉的、令人喜欢的HTML，使Angular拦截它，并增强它。Angular将纯粹的JavaScript对象用于数据绑定，保证任何模型变化都会更新DOM。当模型值更新了一次，Angular会更新来自应用程序的状态来源对象。

### 2.1、MVC 和 MVVM
如果你已经习惯了构建静态网站，你可能更熟悉手动一块一块的构建HTML，通过数据一遍一遍的打印相同的HTML。这可能是grid中的列，一个导航结构，一个链接列表或者是图片等等。在这个实例中，你需要习惯一点小东西的变化都需要手动更新HTML的痛苦，你必须更新模板来保持其他用途的一致性。你还要为每个导航项目杜绝相同的HTML。

深呼吸一下，通过Angular我们能实现恰当的关注点分离以及动态HTML。这意味着数据在模Model中，HTML是作为一个微小的模板被渲染为View，我们能使用Controller来连接它们两个，并驱动Model和View值的变化。