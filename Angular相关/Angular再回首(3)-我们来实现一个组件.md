## 0、前言

前两文写了 ``Component`` 的一些方面，但没有一个比较线性的串联关系，本文，就来从一个实例出发，来尝试概括一个组件的方方面面。

## 1、

## 2、组件实现

### 2.1、先整一个组件

```javascript
angular.module('app', [])
  .component('finalComponent', {});
```

这个组件啥都不干，就提供了一个新的标签，显得毫无意义，但是我们可以从这里看到如何定义一个组件。

**注意：组件名称，请使用小驼峰命名法，在HTML中，请使用连字符+小写字母，这种实现是为了处理js和html大小写敏感的差异(js区分大小写，html不区分)**

**注意2：如果在组件标签中，嵌入有效的标签，是会显示出来的，如下：**

```html
<final-component>
  <h1>Hello</h1>
</final-component>
```

会显示出大号的 “Hello”。

### 2.2、带模板的组件

接着，来实现一个有意义的组件，比如我要渲染一个特定的字符串，代码如下：

```javascript
angular.module('app', [])
  .component('finalComponent', {
    template: '<h1>Hello World.</h1>'
  });
```
现在我们再使用：`<final-component>ABC</final-component>`，则会显示 "Hello World" 内容了。

**注意：当组件指定了模板属性后，其内部的标签，将不会生效（transclude除外，）**

### 2.3、复杂模板的组件

以上，我们已经实现了带模板的组件，可是我们的模板可能会比较复杂，这个时候直接写 `template` 就不太好用了,此时，我们会考虑把模板拆分到一个独立的 `.html` 文件中，代码如下：

```html
<!-- 组件模板内容(文件名为:template.html) -->
<h1>Hello World.</h1>
```

然后，使用 `templateUrl` 属性进行关联

```javascript
angular.module('app', [])
  .component('finalComponent', {
    templateUrl: '/app/template.html'
  });
```

该代码可以达到 2.2 同样的效果，只是把模板内容拆分到独立文件中了。

**注意：模板路径可以是相对路径，也可以是绝对路径，需要注意路径的写法，否则会出现找不到模板**

**注意2：如果使用 `gulp` 构建，可以考虑使用 `gulp-angular-embed-templates` 将独立的模板文件，打包到组件中。**

### 2.4、组件属性绑定

之前实现的组件，感觉太死板了，我想改下文字，都不好实现（你非要用js强制操作dom，我拿你也没办法，不过后果自负），这个时候，我们迫切的需要能给组件传递参数。

`Angular` 组件中，有多个参数传递方式，如下：

* @ 单向绑定字符串（原值绑定） - 传什么就是什么，不做任何处理
* < 单向绑定变量（取scope的值绑定） - 传的值会先用 `$scope` 转换，把结果传递给组件
* = 双向绑定 - 组件内外变化都会通知另一方

#### 2.4.1 直接传递字符串参数

使用 `@` 进行单向字符串绑定

```javascript
angular.module('app', [])
  .component('finalComponent', {
    templateUrl: '/app/template.html'
    bindings: {
      name: '@'
    }
  });
```

```html
<!-- 模板内容 -->
<h1>Hello {{$ctrl.name}}.</h1>

<!-- 使用组件 -->
<final-component name="Jay"></final-component>
```

此时，将会显示“Hello Jay”，可以看到，设定的参数值会原样显示了。

**注意：在模板中，要使用变量，需要加$ctrl前缀，先这样用着，后面会提到**

#### 2.4.2 使用单向绑定变量

```javascript
class TestController{
  constructor(){
    this.name = 'Jay'
  }
}
TestController.$inject = []; // 依赖
angular.module('app', [])
  .component('finalComponent', {
    templateUrl: '/app/template.html'
    bindings: {
      name: '<'
    }
  })
  .controller('TestController', TestController);
```

```html
<!-- 模板内容 -->
<h1>Hello {{$ctrl.name}}.</h1>

<!-- 使用组件 -->
<div ng-controller="TestController as t">
  <final-component name="t.name"></final-component>
</div>
```

此时，也将会显示“Hello Jay”，可以看到，此时 `t.name` 会拿到 `$scope` 中进行解析。

**注意：推荐使用 `controller as` 写法**

#### 2.4.3 双向绑定

```javascript
class TestController{
  constructor(){
    this.name = 'Jay'
  }
}
TestController.$inject = []; // 依赖
angular.module('app', [])
  .component('finalComponent', {
    templateUrl: '/app/template.html'
    bindings: {
      name: '='
    }
  })
  .controller('TestController', TestController);
```

```html
<!-- 模板内容 -->
<h1>
  <h1>Hello {{$ctrl.name}}.</h1>
  <input ng-model="$ctrl.name"></input>
</h1>

<!-- 使用组件 -->
<div ng-controller="TestController as t">
  <final-component name="t.name"></final-component>
  <h3>{{t.name}}</h3>
</div>
```
此时，在文本框输入值之后，可以看到组件内外都会及时变更。

