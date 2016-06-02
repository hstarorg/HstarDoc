## 0、关于Canvas

``<canvas>`` 是HTML5新增的一个标签，用于定义图形，比如图表和其他图像。

``<canvas>`` 标签只是图形容器，必须要使用脚本来绘制图形。

一句话概括就是：``<canvas>`` 是浏览器上的画图，允许你通过js自由作画。

### Canvas和SVG与VML的不同

``<canvas>`` 有一个基于JS的绘图API，它本身并不会绘制图形。SVG和VML都是用一个XML文档来描述图形。

虽然它们在功能上基本相同，但是从表面上来看，它们非常不同。SVG和VML绘图易于编辑，只需要从描述中修改元素属性。而Canvas想移除元素，往往需要擦掉绘图重新绘制它。

### Canvas兼容HTML5标准属性和事件

``<canvas>`` 作为一个HTML的新标签，标准的HTML属性和事件它都支持。比如可以设置 ``title、style、class`` 等属性，也可以使用诸如 ``onclick`` 等事件。

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Canvas Test</title>
  <style>
    body{
      text-align: center;
    }
    .c1{
      border: 1px solid red;
      height: 600px;
      width: 800px;
    }
  </style>
</head>
<body>
  <canvas id="c1" onclick="alert('abc')" class="c1"></canvas>
</body>
</html>
```

## 1、使用Canvas

要使用``canvas``，首先，我们先得html中加入canvas标签。最好，再加上一个id属性（也可以不加，只是查找该元素要稍微麻烦点）。

```html
...
<body>
  <canvas id="c1" onclick="alert('abc')" class="c1"></canvas>
  <script>
    var c1 =document.getElementById('c1');
    // 如果不用id属性，我们可以用如下方式来获取canvas对象
    //var c1 = document.getElementsByTagName('canvas')[0]; 
  </script>
</body>
...
```

在获取到 ``canvas`` 元素之后，我们需要通过 ``getContext(contextID)`` 方法获取到画布。

当前 ``contextID``的值仅仅可以用'2d'，在未来，可能会允许传递'3d'，来进行三维绘图。

```html
...
<body>
  <canvas id="c1" onclick="alert('abc')" class="c1"></canvas>
  <script>
    var c1 =document.getElementById('c1');
    // 如果不用id属性，我们可以用如下方式来获取canvas对象
    //var c1 = document.getElementsByTagName('canvas')[0];
    var context = c1.getContext('2d');
    console.log(context); //可以看到context是一个CanvasRenderingContext2D对象
  </script>
</body>
...
```

``CanvasRenderingContext2D`` 对象实现了一个画布所使用的大多数方法。现在我们就需要对它来进行使用，将图像绘制到浏览器上。

### 1.1、绘制矩形

关于矩形的绘制，主要有三个方法：

* fillRect(x, y, width, height) 用于填充矩形
* strokeRect(x, y, width, height) 用于绘制矩形边框
* clearRect(x, y, width, height) 用于清空矩形区域（设置矩形区域为空白）

其中 ``x,y``表示从那个点开始绘制。``width,height`` 表示矩形的宽度和高度。

要设置矩形的填充颜色，需要通过 ``fillStyle`` 来控制，支持 ``'red', '#fff', 'rgb(10,10,10)', 'rgba(10,10,10,10,0.5)'``等多种颜色属性。

要设置矩形的边框颜色，需要通过 ``strokeStyle`` 来控制，属性值和 ``fillStyle`` 一致。


```javascript
...
//绘制红色矩形
context.fillStyle = 'red'; 
context.fillRect(10,10,100,100);

//绘制蓝色矩形框
context.strokeStyle = 'blue';
context.strokeRect(150,150,100,100);

