# 章节一、React Native 工具链

React Native 身处由数十种软件工具构成的生态系统中。包含转换器（Babel，Metro 以及 Webpack），包管理工具（NPM，Yarn），检查器，单元测试框架等。本章将介绍语言基础以及需要在您的 React Native 项目中使用到的最小化的开源工具。您可以使用常规的 JavaScript 或者是一些编译到 JavaScript 的语言，如 TypeScript 或者 ES6+ 来编写 React Native 应用。我希望本章能帮助您了解 JavaScript 惊人的速度。

> **Expo**
>
> 最近，React Native 团队与 Expo 合作推出了不需要本地环境支持的开发环境。这是尝试和探索 React Native 非常棒的方式，但是当你想在硬件上运行应用时，一个本地开发环境将至关重要。

## 1.1 配置您的开发环境

如果您也在其他 Web 项目中使用这些工具，您可能会自行排查您的环境。就像木匠在工作现场一样，您需要知道所有的工具是如何运行的以及它们是否需要被调整。React Native 是一个包含 Node.js 、iOS 以及 Android 这三个编程环境的软件包。同时，Node 的包管理工具 NPM，也是需要用到的。

### 问题

React Native 是一个依赖许多不同工具的软件包。我们如何能确保它们都配置正确呢？拭目以待。

#### Node 和 Watchman

Node.js （通常称之为 Node）可以让您的计算机像 Web 浏览器运行 JavaScript 一样运行本地 JavaSript。由于 Node.js 直接在您的操作系统上运行，因此 Node 可以包装或者绑定 C 语言库，同时也能像 `PHP、Python、Perl、Ruby` 一样，解决相同的编程问题。

Watchman 则是一个用于监控本地文件变更并触发对应事件的小工具。使用它可以再您的模拟器上执行更新后的代码而不需要重新编译整个项目。同时，也可以非常简单快速的安装它。

