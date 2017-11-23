---
title: 利用Angular实现多团队模块化SPA开发框架
date: 2017-11-23 11:11:11
---

# 0、前言

当一个公司有多个开发团队时，我们可能会遇到这样一些问题：

1. 技术选项杂乱，大家各玩各
2. 业务重复度高，各种通用api，登录注销，权限管理都需要重复实现（甚至一个团队都需要重复实现）
3. 业务壁垒，业务之间的互通变得比较麻烦
4. 部署方式复杂，多个域名（或IP地址）访问，给用户造成较大的记忆难度
5. 多套系统，风格难以统一
6. 等等...

当然，解决方式有不少。以下就来讲解下我们这边的一种解决方案。

# 1、思路

**Angualr**

`Angular`（注：非AngularJS） 是流行的前端 `MVVM` 框架之一，配合 `TypeScript`，非常适合用来做后台管理系统。由于我们曾今的一套 `Angularjs` 开发框架，我们继续选择 `Angular` 来进行实现，并尽可能的兼容 `AngularJS` 的模块。

**SPA**

选 `SPA` 还是多页？多余 `Mvvm` 来说，多页并不是标配。而且多页开发中，我们势必会关注更多的内容，包括通用header，footer，而不仅仅是页面的核心内容。

**模块化**

为什么要模块化呢？当有多个团队开发时（或者项目较大时），我们希望各个团队开发出来的东西都是 `模块`（不仅限于JS模块），这样可以让我们独立发布、更新、删除模块，也能让我们的关注点集中在特定模块下，提高开发效率和可维护性。

**平台化**

我们需要有一个运行平台（Website站点），允许在里面运行指定的模块。这样就可以实现单一入口，也容易实现通用逻辑，模块共享机制等等。

**兼容 AngularJS 模块**

在考虑将框架切换到 `Angular` 时，我们无可避免的会遇到如何兼容当前已有模块的问题。大致可选的方案如下：

1. 参考 `AngualrJS -> Angular` 官方升级指南，一步步将模块切换为 `Angular` 的实现。（工作量大，需要开发团队调整很多东西）
2. `iframe嵌入`，会有一定的体验差异，但对开发团队来说，基本无缝升级，也不需要做什么改动。（无疑，我们选择了这套方案）

**模块打包**

我们需要将单个的模块打包为资源包，进行更新。这样才能做到模块独立发布，及时生效。

**CSS冲突**

在大型 `SPA` 中，CSS冲突是很大的一个问题。我们期望通过技术手段，能够根据当前使用的模块，加载和卸载CSS。

**跨页面共享数据**

由于涉及到iframe兼容旧有模块，我们无可避免，需要考虑跨窗口的页面共享。

**公共模块**

当一个团队的模块较多时，就会有一些公共的东西被抽取出来，这个过程，框架是无法知道的，所以这个时候，我们就需要考虑支持公共模块。（模块之间也有依赖关系）

# 3、实现

基于以上的一些思考，我们首先需要实现一个基础的平台网站，这个没什么难度，直接用 `Angular` 实现即可。有了这一套东西，我们的登录注销，基本的菜单权限管理，也就实现了。

在这个基础之上，我们也能实现公共服务、公共组件了（封装一系列常用的玩意）。

## 如何模块化？如何打包？

**注意：此模块并非Angular本身的模块。** 我们通过约定，在 `modules/` 下的每一个目录都是一个业务模块。一个业务模块一般会包含，静态资源、CSS以及JS。根据这个思路，我们的打包策略就是：遍历 `modules/` 的所有目录，对每一个目录进行单独打包（webpack多entry打包+CSS抽取），另外使用 `gulp` 来处理相关的静态资源（在我看来，gulp才是构建工具，webpack是打包工具，所以混合使用，物尽其用）。

一般来说，`webpack` 会把所有相关依赖打包在一起，A、B 模块都依赖了 `@angular/core` 识别会重复打包，而且框架中，也已经打包了 `@angular` 相关组件。这个时候，常规的打包配置就不太合适了。那该如何做呢？

