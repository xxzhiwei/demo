# 文件上传 demo

将上传文件切割, 将切割后的文件并发上传至服务器, 上传完毕后, 前端调用合并接口

*使用worker(读取文件计算hash是一个耗时任务, 因此这里使用worker以保证UI不会卡死)计算文件内容的hash, 并用其来判断上传的文件是否为同一文件*

* 已完成
  * 切片上传
  * 暂停/续传

## 运行(进入对应部分的根目录)

前端

> npm run dev

服务器

> npm start

## 目录

```text
.
├── frontend # 前端部分
│   ├── README.md
│   ├── dockerfile
│   ├── env.development.js
│   ├── env.production.js
│   ├── env.test.js
│   ├── nginx.conf
│   ├── package-lock.json
│   ├── package.json
│   ├── public
│   │   ├── 22.ico
│   │   ├── hash.js
│   │   ├── index.html
│   │   └── spark-md5.min.js
│   ├── src
│   │   ├── App.vue
│   │   ├── api
│   │   ├── main.js
│   │   ├── router
│   │   ├── styles
│   │   ├── utils
│   │   └── views
│   ├── webpack.build.config.js
│   ├── webpack.config.js
│   ├── webpack.dev.config.js
│   └── webpack.test.config.js
├── readme.md
├── server # 服务器部分
│   ├── index.js
│   ├── package-lock.json
│   ├── package.json
│   └── static
```

参考链接

[字节跳动面试官: 请你实现一个大文件上传和断点续传](https://juejin.im/post/5dff8a26e51d4558105420ed)