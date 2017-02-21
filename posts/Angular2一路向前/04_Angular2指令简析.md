## 0、Angular2指令

在Angular1中，就已经有了指令的概念。Angular1中的指令用于实现可复用UI部件，也用于操作dom元素。

那么在Angular2中的指令是一样的东西么？

Angular2中有组件的概念，指令这个东西就变得更加纯粹。

Angular2的指令有三种：

- 组件 
- 属性指令
- 结构指令

组件是有模板的指令，是指令的中一个另类，因为它使用@Component来装饰，而不是@Directive。

属性指令用于改变现有元素的展现和行为，使用的时候它们看起来像是正常的HTML属性，所以称之为属性指令。如ngModel指令。

结构指令通过添加、删除和替换DOM树中的元素来改变布局，由于可以更改DOM结构，所以称之为结构指令。如ngIf，ngSwitch。

由于Angular2的API好不够稳定，书写该文时，采用的是Angular2 rc1（@angular rc.1）版本，其他版本请自行测试。

## 1、属性指令

接着，我们就一步步来实现一个属性指令 dynamicColor 。

首先，我们需要创建一个ts文件，然后把指令的骨架搭建起来。

```typescript
import {Directive} from '@angular/core';

@Directive({
  selector: '[dynamicColor]'
})

export class DynamicColorDirective{
  constructor(){
    
  }
}
```

以上代码中，我们创建了一个dynamicColor指令。

接下来，我们来实现具体的功能，可以设置元素的背景色和前景色，并能实现事件通知。

要实现动态背景色和前景色，那我们需要额外附加两个属性bgColor和color。

要想在指令中获取这两个属性值，那么我们可以通过@Input方式或者是inputs属性，代码如下：

```typescript
import {Directive, Input} from '@angular/core';

@Directive({
  selector: '[dynamicColor]'
})

export class DynamicColorDirective{
  
  @Input()
  private bgColor: string;
  
  @Input()
  private color: string;
  
  constructor(){
    
  }
}
```

或者是：

```typescript
import {Directive, Input} from '@angular/core';

@Directive({
  selector: '[dynamicColor]',
  //注意，在之前的版本中，使用properties属性，而且，当前还可以使用。
  inputs: [
    'bgColor: bgColor', //字符串以冒号隔开，前者是DynamicColorDirective的属性，后者的html元素的属性
    'color: color'
  ]
})

export class DynamicColorDirective{
  
  // @Input()
  private bgColor: string;
  
  // @Input()
  private color: string;
  
  constructor(){
    
  }
}
```

那么html中又应该如何传递值给指令呢？

```html
<div class="test" dynamicColor [bgColor]="testBgColor" [color]="testColor">
  Hi!
</div>
```

**注意：在html元素的属性上，我们可以有两种写法。一种是直接书写属性，此时会把属性值原样传递给指令。第二种是使用[属性]，此时属性值应该是表达式（可以使用变量，判断等语句），传递给指令的是表达式的结果。**

我们又如何在后端查看这两个值呢？

直接在constructor中console？明确的说是不行的，因为constructor的代码会先于绑定执行。

这个时候，我们就需要借助指令的生命周期钩子。

指令的生命周期钩子有如下几个：

1. ngOnInit --初始化时
2. ngOnChanges -- 属性绑定之时（会有一次inputs属性绑定先于初始化）
3. ngDoCheck -- 执行属性检查时
4. ngOnDestroy -- 指令释放时

了解了生命周期钩子，我们就可以通过ngOnInit来查看绑定好的属性值了。

```typescript
import {Directive, Input, OnInit} from '@angular/core';

@Directive({
  selector: '[dynamicColor]',
  inputs: [
    'bgColor: bgColor', //字符串以冒号隔开，前者是DynamicColorDirective的属性，后者的html元素的属性
    'color: color'
  ]
})

export class DynamicColorDirective implements OnInit{
  
  // @Input()
  private bgColor: string;
  
  // @Input()
  private color: string;
  
  constructor(){
    
  }
  ngOnInit(){
    console.log('bgColor', this.bgColor);
    console.log('color', this.color);
  }
}
```

