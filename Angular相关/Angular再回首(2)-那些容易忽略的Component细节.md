## 0、前言

在 ``Angular 1.5.x`` 中，增加的组件方法，相当实用和易用。但也有许多小细节问题值得注意，
以下为本人在组件实践过程中遇到的问题，或者是需要注意的小细节。

## 1、问题/小细节（需要注意的点）

### 1.1、如何判断是否添加了可选的 ``transclude`` 元素？

在很多时候，我们会给一个组件设定多个 ``transclude``，可能其中有一部分是可选的，那如何判断可选的 ``transclude`` 被用户设置了值呢？

此时，我们可以依靠 ``$transclude`` 来进行判断：

```javascript
class XXXComponent{
  constructor($transclude){
    this.$transclude = $transclude;
  }

  $onInit(){
    // 判断transclude是否存在
    let transcludeName = 'xxx';
    let hasXXX = this.$transclude.isSlotFilled(transcludeName);
  }
}

XXXComponent.$inject = ['$transclude'];
```

### 1.2、如何监控绑定属性的变更？

属性绑定，分为一次性绑定(@)（也算是单向绑定），单向绑定(<)，双向绑定(=)。

**# 监控单向绑定属性**

对于单向绑定的属性，可以通过生命周期钩子 ``$onChanges(changesObj)`` 来进行监控。

```javascript
class XXXController{
  $onChanges(changesObj){
    console.log(changesObj);
  }
}
```

其中参数 ``changesObj`` 是所有变更属性的一个汇总，数据结构如下：

```json
changesObj = {
  key1: { // 有变更的绑定属性
    currentValue: any // 当前值 （变化后的值）
    previousValue: any // 上一次的值 （变化前的值）
    isFirstChange(): fn // 方法，用于判断是否是第一次变更。 
  }
}
```

**注意：``$onChanges`` 无法监控双向绑定属性，切记！**

**# 监控双向绑定**

由于 ``$onChanges`` 无法监控双向绑定属性，那么我们就必须另外想办法来进行监控，可以有以下几种方案：

*方案一：利用 ``$interval``*

既然是双向绑定，那么肯定变化是直接生效的，关键就在于我们无法监视到，这个时候我们可以利用 ``$interval`` 来实现定时监控。

```javascript
class XXXController{
  constructor($interval){
    this.$interval = $interval;
    this.init();
  }
  init(){
    let previousValue = null;
    this.$interval(() => {
      if(previousValue !== this.value){
        previousValue = this.value;
        console.log('value changed');
      }
    }, 200);
  }
}
XXXController.$inject = ['$interval'];

angular.module('xxx').component('xxx', {
  bindings: {
    value: '='
  },
  controller: XXXController,
  controllerAs: 'vm'
});

```

优点：
1. 易于理解

缺点：
1. 浪费资源
2. 需要自己书写逻辑

推荐指数： ☆

*方案二：利用 ``$scope.$watch(keyString)``*

组件也有独立的 ``$scope``，那么借助 ``$scope.$watch`` 也可以实现监听属性变化，代码如下：

```javascript
class XXXController{
  constructor($scope){
    this.$scope = $scope;
    this.init();
  }
  init(){
    this.$scope.$watch('vm.value', (newVal, oldVal) => {
      console.log('value changed);
    });
  }
}
XXXController.$inject = ['$scope'];

angular.module('xxx').component('xxx', {
  bindings: {
    value: '=' // 双向绑定属性
  },
  controller: XXXController,
  controllerAs: 'vm'
});
```

优点：
1. 使用简单

缺点：
1. 字符串形式的 ``$watch``,依赖 ``controllerAs``,不易理解 
2. 实质仍然是定时器，只不过是使用的 ``angular`` 自身的 ``$diget`` 循环

推荐指数： ☆☆

*方案三：利用 ``$scope.$watch(fn)``*

``$scope.$watch`` 也接受函数类型的参数，相对于字符串形式，没有 ``controllerAs`` 的相关性，而且更灵活，代码如下：

```javascript
class XXXController{
  constructor($scope){
    this.$scope = $scope;
    this.init();
  }
  init(){
    this.$scope.$watch(() => this.value, (newVal, oldVal) => {
      console.log('value changed);
    });
  }
}
XXXController.$inject = ['$scope'];

angular.module('xxx').component('xxx', {
  bindings: {
    value: '=' // 双向绑定属性
  },
  controller: XXXController,
  controllerAs: 'vm'
});
```

优点：
1. 使用简单

缺点：
1. 实质仍然是定时器，只不过是使用的 ``angular`` 自身的 ``$diget`` 循环

推荐指数： ☆☆☆☆

*方案四：利用 ``getter & setter``*

因为我们使用了 ``ES6 Class``，那么 ``ES6`` 的 ``getter setter`` 特性，我们也是能够使用的，方式如下：

```javascript
class XXXController{

  set value(val){
    this._value = val;
    console.log('value changed');
  }
  get value(){
    return this._value;
  }
}
XXXController.$inject = [];

angular.module('xxx').component('xxx', {
  bindings: {
    value: '=' // 双向绑定属性
  },
  controller: XXXController,
  controllerAs: 'vm'
});
```
优点：
1. 没有额外的开销，性能高

缺点：
1. 使用相对较为复杂

推荐指数： ☆☆☆☆