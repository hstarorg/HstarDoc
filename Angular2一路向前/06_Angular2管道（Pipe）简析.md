## 0、Angular2 Pipe

**注：由于Angular2的API好不够稳定，书写该文时，采用的是Angular2 rc1（@angular rc.1）版本，其他版本请自行测试。**

对于 ``Pipe``，其实我们并不陌生。在angular1中，它被称之为 ``filter``。

``Pipe``用于对数据进行格式化处理，就好比管道，一个进一头出，中间过程就是管道的处理逻辑。

Angular2中的 ``Pipe`` 本质上是包含特定方法的类。

## 1、编写一个简单Pipe

``Pipe`` 相对于指令和组件来说，非常简单，我们仅仅需要编写一个类：

```typescript
class EmptyToZero{
  
}
```

实现特定的方法：

```typescript
exprt class EmptyToZero{
  transform(v: any, args: any[]){
    if(v === undefined || v === null || v === ''){
      return 0;
    }
    return v;
  }
}
```

使用 ``Pipe`` 装饰，请设定名称:

```typescript
import {Pipe} from '@angular/core';

@Pipe({ name: 'empty2zero' })
export class EmptyToZero {
  transform(v: any, args: any[]) {
    if (v === undefined || v === null || v === '') {
      return 0;
    }
    return v;
  }
}
```

如何使用？

```html
<span>{{ value | empty2zero}}</span>
```

当然前提是要在Component中申明要使用的Pipe：

```typescript
@Component({
  selector: 'todo-list',
  template: require('./todo-list.component.html'),
  styles : [require('./todo-list.component.css')],
  pipes:[EmptyToZero]
})
```

## 2、有状态的Pipe

在使用 ``Pipe`` 装饰器的时候，我们可以提供两个参数：

```typescript
@Pipe({
  name: 'empty2zero', //string类型，必填项，指定pipe的名称
  pure: true //boolean类型，可选项，默认为true，设定为true时，表示无状态管道。无论是输入或者是什么参数的改变都会触发重新计算结果。
})
```

有状态的 ``Pipe`` 可以收到一个Promise对象或者检测输入和自动订阅输入，最终返回一个可触发的值。

要使用有状态的管道，必须将pure属性设置为false。

比较典型的有状态异步管道如下：

```typescript
import {Pipe} from 'angular2/core';
@Pipe({
    name: 'fetch',
    pure: false
})
export class FetchJsonPipe {
    private fetchedValue:any;
    private fetchPromise:Promise<any>;
    transform(value:string, args:string[]):any {
    if (!this.fetchPromise) {
         this.fetchPromise = window.fetch(value)
        .then((result:any) => result.json())
        .then((json:any) => this.fetchedValue = json);
    }
    return this.fetchedValue;
 }
}
```


