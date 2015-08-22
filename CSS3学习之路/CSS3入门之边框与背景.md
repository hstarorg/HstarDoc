## 1、前言

CSS3作为CSS的最新版本，在展示效果上有非常大的提升，接下来，我们就一起领略一下CSS3的风采吧。

## 2、CSS3边框

<style>
    div{
      width: 200px;
      height: 100px;
      border: 1px solid black;
      margin: 10px 0; 
    }
</style>

### 2.1、border-radius(用于设置圆角边框)

在CSS2时代，要想实现圆角边框，是一件非常麻烦的事情。一种实现方式是使用一个背景图片，为了实现伸缩效果，还需要至少3张图片拼凑，相当麻烦。另外一种实现方式是使用多个div重叠来实现圆角。

在CSS3中，有一个非常简单的属性，那就是border-radius。

语法： ``border-radius: 1-4 length|% / 1-4 length|%;``

	border-radius: 10px;
	//等价于
	border-top-left-radius:10px;
	border-top-right-radius:10px;
	border-bottom-right-radius:10px;
	border-bottom-left-radius:10px;

---

	<div style="border-radius:10px;">
    	演示圆角边框
 	</div>

<div style="border-radius:10px;">
    演示圆角边框
</div>

**兼容性说明：** IE9+，Chrome,FF,Safari,Oprea

	div
	{
		border:2px solid;
		border-radius:25px;
		-moz-border-radius:25px; /* Old Firefox */
	}

### 2.2、box-shadow(用于添加边框阴影)

语法： ``box-shadow: h-shadow v-shadow blur spread color inset;``,其中h-shadow和v-shadow是必须设置，允许负值。【参数说明：水平阴影的位置，垂直阴影的位置，模糊距离，阴影的尺寸，阴影的颜色，外部引用(outset)改为内部阴影】

	<div style="border-radius:10px; border: 1px solid red;">
	    演示圆角边框
	</div>
<div style="box-shadow: 2px 2px red;">
	简单阴影
</div>
	<div style="box-shadow: -2px -2px red;">
		简单阴影
	</div>
<div style="box-shadow: -2px -2px red;">
	简单阴影
</div>
	<div style="box-shadow: -2px -2px 10px red;">
		带模糊效果的阴影
	</div>
<div style="box-shadow: -2px -2px 10px red;">
    带模糊效果的阴影
</div>
	<div style="box-shadow: 2px 2px 10px 10px red;">
		带模糊效果指定尺寸的阴影
	</div>
<div style="box-shadow: 2px 2px 10px 10px red;">
	带模糊效果指定尺寸的阴影
</div>
	<div style="box-shadow: 2px 2px 10px 10px red inset;">
		内部阴影
	</div>
<div style="box-shadow: 2px 2px 10px 10px red inset;">
    内部阴影
</div>


**兼容性说明：** IE9+，Chrome,FF,Safari,Oprea

### 2.3、border-image(CSS3边框图片)

border-image是简写属性，全部是：

	border-image-source  //背景图片源
	border-image-slice  //图片边框内偏移
	border-image-width  //图片边框的宽度
	border-image-outset  //边框图像区域超出边框的量
	border-image-repeat  //边框是否适应平铺(repeated)、铺满(rounded)、拉伸(stretched)

---
	<div style="border-width:10px;border-image: url(http://www.w3school.com.cn/i/border.png) 10 10 round;">
		简单图片边框
	</div>
<div style="border-width:10px;border-image: url(http://www.w3school.com.cn/i/border.png) 10 10 round">
	简单图片边框
</div>
	<div style="border-width:10px;border-image: url(http://www.w3school.com.cn/i/border.png) 10 10 50 round">
		完全设置的图片边框
	</div>
<div style="border-width:10px;border-image: url(http://www.w3school.com.cn/i/border.png) 10 10 50 round">
完全设置的图片边框
</div>

**兼容性说明：** Chrome,FF,Safari,Oprea

	div
	{
		border-image:url(border.png) 30 30 round;
		-moz-border-image:url(border.png) 30 30 round; /* 老的 Firefox */
		-webkit-border-image:url(border.png) 30 30 round; /* Safari 和 Chrome */
		-o-border-image:url(border.png) 30 30 round; /* Opera */
	}

## 3、CSS3背景

### 整体兼容性

以下CSS背景的特性，全部支持IE9+,FF,Chrome,Safari,Oprea

### 3.1、background-size(用于规定背景图片的尺寸)

在以前的CSS中，背景图片的大小，是由图片本身的大小决定的。在CSS3中，有一个简单的CSS样式可以设置背景图片的大小，允许我们在不同的环境中重复使用背景图片。可以以像素或百分比规定尺寸。

	<div style="
		background-image:url(http://www.w3school.com.cn/i/bg_flower_small.gif);
		background-size: 50% 70%;
		background-repeat:no-repeat;">
	</div>

<div style="background-image:url(http://www.w3school.com.cn/i/bg_flower_small.gif);background-size: 50% 70%;background-repeat:no-repeat;">
	简单设置背景图大小
</div>

### 3.2、background-origin(规定背景图片的定位区域)

盒子模型示意图：
<img src="http://www.w3school.com.cn/i/background-origin.gif" alt="box" />

background-origin属性则可以设置背景图片放置于哪个区域上（content-box,padding-box,border-box）

	<div style="width:66px;height:125px;
	background-image:url(http://www.w3school.com.cn/i/bg_flower_small.gif);
	background-origin:content-box; 
	padding: 20px;border:20px solid red;"></div>

<div style="width:66px;height:125px;background-image:url(http://www.w3school.com.cn/i/bg_flower_small.gif);background-origin:content-box; padding: 20px;border:20px solid red;"></div>
	
	<div style="width:66px;height:125px;
	background-image:url(http://www.w3school.com.cn/i/bg_flower_small.gif);
	background-origin:border-box; 
	padding: 20px;border:20px solid red;"></div>

<div style="width:66px;height:125px;background-image:url(http://www.w3school.com.cn/i/bg_flower_small.gif);background-origin:border-box; padding: 20px;border:20px solid red;"></div>

	<div style="width:66px;height:125px;
	background-image:url(http://www.w3school.com.cn/i/bg_flower_small.gif);
	background-origin:padding-box;
	padding: 20px;border:20px solid red;"></div>

<div style="width:66px;height:125px;background-image:url(http://www.w3school.com.cn/i/bg_flower_small.gif);background-origin:padding-box; padding: 20px;border:20px solid red;"></div>

### 3.3、多重背景

可以针对标签设置多个背景，用法如下：

	body
	{ 
		background-image:url(bg_flower.gif),url(bg_flower_2.gif);
	}