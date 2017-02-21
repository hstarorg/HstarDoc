# 0、导言

学习一门语言，首先要了解它能做什么？其次，就应该去学习应该如何做。那这个的前提就是语法的学习。

语法决定了代码应该如何写（仅仅是可运行），接着我们就来看看PHP它的语法吧。

*注意：本文测试代码全部运行在PHP7上。*

# 1、基础中的基础

1.1、 PHP文件以 ``.php`` 结尾，对于渲染HTML的PHP文件，其本质还是一个HTML页面，只要可以嵌入PHP逻辑代码。

1.2、 在前端 ``.php`` 文件中，要嵌入PHP代码，需要使用 &lt;?php 你的代码 ?>。

1.3、PHP的每个语句以分号结束（部分场景省略分号也不报错）。

1.4、 PHP中，有两种注释方式。

```php
// 我是单行注释

/*
  我是多行注释
*/
```

1.5、PHP的输出，也有两种方式

一是 ``echo`` 

```
echo 'abc', 'aaaa';
echo('abc', 'aaaa');
```

二是 ``print``

```
print 'abc';
print('abc');
$result = print('abc');
```

**注意：``echo``、``print``即是语言结构，也算是函数，所以可以不加括号调用，也可加括号调用。**

**注意2：``echo`` 输出没有返回值，``print`` 有返回值1。**

**注意3：``echo`` 输出比 ``print`` 快！**

1.6、数据的格式化输出，在输入时，我们可以用更简单的方法拼接字符串

```php
$name = 'Jay';
echo 'My name is {$name}';
echo "My name is {$name}";
print 'My name is {$name}';
print "My name is {$name}";
```

会输出：

```html
 My name is {$name}
 My name is Jay
 My name is {$name}
 My name is Jay
```

**！！！注意：只有当使用双引号（""）包裹字符串的时候，才可以使用简易字符串拼接。**

# 2、数据类型

PHP有个和大多数语言雷同的类型系统，系统提供了如下类型：

1. String（字符串）
2. Integer（整型）
3. Float（浮点型）
4. Boolean（布尔型）
5. Array（数组）
6. Object（对象）
7. NULL（空值）。

PHP中的变量命名以$为标记，之后跟变量名称（变量名字只能包含数字字母和下划线），变量区分大小写。

PHP是弱类型语言，所以同一个变量，可以存储多种类型数据。

```php
$a = '我是字符串'; //定义字符串（单引号，双引号皆可）
echo $a, '<br>';
$a = 10; // 我的整数
echo $a, '<br>';
$a = 0x10; // 定义16进制整数
echo $a, '<br>';
$a = 010; // 定义8进制整数
echo $a, '<br>';
$a = 0.1; // 浮点数
echo $a, '<br>';
$a = 8E-5; // 指数形式定义浮点数
echo $a, '<br>';
$a = true; // Bool类型，只有true,false，注意不区分大小写，写成True，TrUe都没问题。
echo $a, '<br>';
$a = NuLL; // NULL类型只有一个null值，同样不区分大小写。
```

输出如下：

```html
我是字符串<br>
10<br>
16<br>
8<br>
0.1<br>
8.0E-5<br>
1<br>  // 注意，Bool类型，true会输出1，false会输出0
<br> // NULL类型，无任何输出
```

以上演示了PHP中的简单类型，还剩下Array和Object两个复杂类型。

**Array 类型**

数组又分为以下几种：

1. 简单数组（数值数组，下标为数字）

```php
$arr = ['item1', 'item2'];
// 等价于
$arr = array('item1', 'item2');

// 仅能通过下标访问元素
echo $arr[0];
```

2. 关联数组

```php
$arr = ['key1' => 'value1', 'key2' => 'value2'];
//等价于
$arr = array('key1' => 'value1', 'key2' => 'value2');

// 仅能通过key访问
echo $arr['key1'];
```

3. 多维数组（数组包含数组）

