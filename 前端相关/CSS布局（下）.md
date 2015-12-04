## 1、CSS布局之浮动

### 1.1、float之图文混排

float的意思就是元素漂浮在上层。

可以直接通过设置float属性实现图文混排，代码如下：

	<div style="width:200px;height:200px;border: 1px solid gray;">
	  <img src="" alt="" style="width:100px;height:100px;float:right;"> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus imperdiet, nulla et dictum interdum, nisi lorem egestas odio, vitae scelerisque enim ligula venenatis dolor.
	</div>

<div style="width:200px;height:200px;border: 1px solid gray;">
  <img src="" alt="" style="width:100px;height:100px;float:right;"> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus imperdiet, nulla et dictum interdum, nisi lorem egestas odio, vitae scelerisque enim ligula venenatis dolor.
</div>

### 1.2、float的副作用

当为元素设置float只有，它将会漂浮起来。那么它之后的元素就会忽略它，而进行定位。所以会导致元素重叠：

	<div style="width:50px;height:50px;border:1px solid red;float:left">
	  我是悬浮元素
	</div>
	<div style="width:100px;height:100px;border:1px solid blue;">
	  我是标准div元素内容
	</div>

<div style="width:50px;height:50px;border:1px solid red;float:left">
  我是悬浮元素
</div>
<div style="width:100px;height:100px;border:1px solid blue;">
  我是标准div元素内容
</div>

这个时候，就需要清除浮动(clear:both)，另外，还可以通过clear:left|right来分别清除左右浮动：
	
	<div style="width:50px;height:50px;border:1px solid red;float:left">
	  我是悬浮元素
	</div>
	<div style="width:100px;height:100px;border:1px solid blue;clear:both;">
	  我是标准div元素内容
	</div>

<div style="width:50px;height:50px;border:1px solid red;float:left">
  我是悬浮元素
</div>
<div style="width:100px;height:100px;border:1px solid blue;clear:both;">
  我是标准div元素内容
</div>

### 1.3、奇怪的浮动效果

在内容的浮动元素高度大于外部容器时，效果如下：

	
	<div style="width:100px;border:1px solid blue;">
	  <div style="width:50px;height:150px;border:1px solid red;float:right">
	    我是悬浮元素
	  </div>
	  我是标准div元素内容
	</div>


<div style="width:100px;border:1px solid blue;">
  <div style="width:50px;height:150px;border:1px solid red;float:right">
    我是悬浮元素
  </div>
  我是标准div元素内容
</div>

<div style="clear:both;"></div>
	**如何修复？**

可以通过clearfix样式来修复：

	<style>
	  .clearfix {
	    overflow: auto;
	    zoom: 1;/*针对IE需要额外关照*/
	  }
	</style>
	<div class="clearfix" style="width:100px;border:1px solid blue;">
	  <div style="width:50px;height:150px;border:1px solid red;float:right">
	    我是悬浮元素
	  </div>
	  我是标准div元素内容
	</div>

<style>
  .clearfix {
    overflow: auto;
    zoom: 1;/*针对IE需要额外关照*/
  }
</style>
<div class="clearfix" style="width:100px;border:1px solid blue;">
  <div style="width:50px;height:150px;border:1px solid red;float:right">
    我是悬浮元素
  </div>
  我是标准div元素内容
</div>

## 2、CSS布局之百分比宽度

百分比宽度可以非常容易的实现动态布局，但是当窗口变得很窄的时候，元素的展示可能会错乱。所以需要选择最合适的布局方式。

另外，不能使用min-width来修复这个问题，因为如果是左右结构，对左边的元素设定min-width，右边的元素是不会遵守的，可能会引起重叠。

## 3、CSS布局之媒体查询（Media Query）

“响应式设计（Responsive Design）”是一种让网站针对不同的浏览器和设备“响应”不同显示效果的策略，这样可以让网站在任何情况下显示的很棒！

如果要兼容移动端，请加上如下类似meta

	
	<meta name="viewport" content="width=device-width, maximum-scale=2, minimum-scale=0.5, user-scalable=no">

因为众所周知，手机端的屏幕分辨率相当多，所以可以强制指定屏幕的width是等于设备宽度的，忽略分辨率。
maximum-scale 是指最大缩放比例。

## 4、CSS布局之column

CSS columns是较新的标准，不支持IE9及以下和Opera Mini，所以需要使用浏览器前缀。Column可以很轻松的实现文字的多列布局，示例如下：

	<div style="width:150px;-webkit-column-count:3;-webkit-column-gap: 1em;">
	  CSS布局CSS布局CSS布局CSS布局CSS布局CSS布局CSS布局CSS布局CSS布局CSS布局
	</div>

<div style="width:150px;-webkit-column-count:3;-webkit-column-gap: 1em;">
  CSS布局CSS布局CSS布局CSS布局CSS布局CSS布局CSS布局CSS布局CSS布局CSS布局
</div>

## 5、CSS布局之flexbox

flexbox布局模式被用来重新定义CSS中的布局方式。

	<style>
	  .container{
	    width: 80%;
	    border: 1px solid red;
	    height:50px;
	    display: flex;
	  }
	</style>
	<div class="container">
	  <div style="width:100px;"></div>
	  <div style="flex:3;background:lightgray;">1</div>
	  <div style="flex:5;background:lightyellow;">2</div>
	</div>

<style>
  .container{
    width: 80%;
    border: 1px solid red;
    height:50px;
    display: flex;
  }
</style>
<div class="container">
  <div style="width:100px;"></div>
  <div style="flex:3;background:lightgray;">1</div>
  <div style="flex:5;background:lightyellow;">2</div>
</div>

分析一下以上代码，只需要在容器上设置display:flex，那么内部元素的如果设置了flex样式，那么就会按照flex进行计算，然后实现flex布局。

flex布局，还能实现简单的垂直居中布局。

	<div class="container" style="align-items: center; justify-content: center;">
	  我是垂直居中的元素
	</div>

<div class="container" style="align-items: center; justify-content: center;">
  我是垂直居中的元素
</div>

其中，align-items设置水平居中，justify-content设置了垂直居中。