---
title: win10&amp;ubuntu18双系统UEFI安装
categories:
  - Others
mathjax: true
abbrlink: 39261
date: 2018-10-01 20:22:00
updated: 2018-10-01 20:22:00
---
# win10&ubuntu18双系统UEFI安装
## 前言
安装成功之前倒腾半天，总算没什么损失，搞出来了
特此发表blog，也算是作一个好人吧<!--more-->

## 条件准备
- 电脑上已安装的win10系统
- 有网络的环境(最好在下午5点前)
- ubuntu18的镜像ISO [点此下载](http://mirrors.163.com/ubuntu-releases/18.04/ubuntu-18.04-desktop-amd64.iso)
- Universal USB Installer（用于制作启动盘）
- U盘（8G，启动盘）
- 用“磁盘管理”确认一下有没有一个叫“EFI系统分区”的分区

## 步骤
- 百度`windows ubuntu 双系统`，自己查阅各种blog
- 大概懂了以后，对硬盘分区压缩出不少于30GB的空间（可以分C盘，也可以分其他盘；可以是SSD也可以是HDD）
- 用Universal USB Installer做Ubuntu18的启动盘
- 设置BIOS关闭security boot（即使用UEFI启动）
- 插上启动盘，F9或F12进入启动选择界面，选择这个启动盘
- 然后就是Ubuntu的安装界面（UEFI模式下，背景是黑色而非紫色）
- 然后就是正常的安装过程（和那些blog差不多）
- 到了“安装类型”的时候选“其他选项”（Something else）
------
## 现在就是关键的时候了
------
- 辨认一下每一个分区的大小，找到你压缩后空出来的那些空间
- 分配一个交换空间，和电脑的内存的容量一样
- 分配200M 挂载`/boot`
- 剩下的按需分配（必须要有根目录挂载），其他不作要求
- 如有需要，可分配一定的FAT32文件系统，挂载到`/windows`，用来和win10文件共享
------
## 最最重要的
------
- **安装启动器的引导设备，选择EFI分区（类型为EFI的那个，已装系统那貌似写了一个Windows Boot Manager）**（这个步骤就能避免最后的第三方软件修改启动条目的步骤）
- 然后，一路逍遥安装去吧
- 完成等待重启时，重启，拔启动盘
- 按F9或F12进入启动选择界面，如果有两个选择，一个window一个Ubuntu，则安装成功
## 有关独显
如果你的电脑有独立显卡，于是，你 发现刚装上的Ubuntu就悲剧地卡在了启动的logo处。。。。。。
- 在grub界面，按e进入编辑模式
- 倒数第2行,

把


    quiet splash

改成
    i915.modest=0 nouveau.modeset=0

- 最后，为了一劳永逸，`sudo gedit /etc/default/grub`

把

    GRUB_CMDLINE_LINUX_DEFAULT="quiet splash"

改成
    GRUB_CMDLINE_LINUX_DEFAULT="i915.modest=0 nouveau.modeset=0"


## 至此，完美安装！