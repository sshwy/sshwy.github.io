---
title: FHQ Treap 入门
mathjax: true
categories:
  - 数据结构
abbrlink: 59420
date: 2019-05-18 00:47:17
updated: 2019-05-23 13:42:17
tags:
  - 精选
keywords:
---

2019.9.19 编入精选文章。

**摘要**

整整四个月的沉寂，四个月的恐惧自闭，就在最后的 6 个小时，在凌晨 12 点 48 分，他醒了！扼住了平衡树的咽喉 emmm（手动滑稽）

<!--more-->

# FHQ Treap | Treap | Splay

大概讲一下神奇的 FHQ Treap 吧，它把我从对平衡树水深火热的恐惧中拯救回来。为什么要学 FHQ Treap？

首先，FHQ Treap 与 Treap 同样基于模拟堆维护平衡的思想。而 Splay 基于随机的伸展操作维护平衡。那么 FHQ Treap 与这两者的区别是什么呢？它不旋转！这玩意儿它不含旋转操作！核心操作不到 15 行！通俗易懂，可读性没谁了！那，代码好写是不是意味着这玩意儿比较鸡肋呢？然而除了 LCT，Splay | Treap 能写的，它也能写！而且，Splay 不能持久化，这玩意儿能持久化。真是感觉相见恨晚啊

# 核心操作

废话不讲了，直接切入正题。先声名一下笔者用的变量

| $lc[u],rc[u]$  | $val[u]$ | $sz[u]$  | $rnd[u]$     | tot          | seed       | root |
| ------------ | -------- | -------- | ------------ | ------------ | ---------- | ---- |
| 左右儿子指针 | 结点键值 | 子树大小 | 该点的随机值 | 新建结点总数 | 随机数种子 | 树根 |

## 分割 Split

FHQ Treap 利用分割操作按照键值 k 将一棵平衡树分为两棵平衡树 x,y，其中 x 中的键值都小于等于 k，y 中的键值都大于 k。分割采用递归的方式，代码很好懂，就不上图了

```cpp
void split(int u,int k,int &x,int &y){
    if(!u){x=y=0;return;}
    pushdown(u);
    if(val[u]<=k)x=u, split(rc[u],k,rc[u],y);
    else y=u, split(lc[u],k,x,lc[u]);
    pushup(u);
}
```

这里稍微解释一下，如果有下传的标记就把代码写到 `pushdown` 函数里。同理，如果有上穿的标记就把代码放到 `pushup` 函数里（或者可以直接写到 split 里面）。最常见的上传标记是子树大小（sz）。

值得一提的是，split 不只能按权值分割。对于维护序列的问题，通常要求在某个位置 pos 上做操作，那么我们就需要实现一个 split，将平衡树按大小分割，使得 x 的大小为 pos。方法也不难，把比较的条件改成用 sz 做比较即可

```cpp
void split(int u,int k,int &x,int &y){
    // 分割函数，这里的 k 是指把 u 的前 k 个数 split 出来成为 x
    if(!u){x=y=0;return;}
    pushdown(u);
    if(k>sz[lc[u]])x=u, split(rc[u],k-sz[lc[u]]-1,rc[u],y);
    else y=u, split(lc[u],k,x,lc[u]);
    pushup(u);// 递归完成后，向上更新
}

```

##  合并 Merge

有分割就有合并，而合并同样要求两棵平衡树 x,y 满足，x 的键值都小于等于 y 的键值（即 x 中最大的键值小于等于 y 中最小的键值），类似的递归进行。合并的时侯就像 Treap 一样，按照结点的随机值维护一个堆，以达到平衡效果（弱平衡）

```cpp
int merge(int x,int y){
    pushdown(x), pushdown(y);
    if(!x||!y)return x+y;
    if(rnd[x]<rnd[y])return rc[x]=merge(rc[x],y), pushup(x), x;
    else return lc[y]=merge(x,lc[y]), pushup(y), y;
}
```

条件取 `rnd[x]>rnd[y]` 或者 `rnd[x]<rnd[y]` 都可以。

好啦，有了上面两个操作，我们就可以横着走了。

# 基础但重要的操作

不过在干正事以前要先补充几个很基础的东西

## 上传标记

给一个最最最基础的版本吧——至少子树大小应该是要上传的吧

```cpp
void pushup(int u){
    sz[u]=sz[lc[u]]+sz[rc[u]];
}
```

## 下传标记

这里要谈一下标记的含义问题。每个结点的标记是已经应用在当前结点上的，因此下传的时侯只需要处理子结点的信息即可。笔者总结出一个比较常用的框架，首先是 pushdown：

```cpp
void pushdown(int u){
    if(!u)return;
    if(tag[u]){
        pushtag(lc[u],tag[u]), pushtag(rc[u],tag[u]);
        tag[u]=0;
    }
    //etc...
}
```

