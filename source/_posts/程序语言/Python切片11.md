---
title: Python切片
categories:
  - 程序语言
mathjax: true
abbrlink: 21576
date: 2018-10-01 20:22:00
updated: 2018-10-01 20:22:00
---
Python中的列表切片非常灵活，要根据表象来分析它的内在机理，这样用起来才能溜。

下标可以为负数有利有弊，好处是使用起来更简便，坏处是当我下标越界了我也不知道反倒发生奇奇怪怪的错误。

<!--more-->
```python
print str[0:3] #截取第一位到第三位的字符
print str[:] #截取字符串的全部字符
print str[6:] #截取第七个字符到结尾
print str[:-3] #截取从头开始到倒数第三个字符之前
print str[2] #截取第三个字符
print str[-1] #截取倒数第一个字符
print str[::-1] #创造一个与原字符串顺序相反的字符串
print str[-3:-1] #截取倒数第三位与倒数第一位之前的字符
print str[-3:] #截取倒数第三位到结尾
print str[:-5:-3] #逆序截取
```
可见，列表的下标有三个参数：**beg（起始下标），end（终止下标），delta（变化量）**

当delta小于0时，beg默认为len（array）-1，end默认为开头之前。

当delta大于0时，beg默认为0，end默认为最末之后。

当delta未给出时：delta默认为1


# 鸣谢


https://www.cnblogs.com/weidiao/p/6428681.html
