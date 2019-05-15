---
title: 树链剖分·Decomposition
categories:
  - 数据结构
tags:
 - 数据结构
 - 模板
 - 树链剖分
abbrlink: 53684
date: 2018-12-07 23:39:00
updated: 2019-04-08 20:25:00
top: true
---

**摘要**

树链剖分用于将树分割成若干条链的形式，以维护树上路径的信息。

具体来说，将整棵树剖分为若干条链，使它组合成线性结构，然后用其他的数据结构维护信息。

不同的剖分方案会导致不同的时间复杂度。在这其中极常见的是**轻重链剖分**（Heavy-Light Decomposition）


<!--more-->

# 轻重链剖分

**对于每一个结点**：

定义**重子节点**表示其子节点中子树最大的子结点。如果有相同的，任意取。如果没有子节点，就没有。

定义**轻子节点**表示剩余的子结点。

从这个结点到重子节点的边叫**重边**。

到其他轻子节点的边叫**轻边**。

若干条首尾衔接的重边构成**重链**。

把落单的结点也当作重链，那么整棵树就被剖分成若干条重链。

![HLD.png][1]

# 性质

重链开头的结点不一定是重子节点（因为重边是对于每一个结点都有定义的）

所有的重链将整棵树**完全剖分**

重链一定是链状结构；重边不会连成一棵树。

在剖分时**重边优先遍历**，最后树的 DFN 序上，重链内的 DFN 序是连续的。按 DFN 排序后的序列即为剖分后的链

一颗子树内的 DFN 序是连续的

# 实现

轻重链剖分由两个 DFS 实现：
- 第一个 DFS 记录每个结点的深度（deep）、子树大小（size）。
```cpp
TREE-BUILD-DFS(u,dep)// 函数返回该节点对应的子树的大小
    u.deep=dep// 记录深度
    u.size=1
    for v is u's son
        u.size+=TREE-BUILD-DFS(v)
    return u.size
```
- 第二个 DFS 记录每个结点的重子结点（heavy-son）、重边优先遍历时的 DFN 序、所在链的链顶（top，且应初始化为结点本身）。
```cpp
TREE-DECOMPOSITION-DFS(u,top)
    u.top=top
    u.dfn=++tot
    for v is u's son
        if(v.size>hvs)hvs=v.size,p=v
    TREE-DECOMPOSITION-DFS(v,top)// 重边优先遍历
    for v is u's son
        if(v!=p)TREE-DECOMPOSITION-DFS(v,v)// 以自己为链顶
```

# 应用

## 路径上维护

用树链剖分求树上两点路径权值和：
```cpp
TREE-PATH-SUM(u,v)
    while u,v 不在同一条链上
        if u 所在链的链顶的深度小于 v 所在链的链顶的深度
            swap(u,v)
        将 u 到 u 所在链的链顶 之间的结点权值求和，累加到计数器中
        u = u 所在链链顶的父节点
    将 u,v 之间的结点的权值求和累加，返回计数器的值
```
链上的 DFN 序是连续的，可以使用线段树，树状数组维护。

每次选择深度较大的链往上跳，直到两点在同一条链上。

同样的跳链结构适用于维护、统计路径上的其他信息。

## 子树维护

有时会要求，维护子树上的信息，譬如将以 x 为根的子树的所有结点的权值增加 v。

在 DFS 搜索的时候，子树中的结点的 DFN 序是连续的。

每一个结点记录 bottom 表示所在子树连续区间末端的结点。

因此直接维护一次区间信息即可。

## 求最近公共祖先

不断跳链，当跳到同一条链上时，返回深度较小的结点即为 LCA。

# 代码注意事项

首先，任何树链剖分的题码量大概都会在 100+ 行，因此写树剖最重要的不是卡常的问题，而是代码结构的问题。如果代码结构不当，而且程序出了 BUG，会大大增加调试的时间. 笔者为此给出以下建议：

