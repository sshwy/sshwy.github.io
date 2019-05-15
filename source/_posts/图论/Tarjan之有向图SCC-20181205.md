---
title: Tarjan 之有向图 SCC
categories:
  - 图论
tags:
 - Tarjan
 - 专题
 - 模板
abbrlink: 59112
mathjax: true
date: 2018-12-06 21:18:31
updated: 2018-01-16 10:50:31
---
# 引言

tarjan 一直是我认为非常玄学的算法。

首先不提它的描述之模糊，dalao 们写的博客之雷同

这算法的应用就很玄学

于是，本蒟蒻今天就来揭开它神秘的面纱……

<!--more-->

# 分解 Tarjan

***下面的大部分部分内容来自 dalao 们的 Blog（做了调整）***

## DFS 搜索树

**原址：[Tarjan 算法寻找有向图的强连通分量](http://blog.miskcoo.com/2016/07/tarjan-algorithm-strongly-connected-components)**

> Tarjan 算法是由 Robert Tarjan 提出的用于寻找有向图的强连通分量的算法。它可以在`O(|V|+|E|)`的时间内得出结果。

在介绍该算法之前，先来了解**DFS 搜索生成树**，以下图为例（一种可能的搜索情况）：
![派.png][1]

有向图的搜索树主要有 4 种边（不一定全部出现）：
- 绿色的是树边（tree edge），每次搜索找到一个还没有访问过的结点的时候就形成了一条树边
- 黄色的是反祖边（back edge），也被叫做回边，即指向祖先结点的边
- 红色的是横叉边（cross edge），它主要是在搜索的时候遇到了一个已经访问过的结点，但是这个结点**并不是**当前节点的祖先时形成的
- 蓝色的边叫做前向边（forward edge），它是在搜索的时候遇到子树中的结点的时候形成的。

对于在这样的搜索树上的强连通分量：
> 很重要的一点是如果结点 u 是某个强连通分量在搜索树中遇到的第一个结点（这通常被称为这个强连通分量的根），那么这个强连通分量的其余结点肯定是在搜索树中以 u 为根的子树中。

> 反证法：假设有个结点 v 在该强连通分量中但是不在以 u 为根的子树中，那么 u 到 v 的路径中肯定有一条离开子树的边。但是这样的边只可能是横叉边或者反祖边，然而这两条边都要求指向的结点已经被访问过了，这就和 u 是第一个访问的结点矛盾了。得证。

## Tarjan 求强连通分量

**原址：[Tarjan 算法详解](https://blog.csdn.net/jeryjeryjery/article/details/52829142)**

在 Tarjan 算法中为每个节点 i 维护了以下几个变量：
- `DFN[i]`：深度优先搜索遍历时节点 i 被搜索的次序。
- `low[i]`：设以 i 为根的子树为 $subtree(i)$.$low[i]$ 定义为以下结点的 DFN 的最小值：
  1. $subtree(i)$ 中的结点
  2. 从 $subtree(i)$ 通过一条不在搜索树上的边能到达的结点。
- 显然，按照 DFS 搜索树的递归顺序，$low[x]$ 是单调递增的。

按照深度优先搜索算法搜索的次序对图中所有的节点进行搜索：
在搜索过程中，对于任意节点 $u$ 和与其相连的节点 $v$，根据节点 $v$ 是否在栈中来进行不同的操作：

1. 节点 $v$ 未被访问：继续对 $v$ 进行深度搜索。在回溯过程中，用 $low[v]$ 更新 $low[u]$。因为存在从 $u$ 到 $v$ 的直接路径，所以 $v$ 能够回溯到的已经在栈中的节点，$u$ 也一定能够回溯到。
2. 节点 $v$ 被访问过，已经在栈中：即已经被访问过，根据 $low$ 值的定义（能够回溯到的最早的已经在栈中的节点），则用 $dfn[v]$ 更新 $low[u]$.
3. 节点 $v$ 被访问过，已不在在栈中：说明 $v$ 已搜索完毕，其所在连通分量已被处理，所以不用对其做操作。

- 将上述算法写成伪代码：
```
TARJAN_SEARCH(int u,int k)
    vis[u]=true
    low[u]=dfn[u]=k
    while v 是 u 连向的结点
        if 结点 v 未被搜索过 then
            TARJAN_SEARCH(v,k+1)// 搜索
            low[u]=min(low[u],low[v])// 回溯
        else if v 在栈中 then
            low[u]=min(low[u],dfn[v])
```
- 对于一个连通分量图，我们很容易想到，在该连通图中有且仅有一个 $dfn[u]=low[u]$。该节点一定是在深度遍历的过程中，该连通分量中第一个被访问过的节点，因为它的 DFN 值和 $low$ 值最小，不会被该连通分量中的其他节点所影响。
- 因此，在回溯的过程中，判定 $dfn[u]=low[u]$ 的条件是否成立，如果成立，则栈中从 $u$ 后面的结点构成一个 SCC.

# [LuoguP2835] 刻录光盘

首先想到的是 Tarjan 求 SCC，不过对于从 SCC 连出去的边也可以获得拷贝

所以缩点，然后统计入度为 0 的点，即为光盘刻录数量

因为只记录入度，所以用并查集来了一发非主流缩点......

```cpp
#include<bits/stdc++.h>
using namespace std;
int n,tot,k=-1;
vector<int> dpc[201];// 有向边，邻接表
int dfn[201],low[201],vis[201];//tarjan 三件套
int s[201],tp;// 栈，记录 SCC
int id[201],scc[201],snt;// 每个点的入度 id[i]，每个 SCC 的代表元 scc[i]
struct disjoint{// 并查集
	int f[50000];
	int gf(int k){return f[k]==k?k:f[k]=gf(f[k]);}
	bool find(int a,int b){return gf(a)==gf(b);}
	void un(int a,int b){f[gf(b)]=gf(a);}
	void clear(int k){for(int i=0;i<=k;i++)f[i]=i;}
};disjoint d;
void tarjan(int u){
	vis[u]=true,dfn[u]=low[u]=++k,s[++tp]=u;
	for(int i=0;i<dpc[u].size();i++){
		int v=dpc[u][i];
		if(!dfn[v]){
			tarjan(v);
			low[u]=min(low[u],low[v]);
		}
		else if(vis[v])low[u]=min(low[u],dfn[v]);
	}
	int j;
	if(dfn[u]==low[u]){
		scc[++snt]=u;
		do{
			j=s[tp],vis[s[tp]]=0,tp--,d.un(u,s[tp]);// 加入代表元所在并查集，缩点
		}while(j!=u);
	}
}
int main(){
	scanf("%d",&n);
	d.clear(n);
	for(int i=1,a;i<=n;i++)
		for(scanf("%d",&a);a;scanf("%d",&a))dpc[i].push_back(a);

	for(int i=1;i<=n;i++)dpc[0].push_back(i);// 建立虚结点 0，使图连通
	tarjan(0);
	for(int i=1;i<=n;i++)
		for(int j=0;j<dpc[i].size();j++)
			if(d.find(i,dpc[i][j])==0)id[d.gf(dpc[i][j])]++;

	for(int i=1;i<=snt;i++)if(id[scc[i]]==0)tot++;
	printf("%d",tot-1);// 除了虚结点 0 以外
	return 0;
}
```

# [USACO06JAN]The Cow Prom

- 找到元素数大于 1 的 scc 的个数
- 图不一定连通
```cpp
#include<bits/stdc++.h>
using namespace std;
const int N=10004,M=50004;

int n,m,ans;

struct qxx{int nex,t;};
qxx e[M];
int h[M],cnt;
void add_path(int f,int t){e[++cnt]={h[f],t},h[f]=cnt;}

int dfn[N],low[N],dfn_cnt;
int s[N],tp;
bool vis[N];
void tarjan(int u){
    low[u]=dfn[u]=++dfn_cnt,s[++tp]=u,vis[u]=true;
    for(int i=h[u];i;i=e[i].nex){
        const int v=e[i].t;
        if(!dfn[v]){
            tarjan(v);
            low[u]=min(low[u],low[v]);
        }
        else if(vis[v])low[u]=min(low[u],dfn[v]);
    }
    if(low[u]==dfn[u]){
        int tot=1;
        while(s[tp]!=u)tot++,vis[s[tp]]=false,--tp;
        --tp,vis[u]=false;
        if(tot>1)ans++;
    }
}

int main(){
    scanf("%d%d",&n,&m);
    for(int i=1,a,b;i<=m;i++){
        scanf("%d%d",&a,&b);
        add_path(a,b);
    }
    for(int i=1;i<=n;i++)if(!dfn[i])tarjan(i);
    printf("%d",ans);
    return 0;
}
```

# [LuoguP3387] 缩点

- 如题，模板
- 本代码未处理重边的问题
```cpp
#include<bits/stdc++.h>
using namespace std;
const int N=10004,M=100005;
int n,m,ans;
int a[M],b[M],c[N];

struct graph{
	struct qxx{int nex,t;};
	qxx e[M];
	int h[N],cnt;
	void add_path(int f,int t){e[++cnt]=(qxx){h[f],t},h[f]=cnt;}
};
graph g,g_scc;

int dfn[N],low[N],dfn_cnt;
int s[N],tp,scc[N],sc[N],sn;//scc,s_cost,s_n
void tarjan(int u){
	low[u]=dfn[u]=++dfn_cnt,s[++tp]=u;
	for(int i=g.h[u];i;i=g.e[i].nex){
		const int v=g.e[i].t;
		if(!dfn[v]){
			tarjan(v);
			low[u]=min(low[u],low[v]);
		}
		else if(!scc[v])low[u]=min(low[u],dfn[v]);
	}
	if(dfn[u]==low[u]){
        ++sn;
		while(s[tp]!=u)scc[s[tp]]=sn,--tp,sc[sn]+=c[s[tp]];//scc 的总权值
		scc[s[tp]]=sn,sc[sn]+=c[s[tp]],--tp;
	}
}
int id[N],f[N];
int main(){
	scanf("%d%d",&n,&m);
	for(int i=1;i<=n;i++)scanf("%d",&c[i]);
	for(int i=1;i<=m;i++){
		scanf("%d%d",&a[i],&b[i]);
		g.add_path(a[i],b[i]);
	}
	for(int i=1;i<=n;i++)if(!dfn[i])tarjan(i);
	// 建立新的 SCC 图
	for(int i=1;i<=m;i++)
		if(scc[a[i]]!=scc[b[i]])
			g_scc.add_path(scc[a[i]],scc[b[i]]),++id[scc[b[i]]];
	// 拓扑排序 +DP
	queue<int> q;
	for(int i=1;i<=sn;i++)if(!id[i])q.push(i),f[i]=sc[i];
	while(!q.empty()){
		int k=q.front();q.pop();
		ans=max(ans,f[k]);
		for(int i=g_scc.h[k];i;i=g_scc.e[i].nex){const int &v=g_scc.e[i].t;
			f[v]=max(f[v],f[k]+sc[v]),--id[v];
			if(!id[v])q.push(v);
		}
	}
	printf("%d",ans);
	return 0;
}
```

# [LuoguP1726] 上白泽慧音

求最大的 SCC 中，字典序最小的那个

## 分析

依然是 tarjan 的模板

对于每个点，记录它所属的 SCC，该 SCC 的大小

然后从小到大更新 SCC 编号

只取大于，不取等于，规避了字典序的问题

然后将该编号下的点输出即可

## 代码

```cpp
#include<cstdio>
#include<algorithm>
using namespace std;
const int N=5003,M=50004;
int n,m,ans;

struct qxx{int nex,t;};
qxx e[M*2];
int h[N],cnt;
void add_path(int f,int t){e[++cnt]=(qxx){h[f],t},h[f]=cnt;}

int dfn[N],low[N],dfncnt,s[N],tp;
int scc[N],sc;// 结点 i 所在 scc 的编号
int sz[N];// 强联通 i 的大小
void tarjan(int u){
	low[u]=dfn[u]=++dfncnt,s[++tp]=u;
	for(int i=h[u];i;i=e[i].nex){const int &v=e[i].t;
		if(!dfn[v]){
			tarjan(v);
			low[u]=min(low[u],low[v]);
		}
		else if(!scc[v])low[u]=min(low[u],dfn[v]);
	}
	if(dfn[u]==low[u]){
		++sc;
		while(s[tp]!=u)scc[s[tp]]=sc,sz[sc]++,--tp;
		scc[s[tp]]=sc,sz[sc]++,--tp;
	}
}
int main(){
	scanf("%d%d",&n,&m);
	for(int i=1;i<=m;i++){int a,b,t;
		scanf("%d%d%d",&a,&b,&t);
		add_path(a,b);
		if(t==2)add_path(b,a);
	}
	for(int i=1;i<=n;i++)if(!dfn[i])tarjan(i);
	for(int i=1;i<=n;i++)if(sz[scc[i]]>sz[ans])ans=scc[i];
	printf("%d\n",sz[ans]);
	for(int i=1;i<=n;i++)if(scc[i]==ans)printf("%d ",i);
	return 0;
}
```

# [USACO5.3]Network of Schools

缩点之后，求入度为 0 的点的个数，以及入度为 0 和出度为 0 的点的个数的最大值

## 代码

```cpp
#include<cstdio>
#include<vector>
using namespace std;
const int N=105;
int n,t1,t2;
vector<int> e[N];

int dfncnt;
int dfn[N],low[N],s[N],tp;
int scc[N],cs,od[N],id[N];
void tarjan(int u){
	dfn[u]=low[u]=++dfncnt,s[++tp]=u;
	for(int i=0;i<e[u].size();i++){const int &v=e[u][i];
		if(!dfn[v]){
			tarjan(v);
			low[u]=min(low[u],low[v]);
		}
		else if(!scc[v])low[u]=min(low[u],dfn[v]);
	}
	if(low[u]==dfn[u]){
		++cs;
		while(s[tp]!=u)scc[s[tp]]=cs,--tp;
		scc[s[tp]]=cs,--tp;
	}
}
int main(){
	scanf("%d",&n);
	for(int i=1,a;i<=n;i++){
		while(~scanf("%d",&a)&&a)e[i].push_back(a);
	}
	for(int i=1;i<=n;i++)if(!dfn[i])tarjan(i);
	for(int i=1;i<=n;i++){
		for(int j=0;j<e[i].size();j++){const int &v=e[i][j];
			if(scc[i]!=scc[v])od[scc[i]]++,id[scc[v]]++;
		}
	}
	for(int i=1;i<=cs;i++)t1+=(id[i]==0),t2+=(od[i]==0);
	printf("%d\n%d",t1,cs==1?0:max(t1,t2));// 如果只有一个 SCC，当然不需要增加
	return 0;
}
```

# [USACO15JAN]Grass Cownoisseur

给一个有向图，允许重复走边走点，且允许一次反向通过某一条边。

要求从 1 号出发，到 1 号结束。问最多经过多少个不同的点

## 分析

首先，我们选择可以反向走一次的边肯定不在一个强联通分量内，否则是无意义的

因此 tarjan 缩点之后，考虑 DAG 上走一次反边，相当于走一个环，要求这个环包含结点 1 所在 SCC

相当于预处理从 1 所在的 SCC 到各个 SCC 的最长路 $d1[i]$，再处理从各个 SCC 到 1 所在 SCC 的最长路 $d2[i]$，然后对于每条边 $(u,v)$，用 $d1[u]+d2[v]$ 和 $d1[v]+d2[u]$ 更新答案（即反走 $(u,v)$）

## 代码

```cpp
#include<cstdio>
#include<cstring>
#include<queue>
#include<algorithm>
using namespace std;
const int N=100005;
int n,m,ans;
// 前向星
struct qxx{int nex,t;};
qxx e[N];
int h[N],cnt;
void add_path(int f,int t){e[++cnt]=(qxx){h[f],t},h[f]=cnt;}
//tarjan 模板
int dfncnt;
int dfn[N],low[N],s[N],tp;
int scc[N],cs,sz[N];
void tarjan(int u){
	dfn[u]=low[u]=++dfncnt,s[++tp]=u;
	for(int i=h[u];i;i=e[i].nex){const int &v=e[i].t;
		if(!dfn[v]){
			tarjan(v);
			low[u]=min(low[u],low[v]);
		}
		else if(!scc[v])low[u]=min(low[u],dfn[v]);
	}
	if(dfn[u]==low[u]){
		++cs;
		while(s[tp]!=u)scc[s[tp]]=cs,sz[cs]++,--tp;
		scc[s[tp]]=cs,sz[cs]++,--tp;
	}
}
// 两次 dijkstra
qxx e_[N],e__[N];
int h_[N],cnt_,h__[N],cnt__;
void scc_add_path(int f,int t){// 正反建双图 (dijkstra)
	e_[++cnt_]=(qxx){h_[f],t},h_[f]=cnt_;
	e__[++cnt__]=(qxx){h__[t],f},h__[t]=cnt__;
}
#define fi first
#define se second
#define pii pair<int,int>
priority_queue<pii> q;
int d1[N],d2[N];
void dijkstra(int * d,int * h,qxx * e){
	d[scc[1]]=sz[scc[1]],q.push(make_pair(d[scc[1]],scc[1]));
	while(!q.empty()){
		pii u=q.top();q.pop();
		if(d[u.se]>u.fi)continue;
		for(int i=h[u.se];i;i=e[i].nex){const int &v=e[i].t;
			if(d[v]<d[u.se]+sz[v]){
				d[v]=d[u.se]+sz[v];
				q.push(make_pair(d[v],v));
			}
		}
	}
}
int main(){
	scanf("%d%d",&n,&m);
	for(int i=1;i<=m;i++){int x,y;
		scanf("%d%d",&x,&y);
		add_path(x,y);
	}
	for(int i=1;i<=n;i++)if(!dfn[i])tarjan(i);
	for(int i=1;i<=n;i++){//DAG 建图
		for(int j=h[i];j;j=e[j].nex){const int &v=e[j].t;
			if(scc[i]!=scc[v])scc_add_path(scc[i],scc[v]);
		}
	}
	memset(d1,-0x3f,sizeof(d1));
	memset(d2,-0x3f,sizeof(d2));
	dijkstra(d1,h_,e_);
	dijkstra(d2,h__,e__);
	for(int i=1;i<=cs;i++){// 对于 DAG 上的边统计答案
		for(int j=h_[i];j;j=e_[j].nex){const int &v=e_[j].t;
			ans=max(ans,d1[i]+d2[v]),ans=max(ans,d1[v]+d2[i]);
		}
	}
	printf("%d",ans-sz[scc[1]]);//1 所在 SCC 的大小被算两了两次，要减掉一次
	return 0;
}
```

# [HAOI2006] 受欢迎的牛

求有向图中，所有点都能到达的点的个数

## 分析

对于一个强联通分量的中的点是互达的，而将整个图按强联通分量缩点后，剩下 DAG 中出度为 0 的强联通分量即为所求。如果不唯一，则无解（0 个）

## 代码

```cpp
#include<cstdio>
#include<algorithm>
using namespace std;
const int N=10004,M=50004;
int n,m,ans,tot;

struct qxx{int nex,t;};
qxx e[M];
int h[N],cnt;
void add_path(int f,int t){e[++cnt]=(qxx){h[f],t},h[f]=cnt;}

int dfncnt;
int dfn[N],low[N];
int s[N],tp;// 栈
int scc[N],sz[N],cs,od[N];// 强联通分量编号，大小，出度
void tarjan(int u){
	dfn[u]=low[u]=++dfncnt,s[++tp]=u;
	for(int i=h[u];i;i=e[i].nex){const int &v=e[i].t;
		if(!dfn[v]){
			tarjan(v);
			low[u]=min(low[u],low[v]);
		}
		else if(!scc[v])low[u]=min(low[u],dfn[v]);
	}
	if(dfn[u]==low[u]){
		++cs;
		while(s[tp]!=u)scc[s[tp]]=cs,++sz[cs],--tp;
		scc[s[tp]]=cs,++sz[cs],--tp;
	}
}

int main(){
	scanf("%d%d",&n,&m);
	for(int i=1;i<=m;i++){int a,b;
		scanf("%d%d",&a,&b);
		add_path(a,b);
	}
	for(int i=1;i<=n;i++)if(!dfn[i])tarjan(i);
	for(int i=1;i<=n;i++){// 遍历每条边
		for(int j=h[i];j;j=e[j].nex){const int &v=e[j].t;
			if(scc[i]!=scc[v])od[scc[i]]++;// 对于连接两个不同 SCC 之间的边统计出度
		}
	}
	for(int i=1;i<=cs;i++)if(!od[i])ans=max(ans,sz[i]),tot++;
	printf("%d",tot==1?ans:0);
	return 0;
}
```

[1]: https://hexo-source-1257756441.cos.ap-chengdu.myqcloud.com/2018/09/581271179.png
