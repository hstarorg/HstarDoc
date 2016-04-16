## 0、导言

**关于Stylus**

Stylus是一个CSS预处理器，也就是利用编程的方式编写css代码，然后stylus会自动帮我们编译为标准的css，并能附加更多的功能。

Stylus开始于2010年，来自于Node.js社区。

Stylus的文件后缀是``.styl``

**常用预处理器之间的简单比较**

常用的CSS预处理还有Sass和LESS。Sass提供了非常多的特性，也非常成熟。Less使用起来更为简单。
Stylus在功能上更为健壮，和JS的联系更加紧密。

**此文产生的缘由**

1. 由于亲近Node.js，所以想系统的学习下和js更紧密的Stylus预处理器
2. 最近在实现nk-style的时候，采用了Stylus来编写CSS，用文章的方式来加深理解

## 1、配套工具

**如何安装Stylus**

既然是Node.js社区的产出，那么很明显，安装方式也带有浓浓的Node风格。使用``npm install stylus -g``就可以在系统中安装Stylus了，当然，前提是你得先安装node和npm。

**如何使用**

安装好Stylus之后，我们就可以在控制台输入特定命令，来转换Stylus文件。

``stylus css`` --编译css目录的.styl文件，并输出同名的.css文件

``stylus index.styl abc.styl`` --编译index.styl、abc.styl文件

