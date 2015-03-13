##相关：最佳实践，反模式
**1、**为什么会觉得jQuery插件缺失？

请记住：当你在使用jQuery插件时，请在AngularJS之前加载jQuery库

**分析：**因为AngularJS自带jqLite（可以理解为jQuery的精简版），如果先引入AngularJS的话，那么AngularJS会采用jqLite，而不是完整的jQuery库。

---
**2、**如何从一个Controller中访问DOM元素？

不要从Controller中执行DOM的选择/遍历。HTML还没有被渲染。查一查”directive“

---
**3、**为什么Angular说 controller/directive等缺失？

调用 angular.module('myApp',[]) 总是会创建一个新的模块（同时干掉已有的重名模块）。相反，使用一个参数的方式调用 angular.module('myApp') 来引用已经存在的模块。

---
**4、**如何渲染未转义的数据？

	$sce.trustAsHtml(data)
	如何禁用$sce?
	app.config(['$sceProvider', function($sceProvider) {
    	$sceProvider.enabled(false);
	}]);

---
**5、**当array/object/$resource-result变化时，应该如何监视？

	$scope.$watch 有第三个参数设置来监视值变化（非引用变化）
	$watch(watchExpression, listener, [objectEquality]);
	[objectEquality]设置为true，则使用angular.equals对象相等，而不是使用引用相等比较。

---
**6、**怎样才能序列化表单数据提交？

**不要这么做！**不要尝试手动收集输入框值。仅仅只需要在每一个表单元素上附加 ng-model="data.myField"，在需要使用的地方，使用 $scope.data 即可

---
**7、**总是在 ng-models 上使用(.) =>最佳实践

	<any ng-model="book.price" />
	<any ng-model="book.name" />

---
**8、**应该如何从 service 中访问 scope ？

$rootScope 相当于 ng-app 标记，它能够被引导或者是服务注入，可以用于在所有的 scopes 上添加新功能和值

**注意：避免这样做--这相当于定义全局变量**

---
**9、**module().factory() 和 module().service() 不同点是什么？

[查看讨论信息](https://groups.google.com/forum/?fromgroups#!topic/angular/56sdORWEoqg)

---
**10、**如何防止无样式的内容闪现（页面显示双大括号绑定表达式）？

在一些地方使用 ng-bind 来替换双括号表达式

---
**11、**为什么 <a ng-click="go({{myVal}})"> 不工作？

仅有的ng-*属性中，需要{{...}}的只有 ng-src 和 ng-href，因为最终的结果必须是一个字符串，不是一个表达式。所以其他的不能工作。

---
**12、**嵌套 routes/views ? 

或许吧

---
**13、**可以在行内指定模板或者是分部视图吗？

可以。可以采用 <script id="some/partial.html" type="text/ng-template"></script> ，Angular会使用它来替换。

---
**14、**如何在 ngResource 地址中使用端口？

	如下：$resource('example.com\\:8080')

---
**15、**为什么插件触发的change事件似乎不工作？

Angular监视 [input](https://developer.mozilla.org/en-US/docs/Web/Events/input) 事件，不是'change' 事件。

---
**16、**不要使用jQuery来切换crap(待定：无效元素)，在行内使用一些变量标记。

	<a ng-click="flags.open=!flags.open">...<div ng-class="{active:flags.open}">

---
**17、**如何从DOM检查上查看 scope ？

Google Chrome:安装 Batarang extension,检查一个DOM元素，然后在console中键入$scope

Firefox/Firebug：检查一个DOM元素，然后在console中键入 angular.element($0).scope()
或者 $($0).scope()

IE10+: 使用F12工具，检查一个元素。然后在console中键入 angular.element($0).scope()
或者 $($0).scope()

---
**18、**你有一些好的指令示例/库吗？

[AngularUI](http://angular-ui.github.com/) 是非常棒的AngularJS工具集合（甚至是更好的示例代码）

---
**19、**IE？

针对IE8.0或者更早，你需要[阅读这个](https://docs.angularjs.org/guide/ie)和[使用这个](http://angular-ui.github.io/#ieshiv)

---
**20、**必须对路由使用#?

参考 [$locationProvider](https://docs.angularjs.org/api/ng/provider/$locationProvider)

---
**21、**你应该在尝试用指令包装jQuery插件前，优先尝试使用[AngularUI Passthru Directive (uiJq) ](http://angular-ui.github.io/#directives-jq)

---
**22、**为什么我的 $scope.$watch() 递归触发?

如果你在 $scope.$watch(newVal,oldVal)中改变 newVal ，它会重复触发。在 $watch 运行后，$scope 会重新评估，被观察对象将被重新触发。

---
**23、**何时我需要使用 $scope.$apply() ?

仅仅需要在没有angular 事件/回调时 使用 $scope.$apply()。它通常不属于任何地方。

---
**24、**启用了 html5Mode ，如何获取&lt;a href />的后退行为？

如果你想一个链接能够全页面刷新，那么只需要在a标记上添加 target="_self"

---
**25、**如何 .preventDefualt() 或 .stopPropagation() ?

所有的 ng-click 和相关的绑定都注入了 $event 事件对象，你可以用它来调用 .preventDefualt()，甚至是对象传递给你的方法。

---
**26、**AngularJS在我的Chrome扩展中不工作！

你需要使用 [ng-csp](http://docs.angularjs.org/api/ng.directive:ngCsp)

---
**27、**如何缓存 $http 和html 分部视图

	使用装饰器，添加缓存功能
	myAppModule.config(function($routeProvider, $provide) {
	  $provide.decorator('$http', function($delegate){
	    var get = $delegate.get;
	    $delegate.get = function(url, config){
	      url += (url.indexOf('?') !== -1) ? '?' : '&';
	      url += 'v=' + cacheBustVersion;
	      return get(url, config);
	    };
	    return $delegate;
	  });
	}); 

## 测试

**1、**拒绝/解决一个 $q.defer() 不通过

你必须在处理它们的时候添加 $scope.$apply()

---
**2、**Jasmine spyOn() 不执行 spy'd 功能

不一定是AngularJS的问题，但是你需要追加 .addCallThrough()

---
**3、**如何测试异步代码？

