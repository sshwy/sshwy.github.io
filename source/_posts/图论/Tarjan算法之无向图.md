---
title: Tarjan 算法之无向图
categories:
  - 图论
tags:
 - tarjan
 - 模板
abbrlink: 23395
mathjax: true
date: 2018-12-06 19:04:54
updated: 2018-12-06 19:04:54
---
# Tarjan 算法简述

![p1.png][1]

DFS 生成树：即对图进行 DFS 遍历时所有递归到的边组成的树。

时间戳：对于每一个结点，我们用 $DFN(i)$ 表示结点 i 被遍历时的次序。

追溯值：Tarjan 算法引入了追溯值 $low(x)$。

设以 x 为根的子树为 subtree(x).

$low(x)$ 定义为以下结点的 DFN 的最小值：（与 Tarjan 有向图中的 $low(x)$ 区分）

1. $subtree(x)$ 中的结点
2. 通过一条不在搜索树上的边能到达 $subtree(x)$ 的结点。

不难发现，$low(i)$ 按DFS生成树的递归遍历顺序是单调递增的，因此可以在回溯的过程中求出 $low(i)$.

# 无向图的割点与割边

对于无向图 G 中的结点 x，如果删掉它以及与它相连的边后，整个图连通块数量增加，则结点 x 被称为无向图的割点。

对于无向图 G 中的边 (x,y)，如果删掉它后，整个图连通块数量增加，则 (x,y) 被称为无向图的割边，也称作桥。

![p2.png][2]

## 判定割边 (x,y)

1. 割边一定是 DFS 搜索树上的边。
2. 令 x 是 y 的父结点，则满足 $DFN(x)<low(y)$。也就是说，从 subtree(x) 出发，不经过 (x,y) 的前提下无法走到更早访问的结点，则 (x,y) 作为 subtree(x) 与图 G 的唯一连接，即为割边。

```cpp
int dfn[N],low[N],dfn_cnt;
int ans[N],cnt;
void tarjan(int k,int p){//tarjan 找桥，根结点的父节点为0
	dfn[k]=low[k]=++dfn_cnt;
	for(int i=h[k];i;i=e[i].nex){
        int u=e[i].t;
		if(!dfn[u]){
            tarjan(u,k);
			low[k]=min(low[k],low[u]);
			if(dfn[k]<low[u])ans[++cnt]=e[i].idx;// 桥
		}
		else if(u!=p)low[k]=min(low[k],dfn[u]);
	}
}
```

## 判定割点 x

1. 若 $x$ 不为根结点，则要求，存在 $x$ 的子结点 $y$，满足 $DFN(x)\leq low(y)$. 即 $subtree(y)$ 中的结点最多能走到结点 $x$，那么将 $x$ 删除就会导致 $subtree(y)$ 与图 $G$ 不连通。
2. 若 $x$ 是根结点，则要求存在**至少 2 个**的子结点 $y$，满足 $DFN(x)\leq low(y)$。

```cpp
int dfn[N],low[N],totdfn;
bool cut[N];
int ans[N],la;
void tarjan(int u,int p){
    dfn[u]=low[u]=++totdfn;
    int cnt=0;
    for(int i=h[u];i;i=e[i].nex){
        const int v=e[i].t;
        if(!dfn[v]){
            tarjan(v,u);
            low[u]=min(low[u],low[v]);
            cnt+=dfn[u]<=low[v];
        }else low[u]=min(low[u],dfn[v]);
    }
    if(cnt-(p==0)>=1)cut[u]=1;
}
```

# 无向图的双连通分量

![p3.png][3]

## 边双连通分量 E-DCC

无向图 G 的子图 G'内不存在割边，则称 G'是图 G 的边双连通分量。

对于图 G，直接删掉所有割边，剩下分量的就是边双连通分量。

## 点双连通分量 V-DCC

无向图 G 的子图 G'内不存在割点，则称 G'是图 G 的点双连通分量。

