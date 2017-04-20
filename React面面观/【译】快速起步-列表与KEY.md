---
title: 快速起步-数组与KEY
date: 2017-4-20 13:34:37
react version: 15.5.0
---

# 数组与KEY

首先，我们来看看如何在 `JavaScript` 中转换列表。

如下代码中，我们使用 `map()` 方法来让我们的数字数组值翻倍。我们通过 `map()` 方法得到了一个新数组，并打印：

```javascript{2}
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map((number) => number * 2);
console.log(doubled);
```
代码将会在控制台上打印：`[2, 4, 6, 8, 10]`。

在 `React` 中，将数组转换为 [elements](【译】快速起步-渲染元素.md) 列表，几乎和上面的代码一样。

### 渲染多个组件

你可以构建元素集合，并使用 `{}` 将它们包含在 `JSX` 中。

下面，我们使用 [`map()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) 来循环一个数字数组。并对每个项目都返回一个 `<li>` 元素。最终将结果赋值给 `listItems`：

```javascript{2-4}
const numbers = [1, 2, 3, 4, 5];
const listItems = numbers.map((number) =>
  <li>{number}</li>
);
```

我们将整个 `listItems` 包含在 `<ul>` 元素中，并渲染到DOM中：

```javascript{2}
ReactDOM.render(
  <ul>{listItems}</ul>,
  document.getElementById('root')
);
```

[Try it on CodePen.](https://codepen.io/gaearon/pen/GjPyQr?editors=0011)

这个代码显示了 1-5 的数字列表。

### 基础列表组件

通常你会在 [组件](【译】快速起步-组件与属性.md) 中显示列表。

我们将上一个示例重构到一个组件中，这个组件接收一个数字数组，并输出一个无序的元素列表。

```javascript{3-5,7,13}
function NumberList(props) {
  const numbers = props.numbers;
  const listItems = numbers.map((number) =>
    <li>{number}</li>
  );
  return (
    <ul>{listItems}</ul>
  );
}

const numbers = [1, 2, 3, 4, 5];
ReactDOM.render(
  <NumberList numbers={numbers} />,
  document.getElementById('root')
);
```

当你运行这段代码时，你会得到 `a key should be provided for list items（应该为列表提供一个key）` 这样的警告。"Key" 是创建元素列表时，需要包含的特殊字符串属性。我们接下来将会讨论为什么 “Key” 对于数组是非常重要的。

我们可以在 `numbers.map()` 方法中给列表项传递一个 `key` 属性，这样可以修复该问题。

```javascript{4}
function NumberList(props) {
  const numbers = props.numbers;
  const listItems = numbers.map((number) =>
    <li key={number.toString()}>
      {number}
    </li>
  );
  return (
    <ul>{listItems}</ul>
  );
}

const numbers = [1, 2, 3, 4, 5];
ReactDOM.render(
  <NumberList numbers={numbers} />,
  document.getElementById('root')
);
```

[Try it on CodePen.](https://codepen.io/gaearon/pen/jrXYRR?editors=0011)

## Keys

Keys 会帮助 React 识别哪些项是修改、新增或者是移除掉的。Keys  会给数组元素一个固定的标识：

```js{3}
const numbers = [1, 2, 3, 4, 5];
const listItems = numbers.map((number) =>
  <li key={number.toString()}>
    {number}
  </li>
);
```

最好的选择 Key 的方式是使用一个唯一字符串来标识列表项。最常用的做法是使用数据项的ID作为 Key：

```js{2}
const todoItems = todos.map((todo) =>
  <li key={todo.id}>
    {todo.text}
  </li>
);
```

当需要渲染的项没有固定的ID时，你可以把项的索引当成 key：

```js{2,3}
const todoItems = todos.map((todo, index) =>
  // Only do this if items have no stable IDs
  <li key={index}>
    {todo.text}
  </li>
);
```
我们并不建议使用索引来作为 key，这可能会很慢。如果有兴趣，可以阅读 [深入理解Key的必要性](https://facebook.github.io/react/docs/reconciliation.html#recursing-on-children)。

### 带Key的组件拆分

Keys 仅仅在数组上下文才有意义。

例如，如果你拆分出一个 `ListItem` 组件，你需要将 Key 设置在 `<ListItem />` 元素上，而不是放在 `ListItem` 组件本身的 `<li>` 上。（PS：设置在循环的ITEM上）

**示例: 不正确的Key用法**

```javascript{4,5,14,15}
function ListItem(props) {
  const value = props.value;
  return (
    // 错误，这里并不需要指定key：
    <li key={value.toString()}>
      {value}
    </li>
  );
}

function NumberList(props) {
  const numbers = props.numbers;
  const listItems = numbers.map((number) =>
    // 错误，这个需要指定key：
    <ListItem value={number} />
  );
  return (
    <ul>
      {listItems}
    </ul>
  );
}

const numbers = [1, 2, 3, 4, 5];
ReactDOM.render(
  <NumberList numbers={numbers} />,
  document.getElementById('root')
);
```

**示例: 正确的 Key 用法**

```javascript{2,3,9,10}
function ListItem(props) {
  // 正确，此处不需要指定key：
  return <li>{props.value}</li>;
}

function NumberList(props) {
  const numbers = props.numbers;
  const listItems = numbers.map((number) =>
    // 正确，应该在这里指定key：
    <ListItem key={number.toString()}
              value={number} />
  );
  return (
    <ul>
      {listItems}
    </ul>
  );
}

const numbers = [1, 2, 3, 4, 5];
ReactDOM.render(
  <NumberList numbers={numbers} />,
  document.getElementById('root')
);
```

[Try it on CodePen.](https://codepen.io/rthor/pen/QKzJKG?editors=0010)

一个很好的经验法则就是 `map()` 方法内的元素需要key。

### Keys 必须在兄弟节点中唯一

数组元素中指定的 key 应该在当前列表中是独立无二的，但不需要全局唯一。我们可以在不同的数组中，使用相同的 key:

```js{2,5,11,12,19,21}
function Blog(props) {
  const sidebar = (
    <ul>
      {props.posts.map((post) =>
        <li key={post.id}>
          {post.title}
        </li>
      )}
    </ul>
  );
  const content = props.posts.map((post) =>
    <div key={post.id}>
      <h3>{post.title}</h3>
      <p>{post.content}</p>
    </div>
  );
  return (
    <div>
      {sidebar}
      <hr />
      {content}
    </div>
  );
}

const posts = [
  {id: 1, title: 'Hello World', content: 'Welcome to learning React!'},
  {id: 2, title: 'Installation', content: 'You can install React from npm.'}
];
ReactDOM.render(
  <Blog posts={posts} />,
  document.getElementById('root')
);
```

[Try it on CodePen.](https://codepen.io/gaearon/pen/NRZYGN?editors=0010)

Keys 为 React 提供了一些隐藏信息，但不会传递给您的组件。如果你的组件中需要相同的值，请通过其他不同的属性名称进行传递：

```js{3,4}
const content = posts.map((post) =>
  <Post
    key={post.id}
    id={post.id}
    title={post.title} />
);
```

以上这个例子，`Post` 组件能够读取到 `props.id`，但读取不到 `props.key`。

### 在 JSX 中嵌入 `map()`

在上面的例子中，我们定义了一个独立的 `listItems` 变量，并在 JSX 中进行了使用：

```js{3-6}
function NumberList(props) {
  const numbers = props.numbers;
  const listItems = numbers.map((number) =>
    <ListItem key={number.toString()}
              value={number} />
  );
  return (
    <ul>
      {listItems}
    </ul>
  );
}
```
JSX 允许在 `{}` 中嵌入表达式，所以我们内联 `map()` 的结果：

```js{5-8}
function NumberList(props) {
  const numbers = props.numbers;
  return (
    <ul>
      {numbers.map((number) =>
        <ListItem key={number.toString()}
                  value={number} />
      )}
    </ul>
  );
}
```

[Try it on CodePen.](https://codepen.io/gaearon/pen/BLvYrB?editors=0010)

有时这会让代码更清晰，但这种风格也可能被滥用。像JavaScript一样，是否值得提取为变量是由你决定的。请记住，如果 `map()` 嵌套太多，那么是时候进行组件拆分了。