接下来，我们需要设置元素的background color和color样式，那么我们必须要拿到这个而元素的引用, 并在初始化之后进行绑定。

```typescript
import {Directive, Input, OnInit, ElementRef} from '@angular/core';

@Directive({
  selector: '[dynamicColor]',
  inputs: [
    'bgColor: bgColor', //字符串以冒号隔开，前者是DynamicColorDirective的属性，后者的html元素的属性
    'color: color'
  ]
})

export class DynamicColorDirective implements OnInit{
  
  private nativeElement: any;
  
  // @Input()
  private bgColor: string;
  
  // @Input()
  private color: string;
  
  constructor(el: ElementRef){
    this.nativeElement = el.nativeElement;
  }
  
  private _setElementStyle(): void{
    this.nativeElement.style.backgroundColor = this.bgColor;
    this.nativeElement.style.color = this.color;
  }
  
  ngOnInit(){
    console.log('bgColor', this.bgColor);
    console.log('color', this.color);
    this._setElementStyle();
  }
}
```

当从元素上绑定的属性变化时，又应该从哪里获取到变更呢？这就需要借助生命周期里面的OnChanges函数，代码如下：

```typescript
import {Directive, Input, ElementRef, OnInit, OnChanges} from '@angular/core';

@Directive({
  selector: '[dynamicColor]',
  inputs: [
    'bgColor: bgColor', //字符串以冒号隔开，前者是DynamicColorDirective的属性，后者的html元素的属性
    'color: color'
  ]
})

export class DynamicColorDirective implements OnInit, OnChanges{
  
  private nativeElement: any;
  
  // @Input()
  private bgColor: string;
  
  // @Input()
  private color: string;
  
  constructor(el: ElementRef){
    this.nativeElement = el.nativeElement;
  }
  
  private _setElementStyle(): void{
    this.nativeElement.style.backgroundColor = this.bgColor;
    this.nativeElement.style.color = this.color;
  }
  
  ngOnInit(){
    console.log('bgColor', this.bgColor);
    console.log('color', this.color);
    this._setElementStyle();
  }
  
  ngOnChanges(){
    console.log('bgColor-change', this.bgColor);
    console.log('color-change', this.color);
    this._setElementStyle();
  }
}
```

由于每次变化都会触发OnChanges，那么为了提高性能，我们可以在这里加入一个节流函数。

```typescript
private _setElementStyle(): void {
  clearTimeout(this.timeoutId);
  this.timeoutId = setTimeout(() => {
    this.nativeElement.style.backgroundColor = this.bgColor;
    this.nativeElement.style.color = this.color;
  }, 500);
}
```

有了节流函数，我们就不太确定到底执行了几次更新操作了。这个时候，我们可以加入事件通知。这就涉及到指令的@Output了。

```typescript
@Output()
private updated: EventEmitter<any> = new EventEmitter(); 
```

也等同于：

```typescript
outputs: [
  'updated: updated'
]
private updated: EventEmitter<any> = new EventEmitter(); 
```

**注意：在之前的版本中，也可以用events属性来替代outputs，现在也还可以使用**

要对外发出通知，只需要使用如下代码：

```typescript
this.updated.emit('updated');
this.updated.next('updated2');
```

HTML标签使用时，代码如下：

```html
<div class="test" dynamicColor [bgColor]="testBgColor" [color]="testColor" (updated)="notify($event)">
  Hi!
</div>
```

至此，我们这个指令就已经完成了，所有代码如下：