//清空矩形区域（设置矩形区域为空白）
context.clearRect(100,100,100,100);
...
```

### 1.2、绘制线条

我们可以通过 ``lineTo(x, y)`` 绘制直线。两点成直线，绘制直线需要两个点，所以我们需要先设置一个起点，一般来说，我们使用 ``moveTo(x, y)`` 设置笔触的位置。当然，你也可以用 ``lineTo(x, y)`` 来设置一个笔触点。

在没有设置笔触的场景下，以下两段代码的效果完全一致：

```javascript
//画线，设置起点。
context.moveTo(200, 200);
//设置轨迹
context.lineTo(500,500);
//画线
context.stroke();
```

```javascript
//画线，设置起点。
context.lineTo(200, 200);
//设置轨迹
context.lineTo(500,500);
//画线
context.stroke();
```

**一般来说，我们会在 ``canvas`` 初始化或者 ``beginPath()`` 调用后，通过 ``moveTo(x, y)`` 来设置一个初始笔触点。**

要同时绘制多个线条，我们应该通过 ``beginPath()`` 来建立路径。

```javascript
//用线条绘制了一个矩形
context.beginPath();
context.moveTo(400, 400);
context.lineTo(450, 400);
context.lineTo(450, 450);
context.lineTo(400, 450);
context.closePath();
//真实的绘图
context.stroke();
```

看了以上的代码，可能会有一个疑惑，为什么仅仅三个线条就构成了一个矩形呢？

原因在于当调用 ``closePath()`` 的时候，会把最后的笔触点和最开始的笔触点连接在一起，这个时候也就构成了第四条直线。

 **注意：当前路径为空，即调用beginPath()之后，或者canvas刚建的时候，第一条路径构造命令通常被视为是moveTo（），无论最后的是什么。出于这个原因，你几乎总是要在设置路径之后专门指定你的起始位置。**
 
 **闭合路径 ``closePath()``,不是必需的。这个方法会通过绘制一条从当前点到开始点的直线来闭合图形。如果图形是已经闭合了的，即当前点为开始点，该函数什么也不做。**
 
 **当你调用 ``fill()`` 函数时，所有没有闭合的形状都会自动闭合，所以你不需要调用 ``closePath()`` 函数。但是调用stroke()时不会自动闭合。**
 
再来填充一个梯形玩玩：

```javascript
context.beginPath();
context.moveTo(100, 400);
context.lineTo(200, 400);
context.lineTo(250, 500);
context.lineTo(50, 500);
context.fill();
```

### 1.3、绘制矩形线条

矩形线条是一个比较常用的图形，所以提供了一个简单的方法来直接绘制：

```javascript
//绘制矩形线条
context.beginPath();
context.rect(700, 10, 50, 50);
context.stroke();
context.fillStyle = 'red';
context.fill();
```


### 1.4、绘制圆弧

绘制圆弧或者圆的时候，我们可以使用如下方法：

* arc(x, y, radius, startAngle, endAngle, anticlockwise) 画一个以（x,y）为圆心的以radius为半径的圆弧（圆），从startAngle开始到endAngle结束，按照anticlockwise给定的方向（默认为顺时针）来生成。
* arcTo(x1, y1, x2, y2, radius) 根据给定的控制点和半径画一段圆弧，再以直线连接两个控制点。

anticlockwise为true则表示逆时针绘制。

```javascript
//绘制圆弧
context.beginPath();
context.arc(550, 150, 100, getRadian(90) , getRadian(360), false);
context.stroke();
context.beginPath();
context.arc(550, 150, 100, 0, getRadian(90), false);
context.fill();
```

以上代码，绘制了两个弧形，一个空心，一个实心。一般再绘制圆弧的时候就不要执行 ``moveTo(x, y)``，否则绘制终点会被连接到这个触点上。

**注意：在arc函数中，``startAngle`` 和 ``endAngle`` 属性值都是弧度，而不是我们所熟知的角度。所以我们一个一个角度转换为弧度的函数，如下：**

```javascript
function getRadian(degrees/*角度值*/){
  return (Math.PI / 180) * degrees;
}
```

**arcTo没吃透，暂时描述不出来，先简单看看示例：**

```javascript
//绘制圆弧（必须要设定起始点）
context.beginPath();
context.fillRect(600, 400, 10, 10);
context.fillRect(700, 500, 10, 10);
context.fillStyle = 'blue';
context.fillRect(700, 400, 10, 10);

context.beginPath();
context.moveTo(700, 400);
context.arcTo(600, 600, 700, 700, 500);
context.stroke();
```


## 2、其他

### 2.1、canvas检查支持性

如果仅仅需要在UI上体现，那么我们可以在 ``<canvas>`` 标签内部放置元素，如果浏览器不支持 ``<canvas>`` 标签，那么内部的元素就会被浏览器解析，而显示出来。

```html
<canvas id="stockGraph" width="150" height="150">
  <p>Canvas not be support.</p>