对于图 G，割点可能同时属于多个 v-DCC，但每一条边一定只属于一个 v-DCC.

图中通过边的不同颜色来标记 v-DCC.

求 v-DCC，需在 Tarjan 算法中维护一个栈：
1. 当结点 x 被第一次访问时，把该结点入栈。
1. 当割点判定条件 $dfn[x]\leq low[y]$ 成立时，无论 x 是否为根：
  1. 从栈顶不断弹出结点，直到 y 被弹出。
  1. 刚才弹出的所有结点与结点 x 一起构成一个 v-DCC.

# POI2008 BLO

给定一张无向图，求每个点被封锁之后有多少个有序点对 $(x,y),x\ne y,1\le x,y\le n$满足 x 无法到达 y

## 分析

对于非割点，只会减少和这个点有关的 $2(n-1)$ 个点对

对于割点，则除上述之外，剩下的连通块之间也相应的有点对

![poi2008][2]

对于一个割点，将其连接的边删去后，剩余的连通块有三种情况（以上图 4 号点为例）

- 割点本身（4 号点）
- 其搜索树上的子结点为根构成的连通块（3,8 为根的搜索树构成的连通块）
- 除上述之外的结点构成一个连通块（1,2,5,6）

于是对于结点 $u$，设其搜索树上的子结点为 $v_i$，以 $u$ 为根的搜索树的大小为 $size[u]$，那么删除 $u$ 后消失的点对为
$$
ans[u]=(n-1)+\left(\sum_{i=1}^ksize[v_i](n-size[v_i])\right)\\
+\left(n-1-\sum_{i=1}^ksize[v_i]\right)\left(1+\sum_{i=1}^ksize[v_i]\right)
$$


在 tarjan 的过程中统计即可

## 代码

```cpp
#include<cstdio>
#include<algorithm>
using namespace std;
const int N=100005,M=500005;
int n,m;

struct qxx{int nex,t;};
qxx e[M*2];
int h[N],cnt;
void add_path(int f,int t){e[++cnt]=(qxx){h[f],t},h[f]=cnt;}

int dfncnt;
int dfn[N],low[N],s[N],tp;
int sz[N];// 以 i 为根的搜索树的大小
long long ans[N];
void tarjan(int u,int p){//p 为 u 的父结点
	dfn[u]=low[u]=++dfncnt,s[++tp]=u,sz[u]=1;
	int count=0,sum=0;// 当前 u 的子结点的子树和
	for(int i=h[u];i;i=e[i].nex){
        const int &v=e[i].t;
		if(!dfn[v]){
            tarjan(v,u);
			low[u]=min(low[u],low[v]);
			sz[u]+=sz[v];
			if(dfn[u]<=low[v]){
                ans[u]+=(long long)sz[v]*(n-sz[v]);// 统计答案
				sum+=sz[v],count++;//count:dfn[u]<=low[v] 的个数
			}
		}
		else low[u]=min(low[u],dfn[v]);
	}
	if(count-(u==p)>0)ans[u]+=(long long)(n-1-sum)*(1+sum)+n-1;
	else ans[u]=2*(n-1);// 不是割点，之前的计算无效
}
int main(){
    scanf("%d%d",&n,&m);
	for(int i=1;i<=m;i++){
        int a,b;
		scanf("%d%d",&a,&b);
		add_path(a,b);add_path(b,a);
	}
	for(int i=1;i<=n;i++)if(!dfn[i])tarjan(i,i);
	for(int i=1;i<=n;i++)printf("%lld\n",ans[i]);
	return 0;
}
```

[1]: https://hexo-source-1257756441.cos.ap-chengdu.myqcloud.com/2018/09/3902810133.png
[2]: https://hexo-source-1257756441.cos.ap-chengdu.myqcloud.com/2018/09/3962146379.png
[3]: https://hexo-source-1257756441.cos.ap-chengdu.myqcloud.com/2018/09/1620780469.png
