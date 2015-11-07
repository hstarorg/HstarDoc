## 1、CSS布局之display

### 1.1、dispaly

dispaly是CSS中最重要的用于控制布局的属性，每个元素都有一个默认的display，大多数元素的默认值通常是block（块级元素）或inline（行内元素）。


另一个常用的display是none。一些特殊元素的默认值就是它，如script、link等。

### 1.2 display:none 与 visibility:hidden

display设置为none，是不会保存元素本该显示的空间，但是visibility:hidden会保留。

	<div style="width: 100px; height: 100px; border: 1px solid red;float:left;">
	  <span style="display:none;">ABCD</span>EFG
	</div>
	<div style="width: 100px; height: 100px; border: 1px solid red;float:left;">
	  <span style="visibility:hidden;">ABCD</span>EFG
	</div>

<div style="width: 100px; height: 100px; border: 1px solid red;float:left;">
  <span style="display:none;">ABCD</span>EFG
</div>
<div style="width: 100px; height: 100px; border: 1px solid red;float:left">
  <span style="visibility:hidden;">ABCD</span>EFG
</div>
<div style="clear:both;" />

### 1.3、更多的display值

比较常用的有list-item,inline-block,table,table-cell,flex等。

全部列表如下：

	none inline block contents list-item inline-block inline-table 
	
	table table-cell table-column table-column-group table-footer-group table-header-group table-row table-row-group 
	
	flex inline-flex grid inline-grid 
	
	ruby ruby-base ruby-text ruby-base-container ruby-text-container
	
	run-in
	
	/* Global values */
	display: inherit;
	display: initial;
	display: unset;

### 1.4 可改写的display属性

虽然每个元素都有默认的display，但是我们可以随时随地的重写它，比如将li元素修改为inline-block，制作水平菜单。

## 2、元素居中

### 2.1、水平居中

通过设置margin为auto可以实现水平居中，前提是元素必须得有宽度

	<div style="width:400px;margin:0 auto;height:10px;border:1px solid red;"></div>

<div style="width:400px;margin:0 auto;height:10px;border:1px solid red;"></div>

### 2.2、垂直居中

因为table的cell可以设置垂直居中，所以玩么可以模拟这样的效果

	<div style="width: 400px;height: 200px;border: 1px solid red;display: table-cell; vertical-align: middle;">
		<div style="width:100px; height:100px;background: blue;"></div>
	</div>

<div style="width: 200px;height: 200px;border: 1px solid red;display: table-cell; vertical-align: middle;">
	<div style="width:100px; height:100px;background: blue;"></div>
</div>

### 2.3、绝对居中

知道水平居中和垂直居中，那么绝对居中就比较容易实现了。组合一下：

	<div style="width: 200px;height: 200px;border: 1px solid red;display: table-cell; vertical-align: middle;">
	  <div style="width:100px; height:100px;background: blue;margin:0 auto;"></div>
	</div>
<div style="width: 200px;height: 200px;border: 1px solid red;display: table-cell; vertical-align: middle;">
  <div style="width:100px; height:100px;background: blue;margin:0 auto;"></div>
</div>

还有没有更好的方式呢？如下：

通过设置position:absolute,然后top、bottom、left、right值为0，margin:auto;实现绝对居中。
如果要相对容器居中，设置容器的position为relative。

	<div style="width: 200px;height: 200px;border: 1px solid red; position:relative;">
	  <div style="width:100px; height:100px;background: blue;margin:auto;position:absolute;top:0;left:0;bottom:0; right: 0;"></div>
	</div>

<div style="width: 200px;height: 200px;border: 1px solid red; position:relative;">
  <div style="width:100px; height:100px;background: blue;margin:auto;position:absolute;top:0;left:0;bottom:0; right: 0;"></div>
</div>


## 3、盒子模型

盒子模型(box-sizing)有两种典型值，分别为content-box,border-box。

### 3.1、content-box

此时，设置在元素上的宽度为内容宽度，那么元素所占用的宽度为：width + border \* 2 + padding \* 2 + margin * 2。宽度同理

### 3.2、border-box

此时，设置在元素上的宽度为包含border的宽度，那么占用总宽度为width + margin \* 2。内容宽度为width - padding \* 2 - border \* 2。


### 3.3 示例

	<div style="width:100px; margin: 10px; padding: 15px; border: 5px solid blue; box-sizing:content-box"></div>
	<div style="width:100px; margin: 10px; padding: 15px; border: 5px solid blue; box-sizing:border-box"></div>

<div style="width:100px; margin: 10px; padding: 15px; border: 5px solid blue; box-sizing:content-box"></div>
<div style="width:100px; margin: 10px; padding: 15px; border: 5px solid blue; box-sizing:border-box"></div>

### 3.4、浏览器兼容性

为了保证浏览器兼容性，需要加上特定浏览器前缀。


## 4、元素定位

如果要实现更多复杂的布局，那么就需要了解下position了。

### 4.1、position:static

static是position属性的默认值，position:static的元素不会被特殊定位。

### 4.2、position:relative

在相对定位(relative)的元素上设置top、right、bottom、left会使其偏离正常位置，其他元素不会调整位置来弥补它偏离后剩下的空隙。

	<div style="border:1px solid red; width: 400px; height: 200px;">
	  <div style="background: blue; width:100px; height: 100px;"></div>
	  ABCDE
	</div>
	<div style="border:1px solid red; width: 400px; height: 200px;">
	  <div style="background: blue; width:100px; height: 100px;position:relative; left: 100px;top:50px;"></div>
	  ABCDE
	</div>

<div style="border:1px solid red; width: 400px; height: 200px;">
  <div style="background: blue; width:100px; height: 100px;"></div>
  ABCDE
</div>
<div style="border:1px solid red; width: 400px; height: 200px;">
  <div style="background: blue; width:100px; height: 100px;position:relative; left: 100px;top:50px;"></div>
  ABCDE
</div>

### 4.3、position:fixed

固定定位（fixed）元素会相对于视窗来定位，所以就算页面滚动，它还是会留在相同位置。示例请看左下角。

	<div style="width: 100px;height:100px; position:fixed; bottom: 0; right: 0;
	border: 1px solid red;">固定定位</div>
<div style="width: 100px;height:100px; position:fixed; bottom: 0; right: 0;
border: 1px solid red;">固定定位</div>

### 4.4、position:absolute

绝对定位元素（absolute）与fixed类似，但是它不是相对视窗，而是相对最近的positioned（position值不是static的元素都是positioned元素）祖先元素，如果没有这样的祖先元素，那么它相对于文档的body元素，并且会随着页面滚动而滚动。

	<div style="border:1px solid red; width: 400px; height: 200px;position:relative;">
	    <div style="background: blue; width:100px; height: 100px;position:absolute;top: 25px;right:25px;"></div>
	</div>
<div style="border:1px solid red; width: 400px; height: 200px;position:relative;">
    <div style="background: blue; width:100px; height: 100px;position:absolute;top: 25px;right:25px;"></div>
</div>
