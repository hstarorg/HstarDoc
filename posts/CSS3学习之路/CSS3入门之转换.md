## 1、CSS3 转换

### 1.1、转换是什么，能实现哪些效果？

转换是使元素改变形状、尺寸和位置的一种效果，主要能实现的效果如下：

1. 移动
2. 缩放
3. 转动
4. 拉长
5. 拉伸

### 1.2、浏览器兼容

CSS3的转换属性为 ``transform`` ，IE10+,Firefox,Chrome,Opera,Safari等现代浏览器支持transform属性，IE9需要-ms-前缀。

## 2、 2D 转换

准备工作：

	<style>
	  .container{
	    position:relative;border:1px solid red; width: 100px; height: 100px;
	  }
	  .container>div{
	    width: 50px; height: 50px; background: gray;
	  }
	</style>
<style>
  .container{
    position:relative;border:1px solid red; width: 100px; height: 100px;
  }
  .container div{
    width: 50px; height: 50px; background: gray;
  }
</style>

### 2.1、translate() -- 移动

translate(/\*x坐标移动位移\*/ left, /\*y坐标移动位移\*/ top)

	<h3>右移20px</h3>
    <div class="container">
      <div style="transform: translate(20px);"></div>
    </div>
    <h3>下移20px</h3>
    <div class="container">
      <div style="transform: translate(0px,20px);"></div>
    </div>
    <h3>左移20px，下移20px</h3>
    <div class="container">
      <div style="transform: translate(-20px,20px);"></div>
    </div>

<h3>右移20px</h3>
<div class="container">
  <div style="transform: translate(20px);"></div>
</div>
<h3>下移20px</h3>
<div class="container">
  <div style="transform: translate(0px,20px);"></div>
</div>
<h3>左移20px，下移20px</h3>
<div class="container">
  <div style="transform: translate(-20px,20px);"></div>
</div>

### 2.2、rotate() -- 旋转

rotate(/\*旋转角度\*/ deg)

	<h3>旋转135度</h3>
	<div class="container">
	  <div style="transform: rotate(135deg);"></div>
	</div>

<h3>旋转135度</h3>
<div class="container">
  <div style="transform: rotate(135deg);"></div>
</div>

### 2.3、scale() -- 缩放

scale(/\*宽度缩放比例\*/ widthScale, /\*高度缩放比例\*/ heightScale)

	<h3>缩放到0.5倍</h3>
	<div class="container">
	  <div style="transform: scale(0.5, 0.5);"></div>
	</div>
	<h3>宽度缩放到1.5倍，高度缩放到0.25倍</h3>
	<div class="container">
	  <div style="transform: scale(1.5, 0.25);"></div>
	</div>

<h3>缩放到0.5倍</h3>
<div class="container">
  <div style="transform: scale(0.5, 0.5);"></div>
</div>
<h3>宽度缩放到1.5倍，高度缩放到0.25倍</h3>
<div class="container">
  <div style="transform: scale(1.5, 0.25);"></div>
</div>

### 2.4、skew() -- 倾斜

skew(/\*X轴倾斜角度\*/ xDeg, /\*Y轴倾斜角度\*/ yDeg)

	<h3>X轴翻转30度</h3>
	<div class="container">
	  <div style="transform: skew(30deg);"></div>
	</div>
	<h3>X轴翻转30度，Y轴翻转10度</h3>
	<div class="container">
	  <div style="transform: skew(30deg, 10deg)"></div>
	</div>

<h3>X轴翻转30度</h3>
<div class="container">
  <div style="transform: skew(30deg);"></div>
</div>
<h3>X轴翻转30度，Y轴翻转10度</h3>
<div class="container">
  <div style="transform: skew(30deg, 10deg)"></div>
</div>

### 2.5、matrix() --矩阵

	<h3>旋转30度</h3>
	<div class="container">
	  <div style="transform: matrix(0.866,0.5,-0.5,0.866,0,0)"></div>
	</div>

<h3>旋转30度</h3>
<div class="container">
  <div style="transform: matrix(0.866,0.5,-0.5,0.866,0,0)"></div>
</div>


### 2.6 Transform方法

<table class="dataintable">
<tbody><tr>
<th style="width:25%;">函数</th>
<th>描述</th>
</tr>

<tr>
<td>matrix(<i>n</i>,<i>n</i>,<i>n</i>,<i>n</i>,<i>n</i>,<i>n</i>)</td>
<td>定义 2D 转换，使用六个值的矩阵。</td>
</tr>

<tr>
<td>translate(<i>x</i>,<i>y</i>)</td>
<td>定义 2D 转换，沿着 X 和 Y 轴移动元素。</td>
</tr>

<tr>
<td>translateX(<i>n</i>)</td>
<td>定义 2D 转换，沿着 X 轴移动元素。</td>
</tr>