更多命令请参考 [http://stylus-lang.com/docs/executable.html](http://stylus-lang.com/docs/executable.html)

**更常规的用法**

一般使用stylus的话，是会结合构建工具来一起使用的。比如结合gulp来使用的方式如下：

```javascript
var stylus = require('gulp-stylus');

gulp.task('css', _ =>
  gulp.src('./src/index.styl')
    .pipe(stylus())
    .pipe(gulp.dest('./dist/'))
);
```

## 2、Stylus语法

Stylus在语法支持上是比较强大的。既支持标准CSS，也支持缩进格式，最厉害的还能在同一个styl文件中混用。

```styl
body{
  background: white;
}

body{
  background blue
}

body
  background green 
```

编译生成的CSS如下：

```
body {
  background: #fff;
}
body {
  background: #00f;
}
body {
  background: #008000;
}
```

### 2.1、注释

在学习一门编程语言（或者类编程语言时），我都胡优先去了解它的注释用法。因为刚学，意味着陌生，意味着需要些一些备注，那么这个时候注释就是个好东西。

在Stylus中，注释有三种方式：

1. 单行注释 --仅在styl文件中可见
2. 多行注释 --常规模式下，输出到css文件中
3. 重点注释 --在compress模式下，也会输出到css文件中

test.styl文件内容

```
// 单行注释
body{
  background: white;
}

/* 多行注释 */
body{
  background blue
}

/*! 多行注释 */
body
  background green 
```

常规模式下输出

```
body {
  background: #fff;
}
/* 多行注释 */
body {
  background: #00f;
}
/* 多行注释 */
body {
  background: #008000;
}

```

压缩模式下输出

```
body{background:#fff}body{background:#00f}/* 多行注释 */
body{background:#008000}
```

### 2.2、变量

变量在任何一个编程语言中，都是必不可少的。Stylus中也不例外。

Stylus的变量比较灵活，支持较多的变量名命名方式，如$abc、abc、_abc、-abc等等，但是从易读性上来说，
建议大家使用abc或者是$abc（推荐）其一来作为变量名规则。

test.styl内容：

```
/*! 变量 */
/* 常规的表达式做变量名，用等号连接变量值 */
//在Stylus中，可以使用$，_等前缀，但建议使用特定字符开头，来标识变量
font-size = 14px;
$font-size = 20px 

// 单行注释
body{
  background: white;
  font-size font-size
  font-size: $font-size
  
  width w = 100px
  height h = 100px
  //注意，此处表达式的括号不能少
  margin-left -(w/2)
  margin-top -(h/2)
  //使用@符号引用同级的属性
  margin-left -(@width/2)
  margin-top -(@height/2)
} 
```

生成的CSS内容如下：

```
/* 变量 */
/* 常规的表达式做变量名，用等号连接变量值 */
body {
  background: #fff;
  font-size: 14px;
  font-size: 20px;
  width: 100px;
  height: 100px;
  margin-left: -50px;
  margin-top: -50px;
  margin-left: -50px;
  margin-top: -50px;
}
```

更多变量使用，请查阅[http://stylus-lang.com/docs/variables.html](http://stylus-lang.com/docs/variables.html)

### 2.3、选择器

在编写CSS的过程中，我们用得最多的无非就是选择器了。我们来看看Stylus对选择器做了哪些扩展。

```
/*! 选择器 */
/* 1、选择器嵌套 */
body
  background white
  .container
    background blue
/* 2、引用直接父级别节点 */
li
  &:hover
    color blue
/* 3、引用指定级别上层节点,个人觉得稍显复杂，不易懂，尽量少使用 */
body
  color white
  li
    a
      color green
    ^[1]:hover
        color yellow
/* 4、根节点引用，使用/将当前样式提升到第一层级 */
body
  li
    / .test
      color white
/* 5、使用../来回到上一层级 */
body
  li
    ../ .test
      color yellow
/* 6、使用selector()来构造选择器 */
{selector('.a', '.b, .c')}
  color white
/* 7、选择器为变量，那么用{}包裹，属性也是 */
$selector = ".text-danger"
$font = font-family

{$selector}
  {$font} "微软雅黑"

/* 8、使用表达式 */
exp_margin_pad(n)
  margin (- n)px
  
body
  exp_margin_pad(10)
```

编译为CSS如下：

```
/* 选择器 */
/* 1、选择器嵌套 */
body {
  background: #fff;
}
body .container {
  background: #00f;
}
/* 2、引用直接父级别节点 */
li:hover {
  color: #00f;
}
/* 3、引用指定级别上层节点,个人觉得稍显复杂，不易懂，尽量少使用 */
body {
  color: #fff;
}
body li a {
  color: #008000;
}
body li:hover {
  color: #ff0;
}
/* 4、根节点引用，使用/将当前样式提升到第一层级 */
.test {
  color: #fff;
}
/* 5、使用../来回到上一层级 */
body .test {
  color: #ff0;
}
/* 6、使用selector()来构造选择器 */
.a .b,
.a .c {
  color: #fff;
}
/* 7、选择器为变量，那么用{}包裹，属性也是 */
.text-danger {
  font-family: "微软雅黑";
}
/* 8、使用表达式 */
body {
  margin: -10px;
}
```

花样太多，就不一一例举了。不过，常用的没几个。个人最常用的仅仅是嵌套。

想了解更多，请参考： [http://stylus-lang.com/docs/selectors.html](http://stylus-lang.com/docs/selectors.html)

### 2.5、样式块

Stylus的变量没有集合的概念，那么如果有一组样式要复用的时候，变量就有点捉襟见肘了。这个时候，我们可以采用block来实现一组样式的复用。

```
/*! 样式块，两种定义方式，推荐第二种，为了易读性 */
font = 
  font-family "微软雅黑"
  font-size 1rem

font1 = @block{
  font-family "宋体"
  font-size 14px;
}
  
body
  {font}
  {font1}
```

编译结果为：

```
/* 样式块，两种定义方式，推荐第二种，为了易读性 */
body {
  font-family: "微软雅黑";
  font-size: 1rem;
  font-family: "宋体";
  font-size: 14px;
}
```

### 2.6 样式继承

在编写CSS的过程中，我们往往会发现新加的样式和之前已有的样式类有重复的部分，如果是原生CSS，那么我们又得拷贝一份样式出来。在Stylus中，大可不必如此麻烦。使用@extend很方便的就能解决这个问题。

```
/*! 样式继承 */

.btn
  border 1px solid red;
  border-radius 5px

.btn-danger
  @extend .btn //继承.btn的样式
  color red

//如果不嫌输出.btn，我们只需要将btn做成占位选择器，如下
$btn
  border 1px solid red;
  border-radius 5px
  
.btn-info
  @extend $btn
  color purple
```

编译后为：

```
/* 样式继承 */
.btn,
.btn-danger {
  border: 1px solid #f00;
  border-radius: 5px;
}
.btn-danger {
  color: #f00;
}
.btn-info {
  border: 1px solid #f00;
  border-radius: 5px;
}
.btn-info {
  color: #800080;
}
```

**注意1：@extend和@extends完全相等，两者可以混用**

**注意2：@extend与Sass不同的地方，在于Stylus的@extend支持继承嵌套选择器**

### 2.7、方法

编程语言重要的一个特征就是函数，在Stylus中，也有函数的概念，函数的概念和Mixins比较类似，但是，函数还可以有返回值

```
/*! 函数 */
// 个人建议在定义函数时，以f_为前缀，方便识别
f_plus(a, b) //简单函数
  a + b
  
f_plus2(a, b = a) //带默认值的函数
  a + b + 0px

f_multireturn() //多返回值函数
  5px 10px 15px 20px
  
f_margin() //想要作为整体返回,为了消除歧义，建议使用rerurn和括号包裹返回值
  return (5px 10px 5px 10px)

f_test = f_margin //函数可以指定别名

//和js雷同，函数可以作为参数传递
f_fun1(a, b)
  a + b + 0px
f_fun2(a, b)
  a - b + 0px
f_invork(a, b, fn)
  fn(a, b)  

body
  margin-top f_plus(5, 10)
  margin-top f_plus(5px, 10)
  margin-top f_plus2(5)
  margin-top f_plus2(b: 10, a: 5) //命名参数传递
  margin-bottom f_multireturn()[3] //取第四个值，下标从0开始
  margin f_margin()
  width f_invork(100, 50, f_fun1)
  height f_invork(100, 50, f_fun2)
```

编译之后为：

```
/* 函数 */
body {
  margin-top: 15;
  margin-top: 15px;
  margin-top: 10px;
  margin-top: 15px;
  margin-bottom: 20px;
  margin: 5px 10px 5px 10px;
  width: 150px;
  height: 50px;
}

```

## 3、未完，待续