考虑到 `Angular` 也提供了 `CDN` 版本，所以我们将 `Angular` 的组件通过文件合并，作为全局全量访问，如 `ng.core`、`ng.common` 等。

既然这样，那我们打包的时候，就可以利用 `webpack` 的 `externals` 功能，把相关依赖替换为全局变量。

```js
externals: [{
  'rxjs': 'Rx',
  '@angular/common': 'ng.common',
  '@angular/compiler': 'ng.compiler',
  '@angular/core': 'ng.core',
  '@angular/http': 'ng.http',
  '@angular/platform-browser': 'ng.platformBrowser',
  '@angular/platform-browser-dynamic': 'ng.platformBrowserDynamic',
  '@angular/router': 'ng.router',
  '@angular/forms': 'ng.forms',
  '@angular/animations': 'ng.animations'
}
```

这样处理之后，我们打包后的文件，也就不会有 `Angular` 框架代码了。

**注：这个对引入资源的方式也有一定要求，就不能直接引入内层资源了。**

## 如何动态加载模块

打包完成之后，这个时候就要考虑平台如何加载这些模块了（发布过程就不说了，放到指定位置即可）。

什么时候决定加载模块呢？其实是访问特定路由的时候，所以我们的顶级路由，会使用Promise方法来实现，如下：

```js
const loadModule = (moduleName) => {
  return () => {
    return ModuleLoaderService.load(moduleName);
  };
};

const dynamicRoutes = [];

modules.forEach(item => {
  dynamicRoutes.push({
    path: item.path,
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    loadChildren: loadModule(item.module)
  });
});
const appRoutes: Routes = [{
  path: 'login', component: LoginComponent
}, {
  path: 'logout', component: LogoutComponent
}, {
  path: '', component: LayoutComponent, canActivate: [AuthGuard],
  children: [
    { path: '', component: HomeComponent },
    ...dynamicRoutes,
    { path: '**', component: NotFoundComponent },
  ]
}];

```

我们把每个模块，按照 `umd` 的格式进行打包。然后再需要使用该模块的时候，使用动态构建 `script` 来运行脚本。

```js
load(moduleName, isDepModule = false): Promise<any> {
  let module = window['xxx'][moduleName];
  if (module) {
    return Promise.resolve(module);
  }
  return new Promise((resolve, reject) => {
    let path = `${root}${moduleName}/app.js?rnd=${Math.random()}`;
    this._loadCss(moduleName);
    this.http.get(path)
      .toPromise()
      .then(res => {
        let code = res.text();
        this._DomEval(code);
        return window['xxx'][moduleName];
      })
      .then(mod => {
        window['xxx'][moduleName] = mod;
        let AppModule = mod.AppModule;
        // route change will call useModuleStyles function.
        // this.useModuleStyles(moduleName, isDepModule);
        resolve(AppModule);
      })
      .catch(err => {
        console.error('Load module failed: ', err);
        resolve(EmptyModule);
      });
  });
}

// 取自jQuery
_DomEval(code, doc?) {
  doc = doc || document;
  let script = doc.createElement('script');
  script.text = code;
  doc.head.appendChild(script).parentNode.removeChild(script);
}
```

CSS的动态加载相对比较简单，代码如下：

```js
_loadCss(moduleName: string): void {
  let cssPath = `${root}${moduleName}/app.css?rnd=${Math.random()}`;
  let link = document.createElement('link');
  link.setAttribute('rel', 'stylesheet');
  link.setAttribute('href', cssPath);
  link.setAttribute('class', `xxx-module-style ${moduleName}`);
  document.querySelector('head').appendChild(link);
}
```

为了能够在模块切换时卸载，还需要提供一个方法，供路由切换时使用：

```js
useModuleStyles(moduleName: string): void {
  let xxxModuleStyles = [].slice.apply(document.querySelectorAll('.xxx-module-style'));
  let moduleDeps = this._getModuleAndDeps(moduleName);
  moduleDeps.push(moduleName);
  xxxModuleStyles.forEach(link => {
    let disabled = true;
    for (let i = moduleDeps.length - 1; i >= 0; i--) {
      if (link.className.indexOf(moduleDeps[i]) >= 0) {
        disabled = false;
        moduleDeps.splice(i, 1);
        break;
      }
    }
    link.disabled = disabled;
  });
}
```

