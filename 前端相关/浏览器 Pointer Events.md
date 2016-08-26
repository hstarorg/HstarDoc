## 前言

Pointer Events是一套触控输入处理规格，支持Pointer Events的浏览器包括了IE和Firefox，最近Chrome也宣布即将支持该处理规则。

## PointerEvent

``PointEvent``对象继承自``MouseEvent``，使用上也比较类似。

1. mousedown -> pointerdown
2. mouseenter -> pointerenter
3. mouseleave -> pointerleave
4. mousemove -> pointermove
5. mouseout -> pointerout
6. mouseover -> pointerover
7. mouseup -> pointerup

PointerEvent提供了多有预期的鼠标事件属性，并添加了通用的附加属性，来帮助您区分输入类型和特点。

1. height
2. isPrimary
3. pointerId
4. pointerType
5. pressure
6. tiltX
7. tiltY
8. width

在现在的JS编码中，推荐使用特性检测（以前是浏览器检测）来编写代码，我们可以用以下代码检测浏览器是否支持该特性：

	if (window.PointerEvent) {
	  // Pointer events are supported.
	}

那接下来看一下具体的事件代码：

	window.addEventListener('pointerdown', pointerdownHandler, false);
	
	function pointerdownHandler (evt) {
		console.log(evt)
	}

通过输出，可以更直观的看到PointerEvent的各个属性。

通过浏览器的navigator对象的maxTouthPoints，可以拿到当前设备支持的最大多点触控的数量：

	navigator.maxTouchPoints

从win8开始，IE提供了默认的触摸事件处理，如果想全部由js代码控制触摸事件，那么可以使用：

	touch-action: none;

来禁用默认值。

## 参考资料

[https://msdn.microsoft.com/en-us/library/ie/dn433244(v=vs.85).aspx](https://msdn.microsoft.com/en-us/library/ie/dn433244(v=vs.85).aspx)

[http://www.w3.org/TR/pointerevents/](http://www.w3.org/TR/pointerevents/)