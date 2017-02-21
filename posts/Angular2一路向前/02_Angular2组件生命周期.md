## 0、Angular2 组件

Angular1并不是围绕组件的概念来实现的。所以，我们需要controller、$scope，同时也需要封装自定义指令。

在Angular2中，把之前的这些东西都丢弃了，使用了一种更面向对象的组件模型。

一个组件控制着我们称之为View的显示部分。组件同时也是自描述的。

**在Angular2中，指令也是存在的，组件只是指令的一种。**

## 1、定义一个组件

最基本的组件只需要提供一个selector和template就足够了。代码如下：

```javascript
import {Component} from 'angular2/core';

@Component({
  selector: 'basic-info',
  template: '<h1>Basic Info</h1>'
})

export class AboutComponent{
  constructor() {
	}
}
``` 

要实现输入和输出呢？

```javascript
import {Component, Input, Output, EventEmitter} from 'angular2/core';

@Component({
  selector: 'basic-info',
  template: `
  <h1>Basic Info, {{abc}}</h1>
  <input type="text" [(ngModel)]="abc">
  `
})

export class BasicInfo{
  @Input('test') set value(val){
    this.abc = val;
    this.callback.next([val]);
  }
  @Output('callback') callback = new EventEmitter();
  constructor(){
    this.abc = 'aaaa';
  }
}
```

如何使用？

```html
<input type="text" [(ngModel)] = "value">
<basic-info [test]="value" (callback)="innerCallback($event)"></basic-info>
```

## 2、组件生命周期

Angular2会管理组件的整个生命周期，包括组件的创建、渲染、子组件的创建和渲染、数据绑定属性变化时的校验、从DOM移除之前的销毁等等。

那如果我们想在某个状态时，进行一些操作应该怎么办呢？Angular2提供了组件生命周期的钩子，供我们在这些时间点添加自定义的操作。

在``angular2/core``中提供了多个Lifecycle Hook接口，我们可以实现一个或多个接口，来设置自定义操作。每一个接口，都会有一个钩子方法，钩子方法的名称是接口的名称加上前缀ng。如OnInit的钩子方法如下：

```javascript
import {Component, Input, Output, EventEmitter} from 'angular2/core';

@Component({
  selector: 'basic-info',
  template: `
  <h1>Basic Info, {{abc}}</h1>
  <input type="text" [(ngModel)]="abc">
  `
})

export class BasicInfo{
  @Input('test') set value(val){
    this.abc = val;
    this.callback.next([val]);
  }
  @Output('callback') callback = new EventEmitter();
  constructor(){
    this.abc = 'aaaa';
  }
  // 组件Init时创建
  ngOnInit(){
    console.log('basic info init.');
  }
}
```

**生命周期钩子（组件和指令都有的）**

1. ngOnInit //组件初始化，在Angular初始化数据绑定输入属性之后
2. ngOnChanges // 
3. ngDoCheck
4. ngOnDestroy

**生命周期钩子（组件特有的）**

1. ngAfterContentInit // Angular将外部内容放入视图后
2. ngAfterContentChecked // 在Angular检测放到视图内的外部内容的绑定后
3. ngAfterViewInit // Angular创建视图之后
4. ngAfterViewChecked //Angular检测了组件视图的绑定之后

**执行顺序**

1. ngOnChanges //绑定属性变化时
2. ngOnInit //在第一次ngOnChanges之后，初始化时
3. ngDoCheck //每次Angular变化检测时
4. ngAfterContentInit //组件内容初始化之后
5. ngAfterContentChecked //组件内容变化后
6. ngAfterViewInit //初始化组件视图和子视图之后
7. ngAfterViewChecked //在数组视图和子视图检查之后
8. ngOnDestroy

我们将组件设定上钩子函数如下：

```javascript
import {Component, Input, Output, EventEmitter} from 'angular2/core';

@Component({
  selector: 'basic-info',
  template: `
  <h1>Basic Info, {{abc}}</h1>
  <input type="text" [(ngModel)]="abc">
  `
})

export class BasicInfo{
  @Input('test') set value(val){
    this.abc = val;
    this.callback.next([val]);
  }
  @Output('callback') callback = new EventEmitter();
  constructor(){
    this.abc = 'aaaa';
  }
  ngOnInit(){
    console.log('basic info init.');
  }
  ngDoCheck(){
    console.log('basic info do check.');
  }
  ngOnChanges(){
    console.log('basic info changes.');
  }
  ngOnDestroy(){
    console.log('basic info destroy');
  }
  ngAfterContentInit(){
    console.log('basic info after content init');
  }
  ngAfterContentChecked(){
    console.log('basic info after content checked');
  }
  ngAfterViewInit(){
    console.log('basic info after view init');
  }
  ngAfterViewChecked(){
    console.log('basic info after view checked');
  }
}
```

控制台打印的结果是：

```html
basic info changes.
test.component.js:23 basic info init.
test.component.js:26 basic info do check.
test.component.js:35 basic info after content init
test.component.js:38 basic info after content checked
test.component.js:41 basic info after view init
test.component.js:44 basic info after view checked
test.component.js:26 basic info do check.
test.component.js:38 basic info after content checked
test.component.js:44 basic info after view checked
test.component.js:26 basic info do check.
test.component.js:38 basic info after content checked
test.component.js:44 basic info after view checked
test.component.js:26 basic info do check.
test.component.js:38 basic info after content checked
test.component.js:44 basic info after view checked
```