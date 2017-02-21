---
title: Angular再回首(1)-Component组件
date: 2017/02/21 14:47:10
---

## 0、再谈组件

``Component(组件)`` 在 ``Angular1`` 就已经有雏形了，那就是指令。在 ``Angular2`` 中，组件的概念被大大的强化，甚至是Angular2的核心概念。

在前端这么多年的演变中，组件也反哺到 ``Angular1``，成为 ``Angular1`` 的一种重要特性，在此之前，我们仅仅可以用 ``Directive`` 来实现类似组件的效果。

## 1、Angular组件与指令

在 ``Angular 1.5.x`` 中，新增加了 ``angular.component`` 方法，用于实现组件的构造。

在此之前，我们可能用 ``angular.directive`` 来实现类似的效果。

这个时候我们可能就会疑惑，它们有什么区别呢？

| Feature | Directive | Component |
|---|---|---|
| bindings | No | Yes (binds to controller) |
| bindToController | Yes | (default: false)	No (use bindings instead) |
| compile function |Yes |	No |
| controller |	Yes |	Yes (default function() {}) |
| controllerAs |	Yes | (default: false)	Yes (default: $ctrl)|
| link functions |	Yes |	No|
| multiElement	| Yes|	No|
| priority|	Yes|	No|
| require	| Yes|	Yes|
| restrict	|Yes|	No (restricted to elements only)|
| scope	|Yes (default: false)	|No (scope is always isolate)|
| template	|Yes	|Yes, injectable|
| templateNamespace|	Yes|	No|
| templateUrl	|Yes	|Yes, injectable|
| terminal|	Yes| 	No|
| transclude	|Yes (default: false)	|Yes (default: false)|

