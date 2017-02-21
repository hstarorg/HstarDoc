## 0、准备
首先，我们先创建几个耗时任务：

	public class TestTasks
	{
		//无参、无返回值任务
		public void Task1()
		{
		    Console.WriteLine("task1.");
		    Thread.Sleep(5000);
		    Console.WriteLine("task1 completed.");
		}
	
		//有参数、无返回值任务
		public void Task2(int x)
		{
			if (x < 2000) 
			{
				x += 2000;
			}
		    Console.WriteLine("task2.");
		    Thread.Sleep(x);
		    Console.WriteLine("task2 completed.");
		}
	
		//有参数，有返回值任务
		public int Task3(int x)
	    {
	        if (x < 2000)
	        {
	            x += 2000;
	        }
	        Console.WriteLine("task3.");
	        Thread.Sleep(x);
	        Console.WriteLine("task3 completed.");
	        return x;
	    }
	}

## 1、创建新线程执行方法

	var tt = new TestTasks();

	new Thread(tt.Task1).Start();

	//针对有参数的任务，需要用Lambda进行包装或者使用ParameterizedThreadStart对象
	new Thread(x=>tt.Task2((int)x)).Start((object)1000);

	//使用ParameterizedThreadStart，要求要执行的方法参数必须为object，同时无返回值。
	//new Thread(new ParameterizedThreadStart(tt.Task2)).Start((object)1000);

**注意：使用该方式无法执行带返回值的方法。**

**推荐指数：★★**

## 2、使用异步调用方式执行方法

	var tt = new TestTasks();

	Action ac = tt.Task1;
	Action<int> ac2 = tt.Task2;
	ac.BeginInvoke(null, null);
	ac2.BeginInvoke(1000, null, null);
	
	//以下是调用有参数，有返回值的方法
	//代码一
	private delegate int AsyncCaller(int x); //该代码放在方法体外部
	
    AsyncCaller ac = new AsyncCaller(tt.Task3);
    var asyncResult =  ac.BeginInvoke(1000,null,null);
    int result = ac.EndInvoke(asyncResult); //接收返回值

	//代码二，使用Func简化代码
    Func<int,int> ac = tt.Task3;
    var asyncResult =  ac.BeginInvoke(1000,null,null);
    int result = ac.EndInvoke(asyncResult);

**注意：通过这种方式生成新线程是运行在后台的（background）,优先级为normal**

**推荐指数：★★**

## 3、通过ThreadPool（线程池）执行方法

	var tt = new TestTasks();
          
	ThreadPool.QueueUserWorkItem(o => tt.Task1());
	ThreadPool.QueueUserWorkItem(o => tt.Task2(1000));

**注意：该方式不支持返回值，可以将返回值保存在引入类型的参数上，然后进行迂回实现**

**推荐指数：★★★**

## 4、通过BackgroundWorker（后台Worker）执行方法

	var tt = new TestTasks();
	
	var bw = new BackgroundWorker();
	bw.DoWork += (sender, e) => tt.Task1();
	bw.DoWork += (sender, e) => tt.Task2(1000);	

	//要接收返回值，必须将返回值赋值给Result。
	bw.DoWork += (sender, e) => e.Result = tt.Task3(1000);

	bw.RunWorkerAsync();

	//注册事件使用返回值
	bw.RunWorkerCompleted += (sender, e) => Console.WriteLine(e.Result);

**注意：使用BackgroundWorker注册DoWork事件的任务只能挨个执行，如果要同时执行多个任务，需要多个BackgroundWorker。要使用返回值，一定要记得赋值给Result。**

**推荐指数：★★**

## 5、同时Task执行方法

	var tt = new TestTasks();
	
	var t1 = Task.Factory.StartNew(tt.Task1);
	var t2 = Task.Factory.StartNew(() => tt.Task2(1000));
	var t3 =Task.Factory.StartNew(() => tt.Task3(1000));

	//等待t1,t2,t3执行完成
	Task.WaitAll(t1,t2,t3);
	Console.WriteLine(t3.Result);

**注意：Task具有灵活的控制能力，同时可以单个等待，多个等待。**

**推荐指数：★★★★★**

## 6、使用async/await执行方法

	private async void AsyncRunTask()
	{
	    var tt = new TestTasks();
	    await Task.Factory.StartNew(tt.Task1);
	    await Task.Factory.StartNew(() => tt.Task2(1000));
	    var result = await Task.Factory.StartNew(() => tt.Task3(1000));
	    Console.WriteLine(result);
	}

	AsyncRunTask();
	Console.WriteLine("不用等待，我先执行了。");

**注意：需要Framework4.5的支持**

**推荐指数：★★★★**

## The End

**没有原理，没有言语，相信以大家聪明的大脑，已经学会如何在C#中执行耗时任务和使用多线程了。**

