## 1、HTML篇

#### 1、HTML是一种（）。

A、标记语言  

B、编程语言  

C、自然语言  

D、描述语言
#### 2、HTML的后缀名是（）。

A、 .h 

B、.ht  

C、.htm  

D、.html

#### 3、HTML5新增的元素有（）。

A、 p

B、 ruby

C、 canvas

D、 span

#### 4、HTML5中，使用（）可以播放视频？

A、 audio

B、 mark

C、 video

D、 source

## 2、CSS篇

####5、以下html代码中，用（）可设置Home的颜色的元素。

	<div class="container">
	  <p class="about">
	    <a href="#" id="home-link">Home</a>
	  </p>
	</div>

A、 #home-link{}

B、 .container .about{}

C、 .container > a{}

D、 .about a{}

#### 6、要对Me设置样式，应该使用（）。

	<div>
		<span id="id"></span>
		<span>Me</span>
	</div>

A、 #id > span{}

B、 #id + span{}

C、 #id span{}

D、 #id ~ span{}

#### 7、如果对文本的第一个字符进行设置样式？()

A、 :after{}

B、 :before{}

C、 :first-letter{}

D、 :first-line{}

#### 8、在CSS的border-box盒子模型中，border-width: 2px; width: 100px; padding: 5px; margin: 1px;那么，该元素占用的宽度为（）

A、 100px

B、 102px

C、 108px

D、 116px

#### 9、如何对span设置width？（）

A、 span{width: 100px; display: inline-block;}

B、 span{width: 100px; display: inline;}

C、 span{width: 100px; display: block;}

D、 span{width: 100px;}

#### 10、当position设置为（）时，可以让元素钉在浏览器窗口上，不随滚动条滚动而滚动。

A、 absolute

B、 static

C、 relative

D、 fixed

#### 11、以下哪些是CSS的预处理器（）

A、 Less

B、 Sass

C、 Stylus

D、 Dart

## 3、JavaScript篇

#### 12、以下变量定义不正确的是（）。

A、 var a, var b;

B、 var a = b = 1;

C、 var a, b, c;

D、 var class = 1;

#### 13、假定今天是2015年11月1日，如下代码的输出结果是（）

	new Date().getMonth()

A、 111

B、 10

C、 11

D、 2015

#### 14、当表单填写完毕，鼠标单击提交按钮时，触发的是（）事件

A、onblur

B、onmouseleave

C、onmouseenter

D、onsubmit

#### 15、以下哪些是JavaScript的中间语言？

A、 TypeScript

B、 CoffeeScript

C、 JScript

D、 ActionScript

#### 16、typeof undefined 输出（）

A、 "undefined"

B、 "object"

C、 "null"

D、 Error

#### 17、 typeof Array.prototype 输出 （）

A、 "undefined"

B、 "object"

C、 "null"

D、 Error

#### 18、[undefined == null, NaN == NaN] 输出（）

A、 [true, true]

B、 [false false]

C、 [true, false]

D、 [false, true]

#### 19、以下代码输出（）
	
	(function() {
	  var a = b = 5;
	})();
	console.log(b);

A、 Error

B、 null

C、 undefined

D、 5

#### 20、以下代码输出（）

	function test() {
	  console.log(a);
	  console.log(foo());
	  var a = 1;
	  function foo() {
	    return 2;
	  }
	} 
	test();

A、 1 和 undefined

B、 1 和 2

C、 undefined 和 2

D、 undefined 和 undefined

## 4、编程篇

#### 21、请补全代码

	function sortArr(arr){
	  //Your code here... 
	}
	console.log(sortArr([1, 3, 0, 9, 7])); // Result: [9, 7, 3, 1, 0]

#### 22、请补全代码

	function distinctArr(arr){
	  //Your code here... 
	}
	console.log(distinctArr([1, 5, 7, 3, 7, 5])); // Result: [1, 5, 7, 3]



























附参考答案：

A
CD
BC
C
ABD
BD
C
B
AC
D
ABC
AD
B
D
AB
A
B
C
D
C

21、
function sortArr(arr){
  var arrCopy = arr.slice(0);
  // 使用sort时，需要先复制一次arr，避免修改原本的数组。
  arrCopy.sort(function(a1, a2){
    return a2 - a1;
  });
  return arrCopy;
}

22、
function distinctArr(arr){
  var resultArr = [];
  arr.forEach(function(item, i){
    if(resultArr.indexOf(item) === -1){
      resultArr.push(item);
    }
  });
  return resultArr;
}

function distinctArr(arr){
  var tempArr = arr.filter(function(item, index, inputArray){
      return inputArray.indexOf(item) === index;
   });
  return tempArr;
}