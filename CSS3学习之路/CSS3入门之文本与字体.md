## 1、CSS3文本效果

### 1.1、text-shadow文本阴影

语法：``text-shadow: h-shadow v-shadow blur color;``(<水平阴影>，<垂直阴影>，[模糊距离]，[阴影颜色])

示例：

	<h1 style="text-shadow: 5px 5px 2px green;">我是文本阴影</h1>
	<h1 style="text-shadow: 0 0 5px blue;">我是文本阴影</h1>
	<h1 style="text-shadow: 2px 2px 4px #000000;color: white;">我是文本阴影</h1>

<h1 style="text-shadow: 5px 5px 2px green;">我是文本阴影</h1>

<h1 style="text-shadow: 0 0 5px blue;">我是文本阴影</h1>

<h1 style="text-shadow: 2px 2px 4px #000000;color: white;">我是文本阴影</h1>

**该属性兼容IE10+以及所有现代浏览器**

### 1.2、word-break文本换行

语法： ``word-break: normal|break-all|keep-all;``

normal:默认换行；break-all:允许在单词内换行；keep-all:只能在半角空格或连字符处换行

示例：

	<div style="width:100px;word-break:break-all;">Nice to meet you. good mor-ning.</div>
	<div style="width:100px;word-break:keep-all;">Nice to meet you. good mor-ning.</div>

<div style="width:100px;word-break:break-all;">Nice to meet you. good mor-ning.</div>
<div style="width:100px;word-break:keep-all;">Nice to meet you. good mor-ning.</div>

### 1.3、text-overflow修剪文本

语法：``text-overflow: clip|ellipsis|string;``

示例：

	<div style="width: 100px; overflow:hidden; white-space:nowrap;text-overflow: clip;">Nice to meet you. good mor-ning.</div>
	<div style="width: 100px; overflow:hidden; white-space:nowrap;text-overflow: ellipsis;">Nice to meet you. good mor-ning.</div>

<div style="width: 100px; overflow:hidden; white-space:nowrap;text-overflow: clip;">Nice to meet you. good mor-ning.</div>
<div style="width: 100px; overflow:hidden; white-space:nowrap;text-overflow: ellipsis;">Nice to meet you. good mor-ning.</div>

**注意：使用text-overflow的时候，需要与overflow:hidden;white-space:nowrap;协同使用**

## 2、CSS3字体

在CSS3之前，必须使用已经在用户计算机上安装好的字体，给Web设计带来很大的局限性。现在，通过CSS3,Web设计师可以使用他们喜欢的任意字体。

### 2.1、@font-face引入网络字体

Firefox、Chrome、Safari 以及 Opera 支持 .ttf (True Type Fonts) 和 .otf (OpenType Fonts) 类型的字体。

Internet Explorer 9+ 支持新的 @font-face 规则，但是仅支持 .eot 类型的字体 (Embedded OpenType)。

不兼容IE8，IE8-。

示例：

	<style>
		@font-face {
			font-family: SentyPaperCut;
			src:url(http://hstarcdn.github.io/fonts/SentyPaperCut.ttf);
		}
		@font-face {
			font-family:SentyCreamPuff;
			src:url(http://hstarcdn.github.io/fonts/SentyCreamPuff.otf);
		}
		.font1,.font2{
		  font-size: 50px;
		}
		.font1{
		  color: red;
		  font-family: SentyTEA-Platinum;
		}
		.font2{
		  color: blue;
		  font-family: SentyCreamPuff;
		}
	</style>

	<span class="font1">
	  自定义字体演示
	</span>
	<span class="font2">
	  自定义字体演示
	</span>

<style>
	@font-face {
		font-family: SentyTEA-Platinum;
		src:url(http://hstarcdn.github.io/fonts/SentyTEA-Platinum.ttf);
	}
	@font-face {
		font-family:SentyCreamPuff;
		src:url(http://hstarcdn.github.io/fonts/SentyCreamPuff.otf);
	}
	.font1,.font2{
	  font-size: 50px;
	}
	.font1{
	  color: red;
	  font-family: SentyTEA-Platinum;
	}
	.font2{
	  color: blue;
	  font-family: SentyCreamPuff;
	}
</style>

<span class="font1">
  自定义字体演示
</span>
<span class="font2">
  自定义字体演示
</span>

除此之外，在@font-face中，还可以设置多种字体描述符，如：

<table class="dataintable">
<tbody><tr>
<th style="width:20%;">描述符</th>
<th style="width:25%;">值</th>
<th>描述</th>
</tr>

<tr>
<td>font-family</td>
<td><i>name</i></td>
<td>必需。规定字体的名称。</td>
</tr>

<tr>
<td>src</td>
<td><i>URL</i></td>
<td>必需。定义字体文件的 URL。</td>
</tr>

<tr>
<td>font-stretch</td>
<td>
	<ul>
	<li>normal</li>
	<li>condensed</li>
	<li>ultra-condensed</li>
	<li>extra-condensed</li>
	<li>semi-condensed</li>
	<li>expanded</li>
	<li>semi-expanded</li>
	<li>extra-expanded</li>
	<li>ultra-expanded</li>
	</ul>
</td>
<td>可选。定义如何拉伸字体。默认是 "normal"。</td>
</tr>

<tr>
<td>font-style</td>
<td>
	<ul>
	<li>ormal</li>
	<li>italic</li>
	<li>oblique</li>
	</ul>
</td>
<td>可选。定义字体的样式。默认是 "normal"。</td>
</tr>

<tr>
<td>font-weight</td>
<td>
	<ul>
	<li>normal</li>
	<li>bold</li>
	<li>100</li>
	<li>200</li>
	<li>300</li>
	<li>400</li>
	<li>500</li>
	<li>600</li>
	<li>700</li>
	<li>800</li>
	<li>900</li>
	</ul>
</td>
<td>可选。定义字体的粗细。默认是 "normal"。</td>
</tr>

<tr>
<td>unicode-range</td>
<td><i>unicode-range</i></td>
<td>可选。定义字体支持的 UNICODE 字符范围。默认是 "U+0-10FFFF"。</td>
</tr>
</tbody></table>