更多信息，请参考 [Angular 官方说明](https://docs.angularjs.org/guide/component)

从上表我们可以看出，对于 ``Directive``，``Component`` 从设计思路上更加完善，也更加纯粹。总得来说，组件显得更易理解，更简单易用。

## 2、组件生命周期

在 ``angular.directive()`` 中，是没有生命周期这个概念的，我们无法在指令的特定阶段插入自己的逻辑。

但是在 ``angular.component()`` 中，则是具有特定的生命周期，以方便我们进行控制。

生命周期如下：

1. $onInit  -- 指令初始化时执行（放置初始化代码）
2. $onChanges(changesObj)  -- 组件数据变化时执行，并可获取变更对象
3. $doCheck() -- 执行变更检测时执行
4. $onDestroy() -- 组件释放时执行（放置清理代码）
5. $postLink() -- 类似后连接函数 （一般放置dom操作，因为此时组件已经渲染好）

实例：

```javascript
((angular, window) => {
  class AlertComponent {
    constructor() {
    }

    $onInit() {
      console.log('init');
    }

    $onChanges(changesObj)
      console.log('change', changesObj);
    }

    $doCheck() {
      console.log('check');
    }

    $onDestroy() {
      console.log('destroy');
    }

    $postLink() {
      console.log('post link');
    }
  }

  AlertComponent.$inject = []; // 配置依赖项

  angular.module('components').component('jAlert', {
    templateUrl: 'components/alert/alert.html',
    // scope绑定语法，< 单向绑定（变量），@ 单向绑定（纯字符串）， = 双向绑定，& 事件绑定
    bindings: {
      menuData: '<'
    },
    controller: AlertComponent,
    controllerAs: '$ctrl',
    require: '',
    transclude: false
  });

})(window.angular, window);
```

在页面使用该指令后，可以在控制台看出如下输出：

```
init
check
post link
N个check（脏检查）
```

在切换路由，或者其他会删掉该组件的操作时，会看出控制台输出 ``destroy``。

如果中途有数据变化，控制台还会输出 ``change``。 

这就是整个组件的生命周期。

## 3、属性绑定

在 ``directive`` 中，我们要获取数据，一般会采用 ``$scope`` 传参，或者通过link函数来捕获参数。

在新的组件申明中，我们只需要通过 ``bindings`` 就可以实现复杂的参数绑定。

简单思考下，我们可能需要哪些绑定呢？

1. 双向绑定 （双向）
2. 单向绑定变量 （从外到内）
3. 单向绑定属性（字符串）（从外到内）
4. 输出绑定 （从内到外）

在组件的 ``bindings`` 属性中，我们也刚好有四种语法，来一一对应这四种绑定。

具体写法如下： 

```javascript
bindings: {
  model: '=',  // 双向绑定
  title: '@',  // 单项绑定字符串（直接用组件上的属性值）
  key: '<',  // 单项绑定变量，取到属性值，然后返回$scope[属性值]
  onClick: '&'  // 输出绑定，执行外部函数
}
```

假设组件标签为 ``<j-test>``，那么用法如下：

```javascript
$scope = {
  model: '1',
  key: 'abc',
  onClick: () => {

  }
};
```

```html
<j-test model="model" key="key" title="Title" on-click="onClick()"></j-test>
```

此时，我们在组件中，就能获取到对应的值： 

```javascript
{
  model: 1, // 从scope中取
  key: 'abc', // 从scope中取
  title: 'Title', // 直接用string
  onClick: fn // 执行该onClick会触发外部函数$scope.onClick
}
```

**注意：关于输出函数传递参数，需要有特定的写法（一定要注意！！！）**

*在组件中的写法*

在组件中，要给该函数传参，必须使用：

```javascript
this.onClick({
  param1: 'xxx',
  param2: 'BBB'
});
```

的写法，并建议参数名使用 ``$`` 开头，如：``$event``。

*在组件绑定中的写法*

```html
<j-test model="model" key="key" title="Title" on-click="onClick(param1, param2)"></j-test>
```

注意onClick的写法，里面的参数名称，必须和组件中参数对象中的key匹配。

## 4、给组件设定外部HTML

在使用组件过程中，我相信很容易遇到需要使用外部html的组件，如 ``Tabs, Panel`` 等，那我们给组件内部传入自定义的HTML呢？

这个时候，我们可以使用 ``ng-transclude``

### 4.1、传递单个HTML片段

首先，主要在注册组件时，开启 ``transclude``（设置transclude为true），然后我们就可以在组件html中，设定占位符，有如下两种方式：

```html
<!-- 占位符1 -->
<div ng-transclude></div>

<!-- 占位符2 -->
<ng-transclude></ng-transclude>
```

然后在使用组件的地方，就可以直接把要使用的HTML放在组件标记中，如：

```html
<j-test>
  <span>我会被传递到主键内部</span>
</j-test>
```

### 4.2、传递多个HTML片段

以上，我们知道了如何传递单个HTML片段，但传递多个HTML片段也是非常有必要的，如 ``Dialog``组件，
我们很可能会传递 ``dialog-header``, ``dialog-body`` 等等，那此时又应如何呢？

这个场景，我们可以借助 ``ng-transclude`` 的 ``slot`` 功能实现，

首先，是占位符的变化，如下：

```html
<!-- 占位符1 -->
<div ng-transclude="header"></div>
<div ng-transclude="body"></div>

<!-- 占位符2 -->
<ng-transclude ng-transclude-slot="header"></ng-transclude>
<ng-transclude ng-transclude-slot="body"></ng-transclude>
```

其次是组件配置的变化，因为有多个 ``transclude``，那么仅仅设置为 ``true``，就不太能满足需求了。
需要修改如下：

```javascript
transclude: {
  header: '?panelHeader', // panelHeader表示内部标签，?表示是可选的
  body: 'panelBody' // 没有问号，表示该节点必选
}
```

接下来，就应该是调用时的改变，调用如下：

```html
<j-panel>
  <panel-header>
    我是Panel Header（可选）
  </panel-header>
  <panel-body>
    我是Panel Body（必须）
  </panel-body>
</j-panel>
```

## 5、组件 ``require``

同 ``Directive`` 一样，组件也可以相互依赖，只需要在注册组件时，设置require属性即可，写法如下：

```javascript
require: {
  componentCtrl: '^parentComponent'
}
```

## 6、小结

新增的 ``angular.component`` 就是这么一个东西，比起 ``directive`` 更加纯粹，更加强大，更加易用。
建议在后续使用中，多多尝试该方式。