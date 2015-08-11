在浏览本文之前，建议您先浏览《NPM使用详解（上）》

在上一文中，罗列出了最常用的NPM命令，那么本文将继续分解剩下的NPM命令

---

#### 1、access

#### 2、adduser

	//用于启动在指定的git仓库添加用户的向导
	npm adduser [--registry=url] [--scope=@orgname] [--always-auth]
	//eg:
    npm adduser --registry=http://registry.npmjs.org

#### 3、bin

	//打印出npm执行安装的文件夹
    npm bin

#### 4、bugs

	//查看某个包的issue列表
    npm bugs <pkgname>
	//eg:（将会用浏览器打开https://github.com/sindresorhus/del/issues）
	npm bugs del 
    // 可以直接在一个包的文件夹中执行无参数的命令，将自动打开该包的issue列表
    //eg:(在del文件夹下执行cmd)
    npm bugs

#### 5、build

#### 6、bundle(已过期)

#### 7、completion

#### 8、dedupe

	//
	npm dedupe [package names...]
    //可简化为如下调用
	npm ddp [package names...]

#### 9、deprecate

    //为指定版本的包添加过期警告
	npm deprecate <name>[@<version>] <message>
	// eg:
	npm deprecate my-thing@"< 0.2.3" "critical bug fixed in v0.2.3"

#### 10、dist-tag
	
	npm dist-tag add <pkg>@<version> [<tag>]
	npm dist-tag rm <pkg> <tag>
	npm dist-tag ls [<pkg>]

#### 11、docs
	
	//打开包的文档页面
	npm docs [<pkgname> [<pkgname> ...]]
	npm docs (with no args in a package dir)
    // 打开包的首页readme
	npm home [<pkgname> [<pkgname> ...]]
	npm home (with no args in a package dir)

#### 12、edit

	npm edit <name>[@<version>]

#### 13、explore

	npm explore <name> [ -- <cmd>]

#### 14、help

	//打开本地npm的帮助文件
	npm help <topic>
	npm help some search terms
	//eg:(打开config的本地帮助)
    npm help config

#### 15、help-search

	//从npm的markdown文档中查询所有的term，并展示
	npm help-search some search terms

#### 16、link
	
	npm link (in package folder)
	npm link [@<scope>/]<pkgname>
	npm ln (with any of the previous argument usage)

#### 17、logout

	//从指定的仓库登出
	npm logout [--registry=url] [--scope=@orgname]

#### 18、ls

	//列举当前文件夹下的所有包
	npm list [[@<scope>/]<pkg> ...]
	npm ls [[@<scope>/]<pkg> ...]
	npm la [[@<scope>/]<pkg> ...]
	npm ll [[@<scope>/]<pkg> ...]

#### 19、npm

	npm <command> [args]

#### 20、outdated(☆☆☆☆☆)

	//检查当前文件夹中的包版本（当前，需要，最新）
	npm outdated [<name> [<name> ...]]

#### 21、owner

	//管理包的拥有者
	npm owner ls <package name>
	npm owner add <user> <package name>
	npm owner rm <user> <package name>

#### 22、pack(☆☆☆☆☆)

	//压缩包文件夹
	npm pack [<pkg> [<pkg> ...]]
	//eg：在del目录中直接执行
	npm pack
	//或者在项目目录中，执行
	npm pack del

#### 23、prefix

	//打印本地前缀到控制台，如果-g，则打印全局的前缀

#### 24、prune(☆☆☆☆☆)

	//删除多余的包(如果指定包名，则删除指定的包)
	npm prune [<name> [<name ...]]
	npm prune [<name> [<name ...]] [--production]

#### 25、publish
	
	//发布包
	npm publish <tarball> [--tag <tag>] [--access <public|restricted>]
	npm publish <folder> [--tag <tag>] [--access <public|restricted>]

#### 26、rebuild

	//重新编译包
	npm rebuild [<name> [<name> ...]]
	npm rb [<name> [<name> ...]]

#### 27、repo
	
	//在浏览器中打开包的仓库地址
	npm repo <pkgname>
	npm repo (with no args in a package dir)

#### 28、restart

	//重新启动包
	npm restart [-- <args>]

#### 29、rm

	//移除包
	npm rm <name>
	npm r <name>
	npm uninstall <name>
	npm un <name>

#### 30、root

	//打印node_modules文件夹到控制台
	npm root

#### 31、run-script

	//运行任意的包脚本
	npm run-script [command] [-- <args>]
	npm run [command] [-- <args>]

#### 32、search

#### 33、shrinkwrap

#### 34、star

	//给指定的包加star
	npm star <pkgname> [<pkg>, ...]
	npm unstar <pkgname> [<pkg>, ...]

#### 35、stars

	//查看指定用户的stars
	npm stars
	npm stars [username]

#### 36、start

#### 37、stop

#### 38、tag

#### 39、test

#### 40、unpublish

#### 41、version

	npm version [<newversion> | major | minor | patch | premajor | preminor | prepatch | prerelease]

	//查看项目相关信息
	npm version
	npm version major

#### 42、view

#### 43、whoami


	
