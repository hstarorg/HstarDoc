## 0、关于路由

此处所说的路由是指URL路由（也许叫URL Rewrite）。其实是把网址（URL）映射到相关Controller、Component的这个功能。

Angular2的路由其实也就是URL路由，在Angular2中，有两个模块提供了路由功能，``@angular/router-deprecated`` 和 ``@angular/router``。

``@angular/router-deprecated`` 从名称也可以看出，它是一个过时的模块（beta版本中它的名字是 ``angular2/router``，在rc版本被更名）。但疑惑的是，它一直存在于 ``@angular`` 包中。在这里，我主要使用 ``@angular/router`` 来实现路由功能。

## 1、使用Angular2路由

建议在根组件中配置路由。要使用路由，必须先依赖 ``ROUTER_PROVIDERS``；如果要使用路由指令，必须先依赖 ``ROUTER_DIRECTIVES``。

大概结构如下：

```typescript
 //bootstrap.ts
import {provide} from '@angular/core';
import {bootstrap} from '@angular/platform-browser-dynamic';
import {LocationStrategy, HashLocationStrategy} from '@angular/common';

import {AppComponent} from './app/app.component';


bootstrap(AppComponent, [
  provide(LocationStrategy, { useClass: HashLocationStrategy })
]);
```

```typescript
//app.component.ts
import {Component, provide} from '@angular/core';
import {Routes, ROUTER_DIRECTIVES, ROUTER_PROVIDERS} from '@angular/router';

import {HomeComponent} from './../home/home.component';
import {AboutComponent} from './../about/about.component';

@Component({
  selector: 'demo-app',
  template: `
<h3>Angular2 Router Test</h3>
<a [routerLink]="['/home']">Home</a>
<a [routerLink]="['/about']">About</a> 
<router-outlet></router-outlet>
  `,
  directives: [ROUTER_DIRECTIVES],
  providers: [ROUTER_PROVIDERS]
})

@Routes([
  { path: '/home', component: HomeComponent},
  { path: '/about', component: AboutComponent }
])

export class AppComponent {
  constructor() {
    console.log('app init');
  }
}
```

通过 ``@Routes``，我们可以配置路由对应的组件。当然，要求这些组件必须已经存在。在配置路由节点的时候，我们仅仅需要提供 ``path`` 和 ``component`` 参数。

在模板中使用 ``[routerLink]`` 可以配置连接，它的值是一个数组，第一个元素是要导向的url，第二个参数是路由参数。

除了使用 ``[routerLink]`` 实现路由跳转，还可以使用特定服务来跳转，代码如下：

```typescript
this.router.navigate(['/about']);
this.router.navigateByUrl('/about');
```

当URL比较复杂，如/home/test/index时，使用navigate方式如下：

```typescript
this.router.navigate(['home', 'test' ,'index']);
```

## 2、路由参数

有时候，我们需要给路由传递一些参数，这个时候就需要在配置路由的时候，指定参数。使用 ``[routerLink]`` 的方式如下:

```html
<a [routerLink]="['/about', {id: 1}]">About</a> 
```

那么如何获取这个参数呢？就需要在 ``AboutComponent`` 组件中通过 ``RouteSegment`` 来获取，代码如下：

```typescript
export class AboutComponent {  
  constructor(private routeSegment: RouteSegment) {
    console.log('about init', 'params:', routeSegment.parameters);
  }
}
```

## 3、嵌套路由（子路由）

一般来说，我们写一个中大型的应用程序，一个一级路由根本就不够使用。这个时候，就可以使用嵌套路由来把应用程序拆分成很多小的模块。

在这种情况下，就需要我们的子组件也需要使用 ``@Routes`` 来申明自己的路由体系。

```typescript
//about.component.ts

import {Component} from '@angular/core';
import {ROUTER_DIRECTIVES, Routes, RouteSegment} from '@angular/router';

import {AboutUserComponent} from './about-user.component';
import {AboutMeComponent} from './about-me.component';

@Component({
  selector: 'demo-about',
  template: `
  <h1>About</h1>
  <a [routerLink]="['/home']">Go to Home</a>
  <a [routerLink]="['./user', id]">Go to About User</a>
  <a [routerLink]="['./me']">Go to About Me</a>
  <router-outlet></router-outlet>
  `,
  directives: [ROUTER_DIRECTIVES]
})

@Routes([
  { path: '/', component: AboutUserComponent },
  { path: '/user/:id', component: AboutUserComponent },
  { path: '/me', component: AboutMeComponent }
])

export class AboutComponent {
  
  private id: number = 1;
  
  constructor(private routeSegment: RouteSegment) {
    console.log('about init', 'params:', routeSegment.parameters);
  }
  
}
```

在这段代码里，我们需要注意，``[routerLink]``的值，有些是 ``['/home']``, 也有 ``['./me]`` 这种，它们有什么区别呢？

其实直接 '/home' 是指从根路径开始计算，也就是跳转到父路由，真实路径就是 /home。如果是使用的 './me' 这种形式，那么是相对路径，所以点击这个链接，跳转到的实际上是 /about/me 这个地址。

## 4、生命周期钩子（拦截器）

在路由中，我们可以通过实现 ``CanDeactivate`` 来控制路由是否可以被解除；还可以通过实现 ``OnActivate`` 来控制路由激活后的操作。

当我们在 ``HomeComponent`` 中编写如下语句时：

```typescript
routerCanDeactivate(curTree: RouteTree, futureTree: RouteTree) {
  console.log('abc');
  return new Promise((resolve, reject) => {
    resolve(false);
  });
}
```

当进入Home页之后，我们就已经无法跳出了。

当我们在 ``HomeComponent`` 中编写如下语句时：

```typescript
routerOnActivate(currSegment: RouteSegment, prev: RouteSegment, currTree: RouteTree, prevTree: RouteTree){
  console.log('succeed');
}
```

每一次跳转到Home组件，我们都能在控制台看到输出 succeed 。 

**很遗憾的是，暂时没有发现有全局的路由钩子，这也就意味着，我们没法在一个地方控制所有的路由是否允许被解除。**


## 5、后记

以上就是Angular2路由的简单使用了。相关Demo，请点击 [这里](https://github.com/hstarorg/HstarDemoProject/tree/master/angular2_demo)

在Angular2中，还有一个路由是 ``@angular/router-deprecated``，它是之前的路由方式，由于已经被标注为过期，这里就不在说明，如果想了解一下，可以查看 [Demo](https://github.com/hstarorg/HstarDemoProject/tree/master/angular2_demo/angular2-router-deprecated-test)

至于更复杂的动态路由，动态加载组件等等，未完待续...