```php
$arr = ['key1' => ['a', 'b'], 'key2' => ['c', 'd']];
//等价于
$arr = array('key1' => array('a', 'b'), 'key2' => array('c', 'd'));

// 根据数组类型，通过key或者是下标访问
echo $arr['key1'][0];
```

数组Demo合集：

```php 
$arr = ['item1', 'item2'];
print_r($arr);
echo '<br>'; 
$arr = array('item1', 'item2');
print_r($arr);
echo '<br>'; 
//仅能通过下标访问
echo '$arr第一个元素是：', $arr[0], '<br><br>';

$arr = ['key1' => 'value1', 'key2' => 'value2'];
print_r($arr);
echo '<br>';
$arr = array('key1' => 'value1', 'key2' => 'value2');
print_r($arr);
echo '<br>';
// 通过key访问
echo '$arr的key1值是：', $arr['key1'], 'key2值是：', $arr['key2'], '<br><br>';

$arr = ['key1' => ['a', 'b'], 'key2' => ['c', 'd']];
print_r($arr);
echo '<br>';
$arr = array('key1' => array('a', 'b'), 'key2' => array('c', 'd'));
print_r($arr);
echo '<br>';
// 根据数组类型，通过key或者是下标访问
echo $arr['key1'][0], $arr['key2'][1];
```

**Object 类型**

PHP中的Object类型，和编译性语言比较类似，是通过new class得到的。

```php
class User{
  var $userName;
  function setName($name){
    $this->userName = $name;
  }
  function getName(){
    return $this->userName;
  }
}
$user = new User();
$user->setName('Jay');
echo $user->getName();
```

以上代码会输出：``Jay``

# 4、常量与变量

## 4.1、常量

PHP中的常量必须使用 ``define`` 函数来定义。语法如下：

```php
define(常量名称:string, 常量值, 是否区分大小写:bool-默认为false);

//定义一个常量
define('PI', 3.1415926, true);
```

常量值被定义后，在脚本的其他任何地方都不能被改变，且常量是全局可用的。

## 4.2、变量

PHP的变量有如下几类：

1. local - 局部变量
2. global - 全局变量
3. static - 静态变量
4. parameter - 参数变量

### 4.2.1、局部变量

定义在函数中的变量，被称之为局部变量，只在当前函数有效。

```php
function fun(){
  $funName = 'fun1';
  echo $funName;
}
fun();
echo $funName; // 出现警告：Undefined variable: funName
```

### 4.2.2、全局变量

定义在函数外部的变量则是全局变量，如果要在函数内部使用，则需要使用global关键字。示例如下：

```php
$appName = 'test';

function fun1(){
  // 需要指定，当访问$appName时，是访问全局的$appName，否则会出现一个警告，未定义的变量。
  global $appName; 
  echo $appName;
}

fun1();
```

### 4.2.3、静态变量

局部变量，一般是执行完函数，即被释放。如果想保留该变量，那么就可以使用静态变量。

```php
function funs(){
  $id = 1;
  static $static_id = 1;
  echo '$id = ', $id, ', $static_id=', $static_id, '<br>';
  $id++;
  $static_id++;
}
funs();
funs();
```

输出结果为：

```html
$id = 1, $static_id=1
$id = 1, $static_id=2
```

我们可以看到 ``$static_id`` 并没有被释放，一直有效。

**注意：静态变量本质上还是局部变量。**

### 4.2.4 参数变量

这个没啥好说的，函数参数中的变量，类似于局部变量。

### 4.2.5 超级全局变量

什么是超级全局变量呢？

不需要特别定义，可直接在全局任何地方使用,是PHP预定义的全局变量。它们是：

1. $GLOBALS
2. $_SERVER
3. $_REQUEST
4. $_POST
5. $_GET
6. $_FILES
7. $_ENV
8. $_COOKIE
9. $_SESSION

# 5、其他

完整Demo地址：[PHP语法演示Demo01](https://github.com/hstarorg/HstarDemoProject/blob/master/php_demo/04-grammar/01.php)

更多内容，请看下回分解。