- 对于树链剖分与其他数据结构的部分，用不同的结构体维护，或者封装不同的 namespace；
- 变量名大部分使用 3 个字母的形式，易于输入，可读性强，思路不容易乱；
- 边写边输出一些重要的调试信息，这样在最后检查正确性的时候更加全面。尤其是样例较弱的时候；
- 活用编辑器的自动补全功能，思路更连贯；

具体的代码实现结构可以参考本文的`模板 / 新码 -201904082025`章节。

# 模板

[LuoguP3384] 树链剖分 - 模板

> 已知一棵包含 N 个结点的树（连通且无环），每个节点上包含一个数值，需要支持以下操作：
>
> - `1 x y z` 表示将树从 x 到 y 结点最短路径上所有节点的值都加上 z
> - `2 x y` 表示求树从 x 到 y 结点最短路径上所有节点的值之和
> - `3 x z` 表示将以 x 为根节点的子树内所有节点值都加上 z
> - `4 x` 表示求以 x 为根节点的子树内所有节点值之和

## 旧码

```cpp
#include<bits/stdc++.h>
using namespace std;
typedef const int& cint;
const int N=100005,LST_SZ=1<<19;
int n,m,root,p;
int dfn,a[N];
// 前向星，临时存树用
struct data{int nex,t;};
data e[N*2];
int head[N],hcnt,vis[N];
void add_path(int f,int t){e[++hcnt]=(data){head[f],t},head[f]=hcnt;}
// 线段树（基本操作）
int s[LST_SZ],tg[LST_SZ];
void push_up(int rt){s[rt]=(s[rt<<1]+s[rt<<1|1])%p;}
void push_down(int l,int r,int rt){
	int mid=(l+r)>>1;
	s[rt<<1]=(s[rt<<1]+tg[rt]*(mid-l+1))%p,tg[rt<<1]=(tg[rt<<1]+tg[rt])%p;
	s[rt<<1|1]=(s[rt<<1|1]+tg[rt]*(r-mid))%p,tg[rt<<1|1]=(tg[rt<<1|1]+tg[rt])%p;
	tg[rt]=0;
}
int lst_build(int l=1,int r=n,int rt=1){
	if(l==r)return s[rt]=a[l];
	int mid=(l+r)>>1;
	lst_build(l,mid,rt<<1),lst_build(mid+1,r,rt<<1|1);
	push_up(rt);
}
int lst_add(int L,int R,int v,int l=1,int r=n,int rt=1){
	if(L<=l&&r<=R)return s[rt]=(s[rt]+v*(r-l+1))%p,tg[rt]=(tg[rt]+v)%p;
	int mid=(l+r)>>1;
	push_down(l,r,rt);
	if(L<=mid)lst_add(L,R,v,l,mid,rt<<1);
	if(mid<R)lst_add(L,R,v,mid+1,r,rt<<1|1);
	push_up(rt);
}
int lst_sum(int L,int R,int l=1,int r=n,int rt=1){
	if(L<=l&&r<=R)return s[rt];
	int mid=(l+r)>>1,sum=0;
	push_down(l,r,rt);
	if(L<=mid)sum+=lst_sum(L,R,l,mid,rt<<1);
	if(mid<R)sum+=lst_sum(L,R,mid+1,r,rt<<1|1);
	return sum%p;
}
// 树链剖分
struct node{
	int p,s,b,v;//parent,son,brother,value
	int dp,tp,bt,hvs,sz,idx;//deep,top,bottom,heavy-son,size,index（即 DFN 序）
};// 这里的 bt 有点不同，它不是指连续区间末端结点编号，而是末端结点的 index
node t[N];
void add_son(node* T,int p,int s){T[s].p=p,T[s].b=T[p].s,T[p].s=s;}
int tree_build_dfs(int rt,int dp){// 返回值是子树的大小
	vis[rt]=1,t[rt].dp=dp,t[rt].sz=1;
	for(int i=head[rt];i;i=e[i].nex){// 在临时的无根树上遍历
		if(!vis[e[i].t]){
			add_son(t,rt,e[i].t);
			t[rt].sz+=tree_build_dfs(e[i].t,dp+1);
		}
	}
	return t[rt].sz;
}
void tree_decomposition_dfs(int rt,int tp){
	t[rt].tp=tp,t[rt].idx=++dfn,t[rt].bt=dfn,a[dfn]=t[rt].v;
	if(!t[rt].s)return;
	for(int mx=0,i=t[rt].s;i;i=t[i].b)if(t[i].sz>mx)t[rt].hvs=i,mx=t[i].sz;
	tree_decomposition_dfs(t[rt].hvs,tp);
	for(int i=t[rt].s;i;i=t[i].b)
		if(i!=t[rt].hvs)tree_decomposition_dfs(i,i);
	t[rt].bt=dfn;// 递归完所有子节点回溯过后的 dfn，即为子树的 bt。
}
int tree_path_add(int x,int y,int v){
	while(t[x].tp!=t[y].tp){// 两者不在同一链上时
		if(t[t[x].tp].dp<t[t[y].tp].dp)x^=y^=x^=y;
		lst_add(t[t[x].tp].idx,t[x].idx,v);// 维护链上信息
		x=t[t[x].tp].p;// 跳链
	}
	if(t[x].idx>t[y].idx)x^=y^=x^=y;// 交换
	lst_add(t[x].idx,t[y].idx,v);
}
int tree_path_sum(int x,int y){
	int res=0;
	while(t[x].tp!=t[y].tp){
		if(t[t[x].tp].dp<t[t[y].tp].dp)x^=y^=x^=y;
		res=(res+lst_sum(t[t[x].tp].idx,t[x].idx))%p;
		x=t[t[x].tp].p;
	}
	if(t[x].idx>t[y].idx)x^=y^=x^=y;
	return (res+lst_sum(t[x].idx,t[y].idx))%p;
}
int tree_add(int x,int v){
	lst_add(t[x].idx,t[x].bt,v);// 直接维护整个子树区间
}
int tree_sum(int x){
	return lst_sum(t[x].idx,t[x].bt);
}

int main(){
	scanf("%d%d%d%d",&n,&m,&root,&p);
	for(int i=1;i<=n;i++){
		scanf("%d",&t[i].v);
	}
	for(int i=1,x,y;i<n;i++){
		scanf("%d%d",&x,&y);
		add_path(x,y);
		add_path(y,x);
	}
	tree_build_dfs(root,1);
	tree_decomposition_dfs(root,root);
	lst_build();
	for(int i=1,opr,x,y,z;i<=m;i++){
		scanf("%d%d",&opr,&x);
		if(opr==1){
			scanf("%d%d",&y,&z);
			tree_path_add(x,y,z);
		}
		else if(opr==2){
			scanf("%d",&y);
			printf("%d\n",tree_path_sum(x,y));
		}
		else if(opr==3){
			scanf("%d",&z);
			tree_add(x,z);
		}
		else printf("%d\n",tree_sum(x));
	}
	return 0;
}
```

