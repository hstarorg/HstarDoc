## 0、Angular2组件

**注：由于Angular2的API好不够稳定，书写该文时，采用的是Angular2 rc1（@angular rc.1）版本，其他版本请自行测试。**

在上篇中，我们已经讲到了指令，这篇呢，我们一起来看看Angular2组件是怎么一回事。

首先，组件也是指令，组件是一种有模板（内嵌视图）的特殊指令。

从元数据[指令源代码](https://github.com/angular/angular/blob/2.0.0-rc.1/modules/%40angular/core/src/metadata/directives.ts)中也可以看出组件与指令的关系：

```typescript
export class ComponentMetadata extends DirectiveMetadata {
  
}
```

相比 ``Directive``, ``Component`` 新增了一些属性，如下：

```typescript
{
  changeDetection : ChangeDetectionStrategy; 定义变化检测类型
  viewProviders: any[]; 用于在组件中注入特定的class。一般是实体类
  moduleId: string; 定义主键的ID
  templateUrl: string; 如ng1，外部模板地址
  template: string; 如ng1，内嵌模板内容
  styleUrls: string[]; 外部样式表文件
  styles: string[]; 内嵌样式
  directives: Array<Type | any[]>; 使用到的指令
  pipes: Array<Type | any[]>; 使用到的管道
  encapsulation: ViewEncapsulation  封装视图的类型
}
```

## 1、组件生命周期

既然组件也是指令，那么指令所拥有的四大阶段组件也同样拥有。

而且，由于组件带有视图，还多了几个和视图相关的生命周期阶段。如下：

1. ngAfterContentInit 组件内容渲染到页面之后触发
2. ngAfterContentChecked 检查组件内容绑定数据后触发
3. ngAfterViewInit 创建组件视图之后触发
4. ngAfterViewChecked 检查组件视图绑定数据后触发

它们的执行顺序也和以上顺序一致。

## 2、整一个组件试试？

接下来，我们就简单实现一个组件 ``TodoList`` 来实验一下以上的知识点。

首先，搭建好一个简单的架子，如下：

```typescript
import {Component} from '@angular/core';

@Component({
  selector: 'todo-list'
})

export class TodoListComponent{
  constructor(){
    
  }
}
```

使用组件装饰器 ``Component`` 来定义一个组件，注意其中 ``selector`` 属性和 ``Directive`` 中的写法不一样了。

组件必须以标签的方式存在，所以 selector 属性值仅仅只需要写标签名就可以了，不再需要其他特别的符号了。 

组件和指令最大的差别就在于模板，所以我们接下来添加上模板代码：

```typescript
import {Component} from '@angular/core';

@Component({
  selector: 'todo-list',
  template: `
<div class="todo-list">
  <h1>Todo List</li>
  <ul>
    <li></li>
  </ul>
</div> 
  `
})

export class TodoListComponent{
  constructor(){
    
  }
}
```

如上，一个简单的模板就搞好了。这里需要注意 ``templateUrl`` 和 ``template`` 是互斥的两个属性。一般来说只选择一个赋值，如果两者都存在，那么会采用 ``tempalte`` 的值。

模板有了，我们就来点业务逻辑：

先假设Todo有三个状态：

```typescript
enum TodoStatus {
  Open,
  Processing,
  Closed
}
```

在来定义Todo的实体类：

```typescript
class Todo {

  private name: string;

  private description: string;

  private status: TodoStatus;

  constructor(name: string, status: TodoStatus, description?: string) {
    this.name = name;
    this.status = status;
    this.description = description || '';
  }
}
```

接着来实现一个组件：

```typescript
@Component({
  selector: 'todo-list',
  template: require('./todo-list.component.html')
})
export class TodoList {

  private todos: Array<Todo>;

  private todo: { name: string, desc: string } = { name: '', desc: '' };

  constructor() {
    this.todos = [];
  }

  addTodo() {
    this.todos.push(new Todo(this.todo.name, TodoStatus.Open, this.todo.desc));
  }
}
```

这个时候，HTML页面内容如下：

```html
<div *ngIf="todos.length === 0">No todos.</div>
<ul class="todo-list">
  <li *ngFor="let todo of todos">
    {{todo.name}} - {{todo.description}}
  </li>
</ul>
<hr>
<div class="todo-edit">
  Name: <input type="text" [(ngModel)]="todo.name">
  <br>
  Description: <br>
  <textarea name="" id="" cols="30" rows="3" [(ngModel)]="todo.desc"></textarea>
  <br>
  <button (click)="addTodo()">Add Todo</button>
</div>
```

功能做好了，我们得给它来点样式美化。

此时我们仅仅需要实现一点样式：

```css
.todo-list{
  margin: 0;
  padding: 0;
}
.todo-list li{
  list-style: none;
  border: 1px solid red;
}
```

然后在组件装饰器中申明就可以了：

```typescript
@Component({
  selector: 'todo-list',
  template: require('./todo-list.component.html'),
  styles : [require('./todo-list.component.css')]
})
```

至此，一个简单的可以添加todo的todo-list就已经完成了。

**注意：注入@Input，@Output之类的和Directive都是一样的，此处就不再演示了。**