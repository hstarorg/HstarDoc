## 1、NPM是什么？

NPM是JavaScript的包管理工具，在安装NodeJS（什么？你不知道node？来，我们合计合计：[https://nodejs.org/](https://nodejs.org/)）的时候,会自动安装上npm。

要查看安装的npm版本，只需要打开cmd控制台，输入``npm -v``

NPM使得JavaScript开发者分享和重用代码非常容易，同时也让你能否非常方便的更新你分享的代码。

NPM能够自己升级自己，使用命令如下： ``npm install npm -g``

## 2、NPM的使用

以下代码示例中：<>表示必选参数，[]表示可选参数

### #最常用命令
---

#### 2.1、 init：用于初始化项目

	/*
	 * npm init [-f|--force|-y|--yes]
	 */
	
	//在文件夹中打开cmd，然后输入npm init，打开项目初始化向导
	npm init 
	
	//如果文件夹名称满足npm的module name,
	//那么使用如下方式，可以直接生成一个默认的package.json
	//如果文件夹名称不满足要求，那么会出错
	npm init -f
	npm init --force
	npm init --force=true 
	npm init -y
	npm init --yes
	npm init --yes=true


#### 2.2、install：用于安装模块

	/*
	 * npm install (with no args in a package dir)
	 * npm install <tarball file>
	 * npm install <tarball url>
	 * npm install <folder>
	 * npm install [@<scope>/]<name> [--save|--save-dev|--save-optional] [--save-exact]
	 * npm install [@<scope>/]<name>@<tag>
	 * npm install [@<scope>/]<name>@<version>
	 * npm install [@<scope>/]<name>@<version range>
	 * npm i (with any of the previous argument usage)
	 */
	
	//直接使用npm install 或者是npm i，表示根据package.json，安装所有依赖
	npm install
	npm i
	
	//如果加上--production参数，那么只会安装dependencies的模块，
	//而不会安装devDependencies的内模块
	npm install --production
	npm i --production
	
	//使用全局上下文来初始化
	npm install -g
	npm i -g
	
	//安装指定模块
	npm install <packageName>
	npm install <packageName> -g //全局安装
	npm install <packageName>@<version> //指定要安装的模块版本
	npm install <packageName>@<version_start-version_end> //指定要安装的模块版本
	npm install <packageName> --registry=<url> //指定零食的仓库地址
	npm install <packageName> --msvs_version=<vs_version> //指定编译使用的VS版本
	npm install <packageName> --save // 安装模块并修改package.json的dependencies
	npm install <packageName> --save-dev //安装模块并修改package.json的devDependencies
	
	npm install <tarball url> //从指定的压缩包地址安装，示例如下：
	npm install https://github.com/indexzero/forever/tarball/v0.5.6
	
	npm install <tarball file> //从指定的压缩包安装，如下(注意压缩包格式)：
	npm install del-1.2.0.tar.gz //使用.tgz和.tar.gz格式

	npm install @<scope>/<packageName> //安装私有包


#### 2.3、uninstall：用于卸载模块

	/*
	 * npm uninstall [@<scope>/]<package> [--save|--save-dev|--save-optional]
	 */
	
	//直接卸载模块，加上-g参数，表示卸载全局的模块
	npm uninstall <packageName> 
	npm uninstall <packageName> -g
	
	//卸载时同时修改package.json文件
	npm uninstall <packageName> --save-dev
	npm uninstall <packageName> --save

#### 2.4、update：用于更新模块

	/*
	 * npm update [-g] [<name> [<name> ...]]
	 */
	
	//更新一个或多个模块，加上-g参数，表示更新全局的模块
	npm update <packageName> [packageName2...]
	npm update <packageName> [packageName2...] -g
	
	//更新时同时修改package.json文件
	npm update <packageName> [packageName2...] --save-dev
	npm update <packageName> [packageName2...] --save

#### 2.5、config：用于设置npm参数

	//设置指定参数
	npm config set <key> <value> [--global]
	npm set <key> <value> [--global] //可以省略config
	//获取现有参数值
	npm config get <key>
	npm get <key> //可以省略config
	//删除指定参数，此时参数值会变为默认值
	npm config delete <key>
	//查看npm信息；注意：此命令不是查看所有参数配置
	npm config list
	//编辑全量的npm配置文件（.npmrc）
	npm config edit
	//可以将config使用c代替，执行以上所有命令
	npm c [set|get|delete|list]

#### 2.6、cache：管理包缓存

	//将指定的包加入npm缓存
	npm cache add <tarball file>
	npm cache add <folder>
	npm cache add <tarball url>
	npm cache add <name>@<version>
	//查看现有的npm包缓存，如果加上path参数，则查看该路径下的文件
	npm cache ls [<path>] 
	eg: npm cache ls gulp
	//清空缓存。如果加上path，则清理指定路径下的包缓存
	npm cache clean [<path>]
	eg: npm cache clean gulp

