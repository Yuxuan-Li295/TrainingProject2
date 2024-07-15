# BCms

这是一个简易的后台管理系统，使用 express，MongoDB(mongoose)，vue2 的一个简单后台管理系统，图片上传，登录校验，分类管理，适合作为简单展示型网站的服务端，易于二次开发

> 后台管理的前端页面在 [https://gitee.com/banfield/BCmsManager](https://gitee.com/banfield/BCmsManager)

## 运行

```
npm i  // 安装

npm start // 运行

// 进入 http://localhost:8088/
```

## 默认端口

> 默认端口 8088，若要修改，进入 package.json 文件中，修改 config 下 port

## 若想重置密钥 进入 keys 文件执行 OpenSSL 并执行以下语句

### 私钥

> genrsa -out rsa_private_key.pem 2048

### 公钥

> rsa -in rsa_private_key.pem -pubout -out rsa_public_key.pem

## 生成接口文档

```
// 根目录执行
apidoc -i routes -o apidoc
```