注意到我们调用了一个 pushtag 函数，这个函数的意义是指把一个标记更新到某个结点的信息上（同时更新这个结点的标记），框架如下

```cpp
void pushtag(int u,int tg/*, etc..*/){// 可以有多个 tag
    //do something to update u's data
    tag[u]=tg;// 标记这个结点
}
```

这个框架还有一个有用的地方，就是在那些添加标记的操作中，找到对应区间的结点后直接调用 pushtag 函数即可，不用手写更新。

## 删建结点

新建结点一般是直接 `++tot`，但是遇到需要回收内存的题（NOI2005 维护序列），就要设计一个新建和删除结点的函数。新建结点的作用除了清 0 还可以帮助初始化，比较常用。而删除结点的函数需要外部维护一个数据结构保存删除的结点的标号（通常是队列或者栈）。那么在新建结点的时侯首先检查队列 / 栈是否为空，如果不为空就从里面选择结点创建，否则就 `++tot`. 实现依具体情况而定，就不给代码了

## 随机数生成

一般会用 rand 函数。但是其实在 Treap 中的随机可以不用 rand，用以下方式能高速实现

```cpp
int rrand(){return seed*=482711;}
```

seed 一开始为 1. 这个随机值自动对 MAX_INT 取模，并且保证一个循环节取遍 INT 域，常数小。

# 常用操作

上面把各种准备的内容都说完了，下面讲平衡树的操作。

## 插入操作

插入一个键值 k，方法是把平衡树按 k-1 分割成 x,y，这样 x 就包含所有**小于**k 的键值。然后新建个键值为 k 的结点，把这个单结点当成一棵平衡树，然后把 x,k,y 按序合并即可。

```cpp
void insert(int v){// 插入键值 v
    int x,y,u=++tot;
    val[u]=v,sz[u]=1,rnd[u]=rrand();// 初始化单个结点
    split(root,v,x,y);
    root=merge(merge(x,u),y);
}
```

这样插入，平衡树中可能出现键值相同的结点。如果非要求键值不同的话，维护一个 cnt 表示出现次数，然后插入的时侯判断一下即可，但这样写比较麻烦。

## 删除操作

同理，把平衡树按 k-1,k 分割成 x,y,z 三个平衡树，其中 x<y<z，y 中的键值全部为 k，然后删除 y 的根结点，再合并即可。

```cpp
void del(int v){
    int x,y,z;
    split(root,v-1,x,y);
    split(y,v,y,z);// 所有的 v 被分在 y 中
    if(!y)return;// 不存在 v 这个权值
    y=merge(lc[y],rc[y]);// 根结点的 v 删除
    root=merge(x,merge(y,z));
}
```

如果是要求删除所有键值为 k 的结点，直接不管 y，合并 x,z 即可。

## 查询键值排名

多个相同键值的排名是一样的，因此直接按 k-1 分割，返回 x 的大小 +1 即可

```cpp
int rank(int v){// 即相同的数中，第一个数的排名
    int x,y,res;
    split(root,v-1,x,y);
    res=sz[x]+1, root=merge(x,y);
    return res;
}
```

## 第 k 小

这个就只能在平衡树上直接查询了

```cpp
int kth(int k){// 查询排名为 k 的数
    int u=root;
    pushdown(u);
    while(k!=sz[lc[u]]+1){
        if(k<=sz[lc[u]])u=lc[u];
        else k-=sz[lc[u]]+1,u=rc[u];
    }
    return val[u];
}
```

注意，不基于分割合并的操作是要自己加 pushup 和 pushdown 的。

## 前驱后继

这个东西没什么好讲的，注意这里是指严格大于 / 小于。

```cpp
int pre(int v){return kth(rank(v)-1);}// 严格前驱
int suc(int v){return kth(rank(v+1));}// 严格后继
```

# 序列翻转

同 Splay，维护一个 tag，然后分割合并的时侯下传上传一下即可

# Vector 与普通平衡树

Emmmmm LG 模板数据真的水。可以直接写一个 Vector

```cpp
#include<bits/stdc++.h>
using namespace std;
int n;
vector<int> a;

int main(){
    scanf("%d",&n);
    for(int i=1;i<=n;i++){
        int op,x;
        scanf("%d%d",&op,&x);
        int pos=lower_bound(a.begin(),a.end(),x)-a.begin();
        if(op==1)a.insert(a.begin()+pos,x);
        else if(op==2)a.erase(a.begin()+pos,a.begin()+pos+1);
        else if(op==3)printf("%d\n",pos+1);
        else if(op==4)printf("%d\n",a[x-1]);
        else if(op==5)printf("%d\n",a[pos-1]);
        else printf("%d\n",*upper_bound(a.begin(),a.end(),x));
    }
    return 0;
}

```

459ms

wzbl

# 后记

大概，FHQ 的常数在 Splay 和 Treap 之间
