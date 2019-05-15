---
title: Python排序
categories:
  - 程序语言
mathjax: true
abbrlink: 40304
date: 2018-10-01 20:22:00
updated: 2018-10-01 20:22:00
---
# sorted()

简单的升序排序非常容易：只需调用 sorted() 函数，就得到一个有序的新列表：


<!--more-->
```python
>>> sorted([5, 2, 3, 1, 4])
[1, 2, 3, 4, 5]
```


# list.sort()

你也可以使用 list.sort() 方法，此方法为就地排序（并且返回 None 来避免混淆）。通常来说这不如 sorted() 方便——但是当你不需要保留原始列表的时候，这种方式略高效一些。


```python
>>> a = [5, 2, 3, 1, 4]
>>> a.sort()
>>> a
[1, 2, 3, 4, 5]
```

另外一个区别是 list.sort() 方法只可以供列表使用，而 sorted() 函数可以接受任意可迭代对象（iterable）。


```python
>>> sorted({1: 'D', 2: 'B', 3: 'B', 4: 'E', 5: 'A'})
[1, 2, 3, 4, 5]
```

# Key

list.sort() 和 sorted() 都有一个 key 参数，用于指定在作比较之前，调用何种函数对列表元素进行处理。例如，忽略大小写的字符串比较：


```python
>>> sorted("This is a test string from Andrew".split(), key=str.lower)
['a', 'Andrew', 'from', 'is', 'string', 'test', 'This']
```

key 参数的值应该是一个函数，该函数接收一个参数，并且返回一个 key 为排序时所用。这种方法速度很快，因为每个输入项仅调用一次 key 函数。


一种常见模式是使用对象的下标作为 key 来排序复杂对象。例如：


```python
>>> student_tuples = [
    ('john', 'A', 15),
    ('jane', 'B', 12),
    ('dave', 'B', 10),
]
>>> sorted(student_tuples, key=lambda student: student[2])   # sort by age
[('dave', 'B', 10), ('jane', 'B', 12), ('john', 'A', 15)]
```

同样的技巧也可以用在带有命名属性（named attributes）的对象上。例如：


```python
>>> class Student:
        def <strong>init</strong>(self, name, grade, age):
            self.name = name
            self.grade = grade
            self.age = age
        def <strong>repr</strong>(self):
            return repr((self.name, self.grade, self.age))
```

```python
>>> student_objects = [
    Student('john', 'A', 15),
    Student('jane', 'B', 12),
    Student('dave', 'B', 10),
]
>>> sorted(student_objects, key=lambda student: student.age)   # sort by age
[('dave', 'B', 10), ('jane', 'B', 12), ('john', 'A', 15)]
```

# operator


上述的 key 函数模式是非常常见的，所以 Python 提供了一些更简单快速的访问属性的函数。operator 模块有 itemgetter()、attrgetter() 和 methodcaller() 函数。 Using those functions, the above examples become simpler and faster: 使用这些函数，可以使上述的示例更加简洁高效：


```python
>>> from operator import itemgetter, attrgetter
```

```python
>>> sorted(student_tuples, key=itemgetter(2))
[('dave', 'B', 10), ('jane', 'B', 12), ('john', 'A', 15)]
```

```python
>>> sorted(student_objects, key=attrgetter('age'))
[('dave', 'B', 10), ('jane', 'B', 12), ('john', 'A', 15)]
```
operator 模块方法允许多级排序。例如，可以先按 grade 排序，然后再按 age 排序：


```python
>>> sorted(student<em>tuples, key=itemgetter(1,2))
[('john', 'A', 15), ('dave', 'B', 10), ('jane', 'B', 12)]</em>
```

```python
>>> sorted(student_objects, key=attrgetter('grade', 'age'))
[('john', 'A', 15), ('dave', 'B', 10), ('jane', 'B', 12)]
```

# reverse


list.sort() 和 sorted() 都有布尔型的 reverse 参数，用来指定是否降序。例如，按 age 的降序来对学生数据进行排序：


```python
>>> sorted(student_tuples, key=itemgetter(2), reverse=True)
[('john', 'A', 15), ('jane', 'B', 12), ('dave', 'B', 10)]
```

```python
>>> sorted(student_objects, key=attrgetter('age'), reverse=True)
[('john', 'A', 15), ('jane', 'B', 12), ('dave', 'B', 10)]
```

**排序是保证为稳定的**，也就是说，当多条记录拥有相同的 key 时，原始的顺序会被保留下来。


```python
>>> data = [('red', 1), ('blue', 1), ('red', 2), ('blue', 2)]
>>> sorted(data, key=itemgetter(0))
[('blue', 1), ('blue', 2), ('red', 1), ('red', 2)]
```

注意到两条 blue 记录保持了原来的顺序， 所以 (‘blue’, 1) 一定在 (‘blue’, 2) 之前。


这个非常棒的属性允许你通过一系列排序来进行复杂排序。例如，学生数据先按 grade 升序，然后按 age 降序，优先排序 age，然后再按 grade 排序：


```python
>>> s = sorted(student_objects, key=attrgetter('age'))     # sort on secondary key
>>> sorted(s, key=attrgetter('grade'), reverse=True)       # now sort on primary key, descending
[('dave', 'B', 10), ('jane', 'B', 12), ('john', 'A', 15)]
```

