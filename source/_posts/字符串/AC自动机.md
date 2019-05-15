---
title: AC 自动机 ·Automaton
categories:
  - 字符串
tags:
 - 字符串
 - KMP
 - 专题
 - 模板
 - AC 自动机
 - 精选
abbrlink: 29858
mathjax: true
date: 2018-10-01 08:44:23
updated: 2019-06-16 08:44:23
---

**摘要**

 之前洛谷日报上发了一篇《强势图解 AC 自动机》，现在复习一下，重新整理思路

2019.6.16：编入精选文章

<!--more-->

# 前言

声明：代码部分的字符串都以 1 为起点

另外，有小伙伴问我 GIF 图片是怎么生成的。在此我以个人名誉担保——

这 TM 真的是用画图画出来的！

<img src="https://hexo-source-1257756441.cos.ap-chengdu.myqcloud.com/exp/wzdhwg.png" width=150px />

# 概述

AC 自动机是一种**有限状态自动机**（说了等于没说），它常被用于多模式串的字符串匹配。

AC 自动机是**以 TRIE 的结构为基础**，结合**KMP 的思想**建立的。

建立一个 AC 自动机通常需要两个步骤：
- 基础的 TRIE 结构：将所有的模式串构成一棵 $Trie$。
- KMP 的思想：对 $Trie$ 树上所有的结点构造失配指针。

然后就可以利用它进行多模式匹配了。



# TRIE 构建

和 $Trie$ 的 insert 操作**一模一样**（强调！一模一样！）

因为我们只利用 TRIE 的结构，所以直接将模式串存入即可。

# 失配指针

在讲构造以前，先来对比一下这里的 fail 指针与 KMP 中的 next 指针：

1. 共同点：两者同样是**在失配的时候**用于跳转的指针。

2. 不同点：Next 指针求的是最长 $Border$，而 fail 指针指向所有模式串的前缀中匹配当前状态的最长后缀。

因为 KMP 只对一个模式串做匹配，而 AC 自动机要对多个模式串做匹配。有可能 fail 指针指向的结点对应着另一个模式串，两者前缀不同。

其实上面的话**可以当屁处理**，你只需要知道，AC 自动机的失配指针指向当前状态的最长后缀状态即可。

<img src="https://hexo-source-1257756441.cos.ap-chengdu.myqcloud.com/exp/lnmdfh.jpeg" width=120px/>

也就是说，AC 自动机在对匹配串做逐位匹配时，同一位上可匹配多个模式串。

## 构建指针

下面介绍构建 fail 指针的**基础思想**：（强调！基础思想！基础！）

构建 fail 指针，可以参考 KMP 中构造 Next 指针的思想。

考虑字典树中当前的结点 u，u 的父结点是 p，p 通过字符 c 的边指向 u，即 $Trie[p,c]=u$。假设深度小于 u 的所有结点的 fail 指针都已求得。

我们跳转到 $fail[p]$：

1. 如果 $Trie[fail[p],c]$ 存在：则让 u 的 fail 指针指向 $Trie[fail[p],c]$。相当于在 p 和 $fail[p]$ 后面加一个字符 c，就构成了 fail[u]。

2. 如果 $Trie[fail[p],c]$ 不存在：那么我们继续找到 $Trie[fail[fail[p]],c]$ 。重复 1 的判断过程，一直跳 fail 指针直到根结点。

3. 如果真的没有，就让 fail 指针指向根结点。

如此即完成了 fail[u] 的构建。

## 例子

下面放一张 GIF 帮助大家理解：

对字典树 {i,he,his,she,hers} 构建 fail 指针：

黄色结点表示当前的结点 u，绿色结点表示已经 BFS 遍历完毕的结点，红 / 橙色的边表示 fail 指针。

**注**：2 号结点的 fail 指针画错了，$fail[2]=0$.![AC_automation_gif_b_3.gif][1]

我们重点分析结点 6 的 fail 指针构建：
![AC_automation_6_9.png][2]

```
找到 6 的父结点 5，5 的 fail 指针指向 10，然而 10 结点没有字母's'连出的边；
所以跳到 10 的 fail 指针指向的结点 0，发现 0 结点有字母's'连出的边，指向 7 结点；
所以 fail[6]=7.
```

另外，在构建 fail 指针的同时，我们也对 $TRIE$ 中模式串的结尾构建 fail 指针。这样在匹配到结尾后能自动跳转到下一个匹配项。具体见代码实现。

# 字典树与字典图

关于 `insert()` 笔者不做分析，先来看 `build()`:

```cpp
void build(){
    for(int i=0;i<26;i++)if(tr[0][i])q.push(tr[0][i]);
    while(q.size()){
        int u=q.front();q.pop();
        for(int i=0;i<26;i++){
            if(tr[u][i])fail[tr[u][i]]=tr[fail[u]][i],q.push(tr[u][i]);
            else tr[u][i]=tr[fail[u]][i];
        }
    }
}
```
build 函数将结点按 BFS 顺序入队，依次求 fail 指针。

