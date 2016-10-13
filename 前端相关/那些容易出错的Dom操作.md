## 0、导言

在用惯了 ``jQuery`` 这种利器之后，回到原生JS的Dom操作，一时间反而感觉有点陌生。

最近在做的项目中，为了尽可能少的引用三方库，所有DOM操作都是用的原生JS来实现的。在这里也分享下在DOM操作中，容易混淆的一些知识点。

原生JS可能会有兼容性问题，以下方法如非特别说明，均在 ``Chrome latest(53), Firefox latest(47), Edge25, IE11`` 中测试通过

## 1、获取视口高度

所谓视口高度，就是在浏览器中，我们可见区域的高度，它不会随着内容的变化而变化，只会跟着浏览器本身的大小变化而变化（工具栏高度也会影响浏览区域的大小）。

先来一段完整的测试代码：

```javascript
window.addEventListener('resize', function(){
  console.log('window.innerWidth:', window.innerWidth, ', window.innerHeight:', window.innerHeight);
  console.log('document.documentElement.clientWidth:', document.documentElement.clientWidth, ', document.documentElement.clientHeight:', document.documentElement.clientHeight);
  console.log('document.body.clientWidth:', document.body.clientWidth, ', document.body.clientHeight:', document.body.clientHeight);
});
```

打开不同的页面（是否有滚动条，页面内容大于视口高度），分析得知：

``window.innerWidth`` 和 ``window.innerHeight`` 是获取浏览器视口的宽高，包含滚动条。

``document.documentElement.clientWidth`` 和 ``document.documentElement.clientHeight`` 是获取浏览器视口的宽高，但不包含滚动条。

``document.body.clientWidth`` 和 ``document.body.clientHeight`` 是获取页面的宽高，不包含滚动条

**通过也根据结果得出：IE、FF、Chrome的滚动条宽度/高度为 ``17px``， Edge25中滚动条宽度/高度为 ``12px``。**

除此之外，还可以通过 ``window.outerWidth`` 和 ``window.outerHeight`` 获取浏览器的宽高，包含工具栏，标题栏等的宽高。

**结论：**

```javascript
let viewHeight = window.innerHeight || document.documentElement.clientHeight;
let viewWidth = window.innerWidth || document.documentElement.clientWidth;
```

## 2、获取iframe内容高度

``iframe`` 本身等价于一个独立的窗口, 所以要获取iframe内容的高度和获取页面内容高度一致。

在获取视口宽度时，我们知道，通过 ``document.body.clientHeight`` 可以获取 ``body`` 的高度，那么还有其他的方式可以获取么？

还是先上一个测试代码：

```javascript
var timerId;
window.addEventListener('resize', function () {
  window.clearTimeout(timerId);
  timerId = setTimeout(function () {
    console.log('document.documentElement.clientHeight:', document.documentElement.clientHeight);
    console.log('document.documentElement.offsetHeight:', document.documentElement.offsetHeight);
    console.log('document.documentElement.scrollHeight:', document.documentElement.scrollHeight);
    console.log('document.body.clientHeight:', document.body.clientHeight);
    console.log('document.body.offsetHeight:', document.body.offsetHeight);
    console.log('document.body.scrollHeight:', document.body.scrollHeight);
  }, 200);
});
```

这个测试的结果如下：

```javascript
// Chrome
documentElement.offsetHeight = documentElement.scrollHeight = body.scrollHeight
body.offsetHeight = body.clientHeight
documentElement.offsetHeight > body.offsetHeight (大24px)

// Firefox
documentElement.offsetHeight = documentElement.scrollHeight
body.scrollHeight = body.offsetHeight = body.clientHeight
documentElement.offsetHeight > body.offsetHeight (大24px)

// Edge25
documentElement.offsetHeight = body.scrollHeight > documentElement.scrollHeight (大1px)
body.clientHeight = body.offsetHeight
documentElement.offsetHeight > body.clientHeight (大24px)

// IE11
documentElement.offsetHeight = documentElement.scrollHeight
body.scrollHeight = body.offsetHeight = body.clientHeight
documentElement.offsetHeight > body.offsetHeight (大24px)
```

根据以上结果，暂时还无法得出结论，所以我们接着测试：

**测试一：设置body的margin:0**

