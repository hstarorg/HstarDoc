## 0、Decorator

``Decorator`` 是ECMAScript中建议的标准，使得我们可以在设计时对类和属性进行注解和修改。

## 1、Angular2的Decorator

在Angular2的早期版本（使用AtScript）中，我们是使用Annotation（注解），它以一个声明的方式将元数据添加到代码中。

在后来迁移到TypeScript的时候，我们可以使用 Decorator 和 Annotation 。作为使用者来说，使用 Decorator 和 Annotation 几乎是一样的，唯一的区别是我们没有去控制 Annotation 如何将元数据添加到我们的代码中，而 Decorator 是对 这些 Annotation 的最终实现。

从长远看，我们更应该多关注 Decorator ，因为它才是真正的标准建议。

## 2、Angular2的那些Decorator

### 2.1、In angular2/core

#### 2.1.1、Component

``Component`` 用于声明可重用的UI构建模块（组件），每个 Angular component都要求有一个 ``@Component`` 注解，它指定了组件何时被实例化，哪些属性和 hostListeners 被绑定。

当组件实现（implements）了一些生命周期钩子（lifecycle-hooks），那么将在特定的时间点访问这些钩子的回调函数。

**如何使用**

```javascript
@Component({
  selector: 'demo', // 配置选择器
  inputs: [],
  outputs: [],
  properties: [],
  events: [],
  host: {},
  providers: [], // 设定所依赖的Providers（ng1中的service，provider，factory）
  exportAs: '',
  moduleId: '',  //设定模块ID
  viewProviders: [],
  queries: {},
  //changeDetection
  templateUrl : '', // 指定模板文件URL，和template冲突
  template: 'Hello {{name}}!', //指定模板内容，和templateUrl冲突
  styleUrls: [], // 设定组件依赖的样式表文件
  styles : [],  //设定组件依赖的样式
  directives: [], //设定所依赖的Directives（ng1中的directives）
  pipes: [] //设定所依赖的Pipes（ng1中的filter）
  //encapsulation
})
export class Demo {
  private name: string = 'World';
}
```

**注：从继承关系来看，Component extends Directive。**

#### 2.1.2、Directive

``Directive`` 允许你在DOM元素上附加行为。如果指令带有内嵌视图，那么就成为了组件。

指令同样也有生命周期钩子。使用方式和 Component 雷同。

指令允许多种注入方式来实例化：

1、无注入 -- 该指令没有外部依赖

```javascript
// 空构造，无注入
@Directive({ selector: '[my-directive]' })
class MyDirective {
  constructor() {
  }
}
```

2、组件级别的注入 -- 该指令依赖一些外部服务

```javascript
import {User} from 'xxx';

@Directive({ selector: '[my-directive]' })
class MyDirective {
  constructor(user: User) { //依赖外部服务
  }
}
```

3、注入当前元素的其它指令 --该指令依赖当前元素上的其他指令，搭配其他指令一起使用

```javascript
import {User} from 'xxx';

@Directive({ selector: '[my-directive]' })
class MyDirective {
  constructor(depDirective: DepDirective) { //依赖当前元素上的其他指令
  }
}
```

```html
<div my-directive dep-directive>
  
</div>
```

4、注入当前元素、父元素、更上层的父元素上的指令 --该指令依赖上层元素的指令

```javascript
import {User} from 'xxx';

@Directive({ selector: '[my-directive]' })
class MyDirective {
  //要使用 @Host()
  constructor(@Host() depDirective: DepDirective) { //可以依赖父辈元素上的指令
  }
}
```

```html
<div dep-directive>
  <div my-directive></div>
</div>
```

5、注入直接子集集合元素的的指令 --该指令依赖直接子元素的指令

```javascript
import {User} from 'xxx';

@Directive({ selector: '[my-directive]' })
class MyDirective {
  //使用 @Query<Type> ，依赖直接子元素上的指令
  constructor(@Query(DepDirective) depDirective: QueryList<DepDirective>) {
  }
}
```

```html
<div my-directive>
  <p dep-directive></p>
  <p dep-directive></p>
</div>
```

6、注入后代集合元素的指令 --该指令依赖后代元素的指令

```javascript
import {User} from 'xxx';

@Directive({ selector: '[my-directive]' })
class MyDirective {
  //使用 @Query<Type> ，依赖直接子元素上的指令
  constructor(@Query(DepDirective, {descendants: true}) depDirective: QueryList<DepDirective>) {
  }
}
```

```html
<div my-directive>
  <div>
    <p dep-directive></p>
    <p dep-directive></p>
  </div>
</div>
```

7、可选注入 --该指令的依赖是可选的。

```
@Directive({ selector: '[my-directive]' })
class MyDirective {
  // 使用 @Optional 标记，依赖是可选的。 
  constructor(@Optional() depDirective:DepDirective) {
  }
}
```

**注：以上多种注入方式也适用于 Component 。**

#### 2.1.3、Injectable

``Injectable`` 允许使用注入。在编写组件/指令时，如果有注入，那么就需要将指令/组件标记为可注入的。

#### 2.1.4、Pipe

``Pipe`` 允许我们定义管道方法，实现ng1中filter类似的功能。

如何编写一个Pipe？

```javascript
@Pipe({name: 'lowercase'})
class Lowercase {
  transform(v: string, args: any[]) { return v.toLowerCase(); }
}
```

### 2.2、In angular2/router

#### 2.2.1、CanActivate

``CanActivate`` 允许我们在使用路由时，检查组件的权限，来确定是否可以使用。

```javascript
@Component({selector: 'control-panel-cmp', template: `<div>Settings: ...</div>`})
@CanActivate(checkIfWeHavePermission)
class ControlPanelCmp {
}
```

#### 2.2.2、RouteConfig

``RouteConfig`` 用于我们配置路由。

使用如下：

```
@Component({
  selector: 'dojo-app',
  moduleId: module.id,
  templateUrl: 'app.html',
  styleUrls: ['app.css'],
  directives: [ROUTER_DIRECTIVES, HeaderComponent]
})

@RouteConfig([
  {path: '/', name: 'Home', component: HomeComponent},
  {path: '/about', name: 'About', component: AboutComponent}
])

export class AppComponent{
  constructor() {
	}
} 
```

## 3、参考

1. [https://angular.io/docs/ts/latest/api/index.html#!?apiType=Decorator](https://angular.io/docs/ts/latest/api/index.html#!?apiType=Decorator)
2. [https://angular.io/docs/ts/latest/api/index.html#!?apiFilter=metadata](https://angular.io/docs/ts/latest/api/index.html#!?apiFilter=metadata)