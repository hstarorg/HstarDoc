## 0、什么是VsCode（Visual Studio Code - vsc）

VsCode是MS基于Atom Shell开发的新一代 ***跨平台*** 编辑器。vsc将简洁和"编码-编辑-调试"循环的流水线特点结合在代码编辑器中。

截止该文创建时，最新版本是0.10.11。官网地址： [https://code.visualstudio.com](https://code.visualstudio.com)

## 1、VsCode的优势

对比业界各类强大的编辑器，VsCode有哪些优势呢？

1. 跨平台 - VsCode兼容Windows,Linux,OSX三大平台
2. 高性能 - VsCode对比Atom，有更高的性能，更快的大文件加载速度
3. 集成Git - Git作为最流行的版本控制工具，VsCode默认集成
4. 代码调试 - 强大的调试工具
5. 智能提示（代码不全） - 强大的代码不全，语义理解
6. 插件机制 - 可以很方便的扩展需要的功能

## 2、配置编辑器

### 2.1、用户设置

通过选择菜单栏上的Files > Preferences > User Settings，或者是按F1，然后输入user，进行user settings.json的配置。

在配置时，默认是分栏的界面，左侧是标准的系统配置项，右侧是用户自定义配置项。配置右边的项就可以参考左边的标准配置。

由于默认配置已经非常实用了，所以需要我们自定义配置的项并不多：

```json
{
    "editor.tabSize": 2, //tab键所占用的字符数
    "files.exclude": { //需要排除的文件（夹），不在EXPLORER面板中显示
      ".idea/": false,
      ".vscode/": false,
      "typings/": false
    }
}
```
### 2.2、工作空间配置

与用户设置一样，我们可以针对工作空间进行配置，此处的配置文件，保存在目录下vscode/settings.json中。

### 2.3 常用快捷键说明

1. Ctrl+Shift+\  在块标记之间跳转
2. Ctrl+Down or Ctrl+Up  上下移动一行
3. Ctrl+Alt+Down or Ctrl+Alt+Up  上下纵向选择
4. Alt+Click  添加辅助光标，然后就可以多个光标编辑了
5. Ctrl+D 当有选中字符时，跳转到下一个该字符处
6. Ctrl+F2 or Ctrl+Shift+L  选中所有出现的选中字符
7. Ctrl+T 搜索语法
8. F1打开输入框，删除>,输入?,可以看到相关命令

更多快捷键，请参考：[https://code.visualstudio.com/docs/customization/keybindings](https://code.visualstudio.com/docs/customization/keybindings)

## 3、Debugging相关配置

当前支持的Debugging语言有node，Chrome，Go，大概配置如下：

```json
{
    "version": "0.2.0",
    "configurations": [
        {
            "name": "Launch", //名称
            "type": "node",  //类型
            "request": "launch",
            "program": "app.js", //要启动的程序
            "stopOnEntry": false,
            "args": [], //启动参数
            "cwd": ".", //从那个相对路径启动
            "runtimeExecutable": null,
            "runtimeArgs": [
                "--nolazy"
            ],
            "env": {
                "NODE_ENV": "development" //环境变量
            },
            "externalConsole": false,
            "preLaunchTask": "",
            "sourceMaps": false,
            "outDir": null
        },
        {
            "name": "Attach",
            "type": "node",
            "request": "attach",
            "port": 5858
        }
    ]
}
```

## 4、Tasks相关配置
在VsCode中，我们还可以自定义task。首先在.vscode目录下创建tasks.json，进行task的配置：

```json
{
	"version": "0.1.0",
	"command": "gulp",
	"isShellCommand": true,
	"tasks": [
		{
			"taskName": "less", //配置任务名称
			// Make this the default build command.
			"isBuildCommand": true,
			// Show the output window only if unrecognized errors occur.
			"showOutput": "silent",
			// Use the standard less compilation problem matcher.
			"problemMatcher": "$lessCompile"
		}
	]
}
```

## 5、语言环境相关配置

在使用VsCode的过程中，非常吸引人的一个特性就是智能提示。在0.10.8和之前的版本，node代码是直接可以通过typings来智能提示的。但是在0.10.10版本之后，就需要通过配置文件来启用功能了。

### 5.1 JavaScript

在使用JavaScript的时候，配置文件是jsconfig.json(tsconfig.json的子集)，如果目录中存放该问题，表示该目录是项目的根路径。jsconfig配置文件本身列出属于该项目以及编译器的选项。大致内容如下：

```json
{
  "compilerOptions": {
    "target": "ES6", //可选es3,es5,es6,es2015
    "module": "commonjs" //可选amd,umd,commonjs,system
  },
  "files": [ 
    "app.js",
    "model.js"
  ],
  "exclude": [ //排除的目录，不在搜索
    "node_modules"
  ]
}
```
**Tips: 如果应用程序有的代码在app/ or src/下，那么jsconfig应该在这些目录下创建**

**Tips: 如果你的工作空间中，包含多个不同的应用程序（比如client和server），那么请在每个文件夹下增加独立的jsconfig.json文件**

**Tips： 如果没有jsconfig.json，默认是排除node_modules目录**

### 5.2、Dockerfile

Dockerfile编写支持，极大的丰富了VsCode的多样性。要支持Dockerfile，需要通过ext install 来安装Dockerfile and Docker Compose File Support扩展。

创建好一个Dockerfile文件后，使用空格就可以使用智能提示了。

### 5.3、关于智能提示所需要的typing文件

要安装typing文件，那么首先需要我们全局安装``npm install typings -g``，typings相关地址[https://github.com/typings/typings](https://github.com/typings/typings)

通过``typings search --name <name>`` 可以全名匹配搜索插件

通过``typings search <name>`` 可以模糊搜索插件

通过``typings install <name> --ambient --save`` 可以安装type definition

如何要js文件能够智能提示呢？

**方式一：**可以在js文件中首行使用引用注释的方式：

```javascript
/// <reference path="typings/main.d.ts" />
'use strict';
var fs = require('fs');
fs.access...
```

**方式二：**
把typings文件加入到jsconfig.json中的files项下，不要忘记Reload JavaScript Project

```json
{
  "compilerOptions": {
    "target": "ES6", //可选es3,es5,es6,es2015
    "module": "commonjs", //可选amd,umd,commonjs,system
    "moduleResolution": "node"
  },
  "files": [
    "typings/main.d.ts"
  ]
}
```


**另，附上DefinitelyTyped仓库地址：[https://github.com/DefinitelyTyped/DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped)**

## 6、MORE

更多内容，请查阅：[https://code.visualstudio.com/docs/](https://code.visualstudio.com/docs/)

补充说明，2016-3-18 16:08:01更新

如果在VsCode中开启了EsLint，而又使用了import等语法，请使用如下.eslintrc

```json
{
    "parserOptions": {
        "ecmaVersion": 6,
        "sourceType": "module", //支持import
        "ecmaFeatures": {
            "globalReturn": true,
            "impliedStrict": true,
            "jsx": true,
            "experimentalObjectRestSpread": true,
            "modules": true
        }
    },
    "rules": {
        "semi": 2
    },
    "env": {
      "browser": false,
      "node": true
    }
}
```
