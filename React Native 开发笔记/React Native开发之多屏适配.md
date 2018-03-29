---
title: React Native开发之多屏适配
date: 2018-3-24 08:56:47
---

# 多屏适配

# 字体不随系统字体缩放

**针对 `iOS`**

需要在 `node_modules/react-native` 中找到 `RCTFont.mm` 文件（在目录中搜索），在其中，可以找到如下代码：

```js
if (scaleMultiplier > 0.0 && scaleMultiplier != 1.0) {
  fontSize = round(fontSize);
}
```

将其注释掉，打包出来的 App，就不会受到系统字体尺寸变化的影响。

**针对 `Android`**

找到 `<souce>/android` 目录下的 `MainActivity.java` 文件。然后引入如下 Package：

```java
import android.content.res.Configuration;
import android.content.res.Resources;
```

接着，在 Class 中，加入如下代码：

```java
@Override
public Resources getResources() {
    Resources res = super.getResources();
    Configuration config=new Configuration();
    config.setToDefaults();
    res.updateConfiguration(config,res.getDisplayMetrics() );
    return res;
}
```
