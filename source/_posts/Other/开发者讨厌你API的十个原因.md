##1、文档的吸引力太弱##
###解决之道###
1. 采用大图片：[示例站点](https://www.twilio.com/docs)
2. 文档清晰度：[示例站点](https://stripe.com/docs/api)
3. 文档易于查找：[示例站点](https://stripe.com/docs/)
4. 生动的文档：
	1. [Swagger](https://github.com/wordnik/swagger-core)
	2. [I/O Docs](https://github.com/mashery/iodocs)
	3. 采用RAML(RESTful API 模型语言) [RAML官网](raml.org)
	
##2、您的沟通技能需要工作（你不能保证开发者始终被通知到）
###解决之道###
1. 使用变更日志：[http://developer.github.com/changes/](http://developer.github.com/changes/)
2. 使用路线图：[https://developers.facebook.com/roadmap/](https://developers.facebook.com/roadmap/)
3. 采用发布日志：[http://techblog.constantcontact.com/api/release-updates](http://techblog.constantcontact.com/api/release-updates)
4. 使用博客（Blog）：[http://aws.typepad.com/](http://aws.typepad.com/)
5. 使用论坛（Forum）：[http://stackoverflow.com/questions/tagged/soundcloud](http://stackoverflow.com/questions/tagged/soundcloud)
6. 邮件通知

##3、你不能使API使用简单##
###解决之道###
1. 说明你是做什么的：[https://www.twilio.com/voice/api](https://www.twilio.com/voice/api)
2. 支持快速注册：[https://manage.stripe.com/register](https://manage.stripe.com/register)
3. 使用step1-step2-step3说明使用步骤：[示例站点](http://developer.constantcontact.com/get-started.html)
4. 提供快速入门手册：[https://www.twilio.com/docs/quickstart](https://www.twilio.com/docs/quickstart)
5. 提供免费版或者免费试用版：[https://parse.com/plans](https://parse.com/plans)
6. 提供丰富的SDK（支持多种开发语言）
7. 使用GitHub ：[https://github.com/OneNoteDev](https://github.com/OneNoteDev)

##4、没有提供法律申明##
###解决之道###
1. 要明确权利与义务：[http://500px.com/terms](http://500px.com/terms)
2. 编写使用协议：[https://www.etsy.com/developers/terms-of-use](https://www.etsy.com/developers/terms-of-use)
3. 申明越短越好：[http://googledevelopers.blogspot.com](http://googledevelopers.blogspot.com)
4. 申明要想长远：[https://developers.google.com/youtube/terms](https://developers.google.com/youtube/terms)
5. 分享你的财富：[http://slideshare.net/jmusser](http://slideshare.net/jmusser)

##5、你的API不可靠（慢、错误、不可靠）##
API会被停运(Outage)、Bug、速率(Rate limit)、变更(包含有计划的变更和未被文档跟踪的变更)、ToS违规、Provider biz change、网络等原因影响。

不要让API返回未知的错误信息，让用户迷惑。
###解决之道###
1. 使用状态页：[http://status.aws.amazon.com/](http://status.aws.amazon.com/)
2. 监控API：[http://www.apiscience.com](http://www.apiscience.com)
3. 不要隐藏API的变化，如停运：[http://blog.akismet.com](http://blog.akismet.com)

##6、没有提供能帮助我调用成功的工具##
###解决之道###
1. 提供开发者仪表板：[https://manage.stripe.com/test/dashboard](https://manage.stripe.com/test/dashboard)
2. 提供 Debug/Log 等日志：[示例站点](www.twilio.com/user/account/developer-tools/app-monitor)
3. 提供用于测试的沙盒环境：[https://www.twilio.com/user/account](https://www.twilio.com/user/account)
4. 提供Playground：[https://developers.google.com/oauthplayground](https://developers.google.com/oauthplayground)
5. 提供测试控制台：[https://apigee.com/providers](https://apigee.com/providers)

##7、只管销售，但不提供售后服务##
###解决之道###
1. Evangelists：[http://sendgrid.com/developers](http://sendgrid.com/developers)
2. Events：[https://www.twilio.com/conference](https://www.twilio.com/conference)
3. Hackathons
4. PS：不知道如何翻译，so总结一点，就是提供售后支持。

##8、API太复杂了（你使用你自己定制的授权、协议、格式）##
###解决之道###
1. 使用REST（当前最流行的风格）
2. 使用JSON格式（XML也还好）
3. 保持务实：[http://apigee.com/about/content/web-api-design](http://apigee.com/about/content/web-api-design)

##9、你的TTFHW（Time to *(your)* First Hello World）太长##
###解决之道###
1. 极好的开发者体验：[http://developerexperience.org](http://developerexperience.org)
2. 在所有问题修正前，先说“Sorry”

##10、你还没有从最好的学习到的##
1. 学习榜样的做法（Twilio,Stripe,GitHub.SendGrid）
2. 保持进步
3. 记住一句话：API是旅程，不是目的地