Python 使用的 **Timsort** 算法由于可以有效利用数据集中已有的顺序，因而可以高效地进行多级排序。


# DSU

使用 Decorate-Sort-Undecorate 的旧方法

Decorate-Sort-Undecorate 的名称来源于这种方法的三个步骤：


第一步，初始的列表进行转换，获得用于排序的新值。

第二步，将转换为新值的列表进行排序。

最后，还原数据并得到一个排序后仅包含原始值的列表。

例如，使用 DSU（译注：Decorate-Sort-Undecorate的简写）方法，按 grade 来排序学生数据：


```python
>>> decorated = [(student.grade, i, student) for i, student in enumerate(student_objects)]
>>> decorated.sort()
>>> [student for grade, i, student in decorated]               # undecorate
[('john', 'A', 15), ('jane', 'B', 12), ('dave', 'B', 10)]
```

这一方法利用了元组按字典序 (lexicographically) 比较的特性；先比较第一项；如果第一项相同，则比较第二项，以此类推。


在很多情况下是不需要在处理后的列表（decorated list）包含原始下标 i，但是包含原始下标有两个好处：


排序是稳定的——如果有两项有相同的 key，排序后的列表会保留他们的顺序。

原始项不需要是可比较的，因为处理后的元组最多使用前面两项就可以决定排序。例如，原始列表中包含无法直接比较的复数。

这个方法还有另外一个名字，是以 Randal L. Schwartz 的名字来命名的 Schwartzian 变换，因为他使得这个变换在 Perl 程序员中得以流行。


在 Python 排序提供 key 函数之后，这个技巧已经不常用了。


# cmp

使用 cmp 参数的旧方法

本篇指南中给出的方法都假设 Python 2.4 或更新版本。在 2.4 之前，sorted() 和 list.sort() 是没有 key 参数的。但是，在所有的 Py2.x 版本都支持 cmp 参数来处理用户自定义排序函数。


在 Py3.0 中，cmp 参数已经被完全移除（作为简化和统一语言的一部分，去除排序和 cmp() 魔法方法之间的冲突）。


在 Py2.x 中，sort 允许传入一个可选函数，会在进行比较的时候调用。函数必须接受两个参数进行比较，然后返回负数表示小于，返回 0 表示相等，返回正数表示大于。例如，我们可以这样：


```python
>>> def numeric_compare(x, y):
        return x - y
>>> sorted([5, 2, 4, 1, 3], cmp=numeric_compare)
[1, 2, 3, 4, 5]
```

或者你也可以反转比较顺序：


```python
>>> def reverse_numeric(x, y):
        return y - x
>>> sorted([5, 2, 4, 1, 3], cmp=reverse_numeric)
[5, 4, 3, 2, 1]
```

当从 Python 2.x 移植代码到 3.x 时，可能会出现需要将用户提供的排序函数转换为 key 函数的情况。下面的包装器可以轻松做到：


```python
def cmp<em>to<em>key(mycmp):
    'Convert a cmp= function into a key= function'
    class K:
        def <strong>init</strong>(self, obj, *args):
            self.obj = obj
        def <strong>lt</strong>(self, other):
            return mycmp(self.obj, other.obj) < 0
        def <strong>gt</strong>(self, other):
            return mycmp(self.obj, other.obj) > 0
        def <strong>eq</strong>(self, other):
            return mycmp(self.obj, other.obj) == 0
        def <strong>le</strong>(self, other):
            return mycmp(self.obj, other.obj) <= 0
        def <strong>ge</strong>(self, other):
            return mycmp(self.obj, other.obj) >= 0
        def __ne</em></em>(self, other):
            return mycmp(self.obj, other.obj) != 0
    return K
```

转换为 key 函数，仅需要包装旧的比较函数即可：


```python
>>> sorted([5, 2, 4, 1, 3], key=cmp_to_key(reverse_numeric))
[5, 4, 3, 2, 1]
```

在 Python 3.2 中，functools.cmp\_to\_key() 函数已经添加到标准库的 functools 模块中。


# 其他要点


针对时区相关排序，使用 locale.strxfrm() 作为 key 函数，或者使用 locale.strcoll() 作为比较函数。

reverse 参数仍然保持排序稳定性（以便相同 key 的项保留原顺序）。有趣的是，无需传入参数，通过两次调用内置的 reversed() 函数，可以模拟出相同的效果：


```python
>>> data = [('red', 1), ('blue', 1), ('red', 2), ('blue', 2)]
>>> assert sorted(data, reverse=True) == list(reversed(sorted(reversed(data))))
```

在两个对象进行比较时，sort 使用的是 lt() 方法。所以，只需要为类添加 lt() 方法，就可以为类加入排序顺序：


```python
>>> Student.<strong>lt</strong> = lambda self, other: self.age < other.age
>>> sorted(student_objects)
[('dave', 'B', 10), ('jane', 'B', 12), ('john', 'A', 15)]
```

key 函数不需要直接依赖于排序的对象。key 函数可以访问外部资源。例如，如果学生的成绩保存在字典中，字典中的数据可以给单独的一个学生名字排序：


```python
>>> students = ['dave', 'john', 'jane']
>>> newgrades = {'john': 'F', 'jane':'A', 'dave': 'C'}
>>> sorted(students, key=newgrades.<strong>getitem</strong>)
['jane', 'dave', 'john']
```

# 鸣谢


http://python.jobbole.com/85488/
