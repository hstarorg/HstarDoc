# 0、 命令行工具
当全局安装模块之后，我们可以在控制台下执行指定的命令来运行操作，如果npm一样。我把这样的模块称之为命令行工具模块（如理解有偏颇，欢迎指正）

# 1、用Node编写命令行工具
在Node中，我们很容易就能实现一个命令行工具。通过借助npm install -g安装，就能直接调用命令行工具了。

### 1.1、创建项目
首先，命令行也是一个node程序，那么首先通过npm init初始化一个Node项目。

```json
// package.json
{
  "name": "newkit-cli",
  "version": "0.0.1",
  "description": "Newkit Management Tools",
  "main": "index.js",
  "scripts": {
    "test": "test"
  },
  "author": "Jay",
  "license": "MIT"
}
```

### 1.2、创建可执行代码

在项目目录下，创建src目录，并在其中创建index.js文件

```javascript
//src/index.js文件内容
console.log('cli');
```
通过``node src/index``就可以执行到段代码了，那如何用自定义命令来执行呢？ 

### 1.3、在package.json中配置自定义命令

在package.json中可以配置bin节点，当全局安装的时候，该节点内容将会被注册为自定义命令。
```json
{
  "name": "newkit-cli",
  "version": "0.0.1",
  "description": "Newkit Management Tools",
  "main": "index.js",
  "bin": {
    "nc": "./src/index.js"
  },
  "scripts": {
    "test": "test"
  },
  "author": "Jay",
  "license": "MIT"
}
```
### 1.4、测试命令

假设我们已经写好了命令行工具了，那我们应该如何测试呢？

我们可以通过``npm install -g``将当前模块安装到全局模块中。然后再执行nc命令来测试。

通过如上步骤，我们发现并不能执行我们的index.js，这是为什么呢？

因为我们并没有指定用什么工具来执行这条命令，所以应该怎么做呢？打开index.js，然后加上一句代码：

```javascript
#!/usr/bin/env node 

console.log('cli');
```
这句代码什么意思呢？这句代码告诉系统，使用node来启动我们的命令。此时再安装，然后执行nc，你会发现，控制台会打印出cli。也就是我们index中代码的执行结果。

至此，我们的一个最简单的命令行执行就开发成功了。

# 2、处理命令行参数

单纯的执行一个命令，似乎不满足我们的实际运用场景，大部分时候我们会使用``nc version``、``nc xxx -a --b``之类的方式来使用命令。那应该如何获取这些命令呢？

### 2.1、使用process来获取控制台参数

将index.js代码修改一下，如下：
```javascript
#!/usr/bin/env node 

console.log('cli');
console.log(process.argv);
```
安装之后，再次执行``nc xxx -a --b true``,会看到如下的输出：

```
cli
[ 'C:\\Program Files\\nodejs\\node.exe',
  'C:\\Users\\jh3r\\AppData\\Roaming\\npm\\node_modules\\newkit-cli\\src\\index.js',
  'xxx',
  '-a',
  '--b',
  'true' ]
```
从结果可以看到，我们所使用所有参数都会传递到程序中去，这个时候，我们就可以解析这些参数，来实现不同的输出了。

### 2.2、使用Commander来开发命令行工具

从上面的输出也可以看到，我们要手动去解析参数的话，还是一个比较复杂的操作。既然身处Node社区，那么完全使用社区流行的包来帮我们简化代码。

Commander 是一款重量轻，表现力和强大的命令行框架。提供了用户命令行输入和参数解析强大功能。

Commander的方便之处在于：自记录代码、自动生成帮助、合并短参数（“ABC”==“-A-B-C”）、默认选项、强制选项​​、命令解析、提示符

我们可以在[https://github.com/tj/commander.js/](https://github.com/tj/commander.js/)找到Commander。

继续改造index.js文件，修改内容为：
```javascript
#!/usr/bin/env node 
var program = require('commander');

program
  .version('0.0.2') //提供命令行工具的版本号，可以通过-V获取到
  // 使用option方法注册命令
  .option('-i, --init [type]', 'Initial Newkit in current folder', (type) => {
    console.log('process', type, program.init);
  }, true)
  .option('-u| --update <module>', 'Update module.', (moduleName) => {
    //使用program.update 来获取默认值，如果有命令行参数，那么会作为回调函数的参数
    console.log(moduleName, program.update);
  }, 'app-common')

  .parse(process.argv);
```
**注意：以上代码有较多注意的点**

1. option方法参数是四个，第一个是命令，第二个是描述，第三个是回调，第四个是命令的默认值
2. 第一个参数中的-i和-u是短命令，--init和--update是长命令。长短命令之间的分隔符可以是``|``和``,``，如果使用逗号分隔，那么可以通过program.init来获取默认值。
3. 在代码中我们在命令中，注意到有``[type]``和``<module>``两种，前者是可选参数，后者的必选参数。

除此之外，还可以使用command方法来实现Git风格的子命令，代码如下：

```javascript
program
  .command('update <module>')
  .action((module, options) => {
    console.log(module);
  });
```
*更多功能，请自行测试*

### 2.3、使用yargs来开发命令行工具

具体代码如下：

```javascript
#!/usr/bin/env node 
var argv = require('yargs')
  .option('i', {
    alias : 'init',
    demand: true,
    default: '',
    describe: 'Project Init',
    type: 'string'
  })
  .usage('Usage: nc init')
  .example('nc init', 'Initial newkit project')
  .help('h')
  .alias('h', 'help')
  .epilog('copyright 2015')
  .argv;

//根据不同的参数来做处理

```
yargs更多信息请参阅：[https://github.com/yargs/yargs](https://github.com/yargs/yargs)

# 3、注意事项

1. 根据Unix的传统，程序执行成功返回0，否则返回1

```javascript
if(err){
  return process.exit(1);
}
process.exit(0);
```
2. 系统信号

```javascript
process.on('SIGINT', function () {
  console.log('Got a SIGINT');
  process.exit(0);
});
//发送系统信号：$ kill -s SIGINT [process_id]
```