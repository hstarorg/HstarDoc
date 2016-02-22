## 0、导言

在给网站编写 JavaScript 代码时，也有很多可用的 API。 [WEB API 参考](https://developer.mozilla.org/zh-CN/docs/Web/API)。

## 1、FileReader

使用FileReader对象,web应用程序可以异步的读取存储在用户计算机上的文件(或者原始数据缓冲)内容。兼容IE10+，FF和Chrome。Safari和Opera不支持。


## 2、如何读取文件？

	var readFile = function(file, callback) {
	  var fileReader = new FileReader(); //实例化FileReader
	  fileReader.onloadend = function() { //加载完成后执行
	    var result = null; 
	    if (fileReader.readyState === FileReader.DONE) { //判断操作是否完成
	      result = fileReader.result; //获取结果
	    }
	    if (callback) {
	      callback(result);
	    }
	  };
	  fileReader.readAsBinaryString(file); //以二进制的方式读取文件
	};

调用的话，就可以通过如下代码调用

	readFile(file, function(result){
	  // do something
	});

其中file既可以是blob对象也可以是一个File对象。一般我们常用的是File对象，如何来获取一个简单的File对象呢？

	<input type="file" id="file_input">

JS:

	var fileEl = document.getElementById('#file_input');
	var file = fileEl.files[0]; //files是数组对象

## 3、FileReader API

### 方法

1. void abort(); 
2. void readAsArrayBuffer(in Blob blob);
3. void readAsBinaryString(in Blob blob);
4. void readAsDataURL(in Blob blob);
5. void readAsText(in Blob blob, [optional] in DOMString encoding);

其中1是终止读取操作，2~4是将数据读取为不同的格式。

### 状态常量

1. EMPTY 还没有加载任何数据
2. LOADING 数据正在被加载
3. DONE 已完成全部的读取请求

### 属性（属性全部都是只读的）

1. error 读取文件时发生的错误
2. readyState FileReader对象的当前状态
3. result 读取到的文件内容

## 4、用途

1. 客户端校验文件内容
2. 预览图片
3. 客户端导出

## 5、参考文档

1. [MDN - Blob](https://developer.mozilla.org/zh-CN/docs/Web/API/Blob)
2. [MDN - FileReader](https://developer.mozilla.org/zh-CN/docs/Web/API/FileReader)

## 6、后续补充

### 2016-2-17日追加

FileReader的API方法readAsBinaryString在IE11中无法使用，为了兼容IE11，我们需要使用另外的API或者使用猴子补丁的方式实现该API。

参考[http://stackoverflow.com/questions/31391207/javascript-readasbinarystring-function-on-e11](http://stackoverflow.com/questions/31391207/javascript-readasbinarystring-function-on-e11)

补丁代码如下：

```javascript
if(!FileReader.prototype.readAsBinaryString){
   FileReader.prototype.readAsBinaryString = function (blob) {
     var binary = '';
     var self = this;
     var reader = new FileReader();
     reader.onload = function(e){
       var bytes = new Uint8Array(reader.result); 
       var length = bytes.byteLength;
       for (var i = 0; i < length; i++) {
         binary += String.fromCharCode(bytes[i]);
       }
       self.result = binary;
       $(pt).trigger('onload');
     };
     reader.readAsArrayBuffer(blob);
   }
}
```