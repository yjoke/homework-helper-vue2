# 石铁大作业帮 - 实验报告提交(前端)

> 石铁大作业帮项目: 主要是对于文件类型的作业提交, 进行统一的下载进行了处理
>
> 前后端全栈项目
>
> @author HeYunjia




前端代码仓库: [https://github.com/yjoke/homework-helper-vue2](https://github.com/yjoke/homework-helper-vue2)

后端代码仓库: [https://github.com/yjoke/homework-helper](https://github.com/yjoke/homework-helper)

![](readme-img/homepage.png)



## 项目背景
听说超星对于提交的文件下载很不友好, 于是写了这样一个项目, 作为学校 web 实训的作业



## 应用场景
> ~实际的实验报告提交使用~ (划掉) 
> 学校课设划水 (确信)



## 希望大佬们指导

有些内容希望得到大佬们执教

* 前端
    * ~el-img 的 src 属性为什么报警告~ (划掉)
    * 前端没怎么学过, 界面都是拼凑的
* 后端
    * 项目内对腾讯短信云 sms 的短信发送的二次封装
    * 对阿里云 oss 的文件上传下载以及 zip 打包操作的封装
    * 加入课程的邀请码的随机生成策略的封装
    * 等其他功能

> 希望大佬们能多多指教🙏



## 实现功能

* 登录
    * 短信注册
    * 密码找回
    * 个人信息修改
    * 注销账户(我也忘了有没有实现)
* 课程
    * 创建课程
    * 创建邀请码
    * 加入课程
* 作业
    * 发布作业
    * 提交作业
    * 下载作业
* 资源数据
    * 上传资源
    * 下载资源



## 项目目前存在的问题

### 前端

1. 不太懂, 除了写的垃圾也不知道还有啥问题

### 后端

1. 数据表命名有些没有逻辑性
1. 数据库的一些主键外的索引还没加
1. 包和文件的命名还不是很懂怎么分配
1. 分层架构还存在一些错误的认识, 导致引用循环
1. Controller 的命名, 存在一些认识上的问题
1. DTO 和 VO 等 POJO 类的区别有一些问题
1. 对于 RESTful 风格的请求, 还有一些问题
1. ...

> 再次感谢大佬的不吝赐教🙏



### 其他问题

1. 系统还没写后台管理, 目前只有前台...



## 技术栈

### 前端

主要技术:

* Vue 2.6.14
* ElementUI 2.15.9
* FontAwesome 图标库
* Axios 数据请求
* Eslint 代码规范控制



### 后端

主要技术:

* Spring Boot 2.7.3
* MyBatis Plus 3.5.1
* MySQL (我也记不得了
* Redis

依赖库:

* TencentSDK 3.1.561 使用了 sms 短信服务
* AliyunSDK 3.14.0 使用 oss 对象存储
* Jackson Json 解析
* Hutool 工具库
* Lombok 懒人工具
* Knife4j 接口文档生成



## 快速启动

### 前端

安装依赖

```bash
npm run install
```

运行

```bash
npm run serve
```

打包

```bash
npm run build
```



### 后端

1. 运行 sql 目录下的 create_table.sql 建表
1. 修改 application-template.yml 为 application.yml, 并设置自己的数据
1. 安装 Maven 依赖, 直接运行



## 致谢

感谢大佬们的阅读, 希望大佬们能不吝赐教
