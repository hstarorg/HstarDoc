## 0、前言

在使用VsCode编写TypeScript时，VsCode提供了一个tsconfig.json辅助我们设置TypeScript的配置项，另外使用gulp-typescript或者是webpack编译ts文件时，都可以用到这个配置项来确定如何生成最终的js文件。

那tsconfig.json到底有哪些常用属性，它们又起到什么作用呢？下文将为你一一揭晓。

## 1、tsconfig.json

### 1.1、compilerOptions

tsconfig.json文件中的 ``compilerOptions`` 属性用于确定如何编译ts文件。

其中大概有如下属性：

1.1.1、**module: enum**

``module`` 用于指定模块的代码生成规则，可以使用 ``commonjs`` 、 ``amd`` 、 ``umd`` 、 ``system`` 、 ``es6`` 、 ``es2015`` 、 ``none`` 这些选项。

选择commonJS，会生成符合commonjs规范的文件，使用amd，会生成满足amd规范的文件，使用system会生成使用ES6的system.import的代码。使用es6或者是es2015会生产包含ES6特性的代码。

1.1.2、**target: enum**

``target`` 用于指定生成代码的兼容版本，可以从es3,es5,es2015,es6中选择一个，如果不设置，默认生产的代码兼容到es3。

1.1.3、**sourceMap: boolean**

``sourceMap`` 是是否生成SourceMap的开关，如果设置为true，则会生成.map文件。

1.1.4、 **noImplicitAny: boolean**

``noImplicitAny`` 当表达式和申明 类型为any时，是否需要发出警告，设置true，则不警告

1.1.5、 **removeComments: boolean**

用于指定是否需要输出注释，设置为true，则不输出注释。

1.1.6、 **charset: string**

用于指定ts文件的编码格式

1.1.7、 **declaration: boolean**

是否需要生成定义文件d.ts，设置为true，则生成。

1.1.8、 **diagnostics: boolean**

是否需要显示诊断信息，设置为true，则显示。

1.1.9、 **emitBOM: boolean**

是否需要在输出文件的开头发出一个UTF-8字节顺序标记，设置为true，则输出。

1.1.10、**inlineSourceMap: boolean**

是否需要将sourceMap文件生成到js文件中，设置为true，则生成到js文件中。

**注：此选项和sourceMap、mapRoot选项冲突，会优先使用inlineSouceMap**

1.1.11、**inlineSources： boolean**

用于指定生成的source内容是否inline，如果设置为true，则inline展示（从测试的效果来看，就是生成在js文件中的source map内容要多一些）

**注：该设置项依赖inlineSouceMap设置为true**

1.1.12、**jsx: enum**

用于指定按照何种方式生成jsx代码，可选react和preserve。

1.1.13、**reactNamespace: string**

配置jsx属性使用，指定生成react代码时，需要使用的命名空间。默认""

1.1.14、**listFiles: boolean**

编译时是否需要打印文件列表，设置为true，则打印。默认false

1.1.15、**locale: string**

用于指定本地化错误信息，如果设定为en-us，那么错误信息将显示英文。默认""

1.1.16、**mapRoot: string(uri)**

指定map文件的跟路径，该选项的值影响.map文件中的sources属性。默认""

**注：该选项依赖sourceMap: true**

1.1.17、**newLine: enum**

指定换行符。可选 ``CRLF`` 和 ``LF`` 两种，前者是回车换行，后者是换行。默认是回车换行

1.1.18、**noEmit: boolean**

当设置为true时，将不会输出

1.1.19、**noEmitHelpers: boolean**

设置为true时，不会生成自定义的helper函数。

1.1.20、**noEmitOnError: boolean**

设置为true时，如果遇到了错误，就不再输出

1.1.21、**noLib: boolean**

设置为true时，将不会包含默认的库，如（lib.d.ts）,此时有可能导致找不到Array，String等对象

1.1.22、**noResolve: boolean**

设置为true时，不使用三斜杠引入模块，需要从编译的文件列表中添加。

```javascript
/// <reference path="" />
import PI from './2A.ts';
```

1.1.23、**skipDefaultLibCheck: boolean**

设置为true时，将跳过默认库检查。

1.1.24、**outFile: string(uri)**

设置输出文件，会将多个ts输入文件合并到该文件中

1.1.25、**outDir: string(uri)**

指定输出文件的根目录。

1.1.26、**preserveConstEnums: boolean**

设置为true时，生成代码时不会删除常量枚举声明。

1.1.27、**pretty: boolean**

