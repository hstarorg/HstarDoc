## 1、Directive与Controller数据共享

在指令中，不仅仅需要指令配置信息，很多时候也需要获取$scope的相关数据。那么，如何在指令中拿到$scope的数据呢？

### 1.1、Directive和Controller使用同一个scope

	<!doctype html>
	<html>
	  <head>
	    <meta charset="utf-8" />
	    <title>Angular Demo</title>
	  </head>
	  <body>
	    <div ng-controller="DemoCtrl">
	      <d1></d1>
	    </div>
	
	    <!-- 脚本区域 -->
	    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.3.15/angular.min.js"></script>
	    <script>
	      angular.module('app', [])
	      .directive('d1', [function(){
	        return {
	          restrict: 'E',
	          scope: false, //defualt value is false
	          template: '<h1>Hi,{{name}}</h1>',
	          link: function(scope, iElement, iAttrs){
	            console.log('directive scope id = ' + scope.$id);
	          }
	        }
	      }])
	      .controller('DemoCtrl', ['$scope', function($scope){
	        console.log('controller scope id = ' + $scope.$id);
	        $scope.name = 'Jay';
	      }]);
	
	      //可以采用如此方式启动angular扫描，或者直接使用ng-app="app"
	      angular.bootstrap(document.body, ['app']);
	    </script>
	    <!-- 脚本区域 End -->
	  </body>
	</html>

执行以上代码，页面显示Hi Jay，并在控制台打印

	controller scope id = 2
	directive scope id = 2

在指令中，默认会直接使用上级的scope，从控制台来看，先执行controller的scope，再执行directive的scope。因为id一致，所以是同一个scope。既然是同一个scope，那么共享数据自然就不是问题了。该方式，适合业务性质的directive，如果是公共的directive，不建议使用此方式，可能会导致scope杂乱。

### 1.2、在指令作用域中使用@，将当前属性作为字符串传递

	<!doctype html>
	<html>
	  <head>
	    <meta charset="utf-8" />
	    <title>Angular Demo</title>
	  </head>
	  <body>
	    <div ng-controller="DemoCtrl">
	      <d1 name="{{key}}"></d1>
	    </div>
	
	    <!-- 脚本区域 -->
	    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.3.15/angular.min.js"></script>
	    <script>
	      angular.module('app', [])
	      .directive('d1', [function(){
	        return {
	          restrict: 'E',
	          scope: {
	            name: '@'
	          },
	          template: '<h1>Hi,{{name}}</h1>',
	          link: function(scope, iElement, iAttrs){
	            console.log('directive scope id = ' + scope.$id);
	          }
	        }
	      }])
	      .controller('DemoCtrl', ['$scope', function($scope){
	        console.log('controller scope id = ' + $scope.$id);
	        $scope.key = 'Jay';
	
	      }]);
	
	      //可以采用如此方式启动angular扫描，或者直接使用ng-app="app"
	      angular.bootstrap(document.body, ['app']);
	    </script>
	    <!-- 脚本区域 End -->
	  </body>
	</html>

以上代码，主要修改了指令的scope，从输出来看，指令和controller各自是自己独有的作用域。

``scope = {name: '@'}``，等价于

	link:function(scope, iElement, iAttrs){
	    scope.name = iAttrs.name;
	}

Controller中的key的变化，会即时影响到Directive的变化，但是Directive的变化并不会反向影响到Controller，结果近似于单向绑定。

### 1.3、在指令的作用域中使用=，进行数据的双向绑定

	<!doctype html>
	<html>
	  <head>
	    <meta charset="utf-8" />
	    <title>Angular Demo</title>
	  </head>
	  <body>
	    <div ng-controller="DemoCtrl">
	      key = {{key}}
	      <d1 name="key"></d1>
	    </div>
	
	    <!-- 脚本区域 -->
	    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.3.15/angular.min.js"></script>
	    <script>
	      angular.module('app', [])
	      .directive('d1', [function(){
	        return {
	          restrict: 'E',
	          scope: {
	            name: '='
	          },
	          template: '<h1>Hi,{{name}}</h1><input type="text" ng-model="name" />',
	          link: function(scope, iElement, iAttrs){
	            console.log('directive scope id = ' + scope.$id);
	          }
	        }
	      }])
	      .controller('DemoCtrl', ['$scope', function($scope){
	        console.log('controller scope id = ' + $scope.$id);
	        $scope.key = 'Jay';
	
	      }]);
	
	      //可以采用如此方式启动angular扫描，或者直接使用ng-app="app"
	      angular.bootstrap(document.body, ['app']);
	    </script>
	    <!-- 脚本区域 End -->
	  </body>
	</html>

以上代码的变化在于，使用了scope: {name: '='}，该代码将父作用域的属性和指令的属性进行双向绑定。所以指令中文本框的值的变化，将会同步影响controller中key的变化。

