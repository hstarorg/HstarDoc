---
title: 快速起步-JSX简介
date: 2017-4-14 14:12:50
react version: 15.5.0
---

# 快速起步-JSX简介

思考这个变量申明：

```js
const element = <h1>Hello, world!</h1>;
```

这个有趣的标签语法既不是字符串也不是HTML。

它被称之为 `JSX`，是 `JavaScript` 的语法扩展。我们建议使用它来定义React的UI展示。`JSX` 可能会让你想起模板语言，但它可以使用 `JavaScript` 的全部功能。

`JSX` 用于编写 `React "elements"`。在 [下一节](【译】快速起步-渲染元素.md)，我们将探索如何将它们渲染到DOM中。下面，我们来了解下 `JSX` 的基础知识。

### 在 `JSX` 中嵌入表达式

你可以在 `JSX` 中通过 `{xxx}` 来嵌入 [JavaScript 表达式](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Expressions_and_Operators#Expressions)。

例如，`2 + 2`, `user.firstName`, 和 `formatName(user)` 都是合法的表达式：

```js{12}
function formatName(user) {
  return user.firstName + ' ' + user.lastName;
}

const user = {
  firstName: 'Harper',
  lastName: 'Perez'
};

const element = (
  <h1>
    Hello, {formatName(user)}!
  </h1>
);

ReactDOM.render(
  element,
  document.getElementById('root')
);
```

[CodePen Demo](http://codepen.io/gaearon/pen/PGEjdG?editors=0010)

为了可读性，我们将 `JSX` 分割为多行。虽然这不是必须的，但在这样做的时候，我们建议将它放在 `{}` 中，以避免 [自动补全分号](http://stackoverflow.com/q/2846283)。

### JSX 也是一个表达式

编译之后，JSX表达式会变成常规的 `JavaScript` 对象。

这意味着你可以在 `if` 语句和 `for` 循环内部使用 `JSX`，也可以将其作为参数传递或用来作为返回值：

```js{3,5}
function getGreeting(user) {
  if (user) {
    return <h1>Hello, {formatName(user)}!</h1>;
  }
  return <h1>Hello, Stranger.</h1>;
}
```

### JSX中指定属性

您可以使用引号将字符串文本指定为属性：

```js
const element = <div tabIndex="0"></div>;
```

你也可以使用 `{}` 将 `JavaScript` 表达式作为属性：

```js
const element = <img src={user.avatarUrl}></img>;
```
在属性中使用 `JavaScript` 表达式时，不要使用引号包裹大括号。否则，JSX会认为属性值是字符串而不是一个表达式。你可以对字符串使用双引号，对表达式使用花括号，但不能同时使用。

### JSX中指定子集

如果是空标签，可以像XML那样使用自闭合标签 `/>`：

```js
const element = <img src={user.avatarUrl} />;
```

JSX 标签也可以包含子集：

```js
const element = (
  <div>
    <h1>Hello!</h1>
    <h2>Good to see you here.</h2>
  </div>
);
```

>**警告:**
>
>由于 JSX 更趋近于 JavaScript 而不是 HTML，React DOM 使用 `camelCase`（小驼峰） 属性命名约定而不是HTML的属性名称。
>
>例如：`class` 在JSX中是 [`className`](https://developer.mozilla.org/en-US/docs/Web/API/Element/className)，`tabindex` 在JSX中是 [`tabIndex`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/tabIndex)。

### JSX 防止注入攻击

在 `JSX` 中嵌入用户输入是安全的：

```js
const title = response.potentiallyMaliciousInput;
// 安全的：
const element = <h1>{title}</h1>;
```

默认情况下，React DOM 会在渲染前使用 [escapes](http://stackoverflow.com/questions/7381974/which-characters-need-to-be-escaped-on-html) 编码所有嵌入 `JSX` 的值。 因此它能确保您永远不会注入任何未明确写入应用程序的内容。所有内容都将在呈现前转换为字符串。这有助于防御 [XSS (cross-site-scripting)](https://en.wikipedia.org/wiki/Cross-site_scripting) 攻击。

### JSX 代表对象

`Babel` 将 `JSX` 编译成 `React.createElement()` 调用。

这两个例子是等同的：

```js
const element = (
  <h1 className="greeting">
    Hello, world!
  </h1>
);
```

```js
const element = React.createElement(
  'h1',
  {className: 'greeting'},
  'Hello, world!'
);
```

`React.createElement()` 会执行一些检查来帮助您编写无误的代码，但基本上，它是创建如下的对象：

```js
// 注意：以下是简单结构
const element = {
  type: 'h1',
  props: {
    className: 'greeting',
    children: 'Hello, world'
  }
};
```

这些对象称之为 "React elements". 你可以将它们视为您想要在屏幕上看到的内容。`React` 会读取这些对象，并使用它们来构造DOM且保持为最新状态。

下一节我们将探索如何渲染 `React elements` 到DOM中。

>**提示:**
>
>我们建议为编辑器选择 `Babel` 语法支持插件，以便 `ES6` 和 `JSX` 都能被高亮显示。