> **安装 Node.js**
>
> 如何安装 Node 取决于您的操作系统，最好的方式是参 [Node.js 官方网站](https://nodejs.org/en/)。如果您使用 Mac OS 系统，您可以使用 Mac OS 的包管理工具 `Homebrew` 来安装 Node.js。

#### 检查 Node.js 是否正确安装

您可能需要在您的电脑上安装多个版本的 Node.js。类似 Node 版本管理器（NVM）这样的工具能够让您在计算机上安装多个版本的 Node.js，这样每个开发项目都可以配置自己的 Node 版本。

POSIX 风格的操作系统（Linux,BSD,Mac OS） 能够使用符号链接（软链接）来支持多版本的 Node.js。

如果您在 Mac OS 上使用 `Homebrew` 安装了两个版本的 Node，也不要诧异。在列出的目录中，除了您自己的用户名和日期信息之外，应该还有如下一些内容：

```bash
$> which node
/usr/local/bin/node
$> node -v
v8.6.0
```

我正在使用 `8.6.0` 版本的 Node；不过，如果我检查 Homebrew 的目录（默认是 /usr/local/Cellar），将能够找到一个符号链接（指向到实际的 Node 地址）：

```bash
$>ls -l /usr/local/bin/node
lrwxr-xr-x 1 jon admin 29 27 Sep 15:14 /usr/local/bin/node -> ../Cellar/node/8.6.0/bin/node
```

更深入一点，我们可以找到被取代的其他版本的 Node。

```bash
$>ls -l /usr/local/Cellar/node
total 0
drwxr-xr-x 14 jon admin 476 11 May 14:14 7.10.0
drwxr-xr-x 14 jon admin 476 25 Apr 13:41 7.9.0
drwxr-xr-x 14 jon admin 448 27 Sep 15:14 8.6.0
```

您计算机上的结果可能有所不同；不过，重要的是您已经安装成功了一个最近版本的 Node，并能够在您的项目中使用。

#### NPM

NPM 包含一个命令行运行的包管理工具以及一个全面的开源软件包仓库。NPM 中的 `react-native` 软件包包含了依赖特定平台的 JavaScript ES6 模块代码。例如 `<Text />` 组件在 `iOS` 上是基于 `RCTText.m`的，在 `Android` 上是基于 `ReactTextView.java`的。

> **如何使用 Yarn？**
>
> React Native 的历史版本使用 NPM，但 Yarn 在 JavaScript 社区中也很流行。Yarn 是仍然依赖于 npm 仓库一个更快的改进。 `yarn.lock` 能够确保依赖得到正确的维护。Yarn 将优先检查 `yarn.lock`，其次检查 `package.json`，实现无缝向 Yarn 过渡。

NPM 包既可以全局运行，也可以在给定项目的 `node_modules` 目录下运行。最好是全局安装 React Native，本地安装项目相关的依赖。这种方式可以让你在任何地方运行 React Native 的命令行工具 `react-native-cli`。React Native 的特定版本则是项目依赖项的一部分。（译者注：使用 `npm i -g react-native-cli` 全局安装命令行工具，使用 `npm i -S react-native` 本地安装 React Native 框架）

#### 检查 NPM 是否正确安装

```bash
$> which npm
/usr/local/bin/npm
```

您的终端（控制台）将返回一个路径。使用如下命令检查 npm 版本：

```bash
$> npm -v
4.2.0
```

#### 安装 React Native 命令行工具

```bash
npm install -g react-native-cli
```

#### Xcode（iOS 开发需要）

Xcode 的 Apple 的官方开发环境，用于构建和运行 Mac OS 和 iOS 的应用程序。你需要安装 Xcode （仅适用于 Mac OS）（译者注：要使用 XCode，请掏钱买 Mac）以编译由 Objective-C 和 Swift 编写的 React Native 组件。

Xcode 还附带了命令行工具，这些通过 Node.js 绑定到 Mac OS 的命令行工具是构建代码所必须的。

> **运行 XCode Beta**
>
> 随着 iOS 的定期更新，在您的开发机器上，可能会有测试版本的 XCode。多个版本的 Xcode 将会导致模拟器也有多个版本。这种情况下，最好是使用 Xcode 而不是使用命令行（译者注：命令行是指 `react-native run-ios`）来启动模拟器。

#### JDK

Android 与 Java 就像糖和黄油，组合在一起将变得美味无比。Android 和 React Native 也不例外。使用 JavaScript 编写的 React 组件能够触及到 Android Java 虚拟机。为了能够本地运行 Android，需要安装 Java Development Kit（JDK）。

[从 Oracle 的官网下载 JDK(至少下载 8 以上版本](http://www.oracle.com/technetwork/java/javase/downloads/index.html)

#### Android Studio

Android Studio 是免费的用于构建和部署 Android 应用程序的官方开发环境。一旦用上了它，随之而来的是另一个包管理工具。幸运的是，“React Native 入门指南” 提供了详细步骤去了解它。

## 1.2 通过 Babel 来编写 ES6

Babel 将 20 年的编程语言，带到了 21 世纪。通过 Babel，您可以使用增强的语法来编写 JavaScript，让您的 JavaScript 代码变得更流畅且更具表现力。它将诸如 数据结构转换、处理作用域中的 this 以及类继承等常见模式编程了语言本身的一部分。

通过一系列语法转换，Babel 实现了对语言本身的语法高进。每个转换器都会运行您的代码，将新的 ES6 语言特性转换为等价的 JavaScript 语法。

通过 `react-native` 预设（译者注：`npm i babel-preset-react-native -D`），以下 ES6 代码将会被自动转换。

将以下内容保存到 `babel-transform.js` 文件中：

```js
AsyncStorage.getItem('loginParameters').then(login => {
  this.setState({ login });
});
```

通过命令行执行：

```bash
$> babel babel-transform.js
```

Babel 将返回（为了可读性，已格式化）：

```js
var _this = this;
AsyncStorage.getItem('loginParams').then(function(login) {
  _this.setState({
    login: login
  });
});
```

React Native 完成了以下事情：

1.  展开 `{ login }` 到 `{ login: login }`
2.  在外部方法中定义 `_this`，并替换 `=>` 运算符