**注意：在使用指令的时候，html代码，并不是和示例1.1一致了，如果是双向绑定，那么应该使用<d1 name="key" /&gt;，而不是<d1 name="{{key}}"&gt;。**

### 1.4、在Directive中调用Controller的方法

	<!doctype html>
	<html>
	  <head>
	    <meta charset="utf-8" />
	    <title>Angular Demo</title>
	  </head>
	  <body ng-app="app">
	    <div ng-controller="DemoCtrl">
	      key = {{key}}
	      <d1 name="key" show-name="show(key)"></d1>
	    </div>
	
	    <!-- 脚本区域 -->
	    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.3.15/angular.min.js"></script>
	    <script>
	      angular.module('app', [])
	      .directive('d1', [function(){
	        return {
	          restrict: 'E',
	          scope: {
	            name: '=',
	            showName: '&'
	          },
	          template: '<h1>Hi,{{name}}</h1><input type="text" ng-model="name" />' 
	          + '<button ng-click="showName(name)">Show</button>',
	          link: function(scope, iElement, iAttrs){
	            console.log('directive scope id = ' + scope.$id);
	          }
	        }
	      }])
	      .controller('DemoCtrl', ['$scope', function($scope){
	        console.log('controller scope id = ' + $scope.$id);
	        $scope.key = 'Jay';
	        $scope.show = function(name){
	            alert(name);
	        };
	      }]);
	    </script>
	    <!-- 脚本区域 End -->
	  </body>
	</html>

点击指令生成的按钮，会执行controller的show方法，利用在scope: {showName: '&'}，可以将父级作用域的方法绑定到指令中。

**注意，一定要注意属性命令，在html中书写showName，那么在iAttrs中对应showname，只有在html中书写show-name,在会在iAttrs中对应showName。**

## 2、在controller中，拿到directive的作用域

### 2.1、拿到scope的元素，调用isolateScope获取scope

	<!doctype html>
	<html>
	  <head>
	    <meta charset="utf-8" />
	    <title>Angular Demo</title>
	  </head>
	  <body ng-app="app">
	    <div ng-controller="DemoCtrl">
	      key = {{key}}
	      <button ng-click="click()">Click</button>
	      <hr />
	      <d1 id="d1" name="key" show-name="show(key)"></d1>
	    </div>
	
	    <!-- 脚本区域 -->
	    <script src="//ajax.aspnetcdn.com/ajax/jQuery/jquery-2.1.3.min.js"></script>
	    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.3.15/angular.min.js"></script>
	    <script>
	      angular.module('app', [])
	      .directive('d1', [function(){
	        return {
	          restrict: 'E',
	          scope: {}, //等价于 scope: true
	          template: '<h1>Hi,{{name}}',
	          link: function(scope, iElement, iAttrs){
	            scope.name = 'directive name';
	            console.log('directive scope id = ' + scope.$id);
	          }
	        }
	      }])
	      .controller('DemoCtrl', ['$scope', function($scope){
	        console.log('controller scope id = ' + $scope.$id);
	        $scope.click = function(){
	          var dirScope = $('#d1').isolateScope();
	          alert(dirScope.name);
	        }
	      }]);
	    </script>
	    <!-- 脚本区域 End -->
	  </body>
	</html>

此代码中，利用$('#d1').isolateScope，拿到了该指令的scope，所以可以随时方式，该方式在多种指令中也有效。

**如果判断应该用isolateScope()还是scope()获取作用域？一个最简单的方式，用F12查看源码，找到该元素，然后查看class是ng-isolate-scope还是ng-scope**

## 3、 指令之间相互获取数据

### 3.1、通过directive依赖来共享数据

	<script>
	      angular.module('app', [])
	      .directive('d1', [function(){
	        return {
	          restrict: 'E',
	          require: '^ngModel',
	          scope: {}, //等价于 scope: true
	          template: false,
	          link: function(scope, iElement, iAttrs, ngModelCtrl){
	            
	          }
	        }
	      }])
	      .controller('DemoCtrl', ['$scope', function($scope){
	        
	      }]);
	</script>

### 3.2、通过如2.1的方式获取数据

## 4、 其他Hacky的方式

1. 通过``$parent``访问父级作用域
2. 通过``$$prevSibling``访问该作用域的上一个兄弟作用域
3. 通过``$$nextSibling``访问该作用域的下一个兄弟作用域
4. 通过``$$childHead``访问儿子作用域的第一个
5. 通过``$$childTail``访问儿子作用域的最后一个

## 5、参考资料

1. [SHARING DATA BETWEEN CHILD AND PARENT DIRECTIVES AND SCOPES (IN ANGULARJS)](http://tech.blinemedical.com/sharing-data-between-child-and-parent-directives-and-scopes-in-angularjs/)

2. [directive和controller如何通信](http://www.cnblogs.com/bigdataZJ/p/AngularJS1.html)

