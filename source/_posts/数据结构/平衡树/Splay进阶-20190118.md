---
title: Splay 进阶
categories:
  - 数据结构
abbrlink: 6856
date: 2019-01-18 09:52:59
updated: 2019-01-18 09:52:59
tags:
---

# 前言

[splay 初步](https://sshwy.gitee.io/2018/12/19/51231/) 里面提到了 splay 的拓展性

其实 splay 不只是用于维护二叉搜索树，有时候也会脱离二叉搜索树的范畴

<!--more-->

# Splay 维护区间信息

区间信息通常可以用线段树或者树状数组维护，不过不可忽略的是 Splay 也可以维护区间

比如 [BZOJ3223 文艺平衡树](https://www.lydsy.com/JudgeOnline/problem.php?id=3223). 要求支持区间翻转操作.

## 区间翻转

区间翻转放在二叉树上是什么？左右儿子交换啊！

### 维护方法

结合 Splay 本身各种各样的操作，Splay 维护区间翻转的方法是这样的：

1. 初始化：**区间的下标**作为键值插入到 Splay 中.
2. 查询 $[l,r]$：把 $l-1,r+1$ 对应的结点伸展到一起，把区间夹成一颗子树，然后交换左右儿子就行啦

可是直接交换左右儿子是 $O(n)$ 的啊

加一个 lazytag 就行啦，作用和线段树的 lazytag 差不多

然后每次维护的时候 pushdown 一下就行

### 非 BST

上述方法其实是破坏了二叉搜索树的性质的。因为你交换左右儿子，相当于打乱了键值的排列方式

其实 Splay 本身也不局限于 BST，对于一类不求键值单调性的动态维护问题，也可以用 Splay 维护.

### BZOJ3223 代码

```cpp
#include<cstdio>
#include<algorithm>
using namespace std;
const int N=1e5+5;
int n,m;

int rt,tot;
int pa[N],ch[N][2],sz[N],cnt[N],val[N];
bool tg[N];

bool get(int u){return ch[pa[u]][1]==u;}
void pushup(int u){sz[u]=sz[ch[u][0]]+sz[ch[u][1]]+cnt[u];}
void pushdown(int u){if(tg[u])swap(ch[u][0],ch[u][1]),tg[ch[u][0]]^=1,tg[ch[u][1]]^=1,tg[u]=0;
}

void rotate(int u){pushdown(u);
	int p=pa[u],pp=pa[p],k=get(u);
	ch[pp][get(p)]=u,pa[u]=pp;
	ch[p][k]=ch[u][k^1],pa[ch[u][k^1]]=p;
	ch[u][k^1]=p,pa[p]=u;
	pushup(p),pushup(u);
}
void splay(int u,int v){while(pa[u]!=v){int p=pa[u];
		if(pa[p]!=v)rotate(get(p)==get(u)?p:u);
		rotate(u);
	}
	if(!v)rt=u;
}
void insert(int key){
	int u=rt,p=0;
	while(val[u]!=key&&u)p=u,u=ch[u][val[u]<key];
	if(u)++cnt[u];
	else {
		u=++tot;
		if(p)ch[p][val[p]<key]=u;
		pa[u]=p,ch[u][0]=ch[u][1]=0,sz[u]=cnt[u]=1,val[u]=key;
	}
	splay(u,0);
}
int kth(int k){
	++k;
	int u=rt;
	while(1){pushdown(u);
		if(sz[ch[u][0]]+cnt[u]<k)k-=sz[ch[u][0]]+cnt[u],u=ch[u][1];
		else if(k<=sz[ch[u][0]])u=ch[u][0];
		else return u;
	}
}
void rvs(int l,int r){int kl=kth(l-1),kr=kth(r+1);
	splay(kl,0),splay(kr,kl);
	int u=ch[kr][0];
	tg[u]^=1;
}
void mid_print(int u){pushdown(u);
	if(ch[u][0])mid_print(ch[u][0]);
	if(val[u]!=1<<30&&val[u]!=-1<<30)printf("%d",val[u]);
	if(ch[u][1])mid_print(ch[u][1]);
}
int main(){scanf("%d%d",&n,&m);
	insert(1<<30),insert(-1<<30);
	for(int i=1;i<=n;i++)insert(i);
	for(int i=1,l,r;i<=m;i++){scanf("%d%d",&l,&r);
		rvs(l,r);
		//mid_print(rt),puts("");
		//draw();}
	mid_print(rt);
	return 0;
}
```

## 维护动态序列

上述区间翻转只是简单的一点，平衡树常用于维护动态序列，比如插入 / 删除元素等

维护的过程中也可以兼顾一些其他信息

但是要把平衡树维护区间与线段树维护区间分清楚

平衡树通常是点权式维护（一个点代表一个元素），而线段树是区间式维护（一个点代表一个区间）