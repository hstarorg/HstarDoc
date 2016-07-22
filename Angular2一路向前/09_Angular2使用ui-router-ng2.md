## 0、导言

Angular2的路由组件从beta到rc经历了多次变更，知道rc.4都没有完全稳定下来。其次它的功能也并不强大，全局钩子，动态加载，状态控制都不支持。

如果是使用Angular1，那这个时候我们一般会选择 ``ui-router`` 这一个强大的基于状态的路由。

其实，``ui-router`` 也提供了一个Angular2的版本，那就是 ``ui-router-ng2``。

我们就来简单的尝试下它的使用，和利用它来实现动态加载一批组件（结合webpack）。

## 1、引入 ``ui-router-ng2``

要使用 ``ui-router-ng2``，我们必须要先通过 ``npm install ui-router-ng2`` 来安装该包。

安装成功之后，我们需要实现一个 ``UIRouterConfig`` 的实例，代码如下：

```typescript
import { Injectable } from '@angular/core';
import { UIRouter, UIRouterConfig } from 'ui-router-ng2';

import {AboutComponent} from './about.component';

@Injectable()
export class AppRouterConfig implements UIRouterConfig {

  constructor() {

  }

  configure(uiRouter: UIRouter) {
    uiRouter.stateRegistry.register({
      name: 'about',
      component: AboutComponent,
      url: '/about'
    });
  }
}
```

一般做法，我们需要在 ``configure`` 方法中，注册路由状态对象。

当实现了 ``UIRouterConfig`` 之后，我们就可以在应用启动时来使用它了，具体代码如下：

```typescript
import { enableProdMode, provide, PLATFORM_DIRECTIVES } from '@angular/core';
import { APP_BASE_HREF, LocationStrategy, HashLocationStrategy, PlatformLocation } from '@angular/common';
import { BrowserPlatformLocation } from '@angular/platform-browser';
import { bootstrap } from '@angular/platform-browser-dynamic';
import { UIROUTER_PROVIDERS, UIRouterConfig, UIROUTER_DIRECTIVES } from 'ui-router-ng2';

import { RootComponent } from './../shell';
import { AppRouterConfig } from './routes';

enableProdMode();

bootstrap(RootComponent, [
  provide(APP_BASE_HREF, { useValue: '/' }),
  provide(LocationStrategy, { useClass: HashLocationStrategy }),
  provide(PlatformLocation, { useClass: BrowserPlatformLocation }),
  ...UIROUTER_PROVIDERS,
  provide(UIRouterConfig, { useClass: AppRouterConfig }),
  provide(PLATFORM_DIRECTIVES, { useValue: UIROUTER_DIRECTIVES, multi: true })
])
  .then(x => {
    console.log('app started...');
  })
  .catch(error => console.log(error));
```

其中最关键是和路由相关的代码是：

```typescript
...UIROUTER_PROVIDERS, //依赖路由提供者
provide(UIRouterConfig, { useClass: AppRouterConfig }), //指定RouterConfig
provide(PLATFORM_DIRECTIVES, { useValue: UIROUTER_DIRECTIVES, multi: true }) //依赖路由指令
```

在经过这些步骤之后，我们的项目就已经可以使用 ``ui-router-ng2`` 来进行路由管理了。

## 2、路由钩子

``ui-router-ng2`` 提供了很强大的路由钩子函数，可以让我们很方便的对路由的各个阶段进行控制。

使用方式如下：

```typescript
import {Injectable, Inject} from '@angular/core';
import {UIRouter, UIRouterConfig} from 'ui-router-ng2';

import {AboutComponent} from './about.component';

@Injectable()
export class AppRouterConfig implements UIRouterConfig {
  constructor() {

  }

  configure(uiRouter: UIRouter) {
    uiRouter.stateRegistry.register({
      name: 'about',
      component: AboutComponent,
      url: '/about'
    });

    // 以下t均为Transition实例

    uiRouter.transitionService.onBefore({}, t => {
      console.log('onBefore', t); //路由跳转之前
    });
    uiRouter.transitionService.onStart({}, t => {
      console.log('onStart', t); //路由跳转开始
    });
    uiRouter.transitionService.onExit({}, t => {
      console.log('onExit', t); //路由跳出时
    });
    uiRouter.transitionService.onRetain({}, t => {
      console.log('onRetain', t); //...
    });

    uiRouter.transitionService.onEnter({}, t => {
      console.log('onEnter', t); //路由进入时
    });

    uiRouter.transitionService.onFinish({}, t => {
      console.log('onFinish', t); //路由跳转完成
    });
    uiRouter.transitionService.onSuccess({}, t => {
      console.log('onSuccess', t); //路由跳转成功
    });
    uiRouter.transitionService.onError({}, t => {
      console.log('onError', t); //路由跳转出错
    });
  }
}
```

通过以上的各个阶段，我们可以灵活控制跳转是否继续，每个钩子函数都接受 ``boolean`` 和 ``Promise<boolean>``来让我们确定是否跳转。

## 3、自定义回调处理invalidState

通过以上的方式，我们实现了状态路由，也实现了路由跳转的控制。接下来，我们另辟蹊径来实现动态加载。

由于当我们请求不合法的state时，uiRouter都会执行到 ``invalidCallbacks`` 这个函数，我这里就通过它加载动态模块。

实现代码如下：

```typescript
configure(uiRouter: UIRouter) {
  ... //省略不相关代码
  uiRouter.stateProvider.invalidCallbacks = [($from$, $to$) => {
    return new Promise((resolve, reject) => {
      let toStateName = $to$.name();
      let moduleName = this._getModuleName(toStateName);
      if (!moduleName) {
        return;
      }
      this.moduleLoader.load(moduleName).then(_ => {
        let state = uiRouter.stateService.target(toStateName);
        resolve(state);
      });
    });
  }];
}
```

接着，再来看看moduleLoader的代码：

```typescript
import { Injectable, Inject } from '@angular/core';
import {Http} from '@angular/http';

import {UIRouter} from 'ui-router-ng2';

@Injectable()
export class ModuleLoader {

  private uiRouter: UIRouter;
  private loadedModules: Set<string>;

  constructor(private http: Http) {
    this.loadedModules = new Set<string>();
  }

  setRouter(uiRouter) {
    this.uiRouter = uiRouter;
  }

  load(moduleName): Promise<any> {
    if (this.loadedModules.has(moduleName)) {
      return Promise.resolve();
    }
    return new Promise((resolve, reject) => {
      this.http.get(`../dist/assets/js/${moduleName}.js`)
        .toPromise()
        .then(res => {
          let mod = eval(res.text());
          mod.MODULE_STATES.forEach(state => {
            this.uiRouter.stateRegistry.register(state);
          });
          this.loadedModules.add(moduleName);
          resolve();
        }).catch(err => reject(err));
    });
  }
}
```

通过请求指定的文件，然后利用eval执行出具体的state数组，通过register方法，动态注入到我们的ui-router中。

**注意invalidCallbacks回调中的参数($from$, $to$)，必须使用这两个名字，通过分析源代码发现它是用参数名做了匹配的，如果换成其他名称，会提示注入错误。**

**invalidCallbacks回调中的逻辑非常关键，演示了如何获取原始要跳转的state，也演示了如何恢复继续跳转。**

## 4、更多待探索

当前对 ``ui-router-ng2`` 的探索还不够多，另外它本身也还在beta版本，该处理方式应该还有优化空间。