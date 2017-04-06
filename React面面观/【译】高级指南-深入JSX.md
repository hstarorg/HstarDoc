---
title: 高级指南-深入JSX
date: 2017-4-5 17:13:09
---

# 深入JSX

从根本上来讲，`JSX` 仅仅是提供 `React.createElement(component, props, ...children)` 方法的语法糖。

JS代码：

```js
<MyButton color="blue" shadowSize={2}>
  Click Me
</MyButton>
```

将会被编译为：

```js
React.createElement(
  MyButton,
  {color: 'blue', shadowSize: 2},
  'Click Me'
)
```

如果它们（组件/元素）没有子元素，也可以使用自闭合的标签形式，如：

```js
<div className="sidebar" />
```

将会被编译为：

```
React.createElement(
  'div',
  {className: 'sidebar'},
  null
)
```

如果你要测试特定的 `JSX` 将会转换为怎样的 `JavaScript` 代码，可以使用：[the online Babel compiler](https://babeljs.io/repl/#?babili=false&evaluate=true&lineWrap=false&presets=es2015%2Creact%2Cstage-0&targets=&browsers=&builtIns=false&code=function%20hello()%20%7B%0A%20%20return%20%3Cdiv%3EHello%20world!%3C%2Fdiv%3E%3B%0A%7D).

## 指定React元素类型

`JSX` 标签的第一部分，决定了该元素的类型。

大写开头的 `JSX标签` 是表示 `React` 组件。这些标签将被编译为对命名变量的直接引用。所以，如果要使用 `<Foo />` 表达式，必须要保证 `Foo` 必须在作用域内。

### React必须在作用域内

由于 `JSX` 编译为调用 `React.createElement`，那么 `React` 库也必须在 `JSX 代码` 所在的作用域内。

例如，即使 `React` 和 `CustomButton` 没有直接在 `JavaScript` 中被引用，顶部的 `import` 语句也是必须的：

```js{1,2,5}
import React from 'react';
import CustomButton from './CustomButton';

function WarningButton() {
  // return React.createElement(CustomButton, {color: 'red'}, null);
  return <CustomButton color="red" />;
}
```

即使你没有使用打包工具，且是从 script 标签引入 `React`，`React` 也是以全局变量的形式存在于作用域内。

### 对JSX类型使用点分割

你们同样可以使用点表示法来引入 `React` 组件。如果您有一个导出了多个组件的模块，这样做会很方便。例如，如果 `MyComponents.DatePicker` 是一个组件，我们可以采用如下方式引入：

```js{10}
import React from 'react';

const MyComponents = {
  DatePicker: function DatePicker(props) {
    return <div>Imagine a {props.color} datepicker here.</div>;
  }
}

function BlueDatePicker() {
  return <MyComponents.DatePicker color="blue" />;
}
```

### 用户定义的组件必须大写

当一个元素类型是以小写字母开头的，它指的是内置组件，如 `<div>` 或 `<span>`，并将字符串 `'div'` 或 `'span'` 传递给 `React.createElement`。以大写开头的类型如 `<Foo />` 将被编译为 `React.createElement(Foo)`，对应在 `JavaScript` 中定义或导入的组件。

我们建议使用大写字母开头来命名组件。如果您的组件以小写字母开头，请在使用 `JSX` 之前将其赋值给大写的变量。

例如，以下代码不会如预期运行：

```js{3,4,10,11}
import React from 'react';

// 错误！组件应该大写开头
function hello(props) {
  // 正确！div是一个合法的html标签，如下使用是可行的：
  return <div>Hello {props.toWhat}</div>;
}

function HelloWorld() {
  // 错误！ React 认为 <hello /> 是一个HTML标签，因为它不是大写开头的：
  return <hello toWhat="World" />;
}
```

要想解决该问题，我们必须将 `hello` 重命名为 `Hello`，并使用 `<Hello />` 来引用它：

```js{3,4,10,11}
import React from 'react';

// 正确！组件大写开头：
function Hello(props) {
  // 正确！
  return <div>Hello {props.toWhat}</div>;
}

function HelloWorld() {
  // 正确！React 认为 <Hello /> 是一个组件。
  return <Hello toWhat="World" />;
}
```

### 在运行时选择类型

你不能使用一个常规表达式作为 `React元素` 的类型。如果你想用常规表达式来表明元素的的类型，请先将它赋值给一个大写变量。当您要根据属性的变化来渲染不同的组件时，将会遇到此场景：

```js{10,11}
import React from 'react';
import { PhotoStory, VideoStory } from './stories';

const components = {
  photo: PhotoStory,
  video: VideoStory
};

function Story(props) {
  // 错误！JSX类型不能是一个表达式。
  return <components[props.storyType] story={props.story} />;
}
```

要想解决这个问题，我们可以将值赋给一个大写变量。

```js{9-11}
import React from 'react';
import { PhotoStory, VideoStory } from './stories';

const components = {
  photo: PhotoStory,
  video: VideoStory
};

function Story(props) {
  // 正确！大写开头的变量能够被正确识别。
  const SpecificStory = components[props.storyType];
  return <SpecificStory story={props.story} />;
}
```

## JSX 中的属性（Props）

在 `JSX` 中，有多种不同的方式来指定属性。

### JavaScript表达式

你可以将 `JavaScript` 表达式传递为属性，使用 `{}` 包裹。例如：

```js
<MyComponent foo={1 + 2 + 3 + 4} />
```

对于 `MyComponent`， `props.foo` 的值将会是 `10`，因为表达式 `1+2+3+4` 会被计算。

`if` 语句和 `for` 循环语句在 `JavaScript` 中不是表达式，所以不能直接在 `JSX` 中使用。相反，你可以将它们放在代码中使用，例如：

```js{3-7}
function NumberDescriber(props) {
  let description;
  if (props.number % 2 == 0) {
    description = <strong>even</strong>;
  } else {
    description = <i>odd</i>;
  }
  return <div>{props.number} is an {description} number</div>;
}
```

### 字符串

你可以将字符串传递给属性，以下两种方式是等效的：

```js
<MyComponent message="hello world" />

<MyComponent message={'hello world'} />
```

当你传递字符串时，它的值是未转义的。所以，以下两种方式也是等效的：

```js
<MyComponent message="&lt;3" />

<MyComponent message={'<3'} />
```

这种行为通常是不相关的，在这里提到只是说我们可以这样去用。

### 属性默认值为"True"

当我们传递一个无值的属性，它的默认值是`true`。以下两个语法也是等价的：

```js
<MyTextBox autocomplete />

<MyTextBox autocomplete={true} />
```

一般来说，我们不建议这样使用，因为它可能与[ES6对象简写](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Operators/Object_initializer#New_notations_in_ECMAScript_2015) `{foo: foo}` 简写为 `{foo}` 混淆。这种形式之所以存在，是因为它符合HTML的规则。

### 属性扩散（Spread Attributes）

如果你已经有了一个对象 `props`，你又想将它传递到 `JSX`，那么可以使用 `...` 来实现扩散操作，将整个 `props` 对象进行传递。以下两个组件也是等价的：

```js{7}
function App1() {
  return <Greeting firstName="Ben" lastName="Hector" />;
}

function App2() {
  const props = {firstName: 'Ben', lastName: 'Hector'};
  return <Greeting {...props} />;
}
```

当你构建通用的容器时，属性扩散是非常有用的。然而，它们也非常容易传递给组件很多不相关的属性，从而导致代码变得凌乱。我们建议谨慎的使用此语法。

## JSX中的子元素

在包含开始和结束标签的JSX表达式中，标签之间的内容将传递给特定属性 `props.children`。有几种不同的方法来传递子元素：

### 字符串

你可以将字符串放在开始和结束标签中，此时 `props.children` 就只是该字符串。这对于很多内置的HTML元素很有用。例如：

```js
<MyComponent>Hello world!</MyComponent>
```
这是一个合法的JSX，`MyComponent` 中的 `props.children` 是一个简单的字符串 `Hello world!`。HTML是未转义的，所以同样可以使用如下方式书写：

```html
<div>This is valid HTML &amp; JSX at the same time.</div>
```

JSX在行首和行尾移除空格。它也移除空行。与标签向邻的新行会被删除，文本字符串之间的新行会被压缩为一个空格。如下以下的几种方式都是等同的：

```js
<div>Hello World</div>

<div>
  Hello World
</div>

<div>
  Hello
  World
</div>

<div>

  Hello World
</div>
```

### JSX Children

你能够提供多个JSX元素做为子元素。这对于显示嵌套组件非常有用：

```js
<MyContainer>
  <MyFirstComponent />
  <MySecondComponent />
</MyContainer>
```

你也能够组合多种类型的子元素，所以你可以一起使用字符串和JSX组件。这是JSX的类型与HTML的一种形式，这样JSX和HTML都是有效的。


```html
<div>
  Here is a list:
  <ul>
    <li>Item 1</li>
    <li>Item 2</li>
  </ul>
</div>
```

一个 `React` 组件不能返回多个React元素，但是单个的 `JSX表达式` 能够有多个子元素，所以如果你想一个组件包含多个子元素，你可以使用 `div` 来包装，如上。

### JavaScript表达式

你也可以传递 JavaScript表达式 来作为子元素，将其包含在 `{}` 内。例如，以下的表达式是等价的：

```js
<MyComponent>foo</MyComponent>

<MyComponent>{'foo'}</MyComponent>
```
这对于展示任意长度的列表是非常有用的。例如，渲染HTML列表：

```js{2,9}
function Item(props) {
  return <li>{props.message}</li>;
}

function TodoList() {
  const todos = ['finish doc', 'submit pr', 'nag dan to review'];
  return (
    <ul>
      {todos.map((message) => <Item key={message} message={message} />)}
    </ul>
  );
}
```
JavaScript表达式也可以和其他类型的子元素组合。通常用于替代字符串模板：

```js{2}
function Hello(props) {
  return <div>Hello {props.addressee}!</div>;
}
```

### 函数作为子元素

通常，JSX中的JavaScript表达式将会被计算为字符串，React元素或者是这些内容的一个列表。然而，`props.children` 就像其他属性一样工作，它可以传递任何类型的数据，而不仅仅是React知道如何渲染的类型。例如，如果你有一个自定义组件，你可以将它作为 `props.children` 进行回调：

```js{4,13}
// Calls the children callback numTimes to produce a repeated component
function Repeat(props) {
  let items = [];
  for (let i = 0; i < props.numTimes; i++) {
    items.push(props.children(i));
  }
  return <div>{items}</div>;
}

function ListOfTenThings() {
  return (
    <Repeat numTimes={10}>
      {(index) => <div key={index}>This is item {index} in the list</div>}
    </Repeat>
  );
}
```

传递给自定义组件的子元素可以是任何东西，只要在该组件呈现之前被转换成React能够理解的东西。这种用法并不常见，但如果你想扩展JSX，它也是可以工作的。

### 布尔值，NULL和Undefined将被忽略

`false, null, undefined, true` 都是合法的子元素。它们根本不会被渲染。以下的JSX表达式都会渲染出同样的结果：


```js
<div />

<div></div>

<div>{false}</div>

<div>{null}</div>

<div>{undefined}</div>

<div>{true}</div>
```

这有助于条件渲染其他React元素，以下JSX 当 `showHeader` 为 `true` 时，才仅仅渲染 `<Header />`：


```js{2}
<div>
  {showHeader && <Header />}
  <Content />
</div>
```

值得注意的是有一些 ["falsy" values](https://developer.mozilla.org/en-US/docs/Glossary/Falsy)（一些JS中转换为false的值），如数字0，仍然会被React渲染。例如，以下代码不会像你预期的那样工作，当 `props.messages` 为空数组时，也会打印0出来：

```js{2}
<div>
  {props.messages.length &&
    <MessageList messages={props.messages} />
  }
</div>
```

想解决这个问题，确保 `&&` 之前总是布尔值：


```js{2}
<div>
  {props.messages.length > 0 &&
    <MessageList messages={props.messages} />
  }
</div>
```

反之，如果你想渲染 `false, true, null, undefined` 等值，你可以先将它们转换为字符串：

```js{2}
<div>
  My JavaScript variable is {String(myVariable)}.
</div>
```