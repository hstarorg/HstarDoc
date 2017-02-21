---
title: 02_Vue组件（上）
date: 2017/02/21 14:47:10
---

# 0、关于Vue组件

组件是 ``Vue`` 中最强大的功能之一，Vue组件也和angular的组件比较类似，可以扩展HTML元素。在较高层面上，也是自定义元素。

在原生HTML元素上附加功能，``Vue`` 的做法是通过 ``is`` 特性扩展， ``ng2`` 中则称之为属性指令。

# 1、定义组件

在 ``Vue`` 中定义组件是一个很轻松的方式，代码如下：

```javascript
// 定义组件构造器
var Component1 = Vue.extend({

});

// 全局注册组件
Vue.component('component-1', Component1);

// 也可局部注册组件
// 局部注册意味着该组件仅能在包含它的组件中运行，如示例的Parent组件
var Parent = Vue.extend({
  template: '',
  components: {
    'component-1': Component1
  }
});
```

为了足够简单，``Vue`` 还提供了一个语法糖写法如下：

```javascript
// 直接注册组件（不在需要组件构造器）
Vue.component('component1', {

});
// 局部注册同理
var Parent = Vue.extend({
  template: '',
  components: {
    'component-1': {

    }
  }
})
```

该语法实际上是 ``Vue`` 在背后自动调用 ``Vue.extend()``。

除此之外，如果使用 ``.vue`` 格式的组件，我们定义组件的方式如下：

```javascript
<script>
  // 定义一个组件
  export default {

  };
</script>
```

## 组件选项

所谓组件选项，就是在定义组件时，传递给 ``Vue.extend()`` 的参数。

定义组件是相当简单的事情，我们更多的需要去关注组件选项！

先来一个完整的组件选项压压惊：

```javascript
var Component1 = Vue.extend({
  data: {} or fn // 数据对象
  props: [] or {} // 组件可配置的属性
  propsData: {} // 在创建实例时，给属性赋值（用于测试）
  computed: {} // 实例计算属性
  methods: {} // 实例方法
  watch: {} // 监控属性

  el: string or HtmlElement or fn //挂载元素，将组件实例挂载到那儿
  template: string // 组件模板
  replace: boolean // 是否替换挂载元素，和template一起使用，默认true

  init: fn // 生命周期钩子，初始化时调用，此时数据观察、事件和watcher都没初始化
  created: fn // 组件参数已经解析完毕，但还未开始DOM编译
  beforeCompile: fn //开始编译DOM
  compiled: fn // DOM编译完成，数据辩护已经可以触发DOM更新了，但不保证$el已经插入文档
  ready: fn // 编译结束和 $el 第一次插入文档之后调用
  attached: fn // 在$el插入DOM时调用 
  detached: fn // 在$el从DOM元素中删除时调用
  beforeDestroy: fn // 在开始销毁实例时调用
  destroyed: fn // 实例销毁后调用，如果有离开过渡，将会在过渡完成之后调用

  directives: {} // 组件局部注册的指令
  elementDirectives: {} // 组件局部注册的元素指令
  filters: {} // 组件局部注册的过滤器
  components: {} // 组件局部注册的子组件
  transitions: {} // 组件局部注册的动画
  partials: {} // 组件局部注册的分部元素

  parent: Vue实例 // 指定实例的父实例
  events: {} // 事件监听列表对象
  mixins: [] // 组件的混合器
  name: string //组件的名称，允许在自己的模板中调用自己（递归组件非常有效）
  extends: {} or fn // 声明式的扩展组件
});
```

虽然全量的属性比较多，但实际上常用的并不很太多，下面我列一下我比较常用的属性：

```javascript
var Component1 = Vue.extend({
  name: 'component-1',
  data: {
    firstName: 'Hu',
    lastName: 'Jay'
  },
  props: ['height', 'width'],
  template: '<h1>{{fullName}}</h1>',
  replace: true,
  
  filters: {},
  components: {},
  transitions: {},

  methods: {
    doSomething: function(){
      alert(this.fullName);
    }
  },
  events: {
    'do': 'doSomething', //方法名字
    'do1': function(){
      //当捕获 do1 事件时执行
    }
  },
  watch:{},
  computed: {
    fullName: function(){
      return this.firstName + this.lastName;
    }
  }

  created: funciton(){
    // 初始化操作
  },
  ready: funciton(){
    // 如果有DOM操作，那么放在这里
  },
  beforeDestroy: funciton(){
    // 如果某些东西需要手动释放，那么放在这里
  }
});
```

如果是在 ``.vue`` 格式中，我们的用法稍微有点变化，主要是使用ES6的新特性。

```javascript
<style>
  <!-- 放置样式 -->
</style>
<template>
  <!-- 此处放置模板，建议都用一个根元素包裹起来 -->
  <div class="app-component-1">
    <h1>我是模板内容</h1>
  </div>
</template>
<script>
  //放置组件代码
  export default {
    props: [],
    data() { 
      return {};
    },
    created() {

    },
    methods: {
      fun1() {

      },
      fun2() {

      }
    },
    events: {
      'do': function(){

      }
    },
    watch: {
      firstName(newVal, oldVal){

      }
    }
  };
</script>
```

**注意：为什么data在.vue中data是一个方法呢？因为.vue下是使用的ES6的特性，如果是属性的话，就是原型属性，当多个组件时，就会共享同一份原型，导致数据错乱，所以通过function返回一个对象，保证每个组件实例隔离。**
