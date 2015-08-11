1、在使用$routeProvider的时候，需要让模块依赖ngRoute，否则会提示找不到服务，示例：

	angular.module('module1', ['ngRoute'])
	.config(['$routeProvider', function($routeProvider){
	  //do something...
	}]);

2、在页面中需要绑定有风险的html的时候，可以使用ng-bind-html="html"（version>=1.3）,如果遇到错误，控制器中可以使用`html = $sce.trustHtml(unsafeHtml)`。

3、 如何动态的向页面添加带指令的HTML？通入如下代码：

	$compile(html)($scope);

4、如果阻止事件冒泡？示例如下：
	
	//方式一，利用一个自定义指令实现
	.directive('stopEventPropagation', function(){
	  return {
	    restrict: 'A',
	    link: function(scope, iElement, iAttrs){
	      //通过获取事件对象，来阻止调用
	      iElement.bind('click', function(e){
	        e.stopPropagation();
	      });
	    }
	  }
	});
	
	<a stop-event-propagation ng-click="doSomething();">Click me</a>
	
	//方式二，直接引用$event对象
	
	<a ng-click="doSomething(); $event.stopPropagation();">Click me</a>

5、关于$route和$location的事件顺序，如下：

	$routeChangeStart -> $locationChangeStart -> $locationChangeSuccess -> $routeChangeSuccess

6、有关select标签的使用，当options的来源是ajax时，那么如果指定选中项呢？如下：

	<select ng-options="sysOptions" ng-model="selectSystem"></select>
	//如上HTML代码，如果sysOptions来自ajax请求，而selectSystem又不是的话，往往会选中一个空值。
	//可以使用如下方式避免：
	
	.controller('TestCtrl', ['$scope', '$http', function($scope, $http){
	  $http.get(...).success(function(data){
	    $scope.sysOptions = data;
	    //在异步回调函数中，对ng-model赋值。
	    $scope.selectSystem = 'Test';
	  });
	}]);

7、在编写指令时，属性的匹配大小写需要注意：如果在html中使用showName="xx",那么在指令的iAttrs中，应该使用showname获取。如果要在指令中使用showName获取的话，那么必须在html中使用show-name="xx"。

8、要想让ng-href="{{true: 'javascript:void(0);' : 'url'}}" 生成 href="javascript:void(0);"时，需要修改配置，代码如下：

	.config(['$compileProvider', function($compileProvider){
	    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|javascript):/)
	}]);

9、在ng-click等ng事件中，如果拿到事件源对象？如下：

	<a ng-click="click($event);" />
	
	$scope.click = function($event){
	  var target = $event.target;
	};
	
	//注意，如果使用ng-click="click($event.target)"，将会导致angular解析错误。

10、判断angular的模块是否存在，可以使用如下代码：

	var isAngularModuleExists = function(moduleName){
	  try{
	    angular.module(moduleName)
	  }catch{
	    return false
	  }
	  return true;
	};

11、在使用coffee编写使用provider方式编写服务时，当心写在最后的this.$get，coffee会将最后一句编译为return this.$get，而这刚好不符合provider的要求，所以应该在末尾手动加上return或者放置一个undefined在最后，放置编译出return this.$get这样的代码。

12、如果要动态控制是否启用非空验证，可以使用ng-required="true|false"指令。

13、当心ng-if指令，在使用ng-if指令时，会创建独立的作用域，如果要在$scope监视ng-if包含的变量，那么是无法成功的。如果一定要监视，可以考虑使用ng-show。

14、注意.value()与.constant的区别，前者只能注入和用于服务或者控制器中，后则可以被注入到配置(.config(['xx']))中。