## 公共模块依赖

为了处理模块依赖，我们可以借鉴 AMD规范 以及使用 `requirejs` 作为加载器。当前在我的实现里，是自定义了一套加载器，后期应该会切换到 AMD 规范上去。

## 如何兼容 `AngularJS` 模块？

为了兼容 `AngularJS` 的模块，我们引入了 iframe， iframe会先加载一套曾今的 `AngularJS` 宿主，然后再这个宿主中，运行 `AngularJS` 模块。为了实现通信，我们需要两套平台程序中，都引入一个基于 `postMessage` 实现的跨窗口通信库（因为默认跨域，所以用postMessage实现），有了它之后，我们就可以很方便的两边通信了。

## AOT编译

按照 `Angular` 官方的 `Aot` 编译流程即可。

## 多Tab页

在后台系统中，多Tab页是比较常用了。但是多Tab页，在单页中使用，会有一定的性能风险，这个依据实际的情况，进行使用。实现多Tab页的核心就是如何动态加载组件以及如何获取到要加载的组件。

多Tab页面，实际就是一个 `Tabset` 组件，只是在 `tab-item` 的实现稍显特别一些，相关动态加载的源码：

```js
@ViewChild('dynamicComponentContainer', { read: ViewContainerRef }) dynamicComponentContainer: ViewContainerRef;

constructor(
  private elementRef: ElementRef,
  private renderer: Renderer2,
  private tabset: TabsetComponent,
  private resolver: ComponentFactoryResolver,
  private parentContexts: ChildrenOutletContexts
) {
}

public destroy() {
  let el = this.elementRef.nativeElement as HTMLElement;
  // tslint:disable-next-line:no-unused-expression
  el.parentNode && (el.parentNode.removeChild(el));
}

private loadComponent(component: any) {
  let context = this.parentContexts.getContext(PRIMARY_OUTLET);
  let injector = ReflectiveInjector.fromResolvedProviders([], this.dynamicComponentContainer.injector);
  const resolver = context.resolver || this.resolver;
  let factory = resolver.resolveComponentFactory(component);
  //   let componentIns = factory.create(injector);
  //   this.dynamicComponentContainer.insert(componentIns.hostView);
  this.dynamicComponentContainer.createComponent(factory);
}
```

**注意：要考虑组件卸载方法，如 destroy()**

为了获取到当前要渲染的组件，我们可以借用路由来抓取：

```js
this.router.events.subscribe(evt => {
  if (evt instanceof NavigationEnd) {
    let pageComponent;
    let pageName;
    try {
      let nextRoute = this.route.children[0].children[0];
      pageName = this.location.path();
      pageComponent = nextRoute.component;
    } catch (e) {
      pageName = '$$notfound';
      pageComponent = NotFoundComponent;
    }
    let idx = this.pageList.length + 1;
    if (!this.pageList.find(x => x.name === pageName)) {
      this.pageList.push({
        header: `页面${idx}`,
        comp: pageComponent,
        name: pageName,
        closable: true
      });
    }
    setTimeout(() => {
      this.selectedPage = pageName;
    });
  }
});
```

# 3、总结

以上就是大概的实现思路以及部分相关的细节。其他细节就需要根据实际的情况，进行酌情处理。

该思路并不仅限于 `Angular` 框架，使用 `Vue、React` 也可以做到类似的效果。同时，这套东西也比较适合中小企业的后台平台（不一定非要多团队，一个团队按模块开发也是不错的）。

如需要了解更多细节，可以参考：[ngx-modular-platform](https://github.com/hstarorg/ngx-modular-platform)，能给个 `star` 就更好了。

在此抛砖引玉，希望能集思广益，提炼出更好的方案。欢迎讨论和 `提Issue`, `发PR`。
