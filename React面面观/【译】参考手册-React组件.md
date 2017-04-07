---
title: 参考手册-React组件
date: 2017-4-7 13:27:19
version: 15.4.2
---

# React.Component

组件能够让你将UI拆分为多个独立自治并可重用的部分。在 `React` 中提供了 `React.Component`。

## 概述

`React.Component` 是一个抽象基类，直接引用 `React.Component` 无太大意义。反而，我们会用子类来继承它，并至少定义一个 `render()` 方法。

通常您将使用纯 [JavaScript class](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Classes) 来定义一个 `React` 组件：

```javascript
class Greeting extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}
```

如果您还没有使用ES6，可以使用 `React.createClass` 来替代。从 [Using React without ES6](https://facebook.github.io/react/docs/react-without-es6.html) 了解更多。

## 组件生命周期

每个组件都有几个 `生命周期方法`，您可以不同的阶段插入自己的逻辑代码。以 `will` 开头的方法将在事情发生前被调用，以 `did` 开头的方法将在事情发生后被调用。

#### Mounting（挂载）

以下的方法，将在组件实例被创建和插入到DOM前被调用：


- [`constructor()`](#constructor)
- [`componentWillMount()`](#componentwillmount)
- [`render()`](#render)
- [`componentDidMount()`](#componentdidmount)

#### Updating（更新）

属性或状态变化将会引发更新。以下方法将在重绘之前被调用：

- [`componentWillReceiveProps()`](#componentwillreceiveprops)
- [`shouldComponentUpdate()`](#shouldcomponentupdate)
- [`componentWillUpdate()`](#componentwillupdate)
- [`render()`](#render)
- [`componentDidUpdate()`](#componentdidupdate)

#### Unmounting（卸载）

以下方法将在组件开始从DOM移除时被调用：

- [`componentWillUnmount()`](#componentwillunmount)

### 其他APIs

每个组件也都会提供以下几个API：

- [`setState()`](#setstate)
- [`forceUpdate()`](#forceupdate)

### 类属性

- [`defaultProps`](#defaultprops)
- [`displayName`](#displayname)

### 实例属性 

- [`props`](#props)
- [`state`](#state)

* * * 

## 引用

### `render()`

```javascript
render()
```

`render()` 方法是必须的。

当调用 `render()` 方法时，将检查 `this.props` 和 `this.state` 并返回单个React元素。这个元素可以是原生DOM组件，如 `<div />`，也可以是你自定义的复合组件。

如果你不想渲染任何内容，你可以返回 `null` 或者是 `false`。当返回 `null` 或 `false` 时， `ReactDOM.findDOMNode(this)` 也将返回 `null`。

`render()` 函数应该是纯函数，这意味着你不应该修改组件状态，每次调用都应该返回同样的结果，同时也不要直接和浏览器交互（不要操作DOM）。如果你想要操作DOM，请使用 `componentDidMount()` 或其他生命周期方法来替代。使用纯粹的 `render()` 可以使组件易于理解。

> **注意**
>
> `render()` 不会在 [`shouldComponentUpdate()`](#shouldcomponentupdate) 返回 `false` 的时候被调用。

* * *

### `constructor()`

```javascript
constructor(props)
```

React组件的构造函数会在挂载前被调用。当我们在 `React.Component` 的子类中实现构建函数时，我们应该在所有语句之前优先调用 `super(props)`。反之，在构造函数中访问 `this.props` 将会是未定义，这可能会导致bugs。

构造函数是初始化状态的地方。如果你不需要初始化状态，且不绑定方法，那么你不必要实现构造函数。

如果你确信，你可以使用 `props` 来初始化状态。以下是一个合法的 `React.Component` 子类构造函数：

```js
constructor(props) {
  super(props);
  this.state = {
    color: props.initialColor
  };
}
```

当心这种模式，它能够有效的 "forks" 属性且可能会导致bugs。你通常可以使用状态提升来替代同步属性到状态。

如果你想使用 `state` 来 "fork" `props`，你还需要实现 [`componentWillReceiveProps(nextProps)`](#componentwillreceiveprops) 来保持状态是最新的。但是状态提升通常是更容易且不容易出错的。

* * *

### `componentWillMount()`

```javascript
componentWillMount()
```

`componentWillMount()` 将在挂载发生前，被立即调用。它会在 `render` 之前调用，因此在该方法中设置状态将不会触发重新渲染。避免在此方法中引入任何有副作用的行为或者订阅。

这是在服务端渲染中唯一被调用的生命周期钩子。通常，我们用来替代 `constructor()`。

* * *

### `componentDidMount()`

```javascript
componentDidMount()
```

`componentDidMount()` 将在组件挂载之后立即被调用。需要使用 DOM 节点的初始化应该放在这里。如果你需要加载远端数据，这也是处理网络请求的好地方。在这个方法中设置状态将会触发重绘。

* * *

### `componentWillReceiveProps()`

```javascript
componentWillReceiveProps(nextProps)
```

`componentWillReceiveProps()` 将在已经挂载的组件接受到新属性前被调用。如果你需要更新状态来响应属性变化（例如，重置状态），你可以比较 `this.props` 和 `nextProps`，然后使用 `this.setState()` 来处理状态变化。

请注意，就算属性没有变化，React也可能会调用此方法，因此如果你只想到处理有变更的情况，那么请确保比较当前值和下一次的值。这种情况在父组件变更导致你的组件重绘时可能会发生。

在挂载阶段初始化属性React不会调用 `componentWillReceiveProps`。如果一些组件的属性可能会更新，它仅会调用该方法。调用 `this.setState` 通常不会触发 `componentWillReceiveProps`。

* * *

### `shouldComponentUpdate()`

```javascript
shouldComponentUpdate(nextProps, nextState)
```

使用 `shouldComponentUpdate` 让React知道组件的输出不会受到当前状态和属性变更的影响。默认行为是当每次状态变更时都会引发重绘，绝大多数情况下，您应该依赖默认行为。

当收到新的状态或者属性时，将会调用 `shouldComponentUpdate()`。默认值是 `true`。在初次渲染或调用 `forceUpdate()` 时，`shouldComponentUpdate()` 将不会被调用。

返回 `false` 也不会阻止子组件在它们自己的状态变化时重绘。

目前，当 `shouldComponentUpdate()` 返回 `false`，[`componentWillUpdate()`](#componentwillupdate), [`render()`](#render), 和 [`componentDidUpdate()`](#componentdidupdate) 都不会被调用。请注意，未来React可能将 `shouldComponentUpdate()` 作为一个提示而不是一个强制指令，就算是返回 `false` 仍然有可能导致组件重绘。

如果你在监控分析之后，发现特定组件确实非常缓慢，那么可以将其修改为实现了使用浅表属性和状态比较的 `shouldComponentUpdate()` 方法的 `React.PureComponent`。如果你有信心手动确认，你可以比较 `this.props` 与 `nextProps` 以及 `this.state` 与 `nextState` 的值来告诉React本次更新是可以跳过的。

* * *

### `componentWillUpdate()`

```javascript
componentWillUpdate(nextProps, nextState)
```

当接收到新的属性或者状态时，`componentWillUpdate()` 将会在重绘前被立即调用。可以在此处放置一些重绘前的处理逻辑。这个方法在初次绘制时不会被调用。

注意你也不能在此处调用 `this.setState()`。如果你需要更新状态来响应属性变化，请使用 `componentWillReceiveProps()` 替代。

> **注意**
>
> 当 `shouldComponentUpdate()` 返回 false 时，`componentWillUpdate()` 将不会被调用。

* * *

### `componentDidUpdate()`

```javascript
componentDidUpdate(prevProps, prevState)
```

在更新完成之后，`componentDidUpdate()` 会被立即调用。初次绘制不会调用该方法。

在这里可以操作组件更新之后的DOM。在你比较了当前属性和上一次属性之后，这里也适合处理网络请求。（例如：如果属性没有变化，可能不需要一个网络请求。）

> **注意**
>
> 当 `shouldComponentUpdate()` 返回 false 时，`componentWillUpdate()` 将不会被调用。

* * *

### `componentWillUnmount()`

```javascript
componentWillUnmount()
```

在组件卸载和释放之前，将会立即调用 `componentWillUnmount()`。可以在该方法中，执行一些清理动作，如无效的定时器，取消网络请求，或者是清理在 `componentDidMount()` 中创建的DOM元素。 

* * *

### `setState()`

```javascript
setState(nextState, callback)
```

执行它会执行一次浅表复制，将 `nextState` 合并到当前状态上。这也是从事件处理函数和服务请求回调中触发UI更新的主要方法。

第一个参数可以是一个对象（包含0个或多个要更新的key）或者是一个返回包含更新key的对象的函数（传入状态和属性）。

简单对象用法如下：

```javascript
this.setState({mykey: 'my new value'});
```

它也可能传递如下签名 `function(state, props) => newState` 的函数。这将引入一个原子更新，会在设置值之前先查看上一次的状态和属性。例如，我们想每次增加 `props.step` 指定的值：

```javascript
this.setState((prevState, props) => {
  return {myInteger: prevState.myInteger + props.step};
});
```

第二个参数是一个可选的回调函数，它将在 `setState` 完成和组件重绘之后执行一次。通常，我们建议在 `componentDidUpdate()` 中处理这样的逻辑。

`setState()` 不会立即更新 `this.state`，仅会创建一个挂起的状态转换。调用此方法之后访问 `this.state` 可能会返回现有值。

不能确保 `setState` 是同步操作，多次调用 `setState` 可能会进行批处理以提高性能。

`setState()` 将总是导致重绘，除非 `shouldComponentUpdate()` 返回 `false`。如果使用可变对象且不能在 `shouldComponentUpdate()` 中实现条件重绘逻辑，那么可以仅在当前状态与之前不同时，再调用 `setState()` 来避免不必要的重绘。

* * *

### `forceUpdate()`

```javascript
component.forceUpdate(callback)
```

默认情况下，当你的组件状态和属性变化时，组件将会被重绘。如果你的 `render()` 方法中依赖一些其他的数据，你可以调用 `forceUpdate()` 来告诉React需要重绘。

调用 `forceUpdate()` 将导致组件跳过 `shouldComponentUpdate()` 直接调用 `render()`。这也将触发子组件正常的生命周期方法，包括每个子组件的 `shouldComponentUpdate()`。React仍然将只更新标记变化的DOM元素。

通常，你应该避免使用 `forceUpdate()`，仅在 `render()` 中只读取 `this.props` 和 `this.state`。


* * *

## 类属性

### `defaultProps`

能够在组件类自身上定义 `defaultProps` 属性，它将为属性设置默认值。当属性未定义时才会被设置为默认属性值，如果属性值被设置为null，则不会被设置为默认属性值。示例如下：

```js
class CustomButton extends React.Component {
  // ...
}

CustomButton.defaultProps = {
  color: 'blue'
};
```

当 `props.color` 没有提供时，它将被设置为默认值 `'blue'`:


```js
  render() {
    return <CustomButton /> ; // props.color will be set to blue
  }
```

如果 `props.color` 被设置为 null，它仍然是 null:

```js
  render() {
    return <CustomButton color={null} /> ; // props.color will remain null
  }
```

* * *

### `displayName`

`displayName` 字符串用于调试信息。JSX 会自动设置这个值；查看 [深入JSX](【译】高级指南-深入JSX.md) 了解更多。

* * *

### `propTypes`

可以在组件类自身上定义 `propTypes` 属性，用来确定属性的类型。它是属性名称和定义在 `React.PropTypes` 中类型的一个映射。在开发模式中，如果碰到不合法的属性，那么控制台将会打印警告。产线模式下，属性类型检查基于性能考虑将会被跳过。

例如，以下代码确保 `color` 属性是字符串：

```
class CustomButton extends React.Component {
  // ...
}

CustomButton.propTypes = {
  color: React.PropTypes.string
};
```

我们建议您尽可能的使用 [Flow](https://flow.org/)，以便使用编译时的类型检查，而不是运行时的类型检查。查看 [Flow 对 React 的内置支持](https://flow.org/en/docs/frameworks/react/) 来轻松的在 React 应用中使用静态分析。

* * *

## 实例属性

### `props`

`this.props` 包含了组件调用者定义的属性。查看 [组件和属性](【译】快速起步-组件与属性.md) 了解更多。

`this.props.children` 是一个特别的属性，通常是由 JSX 表达式的子标签定义，而不是组件本身的标签。

### `state`

`state` 包含了组件特定的可能随时间变化而变化的数据。 `state` 是用户自定义的，它也是一个纯粹的JavaScript对象。

不需要在 `render()` 中使用的数据，不必要放在 `state` 上。例如，您可以直接在实例上存储定时器ID。

查看 [快速起步-状态和生命周期](【译】快速起步-状态和生命周期.md) 了解更多。

调用 `setState()` 来替代直接修改 `this.state`。保持 `this.state` 是不可变的。