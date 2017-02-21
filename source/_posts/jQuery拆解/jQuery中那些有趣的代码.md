## 0、动态执行JS代码

```javascript
function DOMEval(code, doc) {
		doc = doc || document;
		var script = doc.createElement("script");
		script.text = code;
		doc.head.appendChild(script).parentNode.removeChild(script);
}
```

## 1、