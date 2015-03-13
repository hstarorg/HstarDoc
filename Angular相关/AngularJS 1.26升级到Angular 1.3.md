##升级AngularJS从1.2.x到1.3.x,需要做的事情：

####$parse####
	due to 77ada4c8
Angular表达式中的function可以不再调用.bind,.call,.apply了。这是为了避免以不可预见的方式改变外部方法的行为。

---
	due to 6081f207
在Angular表达式中，不能再使用proto属性（proto过时）

---
	due to 48fa3aad

避免在Angualr表格式中使用{define,lookup}{Getter,Setter}，如果由于一些原因，你真的需要它们，请wrap/bind 它们使得最小危险程度，然后使得在scope对象中是可访问的

---
	due to 528be29d

避免在Angular表达式中使用对象，如果你需要Object.keys，使它们在scope中是可访问的

---
**Angular.copy:**due to b59b04f9
angular.copy的这个变化使得原始对象的原型适用于复制对象。此前，angular.copy会复制原始对象的作用域链到复制对象。

这意味着，如果你复制对象的本身属性，它将不再包含从原型继承过来的属性。这实际上是更合理的行为

如果这种行为是依赖，在一个app中，


####请注意以下变更使用了不兼容IE8的特性。####
如果你需要兼容IE8，你需要为Object.create和Object.getPrototypeOf提供polyfill（东东）
