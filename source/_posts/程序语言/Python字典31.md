---
title: Python字典
categories:
  - 程序语言
mathjax: true
abbrlink: 33765
date: 2018-10-01 20:22:00
updated: 2018-10-01 20:22:00
---
- Python字典(dict)是一个很常用的**复合类型**，其它常用复合类型有：数组(array)、元组(touple)和集合(set)。

- 字典是一个**key/value**的集合，key可以是任意可被哈希（内部key被hash后作为索引）的类型。因此，key可以是文本、数字等任意类型。

- 如果两个数字'=='判断相等，那么key就相等，value会产生覆盖（例如：1 == 1.0 # => True）。

- 注意，浮点数比较很不精确，因此**千万不要用浮点数作为key**！<!--more-->


# 定义


字典是Python的**内置类型**，有字面量的表示方法——逗号分割的'key: value'元组:

```python
{'one': 1, 'two':2, 'three':3}
```
当然，还可以用dict函数来生成返回字典（摘自官方文档的一个例子）：


```python
>>> a = dict(one=1, two=2, three=3)
>>> b = {'one': 1, 'two': 2, 'three': 3}
>>> c = dict(zip(['one', 'two', 'three'], [1, 2, 3]))
>>> d = dict([('two', 2), ('one', 1), ('three', 3)])
>>> e = dict({'three': 3, 'one': 1, 'two': 2})
>>> a == b == c == d == e
True
```

- dict函数可接收的参数形式相当丰富。

- 第一行用关键字参数来生成字典，很容易理解。

- 第三行与第四行其实是相同的方式，zip函数将两个数组参数两两合并成为一个二元组数组，所以，还可以传入二元组数组作为参数。

- 直接传入一个字面量的字典表示法也可以。


当然，这几种形式后面还可以继续加关键字参数：


```python
>>> d = dict([('two', 2), ('one', 1), ('three', 3)], four=4, five=5)
>>> e = dict({'three': 3, 'one': 1, 'two': 2}, four=4, five=5)
```

**后面的关键字参数key如果在前面出现过，那么将会覆盖前面的值。**


# 常见操作


- 'd'表示一个字典实例，'dict'表示字典类

- len(d) 返回字典中有多少项

- d[key] 返回索引为'key'的值，不存在抛出KeyError

- d[key] = value 设置'key'项的值为'value'

- del d[key] 删除索引为'key'的项，不存在抛出KeyError

- key in d 返回'key'是否在字典内

- key not in d返回'key'是否不在字典内


# 高级操作



```python
>>> d = dict(one=1, two=2, three=3)
>>> it = iter(d)
>>> it.next() # => "three" # 字典插入是无顺序的
>>> it.next() # => "two"
>>> it.next() # => "one"
>>> it.next() # => StopIteration
```

```cpp
- d.clear() 清除所有项
- d.copy() 返回一个克隆的字典
- iter(d) 返回一个iterable对象，迭代字典的key。相当于d.iterkeys()
- dict.fromkeys(seq[,value]) 通过一个序列对象（列表、字典、集合的keys等）创建字典，value为每个项的默认值
- d.get(key,[default]) 获取key对应的值，不存在则返回default值。与d[key]的区别是前者不抛出KeyError，而是返回default值
- d.keys() 将所有keys作为一个列表返回，相当与list(d)
- d.values()
- d.items() 返回一个(key, value)的元组列表
- d.iterkeys() 返回一个可key的迭代对象
```
- d.itervalues
- d.iteritems

- d.pop(key[,default]) 删除指定的项并返回值，如果不存在则返回default。若default未设置则在key不存在的情况下抛出KeyError

- d.popitem() 删除随机的一个项，并返回(key, value)

- d.setdefault(key[,default]) 与d.pop很相似，不过，在没有指定key的情况下该函数会插入这个项并返回

- d.update([other]) 与用dict创建字典所接受的参数类型相同，创建或者更新项

- d.viewkeys() 返回view对象，字典改变，view对象也会改变


- d.viewvalues()

- d.viewitems()

# View对象


v不能进行更新和索引，需先转换为其他序列类型。


- len(v)

- iter(v)

- x in v

- v & other 交集，other可以是任何序列对象

- v | other 并集

- v - other 补集

- v ^ other 非交集


# 鸣谢

https://www.cnblogs.com/hyper-xl/p/6502774.html
