## 0、什么是RPC

**RPC**（Remote Procedure Call - 远程过程调用）,是通过网络从远程计算机上请求服务，而不需要了解底层网路技术的细节。简单点说，就是**像调用本地服务（方法）一样调用远端的服务（方法）。**

### RPC与REST的区别

RPC是一种协议，REST是一种架构风格。

RPC以行为为中心，REST以资源为中心。当加入新功能时，RPC需要增加更多的行为，并进行调用。REST的话，调用方法基本不变。

RPC可以不基于HTTP协议，因此在后端语言调用中，可以采用RPC获得更好的性能。REST一般是基于HTTP协议。

## 1、RPC框架Thrift（0.9.3）

Thrift是一种开源的高效的、支持多种编程语言的远程服务调用框架。支持C++, Java, Python, PHP, Ruby, Erlang, Perl, Haskell, C#, Cocoa, JavaScript, Node.js, Smalltalk, OCaml 和 Delphi等诸多语言，能够很好的进行跨语言调用。

Thrift官网： [https://thrift.apache.org/](https://thrift.apache.org/)

## 2、Thrift的简单实践（Windows）

### 2.1 安装Thrift

在[http://www.apache.org/dyn/closer.cgi?path=/thrift/0.9.3/thrift-0.9.3.exe](http://www.apache.org/dyn/closer.cgi?path=/thrift/0.9.3/thrift-0.9.3.exe)这里可以下载Thrift的windows系统编译版本。

该文件是一个绿色文件，可以放置在目录中，进入该目录的cmd，就可以直接使用thrift。输入``thrift -version``可以查看当前Thrift的版本。

![img1](http://7xit2j.com1.z0.glb.clouddn.com/abc1.png)

至此，Thrift已完成安装

### 2.2 编写接口定义文件

在安装好Thrift之后，需要我们编写接口定义文件，用来约定服务和thrift类型的接口定义。

Thrift主要有一下这些类型：

1. bool     --简单类型，true or false
2. byte     --简单类型，单字符
3. i16      --简单类型，16位整数
4. i32      --简单类型，32位整数
5. i64      --简单类型，64位整数
6. double   --简单类型，双精度浮点型
7. string   --简单类型，utf-8编码字符串
8. binary   --二进制，未编码的字符序列
9. struct	--结构体，对应结构体、类等对象类型
10. list    --list容器
11. set     --set容器
12. map     --map容器
13. enum    --枚举类型

接下来，利用这些类型，编写一个简单的.thrift接口定义文件。

	/* 1.thrift file content */
	namespace js ThriftTest
	namespace csharp ThriftTest
	
	service ThriftTest{
	  double plus(1:double num1, 2:double num2)
	}

更复杂的案例： [https://git-wip-us.apache.org/repos/asf?p=thrift.git;a=blob_plain;f=test/ThriftTest.thrift;hb=HEAD](https://git-wip-us.apache.org/repos/asf?p=thrift.git;a=blob_plain;f=test/ThriftTest.thrift;hb=HEAD)

在利用``thrift --gen js:node --gen js 1.thrift``来生成好客户端代码和服务端代码。可以跟多个--gen <language>参数，来实现一次性生成多个语言的代码。


### 2.3 利用Thrift实现nodeJS服务端

	var thrift = require('thrift');
	
	var ThriftTest = require("./gen-nodejs/ThriftTest");
	var ttypes = require("./gen-nodejs/1_types");
	
	
	var nodeServer = thrift.createServer(ThriftTest, {
	  //完成具体的事情
	  plus: function(n1, n2, callback){
	    console.log(`server request, n1 = ${n1}, n2 = ${n2}.`);
	    callback(null, n1 + n2);
	  }
	});
	
	//处理错误，假设不处理，如果客户端强制断开连接，会导致后端程序挂掉
	nodeServer.on('error', function(err){
	  console.log(err);
	});
	
	nodeServer.listen(7410);
	console.log('node server started... port: 7410');
	
	//如果client的浏览器，通信采用http的时候，需要创建http server
	var httpServer = thrift.createWebServer({
	  cors: {'*': true}, //配置跨域访问
	  services: {
	    '/thrift': { //配置路径映射
	      transport: thrift.TBufferedTransport,
	      protocol: thrift.TJSONProtocol,
	      processor: ThriftTest,
	      handler: { //具体的处理对象
	        plus: function(n1, n2, callback) {
	          console.log(`http request, n1 = ${n1}, n2 = ${n2}.`);
	          callback(null, n1 + n2);
	        }
	      }
	    }
	  }
	});
	
	httpServer.on('error', function(err) {
	  console.log(err);
	});
	
	httpServer.listen(7411);
	console.log('http server started... port: 7411');

### 2.4 Node Client 调用

	var thrift = require('thrift');
	var ThriftTest = require('./gen-nodejs/ThriftTest');
	var ttypes = require('./gen-nodejs/1_types');
	
	transport = thrift.TBufferedTransport()
	protocol = thrift.TBinaryProtocol()
	
	var connection = thrift.createConnection("localhost", 7410, {
	  transport : transport,
	  protocol : protocol
	});
	
	connection.on('error', function(err) {
	  console.log(false, err);
	});
	
	var client = thrift.createClient(ThriftTest, connection);
	
	var sum = client.plus(1, 1, function(err, result){
	  //connection.end(); //如果不关闭连接，那么强制断开连接，将会导致后端出现error
	  if(err){
	    console.log(err);
	    return;
	  }
	  console.log(result);
	});

### 2.5、Http Client 调用

	<!DOCTYPE html>
	<html lang="en">
	<head>
	  <meta charset="UTF-8">
	  <title>Thrift Test Client</title>
	</head>
	<body>
	  <input type="text" id="num1"> + <input type="text" id="num2"> <button onclick="call()">=</button> <span id="result">?</span>
	 <!--  <script src="jquery.js"></script> -->
	  <script src="thrift.js"></script>
	  <script src="gen-js/1_types.js"></script>
	  <script src="gen-js/ThriftTest.js"></script>
	  <script>
	    var transport = new Thrift.Transport("http://127.0.0.1:7411/thrift");
	    var protocol = new Thrift.TJSONProtocol(transport);
	    var client = new ThriftTest.ThriftTestClient(protocol);
	    var el_result = document.getElementById('result');
	    function call(){
	      var num1 = +document.getElementById('num1').value,
	      num2 = +document.getElementById('num2').value;
	      client.plus(num1, num2, function(result) {
	        el_result.innerText = result;
	        alert('调用成功！');
	      });
	    }
	  </script>
	  <script>
	  </script>
	</body>
	</html>

**注意：如果在thrift生成代码时，使用了--gen js:jquery参数，那么在浏览器调用的时候，就必须依赖jquery。**

## 3、demo地址

[https://github.com/hstarorg/HstarDemoProject/tree/master/thrift_demo](https://github.com/hstarorg/HstarDemoProject/tree/master/thrift_demo)