```typescript
//dynamicColor.directive.ts

import {Directive, Input, Output, ElementRef, EventEmitter, OnInit, OnChanges} from '@angular/core';

@Directive({
  selector: '[dynamicColor]',
  inputs: [
    'bgColor: bgColor', //字符串以冒号隔开，前者是DynamicColorDirective的属性，后者的html元素的属性
    'color: color'
  ],
  outputs: [
    'updated: updated'
  ]
})

export class DynamicColorDirective implements OnInit, OnChanges {

  private nativeElement: any;

  private timeoutId: any;

  // @Input()
  private bgColor: string;

  // @Input()
  private color: string;
  
  // @Output()
  private updated: EventEmitter<any> = new EventEmitter(); 

  constructor(el: ElementRef) {
    this.nativeElement = el.nativeElement;
  }

  private _setElementStyle(): void {
    clearTimeout(this.timeoutId); //先清除已有的timeout
    //保证只执行最后一次。
    this.timeoutId = setTimeout(() => {
      this.nativeElement.style.backgroundColor = this.bgColor;
      this.nativeElement.style.color = this.color;
      this.updated.emit('updated');
      this.updated.next('updated2');
    }, 500);
  }

  ngOnInit() {
    console.log('bgColor', this.bgColor);
    console.log('color', this.color);
    this._setElementStyle();
  }

  ngOnChanges() {
    console.log('bgColor-change', this.bgColor);
    console.log('color-change', this.color);
    this._setElementStyle();
  }
}
```
```html
//test.html

<h1>Dynamic Color Directive</h1>
<input type="text" [(ngModel)]="testBgColor">
<div class="test" dynamicColor [bgColor]="testBgColor" [color]="testColor" (updated)="notify($event)">
  Hi!
</div>
```

```typescript
//test.component.ts

export class TestComponent{
  
  private testBgColor: string = 'blue';
  
  private testColor: string = 'red';
  
  constructor(){
    
  }
  
  private test(data){
    console.log('data', 'my', data);
  }
  
  private notify(data){
    console.log('notify = ', data);
  }
  
}
```
*思考一下？我们还有没有更简单的方式实现以上的效果呢？*

```typescript
import {Directive, EventEmitter} from '@angular/core';

@Directive({
  selector: '[dynamicColor]',
  inputs: [
    'bgColor: bgColor', //字符串以冒号隔开，前者是DynamicColorDirective的属性，后者的html元素的属性
    'color: color'
  ],
  outputs: [
    'updated: updated'
  ],
  host: {
    '[style.backgroundColor]': 'bgColor',
    '[style.color]': 'color'
  }
})

export class DynamicColorDirective {

  private bgColor: string;

  private color: string;
  
  private updated: EventEmitter<any> = new EventEmitter(); 

  constructor() {
  }
}
```
通过host直接在元素上添加绑定。

## 2、结构指令

结构指令帮助我们修改dom结构，我们就简单实现一个templateInclude指令。

```typescript
import {Directive, Input, Output, ElementRef, EventEmitter, OnChanges} from '@angular/core';
import {Http} from '@angular/http';

@Directive({
  selector: '[templateInclude]'
})

export class TemplateIncludeDirective implements OnChanges {

  private nativeElement: any;

  @Input('templateInclude')
  private templateUrl: string;

  @Output()
  private loaded: EventEmitter<any> = new EventEmitter();

  constructor(el: ElementRef, private http: Http) {
    this.nativeElement = el.nativeElement;
  }

  private _setTemplate() {
    this.http.get(this.templateUrl)
      .subscribe(res => {
        this.nativeElement.innerHTML = res.text();
        this.loaded.next(`${this.templateUrl} loaded`);
      });
  }

  ngOnChanges() {
    console.log(this.templateUrl);
    this._setTemplate();
  }
}
```

## 3、总结

**1、指令的元数据有很多属性可以使用**

```typescript

class DirectiveMetadata {
  selector : string //指令使用的标记（选择器）
  inputs : string[] //输入参数绑定
  properties : string[] //属性绑定（过期，请使用inputs）
  outputs : string[] //输出参数绑定
  events : string[] //事件绑定（过期，请使用outputs）
  host : {[key: string]: string} //宿主元素属性设置
  providers : any[] //服务绑定
  bindings : any[] //服务绑定（过期，请使用providers）
  exportAs : string //导出名称
  queries : {[key: string]: any} //用于指令依赖关系
}
```

**2、在使用指令（不仅仅是指令）进行绑定的时候，[]表示输入属性，()表示输出属性和事件**

**3、尽量使用统一的做法，用装饰器优于在属性上做绑定**

**4、在编写指令（不仅限于指令）时，将class中内容按照特定顺序进行排列，推荐顺序如下（个人建议，仅供参考）：**

1. 私有变量
2. 共有变量
3. @Input变量
4. @Output变量
5. 构造函数
6. 私有方法（建议下划线开头）
7. 公有方法
8. 生命周期钩子方法
