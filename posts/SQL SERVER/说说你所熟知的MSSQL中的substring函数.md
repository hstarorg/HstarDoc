说说你所熟知的MSSQL中的substring函数

###函数签名：

	substring
		--expression (varchar,nvarchar,text,ntext,varbinary,or image)
		--Starting position (bigint)
		--Length (bigint)

	从函数名称来看，是截取字符串内容。
	从函数签名来看，不仅能截取字符串内容，还能截取二进制内容
	
###那么，你觉得如下应该sql语句应该是什么结果呢？
	
	select subString('123456',0,1)
	select subString('123456',1,1)
	select subString('123456',-1,2)
	select subString('123456',-1,3) 

###如果想好了，但不确定，那赶紧打开工具执行看看吧
	
	你答对了吗？为什么会是那些结果，能解释吗？

###三大知识点：
	
	1. MSSQL中，下标从1开始，注意：不是大多数编程语言采用的1。
	2. substring函数的调用substring(str,startIndex,length)
	   效果上是转换为substring(str,startIndex,endIndex)来运算的，
	   endIndex=startIndex+length。
	3. 对于区间取值，采取的是前闭后开的策略，也有是说包含开始下标，但是不包含结束下标。

### 那么能解释上面的代码了吗？

