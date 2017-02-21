# 0、导言

在单页应用时代，有一个非常重要的概念，那就是前端路由。那它到底是怎么实现的呢？

路由一般有如下两种方式：

1. HASH路由（控制浏览器hash变化）
2. URL路由（URL直接变化）

**本文主要关注URL变化这种路由实现。** 

# 1、History对象

当我们浏览网页时，我们会点击其中的一个链接进行跳转，其中一部分是直接替换掉当前页面，此时就产生了历史记录。

在浏览器中，历史记录的存储我们无法直接控制，但是对于历史记录的使用，是可以通过 ``window.history`` 对象操作的。

比如我们可以查看当前访问了多少个页面：

```javascript
console.log(window.history.length); 
```

可以后退和前进：

```javascript
window.history.back();
window.history.forward();
```

也可以以当前页面为基准，跳转到前N个或者后N个页面：

```javascript
window.history.go(2); // 前进两页
window.history.go(-1); //后退1页
```

**注意：如果前进或者后退的索引上没有相对应的历史记录，那么将不会跳转，如 go(555)**

# 2、HTML5 history

在HTML5， ``history`` 有了新的方法，允许我们逐条的添加和修改历史记录条目。

这些方法协同 ``window.onpopstate`` 事件，就构成了我们URL路由的基石。

以下，我们就来看看有哪些新增的方法。

## 2.1、pushState()

使用该方法，可以推送一个状态到历史记录中去。函数使用方式如下：

```javascript
window.history.pushState({a:1, b:2}, '', '/abc.html');
```

其中参数一是一个JS对象，关联在历史条目中；
参数二是标题字符串；（当前会被忽略，建议传递''）
参数三是可选的页面地址（改变URL）

**注意：参数三是一个字符串，但不能带有http://， 可以直接写 xx.html，也可以传入 /xx.html。**

**注意2：虽然看起来效果有点类似 ``window.location = '#abc'`` ，但pushState()方法永远不会触发hashchange事件，即便新的地址只变更了hash**

## 2.2、replaceState()

``replaceState`` 和 ``pushState`` 非常类似，前者是修改，后者是新增。

## 2.3、history.state 属性

当我们正处在一个 ``state`` 状态下的时候，我们可以通过 ``history.state`` 来查看当前的 ``state`` 对象。

如上例中的 ``{a:1, b:2}``

## 2.4、window.onpopstate 事件

如果仅仅只能推送状态到 ``history`` 中，那我们可实现的操作非常有效。但当结合 ``onpopstate`` 事件，我们就能够实现一个可控制URL变化的前端路由器。

```javascript
window.addEventListener('popstate', function(evt){
  console.log(evt);
}, false);

window.history.pushState({key: 'k1'}, '', 'abc.html');
```

先执行以上代码，我们发现事件并没有触发，此时点击浏览器后退按钮，可以发现事件被触发。

**注意：调用history.pushState()或者history.replaceState()不会触发popstate事件. popstate事件只会在其他浏览器操作时触发, 比如点击后退按钮(或者在JavaScript中调用history.back()方法)。**

**注意2：当网页加载时,各浏览器对popstate事件是否触发有不同的表现,Chrome 和 Safari会触发popstate事件, 而Firefox不会。**

**注意3：就算是进入非state页面（不是pushState或者replaceState作用过的），也会触发popstate事件。**


# 3、URL-Router

有了之前的这些基础，我们来看看，实现一个简单的前端路由需要多少代码？

```javascript
;(() => {
  let urlRouter = {};
  let container;
  let routeMapCache;

  let getPage = (url, callback) => {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.setRequestHeader('Accept', 'text/plain');
    xhr.onreadystatechange = () => {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        callback && callback(xhr.responseText);
      }
    }
    xhr.send();
  };

  urlRouter.init = (routeMap, options) => {
    routeMapCache = routeMap;
    if (options.container instanceof HTMLElement) {
      container = options.container;
    } else {
      container = document.querySelector(options.container);
    }

    // 处理状态变化
    window.addEventListener('popstate', function (evt) {
      let stateObj = history.state || evt.state;
      console.log(evt, stateObj);
      if (stateObj) {
        urlRouter.go(stateObj.state);
      }
    }, false);

    // 初始化时，处理默认状态
    let path = window.location.pathname;
    let stateKeys = Object.keys(routeMapCache);
    for (let i = 0; i < stateKeys.length; i++) {
      let stateObj = routeMapCache[stateKeys[i]];
      if (stateObj.url === path) {
        urlRouter.go(stateKeys[i]);
        return;
      }
    }
  };

  urlRouter.go = (state) => {
    let stateObj = routeMapCache[state];
    if (!stateObj) {
      throw new Error('state not found.');
    }
    stateObj.state = state;
    window.history.pushState(stateObj, '', stateObj.url);
    getPage(stateObj.path, (content) => {
      container.innerHTML = content;
    });
  };

  window.urlRouter = urlRouter;
})();
```

如何使用？

```javascript
let routeMap = {
  'page1': { url: '/page1', path: 'page1.html' },
  'page2': { url: '/page2', path: 'page2.html' },
  'page3': { url: '/page3', path: 'page3.html' },
};

// 初始化路由
window.urlRouter.init(routeMap, { container: '#page-content' });

//路由跳转

let links = [].slice.call(document.querySelectorAll('#page-menu li a'));
links.forEach(link => {
  link.addEventListener('click', function (evt) {
    evt.stopPropagation();
    evt.preventDefault();
    window.urlRouter.go(evt.target.getAttribute('href'));
  }, false);
});
```

具体Demo地址：[URL-Router Demo](https://github.com/hstarorg/HstarDemoProject/tree/master/Javascript_demo/url-router)
