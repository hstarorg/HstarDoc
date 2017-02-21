## 0、导言

Angular从1.2.x到1.3.x是一个大的跳跃。在1.3.x之后，也有1.4.x，1.5.x这么两个大版本。

Newkit从1.2.x跳跃到1.3.x经历过一次大的变化，在之后的较大版本升级中，基本上没有大多大改动。但是其中的差异点，我们也需要去了解。

1.3.x以前的版本，我们就不去深究了，毕竟现在不是主流，我们就从1.3.x开始，来看看Angular到底有了哪些变化。

## 1、从1.3.x到1.4.x

从1.3到1.4，Angular的变化涉及到很多个方面，一一列举如下。

### 1.1、动画

在1.4中，动画功能进行了很大的重构，但是API基本保持一致。在新的版本中，我们通过注入 ``$animationCss`` 来实现用JS创建CSS动画。

**1.1.1、定义CSS动画如下：**

```javascript
angular.module('app', ['ngAnimate'])
  .animation('.slide-animation', ['$animateCss', function ($animateCss) {
    return {
      enter: function (element, doneFn) {
        var animation =  $animateCss(element, {
          from: { background: 'black' },
          to: { background: 'blue' },
          duration: 10 // one second
        });
        animation.start().done(doneFn);
      },
      leave: function(element, doneFn){
         var animation =  $animateCss(element, {
          from: { fontSize: '12px' },
          to: { fontSize: '25px' },
          duration: 10 // one second
        });
        animation.start().done(doneFn);
      }
    }
  }]);
```

如何使用？

```html
<div class="test slide-animation" ng-if="vm.ck1"> AAAAAAAAAAA</div>
```

只需要在元素上设置一个class，然后当元素从隐藏到显示，则会执行 ``enter`` 动画，从显示到隐藏，则会执行 ``leave`` 动画。

**1.1.2、监听动画事件**

```javascript
// < 1.4
element.on('$animate:before', function(e, data) {
  if (data.event === 'enter') { ... }
});
element.off('$animate:before', fn);

// 1.4+
$animate.on('enter', element, function(data) {
  //...
});
$animate.off('enter', element, fn);
```

在1.4版本之前，我们需要通过在element上去监听动画开始和结束，另外还必须要通过 ``data.event`` 来判断动画类型。

在1.4及以后，我们可以直接通过 ``$animate`` 来监控了。

**1.1.3、触发动画**

```javascript
var $el = $('.slide-animation');
$animate.enter($el, $el.parent()).then(function(){
  console.log('enter');
});
```

我们需要使用如上的方式，来手动启动动画，此时会触发元素的对应动画事件。

**注意：触发动画的回调中，如果要操作$scope,在<1.4中会失败，需要借助$apply，但在1.4+，就不需要了。示例如下：**

```javascript
$animate.enter(element, elementParent).then(function() {
  $scope.$apply(function() {
    $scope.explode = true;
  });
});

// 1.4+
$animate.enter(element, elementParent).then(function() {
  $scope.explode = true;
});
```

**1.1.4、启用/禁用动画**

```javascript
// < 1.4
$animate.enabled(false, element);

// 1.4+
$animate.enabled(element, false);
```

实现该操作的方法参数1.4+刚好和小于1.4相反。

### 1.2、表单
**1.2.1、ngMessages**

```javascript
<!-- AngularJS 1.3.x -->
<div ng-messages="model.$error" ng-messages-include="remote.html">
  <div ng-message="required">Your message is required</div>
</div>

<!-- AngularJS 1.4.x -->
<div ng-messages="model.$error">
  <div ng-message="required">Your message is required</div>
  <div ng-messages-include="remote.html"></div>
</div>
```

在1.3版本中，``ng-messages-include`` 跟随在 ``ng-messages`` 元素上，这样并不灵活。

在1.4+中，``ng-messages-include`` 不允许更随在 ``ng-messages`` 元素上，必须放在内部，这样使得使用远程模板非常灵活。

另外，当存在多个form时，我们在使用ng-messages获取指定form的方法也有变化，如下：

```javascript
// < 1.4
<div ng-messages="ctrl.form['field_{{$index}}'].$error">...</div>

// 1.4 + 
<div ng-messages="ctrl.getMessages($index)">...</div>
ctrl.getMessages = function($index) {
  return ctrl.form['field_' + $index].$error;
}
```


**1.2.2、ngOptions**

ngOptions仅仅只是内部实现变化，在使用上并没有多大差异。其中当遍历Object时，之前的版本是用的 ``for in``，导致输出的key是字符序的。新版本采用 ``Object.keys``，输出的key是定义时候的顺序。

另外当ngOptions表达式执行之后，将不会再触发ngOptions了。

**1.2.3、select**

在 **select** 元素中，这是一个非常大的变更。简单理解，如下：在1.3中，ngModel和&lt;option>的value比较仅仅是 ``==``，所以 ``200 == '200' //true``。在1.4+中，比较方式成了 ``===``,所以 ``200 === '200' //false``。

这个时候我们可以通过如下方式处理：