当设置为true时，错误信息，跟踪信息将带有颜色和样式

1.1.28、**noImplicitUseStrict: boolean**

当设置为true时，编译输出时不会调用'use strict'指令（也就是不生成use strict）

1.1.29、**rootDir: string(uri)**

指定输入文件的根目录。rootDir应包含所有的源文件。

1.1.30、**isolatedModules: boolean**

设置为true时，无条件的触发导入未解决的文件。

1.1.31、**sourceRoot: string(uri)**

设置在调试时定位的目标文件根目录

1.1.32、**suppressExcessPropertyErrors: boolean**

设置为true时，禁止过剩的对象字面量属性检查

1.1.33、**suppressImplicitAnyIndexErrors: boolean**

Suppress noImplicitAny errors for indexing objects lacking index signatures.

1.1.34、**stripInternal: boolean**

设置为true，则遇到@internal注解时，不会触发代码定义。

1.1.35、**watch: boolean**

设置为true时，将监视文件变化。当文件变化时，自动编译

1.1.36、**experimentalDecorators: boolean**

设置为true，则支持ES7的装饰器特性

1.1.37、**emitDecoratorMetadata: boolean**

设置为true，则使用元数据特性

1.1.38、**moduleResolution: string**

指定模块的解析策略，Node或者是classic，默认是classic。

1.1.39、**allowUnusedLabels: boolean**

设置为true时，允许没有用到的标签。

```
l: do{
  console.log('abc');
}while (1 !== 1);
```

以上代码有个未使用的标签l，默认是会报错的。

1.1.40、**noImplicitReturns: boolean**

设置为true时，如果不是函数中的所有路径都有返回值，则提示Error。

```javascript
var a = 2;
function fun(){
  if(a === 1){
    return 'abc';
  }
  //fun函数只有当a = 1的时候，才有确定的返回值。
}
```

1.1.41、**noFallthroughCasesInSwitch: boolean**

设置为true时，将严格校验switch-case语法。

```javascript
function fun2(){
  let key = 'ab';
  switch (key) {
    case 'ab':
      console.log('abc');
  }
}
```

以上代码默认情况不会报错，当设置noFallthroughCasesInSwitch: true时，则会提示错误。

1.1.42、**allowUnreachableCode: boolean**

设置为true时，如果有无法访问的代码，也不会报错。

```javascript
function fun(){
  return 'abc';
  return 'ccc'; //默认会报错，设置allowUnreachableCode为true时，则不报错
}
```

1.1.43、**forceConsistentCasingInFileNames: boolean**

设置为true时，将强制区分大小写。默认为false。

```javascript
//2a.ts
export const PI = 3.1415926;
//1a.ts
import PI from './2A.ts';
function fun(){
  return PI;
}
```

以上代码默认可以通过，当强制区分大小写时，则提示错误 '2a' !== '2A'

1.1.44、**allowSyntheticDefaultImports: boolean**

设置为true时，则允许从没有默认导出的模块中默认导入(也就是不做检查)。

```javascript
//2.ts
export const PI = 3.1415926;
//1.ts
import PI from './2.ts';
function fun(){
  return PI;
}
```

以上代码，默认是会报错的，当设置allowSyntheticDefaultImports时，则不会报错。

1.1.45、**allowJs: boolean**

当设置为true时，js文件也会被编译。

**注意：编译js文件时，如果不另外设置outFile，将不会成功，因为不能够重写源代码文件**

### 1.2、compileOnSave

该属性用于启用保存时编译功能。

***注意：当前仅仅只有VS2015配置TypeScript1.8.4以后或者在atom中搭配atom-typescript插件才有效*

### 1.3、exclude

exclude用于排除不需要编译的ts文件。该属性和files属性冲突。两者只能设置其一。

### 1.4、files

当files属性不存在时，编译器会编译当前目录和子目录中的所有文件。当files属性存在是，仅仅是编译files列表中的文件。

该属性和exclude属性冲突。如果同时指定了exclude和files，则files属性优先。


## 2、常用tsconfig配置

```json
{
  "compilerOptions": {
    "target": "ES5",
    "module": "commonjs",
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "sourceMap": true,
    "noEmitHelpers": true
  },
  "exclude": [
    "node_modules",
    "typings/main",
    "typings/main.d.ts"
  ],
  "compileOnSave": false
}
```

## 3、参考资料

* [https://www.typescriptlang.org/docs/handbook/tsconfig-json.html](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html)
* [http://json.schemastore.org/tsconfig](http://json.schemastore.org/tsconfig)