这里的字典树根结点为 0，我们将根结点的子结点一一入队。

若将根结点入队，则在第一次 BFS 的时候，会将根结点的子结点的 fail 指针标记为本身。

而将根结点的子结点入队，也不影响算法正确性（因为 fail 指针初始化为 0）

然后开始 BFS：

每次取出队首的结点 u。fail[u] 指针已经求得，我们要求 u 的子结点们的 fail 指针。然后遍历字符集（这里是 0-25，对应 a-z）：

- 如果 $Trie[u,i]$ 存在，我们就将这个子结点的 fail 指针赋值为 fail[u] 的字符 i 对应的结点。Q2- 不是应该用 while 循环，不停的跳 fail 指针，判断是否存在字符 i 对应的结点，然后赋值吗？怎么一句话就完了？
- 否则，$Trie[u,i]$ 不存在，就将 fail[u] 的字符 i 对应的子结点编号赋值给 u.Q3- 等等，说好的字典树呢？怎么将 fail[u] 的子结点直接赋成 u 的子结点去了？

## Q2&Q3

Q2 与 Q3 的代码是相辅相成的。

简单地来讲，我们将 fail 指针跳转的路径做了压缩（就像并查集的路径压缩），使得本来需要跳很多次 fail 指针变成跳一次。

而这个**路径压缩**的就是 Q3 的代码在做的事情**之一**。

我们将之前的 GIF 图改一下：
![AC_automation_gif_b_pro3.gif][3]

蓝色结点表示 BFS 遍历到的结点 u，深蓝色、黑色的边表示执行完 Q3 代码连出的字典树的边。

可以发现，众多交错的黑色边将字典树变成了字典图。图中省略了连向根结点的黑边（否则会更乱）。

我们重点分析一下结点 5 遍历时的情况，这时我们求 $Trie[5]['s']=6$ 的 fail 指针：
![AC_automation_b_7.png][4]

本来应该跳 $2$ 次才能找到 $7$ 号结点，但是我们通过 $10$ 号结点的黑色边直接通过字母 $s$ 找到了 7 号结点。

因此，Q2 结合了 Q3 的代码，就能在 $O(1)$ 的时间内对单个结点构造 fail 指针。

其实我知道没人会仔细看这鬼扯的两张图片的

<img src="https://hexo-source-1257756441.cos.ap-chengdu.myqcloud.com/exp/ylmb.gif" width=100px />

这就是 build 完成的两件事：构建 fail 指针和建立字典图。这个字典图也会在查询的时候起到关键作用。

# 多模式匹配

接下来分析匹配函数 `query()`:

```cpp
int query(char *t){
    int u=0,res=0;
    for(int i=1;t[i];i++){
        u=tr[u][t[i]-'a'];// 转移
        for(int j=u;j&&e[j]!=-1;j=fail[j]){
            res+=e[j],e[j]=-1;
        }
    }
    return res;
}
```
声明 u 作为字典树上当前匹配到的结点，res 即返回的答案

循环遍历匹配串，u 在字典树上跟踪当前字符。

利用 fail 指针找出所有匹配的模式串，累加到答案中。然后清 0。

对 $e[j]$ 取反的操作用来判断 $e[j]$ 是否等于 -1。

Q- 读者可能纳闷了：你这里的 u 一直在往字典树后面走，没有跳 fail 指针啊！这和 KMP 的思想不一样啊，怎么匹配得出来啊

读者表示：我 TM 一点也不纳闷 emm

<img src="https://hexo-source-1257756441.cos.ap-chengdu.myqcloud.com/exp/hrwhl2.jpg" width=200px />

## Answer to Q

还记得刚才的字典图吗？事实上你并不是一直在往后跳，而是在图上穿梭跳动。比如，刚才的字典图：
![AC_automation_b_13.png][5]

我们从根结点开始尝试匹配 `ushersheishis`，那么 p 的变化将是：
![AC_automation_gif_c.gif][6]

红色结点表示 p 结点，粉色箭头表示 p 在字典图上的跳转，浅蓝色的边表示成功匹配的模式串，深蓝色的结点表示跳 fail 指针时的结点。

其中的部分跳转，我们利用的就是新构建的字典图上的边，它也满足后缀相同（sher 和 her），所以自动跳转到下一个位置。

<img src="https://hexo-source-1257756441.cos.ap-chengdu.myqcloud.com/exp/htht.png" width=100px/>

综上，$fail$ 指针的意义是，在匹配串**同一个位置**失配时的跳转指针，这样就利用 fail 指针在同一位置上进行多模式匹配，匹配完了，就在字典图上自动跳转到下一位置。

# 总结

到此，你已经理解了整个 AC 自动机的内容。我们一句话总结 AC 自动机的运行原理：

**构建字典图实现自动跳转，构建失配指针实现多模式匹配。**

<img src="https://hexo-source-1257756441.cos.ap-chengdu.myqcloud.com/exp/hxldyjfh.png" width=150px />

