<style>
.markdown-body pre[lang="answer"]{
  color: white;
}
</style>
## 0、导言

JavaScript超乎寻常的灵活性，让JavaScript可以有很多特殊的用法，让我们来领略一下它们的风采吧。

## 1、哪些不常见（好玩）的题目

---
```javascript
1、 ["1", "2", "3"].map(parseInt)
```
**解析：**
```answer
fdaf
fdasfdas
```


---
```javascript
2、 [typeof null, null instanceof Object]
```

---
```javascript
3、 [ [3,2,1].reduce(Math.pow), [].reduce(Math.pow)] ]
```

---
```javascript
4、 var val = 'smtg';
    console.log('Value is ' + (val === 'smtg') ? 'Something' : 'Nothing');
```

---
```javascript
5、 var name = 'World!';
    (function () {
      if (typeof name === 'undefined') {
        var name = 'Jack';
        console.log('Goodbye ' + name);
      } else {
        console.log('Hello ' + name);
      }
    })();
```

---
```javascript
6、 var END = Math.pow(2, 53);
    var START = END - 100;
    var count = 0;
    for (var i = START; i <= END; i++) {
      count++;
    }
    console.log(count);
```

---
```javascript
7、 var ary = [0,1,2];
    ary[10] = 10;
    ary.filter(function(x) { return x === undefined;});
```

---
```javascript
8、 var two   = 0.2
    var one   = 0.1
    var eight = 0.8
    var six   = 0.6
    [two - one == one, eight - six == two]
```

---
```javascript
9、 function showCase(value) {
      switch(value) {
        case 'A':
          console.log('Case A');
          break;
        case 'B':
          console.log('Case B');
          break;
        case undefined:
          console.log('undefined');
          break;
        default:
          console.log('Do not know!');
      }
    }
    showCase(new String('A'));
```

---
```javascript
10、 function showCase2(value) {
       switch(value) {
       case 'A':
         console.log('Case A');
         break;
       case 'B':
         console.log('Case B');
         break;
       case undefined:
         console.log('undefined');
         break;
       default:
         console.log('Do not know!');
       }
     }
     showCase(String('A'));
```

---
```javascript
11、 function isOdd(num) {
       return num % 2 == 1;
     }
     function isEven(num) {
       return num % 2 == 0;
     }
     function isSane(num) {
       return isEven(num) || isOdd(num);
     }
     var values = [7, 4, '13', -9, Infinity];
     values.map(isSane);
```


---
```javascript
12、 parseInt(3, 8)
     parseInt(3, 2)
     parseInt(3, 0)    
```

---
```javascript
13、 Array.isArray(Array.prototype)
```

---
```javascript
14、 var a = [0];
     if ([0]) { 
       console.log(a == true);
     } else { 
       console.log("wut");
     }
```

---
```javascript
15、 []==[]
```

---
```javascript
16、 '5' + 3  
     '5' - 3
```

---
```javascript
17、 1 + - + + + - + 1 
```

---
```javascript
18、 var ary = Array(3);
     ary[0]=2
     ary.map(function(elem) { return '1'; });
```

---
```javascript
19、 function sidEffecting(ary) { 
       ary[0] = ary[2];
     }
     function bar(a,b,c) { 
       c = 10
       sidEffecting(arguments);
       return a + b + c;
     }
     bar(1,1,1)
```

---
```javascript
20、 var a = 111111111111111110000,
     b = 1111;
     a + b;
```