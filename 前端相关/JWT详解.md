# 0、什么是JWT(JsonWebToken)

JWT，全称 JSON Web Token，本身是一种开放的行业标准 [JSON Web Token (JWT)](https://tools.ietf.org/html/rfc7519)，官网 [https://jwt.io/](https://jwt.io/)。

# 1、JWT场景

JWT在分布式环境下，更具有优势。可以实现与主机/部署无关的用户认证。

# 2、对比Session/token认证

**Session**

`Session` 是把认证信息放在服务端（内存，数据库，高速缓存等），一般把 `SessionId` 放在客户端 `Cookie` 中（SessionId也可以放url）。

在请求到达服务端后，通过解析 `Cookie` 中的 `CookieId` 来映射出用户的认证信息。

**Token**

一般常说的 `Token` 认证，和 `Session` 没有本质的区别，只是把 `Token` 放置于请求 `Header` 中。通过获取请求的 `header` 来反查认证信息，实现用户认证。

对比JWT，Session/Token认证具有如下优缺点：

**优势：**
1. 实现简单（大部分Web框架自动就支持session认证，并能很容易实现token认证）
2. 滑动过期比较容易实现（session默认就是滑动过期）
3. 高性能（k-v存储，直接映射）

**劣势：**
1. 在分布式环境下，需要把 `Session/Token` 存储于分布式缓存上，增加部署成本
2. 分布式环境下，由于网络开销，性能有所下降
3. 需要服务端支持，跨不同类型的服务端比较麻烦

**实际上，JWT比较适合分布式应用，在单机部署上，并没有什么优势**

# 3、JWT实现原理

JWT实际上，是通过将 `算法类型和token类型` 以及 `具体的用户认证信息` 连接，并使用加密算法进行加密，生成一串密文。该密文与主机无关，与部署地址无关。只要拿到到用于加密的公私钥和密文，服务端就能解密出认证数据。之所以性能较低，是由于解密需要花去较长的时间（访问量大的时候）。

代码说话，以RSA256为例：

```js
const crypto = require('crypto');
// 1、首先，你得先准备一对RSA公私钥
const privateKey = `-----BEGIN RSA PRIVATE KEY-----
MIICWwIBAAKBgQDdlatRjRjogo3WojgGHFHYLugdUWAY9iR3fy4arWNA1KoS8kVw33cJibXr8bvwUAUparCwlvdbH6dvEOfou0/gCFQsHUfQrSDv+MuSUMAe8jzKE4qW+jK+xQU9a03GUnKHkkle+Q0pX/g6jXZ7r1/xAK5Do2kQ+X5xK9cipRgEKwIDAQABAoGAD+onAtVye4ic7VR7V50DF9bOnwRwNXrARcDhq9LWNRrRGElESYYTQ6EbatXS3MCyjjX2eMhu/aF5YhXBwkppwxg+EOmXeh+MzL7Zh284OuPbkglAaGhV9bb6/5CpuGb1esyPbYW+Ty2PC0GSZfIXkXs76jXAu9TOBvD0ybc2YlkCQQDywg2R/7t3Q2OE2+yo382CLJdrlSLVROWKwb4tb2PjhY4XAwV8d1vy0RenxTB+K5Mu57uVSTHtrMK0GAtFr833AkEA6avx20OHo61Yela/4k5kQDtjEf1N0LfI+BcWZtxsS3jDM3i1Hp0KSu5rsCPb8acJo5RO26gGVrfAsDcIXKC+bQJAZZ2XIpsitLyPpuiMOvBbzPavd4gY6Z8KWrfYzJoI/Q9FuBo6rKwl4BFoToD7WIUS+hpkagwWiz+6zLoX1dbOZwJACmH5fSSjAkLRi54PKJ8TFUeOP15h9sQzydI8zJU+upvDEKZsZc/UhT/SySDOxQ4G/523Y0sz/OZtSWcol/UMgQJALesy++GdvoIDLfJX5GBQpuFgFenRiRDabxrE9MNUZ2aPFaFp+DyAe+b4nDwuJaW2LURbr8AEZga7oQj0uYxcYw==
-----END RSA PRIVATE KEY-----`;
const publicKey = `-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDdlatRjRjogo3WojgGHFHYLugdUWAY9iR3fy4arWNA1KoS8kVw33cJibXr8bvwUAUparCwlvdbH6dvEOfou0/gCFQsHUfQrSDv+MuSUMAe8jzKE4qW+jK+xQU9a03GUnKHkkle+Q0pX/g6jXZ7r1/xAK5Do2kQ+X5xK9cipRgEKwIDAQAB
-----END PUBLIC KEY-----`;

// 2、准备一批数据
let header = {
  'alg': 'RS256',
  'typ': 'JWT'
};
let payload = {
  'sub': '1234567890',
  'name': 'John Doe',
  'admin': true
};

// 3、准备处理数据的方法
// 3.1、将一个对象，处理为Base64字符串
function base64UrlEncode(obj) {
  var buf = Buffer.from(JSON.stringify(obj), 'utf8');
  var base64Str = buf.toString('base64');
  return base64Str.replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}
// 3.2、处理一个Base64字符串
function processBase64(base64) {
  return base64
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

// 4、拼接要加密的的字符串
let input = `${base64UrlEncode(header)}.${base64UrlEncode(payload)}`;

// 5、利用私钥加密(RSA256)
var signer = crypto.createSign('RSA-SHA256');
signer.update(input);// 填入要加密的数据
var signature = signer.sign(privateKey, 'base64'); // 获取密文
signature = processBase64(signature); // 处理密文

// 6、拼接最终的jwt值
var encrypted = `${input}.${signature}`;

// 7、输出查看与验证
console.log('密文是：', encrypted);
const expert = `eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWV9.EkN-DOsnsuRjRO6BxXemmJDm3HbxrbRzXglbN2S4sOkopdU4IsDxTI8jO19W_A4K8ZPJijNLis4EZsHeY559a4DFOd50_OqgHGuERTqYZyuhtF39yxJPAjUESwxk2J5k_4zM3O-vtd1Ghyo4IbqKKSy6J9mTniYJPenn5-HIirE`;
console.log('与https://jwt.io/的结果进行比对：', expert === encrypted);
```

**注意：jwt本身可以使用多种加密方式，如上代码只是显示了RSA-SHA256算法**

# 4、常用问题解析

## 4.1、jwt如何过期呢？

可以在 `jwt` 的 `payload` 数据中，设置好过期时间。后台校验的时候，判断该时间进行过期。

## 4.1、由于jwt与服务器无关，是直接解析jwt这个token值，那么如何强制过期呢？

为了实现强制过期，我们可以考虑把公私钥和用户绑定，如果要强制过期，则重置用户的公私钥，这样也就无法解码了。

# 5、总结

`jwt` 在分布式环境中，有一定的用武之地。但其他相关的逻辑处理，则相对比较复杂。

我个人比较喜欢直接用 `token + 分布式缓存（如Redis）` 这种方案。

以上均为个人理解，如有错误，望指出，感激不尽。
