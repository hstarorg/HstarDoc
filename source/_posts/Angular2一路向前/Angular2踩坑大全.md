## Angular2的那些坑

1、同样的代码，引用Rxjs库的版本不对，就会导致在IE11下无法运行。(特定版本下重现)
正确的版本：[https://code.angularjs.org/2.0.0-beta.12/Rx.js](https://code.angularjs.org/2.0.0-beta.12/Rx.js)

2、在使用TypeScript编写Angular2代码时，一定要将注意 ``tsconfig.json``，其中 ``experimentalDecorators`` 和 ``emitDecoratorMetadata`` 必须要设置为true，否则无法使用依赖注入。

3、&lt;router-outlet> 不能放在带有 *ngIf的容器内，否则会出现初始化时无法找到。