## 新码 -201904082025

```cpp
#include<bits/stdc++.h>
#define ll long long
using namespace std;
const int N=1e5+5;
int n,m,root,p;
int a[N];// 初始值

// 无根树
struct qxx{int nex,t;};
qxx e[N<<1];
int h[N],cnt=1;
void add_path(int f,int t){e[++cnt]=(qxx){h[f],t},h[f]=cnt;}

namespace LST{// 线段树部分

	int sum[N<<2],tag[N<<2];
	void pushup(int u){sum[u]=((ll)sum[u<<1]+sum[u<<1|1])%p;}
	void modify(int u,int l,int r,int v){sum[u]=((ll)sum[u]+(r-l+1)*v)%p,tag[u]=((ll)tag[u]+v)%p;}// 对单个结点修改
	void pushdown(int u,int l,int r){// 标记下放，本质就是对两个结点的修改，然后清空标记
		int mid=(l+r)>>1;
		modify(u<<1,l,mid,tag[u]);
		modify(u<<1|1,mid+1,r,tag[u]);
		tag[u]=0;
	}
	int build(int u,int l,int r){
		if(l==r)return sum[u]=a[l];
		int mid=(l+r)>>1;
		build(u<<1,l,mid),build(u<<1|1,mid+1,r);
		pushup(u);
	}
	void add(int L,int R,int v,int u=1,int l=1,int r=n){
		if(L<=l&&r<=R)return modify(u,l,r,v);// 单个结点的修改
		int mid=(l+r)>>1;
		pushdown(u,l,r);
		if(L<=mid)add(L,R,v,u<<1,l,mid);
		if(mid<R)add(L,R,v,u<<1|1,mid+1,r);
		pushup(u);
	}
	int query_sum(int L,int R,int u=1,int l=1,int r=n){
		if(L<=l&&r<=R)return sum[u];
		int mid=(l+r)>>1,res=0;
		pushdown(u,l,r);
		if(L<=mid)res=((ll)res+query_sum(L,R,u<<1,l,mid))%p;
		if(mid<R)res=((ll)res+query_sum(L,R,u<<1|1,mid+1,r))%p;
		return res;
	}

}
// 树链剖分
namespace TRD{

	int par[N],sz[N],dep[N],top[N],idx[N],hvs[N];// 对应子树大小、结点深度、链顶结点、线段树编号、重儿子结点
	int dfn;
	int val[N],btm[N];// 额外卫星数据，子树中的最后一个结点
	int szdfs(int u,int pa,int deep){
		dep[u]=deep,sz[u]=1,par[u]=pa;
		for(int i=h[u];i;i=e[i].nex){const int &v=e[i].t;
			if(v==pa)continue;
			sz[u]+=szdfs(v,u,deep+1);
		}
		return sz[u];
	}
	void dedfs(int u,int pa,int topp){
		top[u]=topp,idx[u]=++dfn,a[dfn]=val[u],btm[u]=u;
		for(int i=h[u],mxs=0;i;i=e[i].nex){const int &v=e[i].t;
			if(v==pa)continue;
			if(sz[v]>mxs)mxs=sz[v],hvs[u]=v;// 求重儿子
		}
		if(!hvs[u])return;// 没有重儿子，说明没有子节点
		dedfs(hvs[u],u,topp),btm[u]=btm[hvs[u]];
		for(int i=h[u];i;i=e[i].nex){const int &v=e[i].t;
			if(v==pa||v==hvs[u])continue;
			dedfs(v,u,v),btm[u]=btm[v];// 随着子树的遍历，dfn 一定增大，因此直接赋值为当前访问子树的 btm
		}
	}
	void pathadd(int x,int y,int v){
		while(top[x]!=top[y]){
			if(dep[top[x]]<dep[top[y]])swap(x,y);
			LST::add(idx[top[x]],idx[x],v);
			x=par[top[x]];
		}
		if(idx[x]>idx[y])swap(x,y);
		LST::add(idx[x],idx[y],v);
	}
	int pathsum(int x,int y){
		int res=0;
		while(top[x]!=top[y]){
			if(dep[top[x]]<dep[top[y]])swap(x,y);
			res=((ll)res+LST::query_sum(idx[top[x]],idx[x]))%p;
			x=par[top[x]];
		}
		if(idx[x]>idx[y])swap(x,y);
		res=((ll)res+LST::query_sum(idx[x],idx[y]))%p;
		return res;
	}
	void treeadd(int x,int v){
		LST::add(idx[x],idx[btm[x]],v);
	}
	int treesum(int x){
		return LST::query_sum(idx[x],idx[btm[x]]);
	}

}
signed main(){
	scanf("%d%d%d%d",&n,&m,&root,&p);
	for(int i=1;i<=n;i++)scanf("%d",&TRD::val[i]);
	for(int i=1;i<n;i++){
		int x,y;
		scanf("%d%d",&x,&y);
		add_path(x,y),add_path(y,x);
	}
	TRD::szdfs(root,root,1);
	TRD::dedfs(root,root,root);
	LST::build(1,1,n);
	for(int i=1;i<=m;i++){
		int a,x,y,z;
		scanf("%d%d",&a,&x);
		if(a==1){
			scanf("%d%d",&y,&z);
			TRD::pathadd(x,y,z);
		}
		else if(a==2){
			scanf("%d",&y);
			printf("%d\n",TRD::pathsum(x,y));
		}
		else if(a==3){
			scanf("%d",&z);
			TRD::treeadd(x,z);
		}
		else printf("%d\n",TRD::treesum(x));
	}
	return 0;
}
/*
 * BUG#1: btm[u] 求错
 * BUG#2: 线段树数组没开大
 */
```