所以 AC 自动机到底是啥

~~你发现它是 DP~~

<img src="https://hexo-source-1257756441.cos.ap-chengdu.myqcloud.com/exp/dthj.gif" width=60px />

# 模板

[LuoguP3808【模板】AC 自动机（简单版）](https://www.luogu.org/problemnew/show/P3808) 

```cpp
#include<bits/stdc++.h>
using namespace std;
const int N=1e6+6;
int n;

namespace AC{
    int tr[N][26],tot;
	int e[N],fail[N];
	void insert(char *s){
		int u=0;
		for(int i=1;s[i];i++){
            if(!tr[u][s[i]-'a'])tr[u][s[i]-'a']=++tot;
			u=tr[u][s[i]-'a'];
		}
		e[u]++;
	}
	queue<int> q;
	void build(){
        for(int i=0;i<26;i++)if(tr[0][i])q.push(tr[0][i]);
		while(q.size()){
            int u=q.front();q.pop();
			for(int i=0;i<26;i++){
                if(tr[u][i])fail[tr[u][i]]=tr[fail[u]][i],q.push(tr[u][i]);
				else tr[u][i]=tr[fail[u]][i];
			}
		}
	}
	int query(char *t){
		int u=0,res=0;
		for(int i=1;t[i];i++){
            u=tr[u][t[i]-'a'];// 转移
			for(int j=u;j&&e[j]!=-1;j=fail[j]){
                res+=e[j],e[j]=-1;
			}
		}
		return res;
	}
}

char s[N];
int main(){
    scanf("%d",&n);
	for(int i=1;i<=n;i++)scanf("%s",s+1),AC::insert(s);
	scanf("%s",s+1);
	AC::build();
	printf("%d",AC::query(s));
	return 0;
}
```

# 模板 2

[P3796 【模板】AC 自动机（加强版）](https://www.luogu.org/problemnew/show/P3796)

```cpp
#include<bits/stdc++.h>
using namespace std;
const int N=156,L=1e6+6;
namespace AC{
	const int SZ=N*80;
	int tot,tr[SZ][26];
	int fail[SZ],idx[SZ],val[SZ];
	int cnt[N];// 记录第 i 个字符串的出现次数
	void init(){
        memset(fail,0,sizeof(fail));
		memset(tr,0,sizeof(tr));
		memset(val,0,sizeof(val));
		memset(cnt,0,sizeof(cnt));
		memset(idx,0,sizeof(idx));
		tot=0;
	}
	void insert(char *s,int id){//id 表示原始字符串的编号
		int u=0;
		for(int i=1;s[i];i++){
            if(!tr[u][s[i]-'a'])tr[u][s[i]-'a']=++tot;
			u=tr[u][s[i]-'a'];
		}
		idx[u]=id;
	}
	queue<int> q;
	void build(){
        for(int i=0;i<26;i++)if(tr[0][i])q.push(tr[0][i]);
		while(q.size()){
            int u=q.front();q.pop();
			for(int i=0;i<26;i++){
                if(tr[u][i])fail[tr[u][i]]=tr[fail[u]][i],q.push(tr[u][i]);
				else tr[u][i]=tr[fail[u]][i];
			}
		}
	}
	int query(char *t){// 返回最大的出现次数
		int u=0,res=0;
		for(int i=1;t[i];i++){
            u=tr[u][t[i]-'a'];
			for(int j=u;j;j=fail[j])val[j]++;
		}
		for(int i=0;i<=tot;i++)if(idx[i])res=max(res,val[i]),cnt[idx[i]]=val[i];
		return res;
	}
}
int n;
char s[N][100],t[L];
int main(){
    while(~scanf("%d",&n)){if(n==0)break;
		AC::init();
		for(int i=1;i<=n;i++)scanf("%s",s[i]+1),AC::insert(s[i],i);
		AC::build();
		scanf("%s",t+1);
		int x=AC::query(t);
		printf("%d\n",x);
		for(int i=1;i<=n;i++)if(AC::cnt[i]==x)printf("%s\n",s[i]+1);
	}
	return 0;
}
/*
 * BUG#1 build 的时候忘了 push(tr[u][i])
 * BUG#2 误以为倒序遍历 AC 自动机就是 BFS 的倒序，实际上不是这样
 */

```



[1]: https://hexo-source-1257756441.cos.ap-chengdu.myqcloud.com/2018/08/2858847684.gif

[2]: https://hexo-source-1257756441.cos.ap-chengdu.myqcloud.com/2018/08/3946915055.png
[3]: https://hexo-source-1257756441.cos.ap-chengdu.myqcloud.com/2018/08/1745118561.gif
[4]: https://hexo-source-1257756441.cos.ap-chengdu.myqcloud.com/2018/08/1426947356.png
[5]: https://hexo-source-1257756441.cos.ap-chengdu.myqcloud.com/2018/08/1085042377.png
[6]: https://hexo-source-1257756441.cos.ap-chengdu.myqcloud.com/2018/08/24151497.gif

