## 0、什么的Promise

Promise（承诺）是用于改善异步编程体验的一种编程模型，它提供了一些列的API的方法论，让你能更优雅的解决异步编程中出现的一些问题。

## 1、Promise的核心竞争力

在处理有依赖性的回调的时候，我们的代码是这样写的：

	step1(function (value1) {
	    step2(value1, function(value2) {
	        step3(value2, function(value3) {
	            step4(value3, function(value4) {
	                // Do something with value4
	            });
	        });
	    });
	});

这就是我们所谓的回调地狱。

如果用Promise的方式来实现，是怎么样呢？

	step1().then(step2).then(step3).then(step4)

代码更简单逻辑也清晰，异步的回调嵌套变成了同步写法，孰优孰劣相信大家都一目了然。

## 2、Angular服务$q

在angular中，基于nodejs中流行的Q提供了一个简化版本的Q,对外的话提供一个service $q。

以下列举出angular中的$q提供的API

#### 1、Promise.then() 将回调变成链式调用，then可以接两个参数，successCallback, errorCallback,示例如下：

	var deferred = $q.defer();
	var promise = deferred.promise;
	promise.then(successCallback, errorCallback);

#### 2、Promise.catch 捕获Promise异常，Promise.catch(errorCallback)等价于Promise.then(null, errorCallback)

#### 3、Promise.finally(callback, notifyCallback) promise结束后要做的事情和接收通知信息

#### 4、Deferred.resolve(val) 通知promise请求处理完毕，并将处理结果传给回调函数（successCallback），示例如下：

	var deferred = $q.defer();
	setTimeout(function(){
		deferred.resolve('abc'); //会将abc传递给successCallback
	}, 1000);
	var promise = deferred.promise;
	promise.then(successCallback, errorCallback);

#### 5、Deferred.reject(msg) 通知promise请求出现异常，将异常信息传给回调函数（errorCallback），示例如下：

	var deferred = $q.defer();
	setTimeout(function(){
		deferred.reject('abc'); //会将abc传递给errorCallback
	}, 1000);
	var promise = deferred.promise;
	promise.then(successCallback, errorCallback);

#### 6、Deferred.notify(value) 内部执行有变化时，对外发起通知。将会在Promise.finally中捕获到

	var deferred = $q.defer();
	setTimeout(function(){
		deferred.reject('abc'); //会将abc传递给errorCallback
	}, 1000);
	var promise = deferred.promise;
	promise.then(successCallback, errorCallback);

#### 7、$q.when(val/fn) 将任意对象/函数包装成promise，返回包装好的promise。

#### 8、$q.all(promises).then() 当所有的promise都成功解析后，流程才继续往下走。示例如下:

	$q.all($http.get('xxx'), $http.post('xxx',{}))
	.then(successCallback, errorCallback);

## 3、$q的使用

常规使用

	//定义开关变量
	var canSuccess = false;
	//定义一个Promise
	var buildPromise = ()=>{
	  var deferred = $q.defer();
	  setTimeout(()=>{
	    if(canSuccess){
	      deferred.resolve('promise执行成功！')
	    }else{
	      deferred.reject('promise执行失败！')
	    }
	  },5000);
	  return deferred.promise;
	};
	
	//使用它
	var promise = buildPromise();
	promise.then(()=>{
	  console.log('执行成功啦！');
	}, ()=>{
	  console.log('执行失败了！');
	})

使用$q.all

	var p1 = $http.get('xxxx');
	var p2 = $http.get('xxxx2');
	$q.all(p1, p2).then(() =>{
	  console.log('两次请求都成功了！');
	});

## 4、$q源码分解

	//Deferred定义
	function Deferred() {
	  this.promise = new Promise();
	  //Necessary to support unbound execution :/
	  this.resolve = simpleBind(this, this.resolve);
	  this.reject = simpleBind(this, this.reject);
	  this.notify = simpleBind(this, this.notify);
	}

	//函数柯里化
	function simpleBind(context, fn) {
	  return function(value) {
	    fn.call(context, value);
	  };
	}

