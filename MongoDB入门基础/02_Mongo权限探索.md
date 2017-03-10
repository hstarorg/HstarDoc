---
title: 02_Mongo权限探索
date: 2017/02/21 14:47:10
---

# 0x0、导言

经过一次 `MongoDB` 被黑之后，就想把 `MongoDB` 的权限仔细的了解一遍。安全第一！安全第一！

为了避免版本不一致导致的差异，特此说明：以下命令均在 `Mongo3.4` 中测试，理论上支持所有 `3.x` 版本

# 0x1、MongoDB权限系统

`MongoDB` 的权限管理也是符合 `RBAC` 的权限系统。

既然是 `RBAC` 的权限管理，那么就一定会有 `actions` 和 `resources` 的概念。

在 `MongoDB` 中，每一种操作都对应一种 `action`，在 [Action List](https://docs.mongodb.com/manual/reference/privilege-actions/) 可以查看所有的 `Action` 列表

同理，`Collection/Database/Cluster` 都是 `Resrouce`, `resource` 列表也可以在 [Resource Document](https://docs.mongodb.com/manual/reference/resource-document/) 找到。


## 1.1、如何授权启动

在 `MongoDB` 中，默认是无授权启动的。如果我们要开启授权，那么需要在启动 `MongoDB` 的时候，加上 `--auth` 参数：

```bash
mongod --config "<config path>" --auth
```
如果使用配置文件，那么也可以直接配置

```
security
    authorization: enabled
```

**注意：如果没有添加账户，就算设置 `--auth` 参数也无效，需要先添加用户，在添加用户的时候，必须要指定用户角色。**

## 1.2、MongoDB角色管理

在 `MongoDB` 中，具有两种类型的角色，一类是系统角色，一类是自定义角色。

一般来说，我们只需要关注系统角色。自定义角色需要通过角色相关的Shell来进行CRUD。

### 1.2.1、系统角色

`MongoDB` 按照分类，具有较多的角色，列举如下，也可在 [security-built-in-roles](https://docs.mongodb.com/manual/core/security-built-in-roles/) 查看所有内建角色明细。

* 数据库用户相关角色

	1. read --只能查看单个数据库
	2. readWrite -- 可读写单个数据库

* 数据库管理员相关角色

	1. dbAdmin -- 数据库管理员，能进行差不多各种操作
	2. dbOwner -- 等于dbAdmin、readWrite、userAdmin的并集，数据库拥有者
	3. userAdmin -- 能够管理各种用户，角色等（如果是admin集合的，则能管理所有db）

* 集群管理员相关角色

	1. clusterAdmin -- 是clusterManager，clusterMonitor，clusterMonitor权限的集合，还多了个删除数据库操作。
	2. clusterManager -- 主要是配置集群
	3. clusterMonitor -- 主要是监控集群
	4. hostManager -- 主要是配置主机

* 备份还原相关角色

	1. backup -- 备份操作
	2. restore -- 还原操作

* 针对所有DB的角色

	1. readAnyDatabase -- 可读取所有的数据库
	2. readWriteAnyDatabase -- 可读写所有的数据库
	3. userAdminAnyDatabase -- 所有db的用户管理员
	4. dbAdminAnyDatabase -- 所有db的DB管理员

* 超级管理员角色

	1. root -- 超级超级管理员，最大权限了

* 内部角色

	1. __system -- 既然是内部角色，我们就不要去用了

### 1.2.2、自定义角色

除了系统角色之外，还可以自定义角色，能够更灵活的控制权限。

详细，请参考：[role-management](https://docs.mongodb.com/manual/reference/method/js-role-management/)

## 1.2、MongoDB用户管理

有了Role的知识，我们来看User，就很easy了。

和一般的系统权限类似，MongoDB 也提供了诸多和用户相关的操作

1. db.auth() -- 用于登录

```
db.auth( {
   user: <username>, -- 用户
   pwd: <password>, -- 密码
   mechanism: <authentication mechanism>,  -- 可选，认证机制
   digestPassword: <boolean> 
} )
```

2. db.createUser()  -- 创建用户

```
{ user: "<name>", -- 用户名
  pwd: "<cleartext password>", -- 密码
  customData: { <any information> }, -- 自定义的数据
  roles: [ -- 配置角色，db角色，设置数据库， 否则直接写角色名
    { role: "<role>", db: "<database>" } | "<role>",
    ...
  ]
}
```

3. db.updateUser() -- 更新用户

```
db.updateUser(
   "<username>", -- 要更新的用户名
   { -- 要更新的用户对象
     customData : { <any information> },
     roles : [
               { role: "<role>", db: "<database>" } | "<role>",
               ...
             ],
     pwd: "<cleartext password>"
    },
    writeConcern: { <write concern> }
)
```

**注：仅仅只需要更新role的话，考虑使用grantRolesToUser，revokeRolesFromUser**

5. db.removeUser()
6. db.dropAllUsers()
7. db.dropUser()
8. db.grantRolesToUser()
9. db.revokeRolesFromUser()
10. db.getUser()
11. db.getUsers()

其他用户方法都比较类似，查看详细： [user-management](https://docs.mongodb.com/manual/reference/method/js-user-management/)


# 0x2、使用授权的MongoDB

如果在 `MongoDB` 中配置了授权，那么连接到带授权的 `MongoDB` 也会有些许区别。

```bash
# 简单的MongoDB Connection String
mongodb://127.0.0.1/testdb

# 带端口的MongoDB
mongodb://127.0.0.1:27018/testdb

# 带授权的MongoDB
mongodb://user1:password1@127.0.0.1:27017/testdb

# 带授权，且User是admin的场景
mongodb://user1:password1@127.0.0.1:27017/testdb/?authSource=admin
```

如果是 `shell`，则需要先执行 `db.auth('name', 'pwd')`，之后才能执行其他命令。

# 0x3、总结

加强安全意识，人为预防常规安全风险。

<time>2017-1-21 16:09:48</time>