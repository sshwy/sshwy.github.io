---
title: Python字符串
categories:
  - 程序语言
mathjax: true
abbrlink: 35224
date: 2018-10-01 20:22:00
updated: 2018-10-01 20:22:00
---
# 字符串传递
Python提供了几种不同方式传递的字符串。它们用**单引号或双引号**标识:
```
>>> 'spam eggs'
'spam eggs'
>>> 'doesn\'t'
"doesn't"
>>> "doesn't"
"doesn't"
>>> '"Yes," he said.'
'"Yes," he said.'
>>> "\"Yes,\" he said."
'"Yes," he said.'
>>> '"Isn\'t," she said.'
'"Isn\'t," she said.'
```
Python解释器按照字符串被输入的方式打印字符串结果：为了显示准确的值，字符串包含在**成对的引号**中，引号和其他特殊字符要用反斜线（\\）转译。 如果字符串只包含单引号（'）而没有双引号（"）就可以用双引号（"）包围，反之用单引号（'）包围。 **再强调一下，print函数可以生成可读性更好的输出。**

# 分行

字符串文本有几种方法分行。可以使用**反斜杠为行结尾**的连续字符串，它表示下一行在逻辑上是本行的后续内容:
```
hello = "This is a rather long string containing\n\
several lines of text just as you would do in C.\n\
    Note that whitespace at the beginning of the line is\
 significant."

print(hello)
```
需要注意的是，**还是需要在字符串中写入\\n** ——结尾的反斜杠会被忽略。前例会打印为如下形式:
```
This is a rather long string containing
several lines of text just as you would do in C.
    Note that whitespace at the beginning of the line is significant.
```
另外，字符串可以标识在一对儿三引号中：`"""`或`'''`。**三引号中，不需要行属转义**，它们已经包含在字符串中。
```
print("""\
Usage: thingy [OPTIONS]
     -h                        Display this usage message
     -H hostname               Hostname to connect to
""")
```
得到如下输出:
```
Usage: thingy [OPTIONS]
     -h                        Display this usage message
     -H hostname               Hostname to connect to
```
如果我们生成一个**“原始”字符串**， \\n 序列不会被转义，而且行尾的反斜杠，源码中的换行符，都成为字符串中的一部分数据，因此下例:
```
hello = r"This is a rather long string containing\n\
several lines of text much as you would do in C."

print(hello)
```
会打印:
```
This is a rather long string containing\n\
several lines of text much as you would do in C.
```

# 连接与重复