# [NOI2015] 软件包管理器

> 你决定设计自己的软件包管理器。要解决软件包之间的依赖问题。如果软件包 A 依赖 B，那么安装 A 以前，必须先安装 B。同时，如果想要卸载 B，则必须卸载 A。现在你已经获得了所有的软件包之间的依赖关系。而且，除 0 号软件包以外，在你的管理器当中的软件包都会依赖一个且仅一个软件包，而 0 号软件包不依赖任何一个软件包。依赖关系不存在环，也不会有一个软件包依赖自己。
>
> 用户希望在安装和卸载某个软件包时，快速地知道这个操作实际上会改变多少个软件包的安装状态（即安装操作会安装多少个未安装的软件包，或卸载操作会卸载多少个已安装的软件包），你的任务就是实现这个部分。注意，安装一个已安装的软件包，或卸载一个未安装的软件包，都不会改变任何软件包的安装状态，即在此情况下，改变安装状态的软件包数为 0。

树链剖分后，线段树维护有多少个软件包已安装。

```cpp
#include<bits/stdc++.h>
using namespace std;
const int N=100005;
const int LST=1<<18;
int n,dfn,a[N];

int s[LST],tg[LST];
// 有多少个安装的软件包
//tg：1：全部卸载；2：全部安装；0：不做操作

inline void push_up(int rt){s[rt]=s[rt<<1]+s[rt<<1|1];}
inline void push_down(int l,int r,int rt){
	if(tg[rt]==0)return;
	int mid=(l+r)>>1;
	if(tg[rt]==2)
		s[rt<<1]=mid-l+1,tg[rt<<1]=2,
		s[rt<<1|1]=r-mid,tg[rt<<1|1]=2;
	else
		s[rt<<1]=0,tg[rt<<1]=1,
		s[rt<<1|1]=0,tg[rt<<1|1]=1;
	tg[rt]=0;
}
int lst_sum(int L,int R,int l=1,int r=n,int rt=1){
	if(L<=l&&r<=R)return s[rt];
	int mid=(l+r)>>1,su=0;
	push_down(l,r,rt);
	if(L<=mid)su+=lst_sum(L,R,l,mid,rt<<1);
	if(mid<R)su+=lst_sum(L,R,mid+1,r,rt<<1|1);
	return su;
}
int lst_upd(int L,int R,int v,int l=1,int r=n,int rt=1){
	if(L<=l&&r<=R)return s[rt]=(r-l+1)*v,tg[rt]=v+1;
	int mid=(l+r)>>1;
	push_down(l,r,rt);
	if(L<=mid)lst_upd(L,R,v,l,mid,rt<<1);
	if(mid<R)lst_upd(L,R,v,mid+1,r,rt<<1|1);
	push_up(rt);
}

struct node{
	int p,s,b;
	int dp,tp,sz,hvs,idx;
};
node t[N];
void add_son(int p,int s){t[s].p=p,t[s].b=t[p].s,t[p].s=s;}
int szdfs(int rt,int dp){
	t[rt].dp=dp,t[rt].sz=1;
	for(int i=t[rt].s;i;i=t[i].b)t[rt].sz+=szdfs(i,dp+1);
	return t[rt].sz;
}
void dcdfs(int rt,int tp){
	t[rt].tp=tp,t[rt].idx=++dfn;
	if(!t[rt].s)return;
	for(int mx=0,i=t[rt].s;i;i=t[i].b)
		if(t[i].sz>mx)mx=t[i].sz,t[rt].hvs=i;
	dcdfs(t[rt].hvs,tp);
	for(int i=t[rt].s;i;i=t[i].b)
		if(i!=t[rt].hvs)dcdfs(i,i);
}
int tree_path_query(int x,int v){
	int len=0,c1=0;
	while(t[x].tp!=1){
		len+=t[x].idx-t[t[x].tp].idx+1;
		c1+=lst_sum(t[t[x].tp].idx,t[x].idx);
		x=t[t[x].tp].p;
	}
	len+=t[x].idx;
	c1+=lst_sum(1,t[x].idx);
	if(v==1)return c1;
	else return len-c1;
}
void tree_path_upd(int x,int v){
	while(t[x].tp!=1){
		lst_upd(t[t[x].tp].idx,t[x].idx,v);
		x=t[t[x].tp].p;
	}
	lst_upd(1,t[x].idx,v);
}
int tree_query(int x,int v){
	int c1=lst_sum(t[x].idx,t[x].idx+t[x].sz-1);
	if(v==1)return c1;
	else return t[x].sz-c1;
}
int tree_upd(int x,int v){lst_upd(t[x].idx,t[x].idx+t[x].sz-1,v);}

int main(){
	scanf("%d",&n);
	for(int i=2,ai;i<=n;i++){
		scanf("%d",&ai);
		add_son(ai+1,i);
	}
	szdfs(1,1);
	dcdfs(1,1);
	int q;
	scanf("%d",&q);
	for(int i=1,x;i<=q;i++){
		char op[20];
		scanf("%s%d",op,&x);
		if(op[0]=='i'){
			printf("%d\n",tree_path_query(x+1,0));
			tree_path_upd(x+1,1);
		}
		else {
			printf("%d\n",tree_query(x+1,1));
			tree_upd(x+1,0);
		}
	}
	return 0;
}
```

