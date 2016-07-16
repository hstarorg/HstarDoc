## 0、前言

虽然iframe已经越来越不流行了，但是在某些特定的场景下，使用它可以大大减小我们的工作量。

当在页面内使用iframe，甚至是嵌套iframe的时候，它们之间少不了要通信。如果是同域的情况，那我们可以直接进行通信。

然而，很多场景下，往往是跨域通信，那这个时候我们可以用怎样的方式来跨域通信呢？

请看此文分解。


## 1、重现跨域

我们新建两个 ``index.html``，分别部署两个不同的端口上。

```html
// localhost:8001/index.html
...
<body>
  <h1>Page1</h1>
  <iframe src="http://localhost:8003" frameborder="5" 
  style="width: 100%;height: 300px"></iframe>
  <script>
    window.getPage1Title = function(){
      return 'abc';
    };
  </script>
</body>
...
```

```html
// localhost:8003/index.html
<body>
  <h1>Page2</h1>
  <button onclick="fun1();">Test</button>
  <script>
    function fun1(){
      var parentTitle = window.parent.getPage1Title();
      alert(parentTitle);
    }
  </script>
</body>
```

从浏览器打开 ``http://localhost:8001``，然后点击iframe中的按钮，会出现一个如下提示：

```
(index):15 Uncaught SecurityError: Blocked a frame with origin "http://localhost:8003" from accessing a frame with origin "http://10.16.85.170:8001". Protocols, domains, and ports must match.
```
简而言之，就是不允许跨域访问。

## 2、方式1 - 通过修改domain来实现跨域访问

该方式适合主域相同，而子域不同的场景。此时可以在多个iframe中，通过修改document.domain = '主域' 的方式来实现跨域。

**特定场合适用，不推荐**

## 3、方式2 - 通过 ``window.name`` 跨域访问

该方式原理是通过先请求其他的域的页面，把要传输的值赋值给 ``window.name`` 属性，然后把该iframe的src地址，修改为不跨域的一个页面。此时，由于是同一个iframe，所以name还是之前的数据，通过这样的方式变相的来获取其他域的数据。

示例如下：

在子页面中，仅仅需要把数据赋值给 ``window.name``
```html
// localhost:8003/index.html
...
<body>
  <h1>Page2</h1>
  <script>
    window.name = '我是page2的数据';
  </script>
</body>
...
```

父页面中，需要修改iframe为不跨域，然后获取数据

```html
// localhost:8001/index.html
...
<body>
  <h1>Page1</h1>
  <iframe id="f1" frameborder="5" style="width: 100%;height: 300px"></iframe>
  <script>
    var iframe = document.getElementById('f1');
    var isCrossFrameUrl = true;
    iframe.onload = function(){
      if(isCrossFrameUrl){
        iframe.src = 'about:block;';
        isCrossFrameUrl = false;
        return;
      }
      console.log(iframe.contentWindow.name);
    };   
    iframe.src = 'http://localhost:8003';
  </script>
</body>
...
```

这种方式实现起来，比较别扭，另外只能获取单次数据，并不友好，**不推荐使用**。

## 4、方式3 - 通过 ``navigator`` 对象来跨域(已过期，不能使用了)

该方式利用多个iframe窗口，访问的 ``navigator`` 对象都是同一个，而且并没有跨域问题这个原理；通过在该对象上注册和发送事件的方式来跨域访问。

## 5、通过 ``window.postMessage`` 传递消息

这是IE8+之后正统的iframe跨域解决方案，全称“跨文档消息”，是一个HTML5的新特性。

```javascript
otherWindow.postMessage(message, targetOrigin, [transfer]);
```

其中第一个参数是消息对象，允许JS数据类型，第二个是要发送到的域，可以设置为 ``*`` 表示不限制。

使用如下：

```html
// localhost:8001/index.html
...
<body>
  <h1>Page1</h1>
  <iframe id="f1" src="http://localhost:8003/" frameborder="5" style="width: 100%;height: 300px"></iframe>
  <script>
    window.addEventListener('message', function(evt){
      console.log(evt);
    });
  </script>
</body>
...
```

```html
// localhost:8003/index.html
...
<body>
  <h1>Page2</h1>
  <script>
    parent.postMessage('test', '*');
  </script>
</body>
...
```

打开 ``http://localhost:8001`` 就可以看到父页面已经收到子页面发过来的消息了。

evt对象有几个重要的属性需要我们去了解一下：

1. data // 具体发送的数据
2. origin // 发送者origin（http://localhost:8003）
3. source // 发送者（window对象）

**该方式是当前最合适的跨文档通信方式，如果没有兼容IE6、7的需求，建议全部使用该方式。**