</canvas>
```

除此之外，我们也可以用js的方式来检查。

```javascript
var c1 = document.getElementById('c1');
//如果canvas元素没有getContext方法，那么就证明浏览器不支持canvas。
if(!c1.getContext){
  console.log('Canvas not be support.')
}
```

### 2.2、canvas的width和height属性

``<canvas>`` 对象有两个比较特别的属性，``width、height``，这两者用于控制画布的大小，width的默认值是300，height的默认值为150。**当这两个属性值有变化时，在该画布上已经完成的任何绘图都会擦除掉。**

```javascript
var c1 = document.getElementById('c1');
console.log('default width:', c1.width, '; default height:', c1.height);
c1.width = 500;
c1.height = 600;
```

``<canvas>`` 的的height和width属性如果和用css设置的height和width样式不一致，那么就可能会产生扭曲。

### 2.3、来个好玩的，画个桃心

```javascript
function drawHeart() {
  context.fillStyle = 'purple';
  //三次曲线
  context.beginPath();
  context.moveTo(75, 40);
  context.bezierCurveTo(75, 37, 70, 25, 50, 25);
  context.bezierCurveTo(20, 25, 20, 62.5, 20, 62.5);
  context.bezierCurveTo(20, 80, 40, 102, 75, 120);
  context.bezierCurveTo(110, 102, 130, 80, 130, 62.5);
  context.bezierCurveTo(130, 62.5, 130, 25, 100, 25);
  context.bezierCurveTo(85, 25, 75, 37, 75, 40);
  context.fill();
}
drawHeart();
``` 

### 2.4 附上测试代码

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <title>Canvas Test</title>
  <style>
    body {
      text-align: center;
    }
    
    .c1 {
      border: 1px solid red;
      height: 600px;
      width: 800px;
    }
  </style>
</head>

<body>
  <canvas id="c1" onclick="alert('abc')" class="c1"></canvas>
  <script src="main.js"></script>
</body>
</html>
```

```javascript
var c1 = document.getElementById('c1');
// 如果不用id属性，我们可以用如下方式来获取canvas对象
//var c1 = document.getElementsByTagName('canvas')[0];
c1.width = 800;
c1.height = 600;
var context = c1.getContext('2d');
console.log(context); //可以看到context是一个CanvasRenderingContext2D对象

function getRadian(degrees/*角度值*/) {
  return (Math.PI / 180) * degrees;
}

//绘制红色矩形
context.fillStyle = 'red';
context.fillRect(10, 10, 100, 100);

//绘制蓝色矩形框
context.strokeStyle = 'blue';
context.strokeRect(150, 150, 100, 100);

//清空矩形区域（设置矩形区域为空白）
context.clearRect(100, 100, 100, 100);

//画线，设置起点。
context.moveTo(200, 200);
//设置轨迹
context.lineTo(500, 500);
//画线
context.stroke();

//绘制空心矩形
context.beginPath();
context.moveTo(400, 400);
context.lineTo(450, 400);
context.lineTo(450, 450);
context.lineTo(400, 450);
context.closePath();
context.stroke();

//绘制实心梯形
context.beginPath();
context.moveTo(100, 400);
context.lineTo(200, 400);
context.lineTo(250, 500);
context.lineTo(50, 500);
context.fill();

//绘制圆弧
context.beginPath();
context.arc(550, 150, 100, getRadian(90), getRadian(360), true);
context.stroke();
context.beginPath();
context.arc(550, 150, 100, 0, getRadian(90), true);
context.stroke();

//绘制圆弧（必须要设定起始点）
context.beginPath();
context.fillRect(600, 400, 10, 10);
context.fillRect(700, 500, 10, 10);
context.fillStyle = 'blue';
context.fillRect(700, 400, 10, 10);

context.beginPath();
context.moveTo(700, 400);
context.arcTo(600, 600, 700, 700, 500);
context.stroke();

//绘制矩形线条
context.beginPath();
context.rect(700, 10, 50, 50);
context.stroke();
context.fillStyle = 'red';
context.fill();

function drawHeart() {
  context.fillStyle = 'purple';
  //三次曲线
  context.beginPath();
  context.moveTo(75, 40);
  context.bezierCurveTo(75, 37, 70, 25, 50, 25);
  context.bezierCurveTo(20, 25, 20, 62.5, 20, 62.5);
  context.bezierCurveTo(20, 80, 40, 102, 75, 120);
  context.bezierCurveTo(110, 102, 130, 80, 130, 62.5);
  context.bezierCurveTo(130, 62.5, 130, 25, 100, 25);
  context.bezierCurveTo(85, 25, 75, 37, 75, 40);
  context.fill();
}
drawHeart();
```