# [SDOI2011] 染色

看题面就知道是树链剖分，要求两种操作：

  - 维护路径上不同颜色的段数
  - 区间修改颜色

肯定用线段树维护：
  - 记录每一个区间的颜色段数，左端点颜色，右端点颜色。
  - 合并的时候考虑左右子区间相邻的两个端点的颜色是否相同，相同的话两端就合并，并微调答案。
  - 修改的时候，维护一个修改标记，每次向下更新即可。

树上修改时直接改
查询时，每次跳链的时候，要考虑当前链的链顶与链顶父节点的颜色是否相同，微调答案。

```cpp
#include<bits/stdc++.h>
using namespace std;
const int N=100004,LST=1<<18;

int n,m;
int a[N];
int t[LST],tg[LST],cl[LST],cr[LST];
void push_up(int rt){
	t[rt]=t[rt<<1]+t[rt<<1|1];
	cl[rt]=cl[rt<<1],cr[rt]=cr[rt<<1|1];
	if(cr[rt<<1]==cl[rt<<1|1])t[rt]--;
}
void push_down(int l,int r,int rt){
	if(!tg[rt])return;
	tg[rt<<1]=tg[rt<<1|1]=tg[rt];
	t[rt<<1]=t[rt<<1|1]=1;
	cl[rt<<1]=cr[rt<<1]=tg[rt];
	cl[rt<<1|1]=cr[rt<<1|1]=tg[rt];
	tg[rt]=0;
}
int lst_build(int l=1,int r=n,int rt=1){
	if(l==r)return t[rt]=1,cl[rt]=cr[rt]=a[l];
	int mid=(l+r)>>1;
	lst_build(l,mid,rt<<1),lst_build(mid+1,r,rt<<1|1);
	push_up(rt);
}
int lst_count(int L,int R,int l=1,int r=n,int rt=1){// 区间统计段数
	if(L<=l&&r<=R)return t[rt];
	int mid=(l+r)>>1,t1=0,t2=0;
	push_down(l,r,rt);
	if(L<=mid)t1=lst_count(L,R,l,mid,rt<<1);
	if(mid<R)t2=lst_count(L,R,mid+1,r,rt<<1|1);
	return t1+t2-(t1&&t2?cr[rt<<1]==cl[rt<<1|1]:0);
}
int lst_color(int p,int l=1,int r=n,int rt=1){// 单点查询颜色
	if(l==r&&p==l)return cl[rt];
	int mid=(l+r)>>1;
	push_down(l,r,rt);
	if(p<=mid)return lst_color(p,l,mid,rt<<1);
	else return lst_color(p,mid+1,r,rt<<1|1);
}
int lst_upd(int L,int R,int v,int l=1,int r=n,int rt=1){// 区间修改颜色
	if(L<=l&&r<=R)return t[rt]=1,cl[rt]=cr[rt]=tg[rt]=v;
	int mid=(l+r)>>1;
	push_down(l,r,rt);
	if(L<=mid)lst_upd(L,R,v,l,mid,rt<<1);
	if(mid<R)lst_upd(L,R,v,mid+1,r,rt<<1|1);
	push_up(rt);
}

struct qxx{int nex,t;};// 链式前向星，临时存图
qxx e[N*2];
int head[N],cnt,vis[N];
void add_path(int f,int t){
	e[++cnt]=(qxx){head[f],t};
	head[f]=cnt;
}

int dfn;//dfn 序
struct node{
	int p,s,b,v;
	int dp,tp,sz,hvs,idx;
	//deep,top,size,heavy_son,index
};
node tr[N];// 树结构
void add_son(int p,int s){
	tr[s].p=p,tr[s].b=tr[p].s,tr[p].s=s;
}

int szdfs(int rt,int dp){
	tr[rt].dp=dp,tr[rt].sz=1,vis[rt]=true;
	for(int i=head[rt];i;i=e[i].nex)
		if(!vis[e[i].t]){
			add_son(rt,e[i].t);
			tr[rt].sz+=szdfs(e[i].t,dp+1);
		}
	return tr[rt].sz;
}
void dedfs(int rt,int tp){
	tr[rt].tp=tp,tr[rt].idx=++dfn,a[dfn]=tr[rt].v;
	if(!tr[rt].s)return;
	for(int mx=0,i=tr[rt].s;i;i=tr[i].b)
		if(mx<tr[i].sz)mx=tr[i].sz,tr[rt].hvs=i;
	dedfs(tr[rt].hvs,tp);
	for(int i=tr[rt].s;i;i=tr[i].b)
		if(i!=tr[rt].hvs)dedfs(i,i);
}
void tree_upd(int x,int y,int v){// 树上更新
	while(tr[x].tp!=tr[y].tp){
		if(tr[tr[x].tp].dp<tr[tr[y].tp].dp)x^=y^=x^=y;
		lst_upd(tr[tr[x].tp].idx,tr[x].idx,v);
		x=tr[tr[x].tp].p;
	}
	if(tr[x].idx>tr[y].idx)x^=y^=x^=y;
	lst_upd(tr[x].idx,tr[y].idx,v);
}
int tree_query(int x,int y){// 树上查询
	int res=0;
	while(tr[x].tp!=tr[y].tp){
		if(tr[tr[x].tp].dp<tr[tr[y].tp].dp)x^=y^=x^=y;
		res+=lst_count(tr[tr[x].tp].idx,tr[x].idx);
		int c1=lst_color(tr[tr[x].tp].idx);
		int c2=lst_color(tr[tr[tr[x].tp].p].idx);
		if(c1==c2)res--;
		x=tr[tr[x].tp].p;
	}
	if(tr[x].idx>tr[y].idx)x^=y^=x^=y;
	return res+lst_count(tr[x].idx,tr[y].idx);
}

int main(){
	scanf("%d%d",&n,&m);
	for(int i=1;i<=n;i++)scanf("%d",&tr[i].v);
	for(int i=1,x,y;i<n;i++){
		scanf("%d%d",&x,&y);
		add_path(x,y);
		add_path(y,x);
	}
	szdfs(1,1);
	dedfs(1,1);
	lst_build();
	for(int i=1,a,b,c;i<=m;i++){
		char op[5];
		scanf("%s%d%d",op,&a,&b);
		if(op[0]=='C'){
			scanf("%d",&c);
			tree_upd(a,b,c);
		}
		else {
			printf("%d\n",tree_query(a,b));
		}
	}
	return 0;
}
```


[1]: https://hexo-source-1257756441.cos.ap-chengdu.myqcloud.com/2018/08/3045831361.png
