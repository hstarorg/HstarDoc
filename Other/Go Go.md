**题记：**学习是进步的源泉！

在这个云计算、多核盛行的时代，学习一门与之相配合的语言也就无可厚非了。那么对多核与并行计算原生支持的Go就是我的选择了...

关于GO的好坏，我不会去深究，在每个人眼中，这都是主观的。喜欢就会觉得好，不喜欢好也是坏。当然，它本身的优势与劣势是值得我们关注了，这决定了它的适用性。

工欲善其事必先利其器，本人学习一门语言之前，喜欢先寻找趁手的兵器。搜索之，继而找到了LiteIDE。由于偏爱集成开发环境，那么Sublime也就不是我的首选了。

---
以上全是废话，下面开始搭建开发环境。

##1、准备工作

1. PC + Windows操作系统（我承认我只会玩Windows...）
2. 你得下载Go语言：[https://golang.org/](https://golang.org/) BTW：我下载的文件名是：go1.4.1.windows-amd64.msi
3. LiteIDE：[https://github.com/visualfc/liteide](https://github.com/visualfc/liteide)

##2、搭建环境
<span style="font-size:25px;font-weight:bold;">首</span>先，你需要安装Go语言。什么？你不会？双击msi(或者exe)，Next到手软就可以了。当然，最后应该是Finish。经过这个步骤，go就安装上了，什么环境变量啥的都给你配置好了。当然，安装成功不成功不是你说了算，那么打开cmd，输入一个go试试？如果报错，那么狠抱歉，请重试该步骤，或者检查环境变量。如果提示Go is a tool for managing Go source code ,那么恭喜你，安装已成功！

<span style="font-size:25px;font-weight:bold;">接</span>下面，安装LiteIDE，这货的下载地址在[http://sourceforge.net/projects/liteide/files](http://sourceforge.net/projects/liteide/files)，如果你爱折腾，那么直接下载源码编译也是OK的，请参考[https://github.com/visualfc/liteide/blob/master/liteidex/deploy/welcome/en/install.md](https://github.com/visualfc/liteide/blob/master/liteidex/deploy/welcome/en/install.md)。此处熊出没！liteide下载下来可不是exe或者msi文件哦。我下载的文件名是：liteidex27-1.windows.7z。既然这样，那么解压缩，找个地儿一扔就搞定，是不是更简单？

##3、永远的经典：Hello World
既然到了这里，想必以上两个小玩意已经安装好了。那么就应该开始写代码。据说程序员爱代码不爱妹子，这是真的么？

找到liteIDE的安装目录，进行/bin目录，双击“liteide.exe”（PS：一看到这个丑丑的太极图标，我就在想，这货应该是一个国人开发的吧，呵呵，果真是！）。和一般IDE无异，File->New->Go1 Command Project(Not Use GOPATH)，当然其他也是可以选的，惊喜在等着你。输入必要的信息，那么一个项目就创建好了。

打开main.go文件，输入代码（这段代码我是借鉴的，肯定不是copy的）：

	// demo1 project main.go
	package main
	
	import (
		"fmt"
	)
	
	func main() {
		fmt.Println("Hello World!")
	}


然后点击工具栏上的FR(File Run),这坑爹的按钮，简直反人类。。我点了N次Go按钮之后，才发现这货才是运行。。在右下方区域就能看到输出了。。Hello World~


**后记：**至此，一个简单的Go开发环境已经搭建好了。

###或许你还有疑问

1. 如果生成可执行文件呢？ **可以利用LiteIDE的Build按钮，或者是控制台命令 ``go build``**
2. 如果我是64位系统，如何生成32位可执行程序呢？ **我也不知道，只能给你关键字“交叉编译”**
3. 更多，就留给你慢慢发掘吧。Over！


