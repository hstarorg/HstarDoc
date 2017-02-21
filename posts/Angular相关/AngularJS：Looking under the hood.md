原文地址：[https://www.binpress.com/tutorial/angular-js-looking-under-the-hood/153](https://www.binpress.com/tutorial/angular-js-looking-under-the-hood/153)

**用AngularJS写得越多，你就越惊叹于它的神奇。我对Angular能做的一些奇妙的事情非常好奇，然后我决定分析它的源代码，看看我能否揭示它的一些秘密。我记录了我在23000多行Angular源码中发现的真正有用的，能够解释Angular先进（和隐藏）的方面的一些内容。**

## 1、Dependency Injection annotation process
依赖注入（DI）是除开用代码获取或创建依赖之外的一条不同的请求依赖的方式。简单的说，依赖是作为一个注入对象传递给我们的。Angular允许我们在我们的应用程序中通过像Controllers和Directives的方法来使用DI。我们能创建自己的依赖，同时允许Angular在请求它们的时候被注入。

在Angular中，一个最常用的被请求的依赖是 *$scope*。例如：

	function MainCtrl ($scope){
		//access to $scope
	}
	angular.module('app').controller('MainCtrl', MainCtrl);

对于没有使用过Angular提供的依赖注入的JavaScript开发者来说，这看起来像一个局部变量名。实际上，它仅仅是我们所请求的依赖名称的一个占位符。Angular查找这些占位符，然后通过DI将它们转换为真正的依赖对象，让我们来仔细看看。

### 方法参数 ###
直到我们压缩我们的应用前，方法参数都运行正常。当你压缩你的代码，你的方法定义将会用字符表示参数而不是单词-这意味着Angular不能找到你想要的！Angular使用了一个方式来解决，调用function的 *toString()* 方法。这将返回函数的字符串形式！接下来我们就能访问正在被请求的参数。Angular
	
	var FN_ARGS = /^function\s*[^\(]*\(\s*([^\)]*)\)/m;
	var FN_ARG_SPLIT = /,/;
	var FN_ARG = /^\s*(_?)(\S+?)\1\s*$/;
	var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;

Angular做的第一件事就是将函数转换为字符串，这是JavaScript中非常有用的一个特性。这将给我们一个字符串类型的函数，如：

	'function MainCtrl ($scope) {...}'

接下来，Angular使用如下方法，移除所有的注释：

	fnText = fn.toString().replace(STRIP_COMMENTS, '');

紧接着，Angular从处理好的function中分割参数来创建真正有用的部分，

	argDecl = fnText.match(FN_ARGS);

Angular接下来使用 *.split()* 来移除空白字符，同时返回我们请求的参数数组。为了更完美，Angular使用了一个内部的forEach方法来迭代这个数组，并匹配参数名称然后将它们添加到 *$inject* 数组中。

	forEach(argDecl[1].split(FN_ARG_SPLIT), function(arg) {
	  arg.replace(FN_ARG, function(all, underscore, name) {
	    $inject.push(name);
	  });
	});

这是你能想象的一个昂贵的处理流程。对每个函数的4个正则查找和一很多转换会造成性能损耗。当我们得到了Angular抽象的 *$inject* 数组，我们可以直接切入且田填充 *$inject* 数组来保存Angular困难和开销时间长的操作。

### $inject 对象 ###

我们可以通过在函数上添加 *$inject*属性来指定依赖自身，其中，如果存在的话，Angular使用DI注解。这是很容易的最可读的语法。例子如下：

	function SomeCtrl ($scope) {
	}
	SomeCtrl.$inject = ['$scope'];
	angular.module('app', [])
		.controller('SomeCtrl', ['$scope', SomeCtrl]);

这样节省了Angular的许多工作-替代了检查方法参数，或者是操纵数组（详情请查看下一章节：Array Arguments）,它仅仅返回和运行指定的 *$inject* 数组。简单，高性能。

理想情况下，由于依赖注入在我们自己的时间和Angular的转换时间上开销很大，我们可以使用任务运行工具如Grunt.js或者是Gulp.js 来自动化注入任务或者是数组语法。

**Note：这个并没有实例化被依赖的所有服务，Angular所做的只是标注相关的名字-框架的其他部分关心对象注入。**

### Array Arguments

最后一个例子使用了我们通常看见的数组索引对应函数参数序号的语法，例如：

	['$scope', function($scope){}]

数组的顺序是非常重要的，因为函数的参数将会按照同样的顺序，以此来避免依赖被错误的实例化和可能引发的错误。

	function SomeCtrl ($scope, $rootScope) {	
	}	
	angular.module('app', [])
		.controller('SomeCtrl', ['$scope', ‘$rootScope’, SomeCtrl]);

我们需要做的是传递函数作为数组的最后一个项，Angular会删除这个函数，并遍历数组所注明的依赖名称，就好像我们创建的 *$inject* 属性。当Angular解析一个方法的时候，它会检查参数是不是一个数组，如果是，那么最后一项是函数，其他的则是依赖。

	else if (isArray(fn)) {
	  last = fn.length - 1;
	  assertArgFn(fn[last], 'fn');
	  $inject = fn.slice(0, last);
	}

## 2、Factory vs Service ##

Factory 和 Service 非常类似，但往往开发人员都难以理解它们。

当 *.service()* 已经实例化，那么 *new Service()* 将被引擎调用，返回一个新实例给我们。本质上，*。.service()* 是作为构造函数被使用的。

service 基本上是一个 factory，然而它是创建时被实例化，因为，你需要在 service 中使用this来注册变量和函数，来替代在factory中返回一个对象的方式。

factory 是非常接近面向对象中的“工厂模式”，当你注入了这个 factory ,你就获得了完整的方法，允许你创建你需要的新的实例-本质上是通过一个对象创建多个新对象。

你可以看下在Angular源码中的内部的工作：

	function factory(name, factoryFn) { 
		return provider(name, { $get: factoryFn }); 
	}
	function service(name, constructor) {
	    return factory(name, ['$injector', function($injector) {
		    return $injector.instantiate(constructor);
	    }]);
	}

## 3、New $scope creation from $rootScope

Angular中所有的scope都是 *$rootScope* 的下级。 *$rootScope* 是通过 *new Scope()*创建的，进一步的子 scope 是通过 *$scope.$new()* 创建的。

	var $rootScope = new Scope();

在 *$new* 方法里面，Angular设置了一个原型链来允许允许 scope 引用它们的父亲，它们的自己跟踪（作为生命周期），和以前的兄弟 scope 。

从下面的代码，如果你请求了一个隔离的 scope ，它会创建一个 *new Scope()* ,否则，它会创建一个从父级继承的子 scope 。

我省略了一些不必要的代码，但这里的是重点：

	$new: function(isolate) {
	    var child;
	
	    if (isolate) {
	      child = new Scope();
	      child.$root = this.$root;
	    } else {
	      // Only create a child scope class if somebody asks for one,
	      // but cache it to allow the VM to optimize lookups.
	      if (!this.$$ChildScope) {
	        this.$$ChildScope = function ChildScope() {
	          this.$$watchers = null;
	        };
	        this.$$ChildScope.prototype = this;
	      }
	      child = new this.$$ChildScope();
	    }
	    child['this'] = child;
	    child.$parent = this;
	    return child;
	  }

当你使用*$scope.$new()*来测试Controller的时候，这也是非常好的能了解测试目的。这有助于明确对我来说Angular是如何创建新的scope的，为什么用Angular mocks 模块来嘲笑测试驱动开发（TDD）。

## 4、Digest Cycle

Digest Cycle 经常作为 *$digest* 被我们看到，这是Angular双向绑定的能力。当一个模型值更新的时候，它会运行，检查它最后已知的值，如果值有变化，呼叫适当的监听器。这是基本的脏检查 - 它针对所有有可能的值来检查，如果是脏值，那么呼叫相关的监听器，直到他没有脏值。我们快速看一下它是如何工作的：

	$scope.name = 'Todd';
	
	$scope.$watch(function() {
	    return $scope.name;
	}, function (newValue, oldValue) {
	    console.log('$scope.name was updated!');
	} );

当你调用 *$scope.$watch*，你注册了两件事。参数一是一个函数，返回你想要监视的值（当你提供一个字符串的时候，Angualr会将他转换为函数）。当 $digest 运行时，监视的参数将被调用，返回任何你想要的值。参数二是当你的参数一变化时，想要执行的函数。看一下Angular是怎样注册watch的。

	$watch: function(watchExp, listener, objectEquality) {
	    var get = $parse(watchExp);
	
	    if (get.$$watchDelegate) {
	      return get.$$watchDelegate(this, listener, objectEquality, get);
	    }
	    var scope = this,
	        array = scope.$$watchers,
	        watcher = {
	          fn: listener,
	          last: initWatchVal,
	          get: get,
	          exp: watchExp,
	          eq: !!objectEquality
	        };
	
	    lastDirtyWatch = null;
	
	    if (!isFunction(listener)) {
	      watcher.fn = noop;
	    }
	
	    if (!array) {
	      array = scope.$$watchers = [];
	    }
	    // we use unshift since we use a while loop in $digest for speed.
	    // the while loop reads in reverse order.
	    array.unshift(watcher);
	
	    return function deregisterWatch() {
	      arrayRemove(array, watcher);
	      lastDirtyWatch = null;
	    };
	 }

这个函数推送你提供的参数到 scope 的 *$$watchers* 数组中，同时，返回一个方法允许你停止watch。

然后，每当*$scope.$apply*或者*$scope.$digest* 运行时，digest cycle将被运行。

### 未完...待续...