<tr>
<td>translateY(<i>n</i>)</td>
<td>定义 2D 转换，沿着 Y 轴移动元素。</td>
</tr>

<tr>
<td>scale(<i>x</i>,<i>y</i>)</td>
<td>定义 2D 缩放转换，改变元素的宽度和高度。</td>
</tr>

<tr>
<td>scaleX(<i>n</i>)</td>
<td>定义 2D 缩放转换，改变元素的宽度。</td>
</tr>

<tr>
<td>scaleY(<i>n</i>)</td>
<td>定义 2D 缩放转换，改变元素的高度。</td>
</tr>

<tr>
<td>rotate(<i>angle</i>)</td>
<td>定义 2D 旋转，在参数中规定角度。</td>
</tr>

<tr>
<td>skew(<i>x-angle</i>,<i>y-angle</i>)</td>
<td>定义 2D 倾斜转换，沿着 X 和 Y 轴。</td>
</tr>

<tr>
<td>skewX(<i>angle</i>)</td>
<td>定义 2D 倾斜转换，沿着 X 轴。</td>
</tr>

<tr>
<td>skewY(<i>angle</i>)</td>
<td>定义 2D 倾斜转换，沿着 Y 轴。</td>
</tr>
</tbody></table>


## 3、3D 转换

### 3.1、rotateX、rotateY

	<div class="container">
	  <div style="transform: rotateY(0deg)" id="fun2"></div>
	</div>
	<script>  
	function fun2 (element) {
	  var i = 0;
	  var interval = setInterval(function(){
	    element.style.transform = 'rotateY(' + i + 'deg)';
	    i++;
	  }, 5);
	}
	fun2(document.getElementById('fun2'));
	</script>
<div class="container">
  <div style="transform: rotateY(0deg)" id="fun2"></div>
</div>
<script>  
function fun2 (element) {
  var i = 0;
  var interval = setInterval(function(){
    element.style.transform = 'rotateY(' + i + 'deg)';
    i++;
  }, 5);
}
fun2(document.getElementById('fun2'));
</script>

### 3.2、Transform方法

<table class="dataintable">
<tbody><tr>
<th style="width:25%;">函数</th>
<th>描述</th>
</tr>

<tr>
<td>matrix3d(<i>n</i>,<i>n</i>,<i>n</i>,<i>n</i>,<i>n</i>,<i>n</i>,<br><i>n</i>,<i>n</i>,<i>n</i>,<i>n</i>,<i>n</i>,<i>n</i>,<i>n</i>,<i>n</i>,<i>n</i>,<i>n</i>)</td>
<td>定义 3D 转换，使用 16 个值的 4x4 矩阵。</td>
</tr>

<tr>
<td>translate3d(<i>x</i>,<i>y</i>,<i>z</i>)</td>
<td>定义 3D 转化。</td>
</tr>

<tr>
<td>translateX(<i>x</i>)</td>
<td>定义 3D 转化，仅使用用于 X 轴的值。</td>
</tr>

<tr>
<td>translateY(<i>y</i>)</td>
<td>定义 3D 转化，仅使用用于 Y 轴的值。</td>
</tr>

<tr>
<td>translateZ(<i>z</i>)</td>
<td>定义 3D 转化，仅使用用于 Z 轴的值。</td>
</tr>

<tr>
<td>scale3d(<i>x</i>,<i>y</i>,<i>z</i>)</td>
<td>定义 3D 缩放转换。</td>
</tr>

<tr>
<td>scaleX(<i>x</i>)</td>
<td>定义 3D 缩放转换，通过给定一个 X 轴的值。</td>
</tr>

<tr>
<td>scaleY(<i>y</i>)</td>
<td>定义 3D 缩放转换，通过给定一个 Y 轴的值。</td>
</tr>

<tr>
<td>scaleZ(<i>z</i>)</td>
<td>定义 3D 缩放转换，通过给定一个 Z 轴的值。</td>
</tr>

<tr>
<td>rotate3d(<i>x</i>,<i>y</i>,<i>z</i>,<i>angle</i>)</td>
<td>定义 3D 旋转。</td>
</tr>

<tr>
<td>rotateX(<i>angle</i>)</td>
<td>定义沿 X 轴的 3D 旋转。</td>
</tr>

<tr>
<td>rotateY(<i>angle</i>)</td>
<td>定义沿 Y 轴的 3D 旋转。</td>
</tr>

<tr>
<td>rotateZ(<i>angle</i>)</td>
<td>定义沿 Z 轴的 3D 旋转。</td>
</tr>

<tr>
<td>perspective(<i>n</i>)</td>
<td>定义 3D 转换元素的透视视图。</td>
</tr>
</tbody></table>