字符串可以由 + 操作符连接（粘到一起），可以由 * 重复:
```
>>> word = 'Help' + 'A'
>>> word
'HelpA'
>>> '<' + word*5 + '>'
'<HelpAHelpAHelpAHelpAHelpA>'
```
**相邻的两个字符串文本自动连接在一起**，前面那行代码也可以写为 word ='Help' 'A'
它只用于两个字符串**文本**，不能用于字符串**表达式**:
```
>>> 'str' 'ing'                   #  <-  This is ok
'string'
>>> 'str'.strip() + 'ing'   #  <-  This is ok
'string'
>>> 'str'.strip() 'ing'     #  <-  This is invalid
  File "<stdin>", line 1, in ?
    'str'.strip() 'ing'
                      ^
SyntaxError: invalid syntax
```
# 检索
字符串也可以被截取（检索）。类似于 C ，字符串的第一个字符索引为 0 。**没有独立的字符类型**，字符就是长度为 1 的字符串。类似 Icon ，可以用**切片标注法**截取字符串：由两个索引分割的复本。
```
>>> word[4]
'A'
>>> word[0:2]
'He'
>>> word[2:4]
'lp'
```
索引切片可以有默认值，切片时，**忽略第一个索引的话，默认为0，忽略第二个索引，默认为字符串的长度**。
```
>>> word[:2]    # The first two characters
'He'
>>> word[2:]    # Everything except the first two characters
'lpA'
```
不同于 C 字符串，**Python字符串不可变（常量）**。向字符串文本的某一个索引赋值会引发错误:
```
>>> word[0] = 'x'
Traceback (most recent call last):
  File "<stdin>", line 1, in ?
TypeError: 'str' object does not support item assignment
>>> word[:1] = 'Splat'
Traceback (most recent call last):
  File "<stdin>", line 1, in ?
TypeError: 'str' object does not support slice assignment
```
不过，组合文本内容生成一个新文本简单而高效:
```
>>> 'x' + word[1:]
'xelpA'
>>> 'Splat' + word[4]
'SplatA'
```
切片操作有个有用的不变性：**s[:i] + s[i:] 等于 s**。
```
>>> word[:2] + word[2:]
'HelpA'
>>> word[:3] + word[3:]
'HelpA'
```
Python能够优雅的处理那些**没有意义的切片索引**：一个过大的索引值（即下标值大于字符串实际长度）将被字符串实际长度所代替，当上边界比下边界大时（即切片左值大于右值）就返回空字符串。
```
>>> word[1:100]
'elpA'
>>> word[10:]
''
>>> word[2:1]
''
```
索引也可以是负数，这将导致从右边开始计算。 例如:
```
>>> word[-1]     # The last character
'A'
>>> word[-2]     # The last-but-one character
'p'
>>> word[-2:]    # The last two characters
'pA'
>>> word[:-2]    # Everything except the last two characters
'Hel'
```
请注意 -0 实际上就是 0 ，所以它不会导致从右边开始计算！
```
>>> word[-0]     # (since -0 equals 0)
'H'
```
负索引切片越界会被截断，不要尝试将它用于单元素（非切片）检索:
```
>>> word[-100:]
'HelpA'
>>> word[-10]    # error
Traceback (most recent call last):
  File "<stdin>", line 1, in ?
IndexError: string index out of range
```
有个办法可以很容易的记住切片的工作方式：切片时的索引是在两个字符 之间 。左边第一个字符的索引为0，，而长度为 n 的字符串其最后一个字符的右界索引为 n 。例如:
```
 +---+---+---+---+---+
 | H | e | l | p | A |
 +---+---+---+---+---+
 0   1   2   3   4   5
-5  -4  -3  -2  -1
```
文本中的第一行数字给出字符串中的索引点 0...5 。第二行给出相应的负索引。切片是从 i 到 j 两个数值标示的边界之间的所有字符。

对于非负索引，如果上下都在边界内，切片长度与索引不同。例如， word[1:3] 是 2 。

# 函数

内置函数 **len()** 返回字符串长度:
```
>>> s = 'supercalifragilisticexpialidocious'
>>> len(s)
34
```


<!--more-->

# 关于Unicode
从Python 3.0开始所有的字符串都支持Unicode（参考 http://www.unicode.org ）。

Unicode的先进之处在于为每一种现代或古代使用的文字系统中出现的每一个字符都提供了统一的序列号。之前，文字系统中的字符只能有 256 种可能的顺序。通过代码页分界映射。文本绑定到映射文字系统的代码页。这在软件国际化的时候尤其麻烦 （通常写作 `i18n` —— `'i'` + 18 个字符 + `'n'`）。Unicode 解决了为所有的文字系统设置一个独立代码页的难题。

如果想在字符串中包含特殊字符，你可以使用Python的`Unicode_Escape`编码方式。 下面的列子展示了如何这样做:
```
>>> 'Hello\u0020World !'
'Hello World !'
```
转码序列`\u0020`表示在指定位置插入编码为0x0020的Unicode字符（空格）。

其他字符就像Unicode编码一样被直接解释为对应的编码值。 如果你有在许多西方国家使用的标准Latin-1编码的字符串，你会发现编码小于256的Unicode字符和在Latin-1编码中的一样。

除了这些标准编码，Python还提供了一整套基于其他已知编码创建Unicode字符串的方法。

字符串对象提供了一个`encode()`方法用以将字符串转换成特定编码的字节序列，它接收一个小写的编码名称作为参数。:
```
>>> "Äpfel".encode('utf-8')
b'\xc3\x84pfel'
```