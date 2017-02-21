## 导言

CSS不是一门真正意义上的编程语言，很多编程语言理所当然的特性（比如变量），都不被支持。同时再开发模块化的web项目的时候，也要避免相互干扰。为了弥补CSS的这些不足，就产生了**[CSS预处理器]()**，Sass则是其中的佼佼者。

## 什么是Sass
**[Sass](http://sass-lang.com/)**是最成熟、稳定、强大、专业的CSS扩展语言（官方解释）。直白点，Sass就是一个非常好用的CSS预处理器，为css引入部分编程语言的特性。

Sass在现阶段，有两种编码的语法，一个是兼容CSS语法的Scss格式文件，一个是Haml、Ruby类似语法的Sass格式文件。一般情况下，我们选用第一种兼容Css语法的Scss文件格式

## 什么是Compass
**[Compass](http://compass-style.org/)**是基于Sass的一个css创作框架，其实就是基于Sass提供了很多非常实用的函数，有点类库的概念。

## 如何安装
Sass是基于Ruby写的，安装Sass需要先安装Ruby：[https://www.ruby-lang.org/zh_cn/downloads/](https://www.ruby-lang.org/zh_cn/downloads/)。

在Windows上安装Ruby，需要借助RubyInstall工具：[http://rubyinstaller.org/](http://rubyinstaller.org/)

安装好Ruby只有，可以使用cmd：ruby -v 查看ruby的版本，如果有输出，表示ruby安装成功。这个时候，则可以使用``ruby gem sass``来安装Sass，``ruby gem compass``来安装Compass。

***注意事项**：由于gem仓库被墙了，如果想使用的话，需要切换镜像地址，国内可以采用淘宝的ruby镜像：``http://ruby.taobao.org``。可以通过如下命令实现：*

    //移除官方gems
	gem sources --remove https://rubygems.org/
	//添加淘宝的gems   
	gem sources -a https://ruby.taobao.org/
	//查看现有的gems
	gem sources -l

## 命令行

	//编译Sass
	sass <sass file> <css file>
	
	//Sass与Scss相互转换
	sass-convert <.sass file> <.scss file>
	sass-convert <.scss file> <.sass file>
	
	//监视Sass文件变更，自动编译(可选输出css的风格，参数为style)
	sass --watch <sass file>:<css file> [--style [nested|expanded|compact|compressed]]
	
	//监视文件夹中Sass文件变更，自动编译
	sass --watch <sass folder>:<ouput css folder>
	
	//----------------------Compass--------------
	
	//创建Sass工程
	compass create
	
	//编译sass文件
	compass compile
	
	//监视Sass工程下sass文件变更(可选输出css的风格，参数为output-style)
	compass --watch [--output-style [nested|expaned|compact|compressed]]

## 更简单的使用方式

看了以上这么多的步骤，是不是感觉头疼？

**老夫看你天资聪慧，将来必成大器，特为你带来一本秘籍，祝你早日功成！**

在真正的开发环境中，我们一般这么用，结果node+gulp等构建工具。

首先，需要安装node,然后使用npm安装gulp和gulp-sass。

接着，编写一个基于gulp的构建脚本，如果是其他构建工具，那么编写对应的脚本即可，gulpfile.js代码如下：

	var gulp = require('gulp'),
	  sass = require('gulp-sass');
	
	gulp.task('default', ['sass', 'watch'], function () {
	  console.log('Begin watching...');
	});
	
	gulp.task('sass', function () {
	  return gulp.src('./*.scss')
	    .pipe(sass({
	      outputStyle: 'expanded'
	    }).on('error', sass.logError))
	    .pipe(gulp.dest('./css/'));
	});
	
	gulp.task('watch', function () {
	  return gulp.watch('./*.scss', ['sass']);
	});

最后，使用控制台，启动gulp，然后畅快的编写sass代码吧。
