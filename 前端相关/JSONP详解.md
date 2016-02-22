## 0、关于JSONP

### 什么的JSONP
JSONP（JSON with Padding）是资料格式 JSON 的一种“使用模式”，可以让网页从别的网域要资料。另一个解决这个问题的新方法是跨来源资源共享。（参考：[https://zh.wikipedia.org/wiki/JSONP](https://zh.wikipedia.org/wiki/JSONP)）

### JSONP的起源

1. 曾经的Ajax不能跨域请求（现在的也不能，不过有cors）
2. Web上使用script调用js文件不存在跨域问题（实际上，只要拥有src属性的标签都允许跨域，比如script,img,iframe）
3. 那个时候，想要通过web端跨域访问数据，只可以在服务器端设法把数据装进js，然后客户端调用
4. 刚好这个时候JSON大行其道
5. 所以，解决方案就出来，web端像调用脚本一样来跨域请求服务器上动态生成的js文件
6. 为了便于客户端使用数据，逐渐形成了一种非正式传输协议，人们把它称作JSONP。

### JSONP用来做什么

通过JSONP的起源，我们大概也知道了JSONP就是为了跨域资源访问的。

## 1、JSONP实现原理

我们知道，在script标签中请求的js代码，到客户端之后，是能被自动执行的。

我们先构造一个后端（采用node实现）：

	var http = require('http');
	
	var server = http.createServer((req, res) => {
	  var sendObj = {
	    url: req.url,
	    name: 'test'
	  };
	  res.write(`callback(${JSON.stringify(sendObj)})`);
	  res.end();
	});
	
	server.listen(9999, () => {
	  console.log('started.')
	});

我们要使用这个这个数据呢？可以用Ajax，可能会产生跨域问题

另外，可以用如下写法：

	<!DOCTYPE html>
	<html lang="en">
	<head>
	  <meta charset="UTF-8">
	  <title>JSONP TEST</title>
	</head>
	<body>
	  <script>
	  function callback(obj){
	    console.log(obj);
	  }
	  </script>
	  <script src="http://localhost:9999/abc"></script>
	</body>
	</html>

打开这个页面后，我们会看到控制台会输出一个对象``Object {url: "/abc", name: "test"}``,
也就是后端返回的对象。

**当使用script请求地址时，会将返回的字符串，默认当成js解析。由于后端返回是的callback(xxx),所以会调用本地的callback函数。**

**从原理上来看，要使用JSONP，必须要后端返回相应的数据，这个就是JSONP的模式了，允许客户端传递一个callback函数，后端将数据包裹在callback函数中返回。**

**从原理也能看出，JSONP并不要求必须传递JSON格式的数据，只要是JS函数能够认可的数据都是可以传递的**

## 2、封装JSONP调用JSONP

知道了原理，我们很容易能够实现一个jsonp的函数调用，代码如下：

	window.JSONP = function(url, callback){
	  callback = callback || 'callback';
	  var result;
	  return new Promise((resolve, reject) => {
	    var overwritten;
	    var scriptEl = document.createElement('script');
	    scriptEl.src = url + '?callback=' + callback;
	    //加载完成后，删除callback
	    scriptEl.onload = function(){
	      if(overwritten === undefined){
	        delete window[callback];  
	      }else{
	        window[callback] = overwritten;
	      }
	      resolve(result);
	    }
	    //挂载一个callback到window上
	    overwritten = window[callback]; //先保存一个，用完之后再还原
	    window[callback] = function(data){
	      result = data
	    }
	    document.head.appendChild(scriptEl);
	  });
	};

如何用？

	window.JSONP('http://localhost:9999/abc').then((data) => {
	  console.log(data);
	});

## 3、扩展

在jQuery中，我们使用jsonp感觉就和使用ajax没有区别，但实际上它们的底层实现实现是完全不一样的，毕竟原理都不同。

虽然很多库和框架都把jsonp封装到了ajax中，但是一定要记得jsonp不是ajax的一个特例。

当前，除了用jsonp跨域之外，还可以采用服务端代理（通过不跨域的后端程序，发送webClient去请求数据，然后转发），CORS（API服务器允许跨域的一种设置）。
