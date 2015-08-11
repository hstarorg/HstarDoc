## 前言

由于.sass不兼容CSS代码，所以以下内容完全使用.scss的语法。

## Sass注释

Sass中除了提供CSS中的标准注释之外，还提供了一种静默注释：

	/* 我是标准注释 */
	// 我是静默注释

标准注释大多数情况下（**一种例外：设置输出风格为compressed**）是会生成到最终的CSS中的，而静默注释的话，只是Sass的注释，是不会被生成到CSS文件中的。

如果想，就算设置输出风格为compressed也要加入特定注释呢？那么可以采用**重要注释**写法，如下：

	/*! 我的重要注释 */

也就是在标准注释的基础上，将注释的第一个字符设置为感叹号。

## Sass变量

Sass作为一个CSS预处理器，那么最基本的编程语言特性**变量**自然也是必不可少的。Sass中变量系统相对比较丰富，包含局部变量，全局变量，默认变量，特殊变量（变量作用在属性上），多值变量。

**Sass变量以$开头，用:分割变量名与变量值，以;结尾。如： $color: red;**

**Sass变量，不区分中横线和下划线，比如定义变量为$bg-color，那么使用$bg_color也能访问到哦！**

### 局部变量

同大多数编程语言一样，变量的作用域是它本身的这个块，以及所有的子集。如:

	body{
	  $color: blue;
	  color: $color;
	  .container{
	    background-color: $color;    
	  }
	}

将被编译为：

	body {
	  color: blue;
	}
	
	body .container {
	  background-color: blue;
	}

同时，需要注意：针对以上代码，如果内部修改了$color的值，也会同时影响到外部的变量值。

### 全局变量

如果定义在局部的变量，与它同级的选择器中是无法使用的：

	body{
	  $color: blue;
	  color: $color;
	  .container{
	    background-color: $color;    
	  }
	}
	
	// 会出现错误，未定义的变量
	footer{
	  color: $color;
	}

这个时候，就需要提升$color为全局变量，**在变量值之后，加上!global**,示例如下：

	body{
	  $color: blue !global;
	  color: $color;
	  .container{
	    background-color: $color;    
	  }
	}
	
	// 会出现错误，未定义的变量
	footer{
	  color: $color;
	}

这个的话，就能够正常编译了，因为$color被提升为全局变量了。

### 默认变量

在Sass中，可以通过在**变量值之后加入!default**来让变量称为默认变量，如果有对该变量的赋值，不管前后，那么变量的默认值都会被替换掉，示例如下：

	$color: red;
	body{
	  $color: blue !default;
	  color: $color;
	  .container{
	    background-color: $color;    
	  }
	}
	footer{
	  color: $color;
	}

可以通过注释掉!default来查看生成的CSS的异同。

### 特殊变量

Sass的变量，还可以用在属性中，此时需要使用#{变量名}来引用，示例如下：

	$containerId: c1;
	
	##{$containerId}{
	  color: red;
	}

此时，生成的CSS为：

	#c1 {
	  color: red;
	}

### 多值变量

强大的Sass，还提供了一种特殊的变量，即为多值变量，在一个变量中，可以定义多个值，然后通过制定的函数访问，示例如下：

	// List类型的多值变量 
	$px: 5px 10px 15px 20px;
	
	// Map类型的多值变量 
	$map: (id1: test, id2: testGrid, color: red);
	
	body{
	  // 此处需要注意，索引是从1开始，不是从0哦。
	  margin-left: nth($px, 1);
	
	  // 使用map-get访问，当心key的使用，指定了不存在的key会导致生成的css异常 
	  #{map-get($map, id2)}{
	    color: red;
	  }
	
	  #id{
	    color: map-get($map, color);
	  }
	}

生成的CSS如下：

	body {
	  margin-left: 5px;
	}
	
	body testGrid {
	  color: red;
	}
	
	body #id {
	  color: red;
	}

## 导入

体现可维护性的重要指标就是文件似乎可以单一职责，那么在Sass中，主要体现在导入上。由于Sass中的导入指令和CSS的导入指令是同样的关键字，那么就需要按照一定的规则来判别了，满足以下任意一条规则的导入，使用CSS的原生导入：

1. 被导入的文件名以.css结尾
2. 被导入的文件是一个在线的url地址
3. 以@import url(...)方式去导入文件

同时，编写局部的sass文件，建议使用下划线开头,如： _a.scss，这样就不会生成多余的_a.css了。

	//_a.scss
	#id2{
	  color: red;
	}

	//1.scss
	@import "a.scss";
	#id1{
	  color: blue;
	}

	body{
		@import "a.scss";
	}

最终生成的结果为:

	#id2 {
	  color: red;
	}
	
	#id1 {
	  color: blue;
	}
	
	body #id2 {
	  color: red;
	}

## 结尾

欲知后事如何，请听下回分解！



