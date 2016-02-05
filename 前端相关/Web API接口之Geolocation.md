## 0、关于Geolocation

Geolocation，地理位置API。用于获取用户的位置信息。它不算是现有的HTML5标准的“直系”成员，但是是W3C的一个标准。它几乎就是一个真正的JavaScript API！

## 1、位置相关

### 1.1、经纬度表示位置
要想知道用户的位置，就需要有一个坐标系统，这就是我们的经纬度。一般我们用度/分/秒表示经纬度，如果需要将经纬度转换为小数，可以使用如下函数：

    function degreesToDecimal(degrees, minutes, seconds){
      return degrees + (minutes / 60) + (seconds / 3600);
    }
    
###  1.2、API如何确定你的位置

浏览器要获取你的位置信息，并不要求你非得使用最新的智能手机，即使桌面浏览器也能获取你的位置。那么是如何获取到位置的呢？

其实，获取位置信息的方式有很多，比如：

1. IP地址 --通过ip地址库获取你的位置
2. GPS  --通过全球定位系统获取你的位置（高精度）
3. 蜂窝电话  --通过三角定位获取你的位置
4. Wi-Fi  -- 同样适用类似蜂窝电话的三角定位获取位置

我们没办法知道设备是使用的何种方法获取我们的位置信息，一些聪明的浏览器很可能会使用多种方式来确定你的位置。

## 2、如何使用Geolocation

在使用Geolocation之前，我们需要先是否支持，通过如下代码：

    if(navigator.geolocation){
      //Supported.
    } else {
      window.alert('No geolocation support.');
    }

### 2.1、获取位置

获取位置信息的方法是一个异步方法，我们应该如下来使用它：

    if(navigator.geolocation){
      var callback = function(pos){
        console.log('你的位置是：', pos);
      };
      navigator.geolocation.getCurrentPosition(callback);
    } else {
      window.alert('No geolocation support.');
    }

其中pos长什么样呢？大概是如下这个样子的：

    {
      coords： { // Coordinates
        accuracy: 137082,
        altitude: null,
        altitudeAccuracy: null,
        heading: null,
        latitude: 24.1848198,
        longitude: 120.63149479999998,
        speed: null
      },
      timestamp: 1453877895563
    }

其中latitude和longitude就是我们的经纬度了。

该方法的语法是：navigator.geolocation.getCurrentPosition(success[, error[, options]])，具体参数含义，请接着往下看。

### 2.2、监控位置变化

在2.1中，我们知道如何获取位置，那如何监控位置变化呢？很容易相当的办法，就是我们定时去获取位置信息，然后比对。那么有没有更好的方式呢？当然，Geolocation API已经帮我们考虑好了。如下：

    //正常时，会获取到一个地理位置信息
    var watchSuccess = function(pos){
      var latitude = pos.coords.latitude;
      var longitude = pos.coords.longitude;
      console.log('你的经纬度是：', latitude, longitude);
    };
    //错误时，函数会接收一个错误对象
    var watchError = function(err){
      console.warn(err, err.code, err.message);
    };
    var watcherId = navigator.geolocation.watchPosition(watchSuccess, watchError);
    
watchPosition方法的语法是：id = navigator.geolocation.watchPosition(success[, error[, options]])。所以，我们还可以针对这个方法设置参数：

    var options = {
      enableHighAccuracy: false, //默认false，为true时，则选择最高的精度获取位置
      timeout: 5000, //每次获取位置信息的最长时间，默认是无限的
      maximumAge: 0 // 缓存时间（毫秒），如果为0，则每次获取最新的
    };
    
### 2.3 清除监控

既然我们有监控方法，那么该如何停止呢？这就要借助清除监控的方法了，代码如下：

    navigator.geolocation.clearWatch(watcherId);
    
watcherId是2.2中监控时的返回值。

### 2.4、如何计算距离？

给予两个坐标点，如何计算两者之间的距离呢？一般采用半正矢（Haversine）公式，具体代码如下：

  function degreesToRadians(degrees){
    var radians = (degrees * Math.PI) / 180;
    return radians;
  }

  function computeDistince(startCoords, destCoords){
    var Radius = 6371; //每度在地球上的距离（km）
    
    var startLatRads = degreesToRadians(startCoords.latitude);
    var startLongRads = degreesToRadians(startCoords.longitude);
    var destLatRads = degreesToRadians(destCoords.latitude);
    var destLongRads = degreesToRadians(destCoords.longitude);
    
    var distince = Math.acos(
      Math.sin(startLatRads) * Math.sin(destLatRads) + 
      Math.cos(startLatRads) * Math.cos(destLatRads) * 
      Math.cos(startLongRads - destLongRads)
    ) * Radius;
    return distince;
  }
  
## 3、扩展

地理位置API单独使用意义不大，一般来说，结合地图就可以实现很复杂的功能了。

待续...