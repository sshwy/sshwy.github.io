---
title: Vbox代理全局
author: sshwy
abbrlink: 9978
tags:
 - 科学上网
categories:
  - Others
date: 2018-10-04 14:58:00
updated: 2018-10-04 14:58:00
---
- 在Deepin下使用shadowsocks？你会发现一个叫做aec-128-gcm的加密方法是不被支持的
- 于是，搭建Vbox-Win7虚拟机.
- 配置好ss后，在网络-NAT的高级选项中的端口转发：
  - 配置一下主机域名（127.0.0.1）<!--more-->
  - 随便一个主机端口
  - 子系统端口1080
![__20181004150136.png](https://www.z4a.net/images/2018/10/04/__20181004150136.png)

- 保存之后，在设置的socks代理中把刚配置的主机域名，主机端口配置一下即可