以上四个都有大24px，先来分析下这个是怎么来的。

初步分析是由于 ``body`` 默认的 ``margin: 8px`` 导致的，当设置body的 ``margin: 0`` 之后，这个差距变成了 ``16px``。

**Edge25比较特殊，相关数据变成了：**

```javascript
documentElement.offsetHeight = documentElement.scrollHeight < body.scrollHeight （小1px）
body.clientHeight = body.offsetHeight
documentElement.offsetHeight > body.clientHeight (大16px)
```

**测试二：给body设置固定高度**

此时，我们给body设定一个固定高度，得出以下结果：

```javascript
documentElement.offsetHeight = body.clientHeight = body.offsetHeight = 我们设定的高度
```

**测试三：增加超高的 absolute 元素**

当absolute元素高度不超过整个页面高度时，无影响。

当absolute元素高度超过整个页面高度时，结果如下：

```javascript
// Chrome
body.scrollHeight = 设定的absolute元素高度

// Firefox, IE11
documentElement.scrollHeight = 设定的absolute元素高度

// Edge25
documentElement.scrollHeight = body.scrollHeight = 设定的absolute元素高度
```

综合以上测试，在这里得出一个获取页面高度的代码如下：

```javascript

let pageHeight = Math.max(documentElement.scrollHeight, body.scrollHeight);

```

**注意，以上方案并不具有通用性，还需根据自己的场景来灵活选择。**

## 3、URL编码

我们在浏览器中进行URL编码一般有两个方法，``encodeURI`` 和 ``encodeURIComponent``，那它们之间有啥区别呢？

不多说，先来段代码就知道了：

```javascript
let str = '_- key fda';

console.log(encodeURI(str)); //_-%20key%20fda
console.log(encodeURIComponent(str)); //_-%20key%20fda

str = 'https://www.google.com/search?q=Path+must+be+a+string.+Received+null&oq=Path';
console.log(encodeURI(str)); //https://www.google.com/search?q=Path+must+be+a+string.+Received+null&oq=Path
console.log(encodeURIComponent(str)); //https%3A%2F%2Fwww.google.com%2Fsearch%3Fq%3DPath%2Bmust%2Bbe%2Ba%2Bstring.%2BReceived%2Bnull%26oq%3DPath
```

由此可以看出，当str是简单的非url字符串时，两者并没有差异。但当我们要对一个完整的URL进行编码的时候，就需要使用 ``encodeURIComponent`` 。

## 4、新Tab打开链接实现

一般做法是模拟一个 ``a`` 标签，然后打开，代码如下：

```javascript
var a = document.createElement('a');
a.setAttribute('href', url);
a.setAttribute('target', '_blank');
// 以下两行为兼容IE9而实现，IE9要求必须在body中的a才可以跳转
a.style.display = 'none';
document.body.appendChild(a);

a.click();
document.body.removeChild(a);
```

## 5、设置iframe内容

如果设置局部内容，直接获取 ``contentDocument`` 就可以做到，那如果要填充一个完整的HTML文档，该如何做呢？

```javascript
// 找到document
let fd = document.getElementById('previewFrame').contentDocument;
fd.open(); // 打开输入流
fd.write('');
fd.write(fullHtml); // 写入完整的HTML内容
fd.close(); // 关闭输入流
```

## 6、获取滚动高度

老规矩，先来段测试代码：

```javascript
var timerId;
window.addEventListener('scroll', function () {
  window.clearTimeout(timerId);
  timerId = setTimeout(function () {
    console.log('document.documentElement.scrollTop:', document.documentElement.scrollTop);
    console.log('document.body.scrollTop:', document.body.scrollTop);
  }, 200);
});
```

通过在浏览器中测试，得到以下结果：

```javascript
// Chrome and Edge
documentElement.scrollTop 始终等于 0
document.body.scrollTop 是真实的滚动高度

// Firefox and IE11
documentElement.scrollTop 是真实的滚动高度
document.body.scrollTop 始终为0
```

因此当我们要计算滚动高度的时候，可以采用如下代码：

```javascript
let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
```

## 7、获取屏幕大小

这个就比较简单了，代码如下：

```javascript
// 屏幕宽度
screen.width

// 屏幕高度 
screen.height
```