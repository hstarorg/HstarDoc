---
title: Yarn vs. Npm
date: 2017/02/21 14:47:11
---

# 0、什么是 ``Yarn`` ?

官方解释是：**FAST, RELIABLE, AND SECURE DEPENDENCY MANAGEMENT（快速，可靠和安全的依赖管理器）**。

它是 ``facebook`` 开源的一个 ``npm`` 替代品。我们主要用它来进行依赖管理工作。

# 1、为什么需要 ``Yarn`` ?

对于 ``Yarn``，其实一开始我是拒绝的。

为啥？

1. 发布第二天时我就去体验，结果发现安装它自身比较麻烦，而且安装依赖还慢，还非常容易崩溃。
2. 命令和 ``npm`` 不一样，增加了学习成本
3. ``yarn`` 安装依赖进度条在windows上不友好（是npm之前旧版本的样式）
4. 觉得赶超 ``npm`` 还需要一定的时间

那为什么又开始推荐 ``yarn`` 呢？

1. ``npm`` 安装依赖慢，是个长久的问题
2. 再次体验 ``yarn``, 发现之前遇到的一些问题都不见了
3. 使用 ``yarn`` 安装依赖，速度有很大的提升
4、``yarn`` 比 ``npm`` 提供更多更易用的功能 

综上，我觉得现在可以开始尝试使用 ``yarn``，说不定过不了多久，还真能完全替代 ``npm``。

# 2、``yarn-cli`` 使用手册（对比npm）

首先，要使用 ``yarn-cli``，需要先执行 ``npm install -g yarn`` 来全局安装 ``yarn``（莫名的想到，IE浏览器最大的作用就是下载其他浏览器），通过 ``yarn --version`` 来查看 ``yarn`` 的版本。

如 ``npm`` 一样，``yarn`` 也提供了较多的命令。其中最常用的命令如下：

1. yarn init ($ npm init)
2. yarn install ($ npm install) 
3. yarn add ($ npm install --save)
4. yarn remove ($ npm uninstall --save) 
5. yarn publish ($ npm publish)

**注意：下文中仅仅会列出本人觉得比较有代表性/常用的命令，并不是所有的命令**

### 2.1、``yarn init``

``yarn init`` 用于初始化 ``package.json`` 文件，效果和 ``npm init`` 类似。

同样也支持直接创建，不询问。

```bash
# 初始化package.json，带交互
npm init  =>  yarn init

# 初始化package.json，直接创建
npm init -f/--force  =>  yarn init -y/--yes
```

### 2.2、``yarn install``

``yarn install`` 该命令和 ``npm install `` 一样，用于根据 ``package.json`` 来初始化项目依赖。

和 ``npm`` 对比如下：

```bash
# 安装所有依赖
npm install => yarn install

# 安装项目依赖（对比开发依赖，上产线时的依赖）
npm install --production => yarn install --production/--prod 
```

除此之外，``yarn install`` 还有一些新的参数设置，正是这些设置，让 ``yarn`` 比 ``npm`` 有着更强大的功能。

```bash
# 强制安装所有的包，就算是已经安装过的
yarn install --force

# 不会读取和生成lockfile
yarn install --no-lockfile

# 不生成lockfile
yarn install --pure-lockfile
```

### 2.3、``yarn add``

``yarn add <package>`` 等同于 ``npm install <package>``，用于安装指定包，它和 ``npm`` 的区别如下：

```bash
# 仅安装依赖包
npm install <package> --save  =>  N/A

# 安装依赖包，并写入 dependencies 属性
npm install <package> --save  =>  yarn add <package>  

# 安装依赖包，并写入 devDependencies 属性
npm install <package> --save-dev  =>  yarn add <package> --dev

# 安装依赖包，并写入 peerDependencies 属性
N/A  =>  yarn add <package> --peer

# 安装依赖包，并写入 optionalDependencies 属性
npm install <package> --save-optional  =>  yarn add <package> --optional

# 安装精确的版本号的依赖包
# 什么意思呢？简单点说，就是在 package.json中写入的版本号规则不一样。
# 默认场景下，是会写： "xxx":"^1.1.0"，允许使用同一主版本的包，如1.2.0
# 当设置该参数之后，就会变成： "xxx": "1.1.0"，（只能使用该版本号的包）
npm install <package>[@version] --save-exact  => yarn add <package>[@version] --exact

# 安装具有相同次版本号的依赖包
N/A  =>  yarn add <package>[@version] --tilde
```

除此之外，还有一个比较常见的安装包方式，那就是全局安装安装，在 ``yarn`` 中又该如何使用呢？

```bash
# 全局安装依赖包
npm install <package> -g/--global  => yarn global add <package>
```

### 2.4、``yarn remove``

该命令和 ``npm uninstall`` 比较类似，用于删除依赖包。但和 ``npm uninstall`` 又有点不同。

因为它没法直接删除包，而不更新 ``package.json``。

当 ``remove`` 一个包时，它会同时更新 ``package.json`` 中对它的所有引用。

```bash
yarn remove <package> = npm uninstall <package> --save | --save-dev | save-exact | save-optional
```

和 ``yarn add`` 类似，如果要移除全局安装包，需要用 ``yarn global remove <package>``

### 2.5、``yarn publish``

用于将包发布到仓库（当前是npm仓库）上。类似于 ``npm publish``

# 3、其他重要的命令

### 3.1、``yarn run``

该命令和 ``npm run`` 没啥区别，用户执行 ``package.json`` 中 ``script`` 节点中定义的命令。

### 3.2、``yarn self-update``

用于更新自身，如果是 ``npm``，则是： ``npm install -g npm``

### 3.3、``yarn outdated``

检查依赖版本情况，类似 ``npm outdated``

### 3.4、``yarn upgrade``

用于更新版本，类似于 ``npm update``

### 3.5、``yarn config``

该命令用于管理 ``yarn`` 的配置数据。

```bash
# 查看配置数据
npm config list  =>  yarn config list 

# 查看指定的key值
npm config get <key>  =>  yarn config get <key>

# 删除指定的Key
npm config delete <key>  =>  yarn config delete <key>

# 设置指定的key - value
npm config set <key> <value> => yarn config set <key> <value>
```

**由于国内的环境，强烈建议将 ``registry``设置为： ``https://registry.npm.taobao.org/``，命令如下：**

```bash
yarn config set registry https://registry.npm.taobao.org/ -g
```

# 4、参考资料

1. [yarn 文档](https://yarnpkg.com/en/docs/cli/)
2. [npm 文档](https://docs.npmjs.com/cli/)