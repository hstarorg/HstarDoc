html5相比html4，添加了部分语义化的标签和属性，现在我们就从这些标签和属性开始，学习html5吧。

首先，认识下HTML5新的文档类型：

	<!DOCTYPE html>

## 那些新标签

### 格式

1. <bdi&gt; 定义文本的文本方向，使其脱离其周围文本的方向设置
2. <mark&gt; 定义有记号的文本
3. <meter&gt; 定义预定义范围内的度量
4. <progress&gt; 定义任何类型的任务的进度
5. <rp&gt; 定义若浏览器不支持ruby元素显示的内容
6. <rt&gt; 定义ruby注释的解释
7. <ruby&gt; 定义ruby注释
8. <time&gt; 定义日期/时间
9. <wbr&gt; 强制定义换行点

HTML：

	<!DOCTYPE html>
	<html>
	  <head>
	    <meta charset="utf-8" />
	    <title>HTML5 Test Page 1</title>
	  </head>
	  <body>
	    <div><bdi>BDI:在发布用户评论或其他您无法完全控制的内容时，该标签很有用 test</bdi></div>
	    <hr />
	    <div><mark>Mark:定义带有记号的文本</mark></div>
	    <hr />
	    <div style="width:200px;border:1px solid red;"><meter value="10" />Meter</div>
	    <hr />
	    <div><progress value="10" max="100"></progress>Progress: 用于显示进度，结合JS一同使用</div>
	    <hr />
	    <div>我在 <time datetime="2008-02-14">情人节</time> 有个约会
	    <mark>该标签不会再在任何浏览器中呈现任何特殊效果，仅仅方便搜索引擎生成更智能的结果</mark>
	    </div>
	    <hr />
	    <div>
	      <p>如果想学习 AJAX，那么您必须熟悉 XML<wbr>Http<wbr>Request 对象。</p>
	      <mark>wbr可强制设置换行点</mark>
	    </div>
	  </body>
	</html>

### 表单

1. <datalist&gt; 定义下拉列表
2. <keygen&gt; 定义生成密钥
3. <output&gt; 定义输出的一些类型

HTML：

	<!DOCTYPE html>
	<html>
	  <head>
	    <meta charset="utf-8" />
	    <title>HTML5 Test Page 2</title>
	  </head>
	  <body>
	    <form method="post">
	      <p>datalist:和input元素配合，用于定义input可能的值</p>
	      <input id="lang" list="dl" />
	      <datalist id="dl">
	        <option value="C#" />
	        <option value="Java" />
	        <option value="PHP" />
	      </datalist>
	      <hr />
	      <p>keygen:提交密钥串到服务器</p>
	      Username: <input type="text" name="usr_name" />
	      Encryption: <keygen name="security" />
	      <input type="submit" />
	      <hr />
	    </form>
	    <p>output:定义不同类型的输出</p>
	    <form oninput="x.value=parseInt(a.value)+parseInt(b.value)">
	      0
	      <input type="range" id="a" value="50">100
	      +<input type="number" id="b" value="50">
	      =<output name="x" for="a"></output>
	    </form> 
	  </body>
	</html>

### 图像

1. <canvas&gt; 定义图形
2. <figcaption&gt; 定义figure元素的标题
3. <figure&gt; 定义媒介内容的分组，以及它们的标题

HTML：

	<!DOCTYPE html>
	<html>
	  <head>
	    <meta charset="utf-8" />
	    <title>HTML5 Test Page 3</title>
	  </head>
	  <body>
	    <div>
	      <p>canvas:你懂的，画布，各种绚丽效果就靠它了。</p>
	      <canvas id="c"></canvas>
	      <script>
	        var canvas=document.getElementById('c');
	        var ctx=canvas.getContext('2d');
	        ctx.fillStyle='#FF0000';
	        ctx.fillRect(0,0,80,100);
	      </script>
	    </div>
	    <hr />
	    <div>
	      <p>
	      figure: 规定独立的流内容（图像、图表、照片、代码等等），figure 元素的内容应该与主内容相关，但如果被删除，则不应对文档流产生影响。
	      <br />
	      figcaption:定义 figure 元素的标题，语义化</p>
	      <figure>
	        <figcaption>黄浦江上的的卢浦大桥</figcaption>
	        <img src="https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcSehM_6Bfd79RwCCy1wNj_K6YGEkMsdt0Gekn10Dc6xJ8nxDcS7rg" width="350" height="234" />
	      </figure>
	    </div>   
	  </body>
	</html>

### 音频/视频

1. <audio&gt; 定义声音内容
2. <source&gt; 定义媒介源
3. <track&gt; 定义用在媒体播放器中的文本轨道
4. <video&gt; 定义视频

### 链接

1. <nav&gt; 定义导航链接

### 列表

1. <command&gt; 定义命令按钮 --**注：现在浏览器暂时都不支持**

### 样式/节 -- 语义化标签

1. <header&gt; 定义section或page的页眉
2. <footer&gt; 定义section或page的页脚
3. <section&gt; 定义section
4. <article&gt; 定义文章
5. <aside&gt; 定义页面内容之外的内容
6. <details&gt; 定义元素细节
7. <dialog&gt; 定义对话框或窗口
8. <summary&gt; 为<details&gt;元素定义可见的标题

### 编程

<embed&gt; 为外部应用程序（非HTML）定义容器

## 那些新属性

1. contenteditable 规定元素内容是否可编辑
2. contextmenu 规定元素的上下文菜单。上下文菜单在用户点击元素时显示
3. data-* 用于存储页面或应用程序的私有定制数据
4. draggable 规定元素是否可拖动
5. dropzone 规定在拖动被多动数据时是否进行复制、移动或链接
6. hidden 规定元素仍未或不再相关
7. spellcheck 规定是否对元素进行拼写和语法检查
8. translate 规定是否应该翻译元素内容

**以上全局属性可用于任何HTML元素**

## 参考资料

1. [http://www.w3schools.com/tags/](http://www.w3schools.com/tags/)

