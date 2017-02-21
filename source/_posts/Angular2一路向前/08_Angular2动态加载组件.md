## 0、为什么需要动态加载

在一个比较大的应用程序中，我们不可能将所有的业务逻辑一次性加载出来，比较浪费资源，因为单个用户一般用不到所有的功能，这个时候，就需要部分组件动态加载了。

## 1、Angular2如何动态加载组件

在Angular2，有一个服务是 ``DynamicComponentLoader``，我们就可以通过它来进行动态加载组件。

首先要使用它的话，我们必须要在providers中指定它。

另外，它还有一些必须的依赖，是 ``injector``，当引入了这些元素之后，我们就可以实现一个加载组件的方法：

```javascript
class AppComponent {
  constructor(dynamicComponentLoader, viewContainerRef, injector) {
    this.dynamicComponentLoader = dynamicComponentLoader;
    this.viewContainerRef = viewContainerRef;
    this.injector = injector;
  }

  //动态加载组件的方法，需要传入一个组件
  loadComponent(component) {
    this.viewContainerRef.clear();
    this.dynamicComponentLoader.loadAsRoot(component, '#component-container', this.injector)
      .then((componentRef) => {
        //必须要这样来编写，否则会导致双向绑定表达式获取不到值。
        componentRef.changeDetectorRef.detectChanges();
        componentRef.onDestroy(() => {
          componentRef.changeDetectorRef.detach();
        });
        return componentRef;
      });
  }
}  
```

在以上代码中，核心就是 ``dynamicComponentLoader`` 的 ``loadAsRoot`` 方法，这个方法里面有个参数是 ``'#component-container'``，实际上指定将动态加载的组件放置的容器，

```html
<div id="content">
  <child id="component-container"></child>
</div>
```

通过这样的方式，我们就能够动态的把组件加载到页面上了。

**注：``dynamicComponentLoader`` 还有一个加载方法是 ``loadNextToLocation(component, viewContainerRef)``，只需要提供要动态加载的组件和一个容器引用，就可以将组件加载到容器中了。**