通过这种方式，就能将resolve，reject和promise关联起来了。既然我们最终要返回promise，那我们来看已看Promise的实现：

	function Promise() {
	  this.$$state = { status: 0 };
	}
	
	extend(Promise.prototype, {
	  then: function(onFulfilled, onRejected, progressBack) {
	    if (isUndefined(onFulfilled) && isUndefined(onRejected) && isUndefined(progressBack)) {
	      return this;
	    }
	    var result = new Deferred();
	
	    this.$$state.pending = this.$$state.pending || [];
	    this.$$state.pending.push([result, onFulfilled, onRejected, progressBack]);
	    if (this.$$state.status > 0) scheduleProcessQueue(this.$$state);
	
	    return result.promise;
	  },
	
	  "catch": function(callback) {
	    return this.then(null, callback);
	  },
	
	  "finally": function(callback, progressBack) {
	    return this.then(function(value) {
	      return handleCallback(value, true, callback);
	    }, function(error) {
	      return handleCallback(error, false, callback);
	    }, progressBack);
	  }
	});

从这里很明显可以看出，catch就是一个语法糖，调用的还是then。finally也是一个语法糖，就是不关成功，还是失败，都会调用callback。那这个时候，我们主要关注的方法就放到then这个方法的实现上。

为了实现链式调用，在then方法内部，又实例化了Deferred对象，并返回Defferrd.promise。

接下来就来看处理过程：

	this.$$state.pending = this.$$state.pending || [];
	this.$$state.pending.push([result, onFulfilled, onRejected, progressBack]);
	if (this.$$state.status > 0) scheduleProcessQueue(this.$$state);

	extend(Deferred.prototype, {
	  resolve: function(val) {
	    if (this.promise.$$state.status) return;
	    if (val === this.promise) {
	      this.$$reject($qMinErr(
	        'qcycle',
	        "Expected promise to be resolved with value other than itself '{0}'",
	        val));
	    } else {
	      this.$$resolve(val);
	    }
	
	  },
	
	  $$resolve: function(val) {
	    var then, fns;
	
	    fns = callOnce(this, this.$$resolve, this.$$reject);
	    try {
	      if ((isObject(val) || isFunction(val))) then = val && val.then;
	      if (isFunction(then)) {
	        this.promise.$$state.status = -1;
	        then.call(val, fns[0], fns[1], this.notify);
	      } else {
	        this.promise.$$state.value = val;
	        this.promise.$$state.status = 1;
	        scheduleProcessQueue(this.promise.$$state);
	      }
	    } catch (e) {
	      fns[1](e);
	      exceptionHandler(e);
	    }
	  },
	
	  reject: function(reason) {
	    if (this.promise.$$state.status) return;
	    this.$$reject(reason);
	  },
	
	  $$reject: function(reason) {
	    this.promise.$$state.value = reason;
	    this.promise.$$state.status = 2;
	    scheduleProcessQueue(this.promise.$$state);
	  },
	
	  notify: function(progress) {
	    var callbacks = this.promise.$$state.pending;
	
	    if ((this.promise.$$state.status <= 0) && callbacks && callbacks.length) {
	      nextTick(function() {
	        var callback, result;
	        for (var i = 0, ii = callbacks.length; i < ii; i++) {
	          result = callbacks[i][0];
	          callback = callbacks[i][3];
	          try {
	            result.notify(isFunction(callback) ? callback(progress) : progress);
	          } catch (e) {
	            exceptionHandler(e);
	          }
	        }
	      });
	    }
	  }
	});

在调用then的时候，就将锅中回调写到$$state的pending数组中，让defferred.resolve的时候就会调用Deferred的内部方法，调用我们传递的回调函数。

**源码分解实在是说不明白，后期再发一篇如何实现一个简易的Promise，希望能更简洁易懂**

## 5、 了解更多

[JavaScript Promise迷你书（中文版）](http://liubin.github.io/promises-book/)

[Angular $q api](https://docs.angularjs.org/api/ng/service/$q)