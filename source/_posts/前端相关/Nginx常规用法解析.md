## 0、Nginx简介

``Nginx`` 是时下最流行的静态Web服务器之一，使用它能快速的托管一个web站点。

当然，它的功能并不仅限于此，负载均衡，反向代理，它都非常拿手。

然而，要使用它，就不得不提到它的配置文件。本文就大致来了解下 ``Nginx`` 常规配置。

**注意：由于环境因素，该文所有测试均在Win10上使用 ``nginx-1.11.5`` 测试通过。**

## 1、如何开始？

### 1.1、安装

**注意：该安装是指在Windows上安装 **

首先，我们进入 ``Nginx`` 的下载地址：[https://nginx.org/en/download.html](https://nginx.org/en/download.html)（书写该文时，``nginx`` 最新版本是 ``1.11.5``）。

然后，找到nginx的Windows压缩包并下载，然后解压到指定目录即可。

**提示：Linux下安装也是同样的思路，下载压缩包，解压缩。**

### 1.2、启动

解压好之后，进入解压目录，我们会看到一个 ``nginx.exe``，它就是 ``nginx`` 的启动文件。

进入该目录的cmd环境，执行 ``nginx`` 即可启动 ``nginx``，此时我们打开的是一个阻塞的控制台。当我们关闭控制台之后，``nginx`` 服务也相应的关闭了。

大部分时候，我们需要它能在后台执行，此时我们可以使用 ``start nginx`` 来启动一个后台运行的 ``nginx`` 实例。

如果是线上环境，可能还要求它能够开机启动，此时我们可以采用把 ``nginx`` 作为Windows服务的方式来实现开机启动，具体做法请参考： [http://www.spkevin.com/?p=946](http://www.spkevin.com/?p=946)。

### 1.3、重新载入配置

当我们后台启动 ``nginx`` 之后，如果修改了配置文件，想重新载入配置怎么办呢？当然，我们可以停止，然后再启动。实际上，还有更简单的方法，执行如下命令：

```bash
# 重新载入配置文件
$ nginx -s reload

# 重新打开日志文件
$ nginx -s reopen
```

### 1.4、停止服务

```bash
# 停止（快速停止，不保存相关信息，快）
$ nginx -s stop

# 退出（完整有序的停止，保存相关信息，慢）
$ nginx -s quit 
```

## 2、托管静态目录

托管静态目录是 ``Nginx`` 最常用的功能之一，该功能是将一个目录部署为一个静态的Web站点。

先使用 ``start nginx`` 启动 ``nginx``（默认绑定的是80端口，可能会有冲突，需要修改下端口绑定）。

**修改端口绑定：在 ``nginx/conf`` 的目录下，打开 ``nginx.conf`` 配置文件，找到80，修改为另外一个端口号即可。**

启动之后，我们直接输入 ``http://localhost:<port>`` 即可查看到Nginx的欢迎页面。

先来分析下它的配置文件：

```bash
http {
  ...
  server {
    listen 7777;

    location / {
      root html;  # 从html相对目录查找内容
      index index.html index.htm; # 默认首页查找顺序
    }
  }
}
```

什么意思呢？我们主要需要关注 ``server/location`` 节点，其中 ``root属性`` 表示去哪个目录查找文件，``index属性`` 表示默认首页查找顺序。

### 2.1、托管多个站点

当我们要托管多个站点的时候，我们可以以同样的方式，创建多个 ``server`` 节点，这样就能监听不同的端口，也能托管不同的目录。

### 2.2、有条件查找（复杂实例）

```bash
server {
  listen 8101; # 监听8101端口
  server_name newegg-central-2.0; # 设置server_name，类似iis的主机头 
  root /dist;
  index index.html; 

  location ~* \.(eot|ttf|woff|woff2)$ { # 针对字体请求做特殊处理
    add_header x-nc2-server $server_addr;
    add_header Access-Control-Allow-Origin '*'; # 允许字体跨域
  } 

  location ~* \.[a-zA-Z0-9]+$ { # 针对有后缀名的请求特殊处理，直接返回
    add_header x-nc2-server $server_addr; 
  }

  location / { # 针对不满足上述条件的请求做处理
    add_header x-nc2-server $server_addr;
    access_log off;
    error_page 404 = /index.html;  # 如果遇到了404，则返回首页（为浏览器history api做的特殊处理，客户端路由）
  }
}
```

## 3、反向代理

反向代理是根据客户端的请求，从后端的服务器上获取资源，然后再将这些资源返回给客户端。所以我们需要一个后端，此处随便找一个站点来测试，如 "www.newegg.com"，让如何实现我们访问 localhost:7778，就能返回 ``newegg``的数据呢？

配置如下：

```bash
server {
  listen 7778; # 监听7778端口
  location / {
    proxy_pass http://www.newegg.com; #根据客户端请求返回newegg的数据
  }
}
```

### 3.1、利用反向代理，处理跨域

跨域是前后端分离项目中，比较容易遇到的一个问题，在这里演示下，如何利用Nginx来避免跨域问题。

该方法的原理是，将API通过反向代理，让它看起来和站点是在同一个域，避免发起跨域请求。

先在7777端口托管的index.html中添加如下代码：

```html
<script>
  let xhr = new XMLHttpRequest();
  xhr.open('GET', 'http://localhost:7779', true);
  xhr.send();
</script>
```

访问 ``http://localhost:7777``，可以明显的看到有跨域请求，接下来，我们来解决该问题，

首先，修改请求域名为： ``http://localhost:7777/api`` 这样就变成了同域，然后配置 ``nginx``，把 ``/api``的请求转发到真实的后端api上。

配置如下：

```bash
location / {
  root html;
  index index.html index.htm;
}

location /api { # 把所有已/api 开头的请求，转发到7779端口
  proxy_pass http://localhost:7779;
}
```

## 4、负载均衡

负载均衡是将应用部署到多个地方，然后用统一入口访问，解决单点故障问题。

先用 ``Node`` 创建两个 ``Web server``，代码如下：

```javascript
// Server 1
const http = require('http');

let server = http.createServer((req, res) => {
  res.write('Server 1, port: 7801');
  res.end();
});

server.listen(7801, err => {
  if(err) return console.error(err);
  console.log('server 1 started.port: 7801');
});
```

为了方便查看效果，我们将 ``Server 2`` 的端口修改为 ``7802``，输出的文字也稍微变下。

接下来我们来进行负载均衡的配置，在 ``nginx`` 中，负载均衡有几种方式：

1. 轮询（默认方式）
2. 加权轮询（轮询升级版，可以指定权重）
3. ip_hash（通过ip计算hash，然后跳转到指定服务器）
4. fair（第三方，根据后台服务器的响应时间来分配请求，响应时间短，优先分配，适应性较强）
5. upstream_hash（ip hash升级版，可以指定hash因子）

这里我们就简单测试下前两种方式，实现配置如下：

```bash
http {
  ...
  upstream test_server {
    server localhost:7801; # 后端服务器1,
    server localhost:7802; # 后端服务器2
  }

  server {
    listen 7779;
    location / {
      proxy_pass http://test_server; # 负载均衡 
    }
  }
}
```

此时，访问 ``http://localhost:7779``，会发现 Server1 和 Server2 循环命中，这就是默认的轮询方式负载。

接着，测试带权重的负载，修改配置如下：

```bash
http {
  ...
  upstream test_server {
    server localhost:7801 weight=2; # 后端服务器1，权重2
    server localhost:7802 weight=1; # 后端服务器2，权重1
  }

  server {
    listen 7779;
    location / {
      proxy_pass http://test_server; # 负载均衡 
    }
  }
}
```

此时，再多次请求 ``http://localhost:7779``，会发现 Server1 出现两次，Server2 出现一次交替命中。

## 5、更多配置

```bash
http {
  ...
  gzip on; # 开启Gzip

  server {
    ...
    location / {
      add_header <field> value [always]; # 返回时追加Header
      proxy_set_header <field> <value>; # 反向代理时，发送Header 
    }
  }
}
```

更多指令，请查询：[https://nginx.org/en/docs/dirindex.html](https://nginx.org/en/docs/dirindex.html)

想了解完整配置，请查阅：[https://nginx.org/en/docs/](https://nginx.org/en/docs/)

## 6、其他

### 6.1、测试使用的完整Nginx配置文件

```bash

#user  nobody;
worker_processes  1;

#error_log  logs/error.log;
#error_log  logs/error.log  notice;
#error_log  logs/error.log  info;

#pid        logs/nginx.pid;


events {
    worker_connections  1024;
}

http {
    include       mime.types;
    default_type  application/octet-stream;

    # 定制日志格式
    #log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
    #                  '$status $body_bytes_sent "$http_referer" '
    #                  '"$http_user_agent" "$http_x_forwarded_for"';

    #access_log  logs/access.log  main;

    sendfile        on;
    #tcp_nopush     on;

    # 定制保持连接超时时间
    #keepalive_timeout  0;
    keepalive_timeout  65;

    # 是否启用gzip
    #gzip  on;

    upstream test_server {
      server localhost:7801 weight=2; 
      server localhost:7802 weight=1;
    }

    server {
        listen       7777;
        server_name  localhost;

        # 设置编码格式
        #charset koi8-r;

        # 是否开启访问日志
        #access_log  logs/host.access.log  main;

        location / {
            root   html;
            index  index.html index.htm;
        }

        location /api {
          proxy_pass http://localhost:7779;
        }

        # 指定错误页面
        #error_page  404              /404.html;

        # redirect server error pages to the static page /50x.html
        #
        error_page   500 502 503 504  /50x.html;
        location = /50x.html {
            root   html;
        }

        # proxy the PHP scripts to Apache listening on 127.0.0.1:80
        #
        #location ~ \.php$ {
        #    proxy_pass   http://127.0.0.1;
        #}

        # 托管PHP的相关配置
        # pass the PHP scripts to FastCGI server listening on 127.0.0.1:9000
        #
        #location ~ \.php$ {
        #    root           html;
        #    fastcgi_pass   127.0.0.1:9000;
        #    fastcgi_index  index.php;
        #    fastcgi_param  SCRIPT_FILENAME  /scripts$fastcgi_script_name;
        #    include        fastcgi_params;
        #}

        # deny access to .htaccess files, if Apache's document root
        # concurs with nginx's one
        #
        #location ~ /\.ht {
        #    deny  all;
        #}
    }

    server {
      listen 7778;
      location / {
        proxy_pass http://www.newegg.com;
      }
    }

    server {
      listen 7779;
      location / {
        proxy_pass http://test_server;
      }
    }


    # another virtual host using mix of IP-, name-, and port-based configuration
    #
    #server {
    #    listen       8000;
    #    listen       somename:8080;
    #    server_name  somename  alias  another.alias;

    #    location / {
    #        root   html;
    #        index  index.html index.htm;
    #    }
    #}


    # 托管HTTPS
    # HTTPS server
    #
    #server {
    #    listen       443 ssl;
    #    server_name  localhost;

    #    ssl_certificate      cert.pem;
    #    ssl_certificate_key  cert.key;

    #    ssl_session_cache    shared:SSL:1m;
    #    ssl_session_timeout  5m;

    #    ssl_ciphers  HIGH:!aNULL:!MD5;
    #    ssl_prefer_server_ciphers  on;

    #    location / {
    #        root   html;
    #        index  index.html index.htm;
    #    }
    #}

}
```