```javascript
ngModelCtrl.$parsers.push(function(value) {
  return parseInt(value, 10); // Convert option value to number
});

ngModelCtrl.$formatters.push(function(value) {
  return value.toString(); // Convert scope value to string
});
```

实现指令如下：

```javascript
app.directive('convertNumber', function() {
  return {
    require: 'ngModel',
    link: function(scope, el, attr, ctrl) {
      ctrl.$parsers.push(function(value) {
        return parseInt(value, 10);
      });

      ctrl.$formatters.push(function(value) {
        return value.toString();
      });      
    }
  }
});
```
当然，如果我们保证ngModel的值为string类型，那就没啥问题了（在不使用ng-value的情况下）。

**1.2.4、Form**

表单的变化，主要是name属性，在 < 1.4 的版本中，我们可以设置name为 "my:form1"，在1.4+版本中，不在允许这种特殊的用法。

### 1.3、模板相关

**1.3.1、ngRepeat**

< 1.4 版本中，ng-repeat的遍历顺序是字母序。

1.4+版本中，顺序是有浏览器的 ``for in`` 来返回的。

**1.3.2、ngInclude**

```javascript
// < 1.4

<div ng-include="findTemplate('https://example.com/templates/myTemplate.html')"></div>
$scope.findTemplate = function(templateName) {
  return $sce.trustAsResourceUrl(templateName);
};


// 1.4+
var templateCache = {};
$scope.findTemplate = function(templateName) {
  if (!templateCache[templateName]) {
    templateCache[templateName] = $sce.trustAsResourceUrl(templateName);
  }

  return templateCache[templateName];
};
// Or
angular.module('myApp', []).config(function($sceDelegateProvider) {
  $sceDelegateProvider.resourceUrlWhitelist(['self', 'https://example.com/templates/**'])
});
```

### 1.4、Cookie

在1.4+中，cookie增加了新的API：

```javascript
get
put
getObject
putObject
getAll
remove
```
另外，``$cookieStore`` 将不推荐使用。

### 1.5、HTTP

在1.4+中，$http的 ``transformRequest`` 将不允许修改请求header。但是我们可以使用如下方式进行动态的header设置：

```javascript
$http.get(url, {
  headers: {
    'X-MY_HEADER': function(config) {
      return 'abcd'; //you've got access to a request config object to specify header value dynamically
    }
  }
})
```

### 1.6、Filter

``fliter``如果作用在非数组上，将会抛出一个异常，之前则是返回一个空数组。

``limitTo``作用在不合法的value上，现在将会原样返回，之前是返回空对象，空数组。


## 2、从1.4.x到1.5.x

从 1.4.x 到 1.5.x 是一个为升级ng2做准备的变更版本。

该版本主要是增加了一些功能，所以从1.4.x升级到1.5.x基本不需要太大的改动。

在 1.5.x 版本中，增加了一些接近ng2的新特性，如：

1. angular.component() //一种偏向于angular2风格的组件（特殊的指令）
2. $onInit //生命周期钩子
3. ngAnimateSwap // ngAnimate中一个新的指令

接着，我们来看下它的一些具体变更。

### 2.1、Core

**2.1.1、$parse**

``$parse`` 增加新特性，可以使用locals来覆盖原本的context。用法如下：

```javascript
var context = { user: { name: 'Jay' } };
var locals = { user: { name1: 'Local Jay' } };
var getter = this.$parse('user.name');
console.log(getter(context)); // 'Jay'
console.log(getter(context, locals)); // 'Local Jay'
```

**2.1.2、ngOptions**

如果元素上有 ``ngOptions`` 指令，那么 ``ngModel`` 指令也必须存在，否则就会抛出错误。

另外 ``ngOptions`` 接受假值（'', 0, false, null）

**2.1.3、orderBy**

对 ``undefined`` 或者 ``null`` 进行 ``orderBy`` 将会抛出错误。

### 2.2、ngAria

取消了部分元素的可访问性设置。

### 2.3 ngMessages

将 ``ngMessages`` 指令的优先级设置为1，如果有优先级低于1的指令有transclude功能，那么需要设置为更高的优先级。

### 2.4、ngResource

``$resource`` 增加了 ``$cancelRequest()`` 方法。

### 2.5、ngRoute

增加了 ``$resolveAs`` 配置属性，允许对 ``$resolve`` 指定别名。

### 2.6、ngTouch

默认禁用了 ``ngClickOverrideEnabled``，在触摸屏上，可能还有300ms的延迟。

如果要启用，那么可以使用如下方式：

```javascript
angular.module('myApp').config(function($touchProvider) {
  $touchProvider.ngClickOverrideEnabled(true);
});
```

另外，建议使用FastClick来实现该功能。

需要注意，某些现代浏览器在某些场景下已经删除了300ms延迟：

Chrome 和 Firefox for Android 发现设置了 ``<meta name="viewport" content="width=device-width">`` 将会删除300ms延迟。

IE当设置 ``touch-action`` 为 ``none`` 或者 ``manipulation`` 移除延迟。

**注意：这些变化并不影响ngSwipe指令**。

## 3、总结

Angular1.x基本已经进入维护期了，很少会有新特性加入了。现在的重心在angular2，所以我们也可以优先对angular2做一些技术储备。