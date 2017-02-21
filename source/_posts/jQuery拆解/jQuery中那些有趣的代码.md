---
title: jQuery中那些有趣的代码
date: 2017/02/21 14:47:10
---

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