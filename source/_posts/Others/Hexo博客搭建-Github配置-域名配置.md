---
title: Hexo 博客搭建 + Github 配置 + 域名配置
author: sshwy
abbrlink: 4586
categories:
  - Others
tags:
 - Hexo
date: 2018-10-06 22:09:00
updated: 2019-03-16 13:10:00
---


**摘要**

Hexo 作为一款轻量级的静态博客博客框架，本身访问的速度很快，官网的主题也很多，美观又高效。然而在配置的过程中仍有一些棘手的地方，例如 Git 的使用，SSH 秘钥的生成，插件的使用等。本文将从一个相对细致的角度介绍 Hexo 搭建到使用的全过程。


<!--more-->

# 前置技能

- Linux 系统（笔者推荐 deepin）
- Linux 命令行（cd cat sudo 之类的基础命令）

# Hexo 本地搭建 & 使用

优先选择从[官网](https://hexo.io/zh-cn/docs/) 上学习
## 安装

官网已有详细的说明，笔者在这里对命令做一个整理：

安装 git ，因为 Hexo 通过 git 上传博客

使用 nvm 安装 Node.js

```
sudo apt-get install git-core
wget -qO- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash
```
执行完后关闭当前终端，重新打开一个终端，再执行命令完成 Node.js 安装：

安装 Hexo

```
nvm install stable
npm install -g hexo-cli
```

## 主要配置

### 初始化

在当前目录下新建 [folder] 文件夹，作为本地 Hexo 的根目录，并在里面搭建一个初始的 Hexo 博客：

```
hexo init [folder]
```
接下来的操作大多在根目录下进行（即 cd 到 [folder]）：

### 常用命令

- `hexo clean` 清除本地静态生成博客的缓存
- `hexo g` 生成静态文件
- `hexo d` 发布到 git 服务器上（见下文）
- `hexo s` 本地端口预览

## 通过本地服务预览

在根目录下先执行`hexo g`，再执行`hexo s`后，根据它的提示，可以在`localhost:4000`预览你的博客：（初始博客的主题背景）：
![初始博客的主题背景](https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1538815232650&di=67d0433e337f3af4ad3fa0101270f01f&imgtype=jpg&src=http%3A%2F%2Fimg1.imgtn.bdimg.com%2Fit%2Fu%3D996511926%2C3300922985%26fm%3D214%26gp%3D0.jpg)

**其余配置参加官网和其他作者的博客，限于篇幅不做详细介绍**

# Git&Github 配置

## 安装 Git

安装 git ，因为 Hexo 通过 git 上传博客：
```
sudo apt-get install git-core
```

## Github 配置

在 Github 上创建账号（用户名和你的域名有关，所以好生斟酌～）

新建一个项目（repository），名称叫做`USERNAME.github.io`（注意，是`用户名.github.io`），公开，其他的不管。

在项目的 Setting 里启用 Github Pages，随便选一个主题（之后会被 Hexo 博客覆盖，所以随便选，但不能不选），确认。

解释一下，之所以使用`USERNAME.github.io`作为项目名称，是为了 Github Pages 生成`http://USERNAME.github.io`的域名；如果改成`NAME.github.io`，域名就会变成`http://USERNAME/NAME.github.io`，显然不美观（当然域名解析是可以的，不过还要考虑证书的问题，不然没有小绿锁......）

## 与 Github 建立 SSH 链接

要将本地 git 中的代码上传到服务器的 git，一般使用`git push`命令，有两种方式连接：html 和 ssh

html 连接要求输入服务器（github）用户名和密码来建立连接，而 ssh-key 则通过验证本地的私钥和公钥的匹配来建立连接，比 html 操作更方便，也更安全。

要配置 ssh-key，在**主目录**下执行

```
ssh-keygen -t rsa -C “email@email.com”   // 邮箱仅用于标识，不要求和用户名相同
```
运行过程中，会要求你先回车，再重复输入两次 phrase（这是 ssh 连接的密码）。

然后浏览器打开`github - Settings - SSH and GPG keys`，新建`SSH key`，并将`./.ssh/id_rsa.pub`的内容复制上去，保存即可。

测试连接是否成功：

```
ssh -T git@github.com
```
可能会有不成功的错误码，按照它的提示操作几次。

如果实在无法建立 ssh 连接，就用 http 连接吧。

# Hexo 网站博客搭建 & 备份

## 上传博客到 Github

- 有了 ssh-key 的连接，则修改博客根目录下的`_config.yml`，找到 deploy 的配置：
```
# Deployment
## Docs: https://hexo.io/docs/deployment.html
deploy:
    type: git
    repo: git@github.com:XXX/XXX.github.io.git
    		#其实就是你博客所在项目的 CloneWith SSH/HTTP 里复制框的代码，也可以用 HTTP
    branch: master #默认
```
- 保存后，运行`hexo g`生成静态文件，`hexo d`上传到 github.
- 如果配置成功，访问`XXX.github.io`即可看到你的博客。

## 博客备份

hexo 访问速度快，可是要随时随地编辑博客就比较困难。对博客做一个备份，每次上传博客的同时上传备份，即可随时随地编辑博客。通过在博客项目下新建`hexo`分支，将备份上传到这个分支上即可（同样使用`git+ssh`上传）。

### 准备工作

只需在第一次配置备份的时候执行

在博客根目录下初始化 git（相当于将博客根目录下的文件（不是生成的静态文件，是原生 hexo 文件）上传到 github 该博客项目的`hexo`分支）

```
git init
```
本地创建`hexo`分支

```
git checkout -b hexo
```
添加远程仓库

```
git remote add origin git@github.com:XXX/XXX.github.io.git #SSH
```

或者

```
git remote add origin https://github.com/XXX/XXX.github.io.git #HTTP
```

### 备份

每次备份，执行以下操作
- 将当前目录下的文件添加到 git
```
git add .
```
- 提交到本地 git 仓库
```
git commit -m "init" #init 是发布的名字，随便填
```
- 发布到代码仓库的 hexo 分支
```
git push origin hexo
```

### 其他事项

- 有时在备份的时候会提示无法上传，原因大概是你在本地删除两一些目录，导致上传失败的；这时可以先在网站上删除网站上的分支，再重新执行上述命令即可。
- 有时获取备份后的文件，发现 `hexo s` 要报错，那么可在`.gitignore`文件中删除`db.json`再上传备份。`.gitignore`记录的是 git 命令不上传的文件（忽略），其中`node_modules/`也可以删去（有时对插件做了修改的话），反正文件也不大。

# Hexo 插件 - 小 Bug

## hexo-all-minifier

如果报错说没有`libpng`：
```
sudo apt-get install libpng-dev
```



## hexo-auto-category(2018.10.6)

`hexo-hexo-auto-category`是一个根据文件目录名自动生成标签的插件，而作者在使用过程中遇到一些问题，在此做修正。

- [Hexo-Plugin](https://hexo.io/plugins/)
- [github 项目](https://github.com/xu-song/hexo-auto-category)

### 问题

按照 github 上开发者的步骤操作，出现以下情况：

```
INFO  Generated: categories [] for post [C++memset() 小记』
INFO  Generated: categories [] for post [C++ 常数优化』
INFO  Generated: categories [] for post [C++ 数据读入函数』
INFO  Generated: categories [] for post [C++ 语言常识』
INFO  Generated: categories [] for post [C++ 输入输出格式控制符』
INFO  Generated: categories [] for post [C++ 随机数据生成』
```
也就是说，它为我的文章创建了空分类

打开文章的 markdown 文件，发现 category 变成了`[]`

在这种情况下继续运行`hexo s`的话，终端会不停输出信息（貌似无限循环了）

### 分析

分析插件的源代码，发现 category 的生成是将文章的 slug(`data.slug`) 以'/'为分隔符，用 spilt 划分为**以目录名称为元素**的数组，然后将文章的标签依次赋值为数组中的元素（前一个元素是后一个元素的父分类）

然而在解析 slug 的时候，有些文章被解析为以`-`分隔的形式，使得`/`没有将目录成功分隔，比如：
- 我的一篇文章原始路径`_post/Programming/Python/ 排序.md`
- slug 本来应该将其解析为`Programming/Python/ 排序`（slug 会自动去掉_post，并把文件名用文章标题`:title`代替），数组 spilt 后是`["Programming","Python","排序"]`，然后忽略最后一个元素（那是文章标题），用其他元素生成标签。
- 可是插件却错误解析成`Programming-Python- 排序`，于是数组中的元素为`["Programming-Python- 排序"]`，标签为空，被赋值为`[]`（空数组）

### Bug 修复

把 slug 改成 source（原始路径），用`/`分隔

这时数组的开头元素多了`"_post"`，所以舍弃第一个和最后一个元素，用中间的生成标签。

### 操作

在`<YourHexoRoot>/node_modules/hexo-auto-category/lib/logic.js`中，将
```
var categories = data.slug.split('/');
```
修改为
```
var categories = data.source.split('/');
```
再将
```
tmpPost.categories = categories.slice(0, Math.min(depth, categories.length-1));
```
修改为
```
if(1<Math.min(depth,categories.length-1))
    tmpPost.categories = categories.slice(1, Math.min(depth, categories.length-1));
else
    tmpPost.categories = ["Uncategorized"].slice();// 未分类
```

问题解决。

### 等待作者修复的 Bug

在执行`hexo s`的时候，`hexo-hexo-auto-category`会不停的创建分类（无限循环）

目前只能先`_config.yml`先打开插件生成静态文件，再关闭插件在本地预览

# Hexo 自定义域名

*2019.3.16 更新*

在 GithubPages 上部署 Hexo 博客的域名是`.github.io`的，显然并不是所有人都能忍受这么长的域名。接下来笔者介绍如何将 GithubPages 的域名自定义为自己注册的域名

## 注册域名

这里推荐 frenom 的域名，最多可以免费一年，到期就续订

注册完后，我们需要设置三个 DNS 解析

| Type  |      | 记录值         |
| ----- | ---- | -------------- |
| A     | @    | 192.30.252.153 |
| A     | @    | 192.30.252.154 |
| CNAME | www  | yourdomin.com  |

前面两条是指向 GIthubPages 的 IP 地址；第 3 个是把 www.youdomin.com 定向到 yourdomin.com

然后我们需要在 Public 下新建一个名为`CNAME`（名称大写）的文件，里面写入 yourdomin.com，即你注册的域名，然后 Deploy 上去

等待 DNS 服务器广播完成后，你的域名就可以访问啦

![1552710011041](https://hexo-source-1257756441.cos.ap-chengdu.myqcloud.com/2019/03/16/1220.png)

在 github 的 settings 里面看大概是这个样子的

# 博客 CDN 加速

Github 的服务器在国外，因此访问速度较慢；我们可以采用 CDN 加速

Hexo 博客的 CDN 加速基于自定义域名的基础上，因此请先给博客添加自定义域名

我选择 cloudflare 来做 CDN 加速。首先注册账号后添加网站（把自定义的域名输进去）

然后 cloudflare 就会自动读取这个域名的 DNS 解析并复制一份到 cloudflare 的服务器上

然后它会让你修改你域名的 nameserver 为 cloudflare 的 nameserver，按照提示的步骤修改即可。DNS 解析记录就不用操心了，因为人家已经帮你搬过来了

完了过后等待 re-check 完成后，你的博客就可以使用 cloudflare 的 CDN 加速了

cloudflare 不仅支持 CDN 加速，它还可以一键帮你添加 SSL 证书，然后你的博客就可以有小绿锁了。具体操作直接看 Crypto 选项卡下面的内容，功能很多
