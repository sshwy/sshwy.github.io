---
title: 概率与期望·expectation
categories:
  - 数学
mathjax: true
abbrlink: 59440
tags:
 - 概率
 - 期望
author: sshwy
date: 2018-10-01 20:22:00
updated: 2018-10-01 20:22:00
---
# 期望（离散）

## 定义

设 P(x) 是一个**离散概率**分布函数，自变量的取值范围为`{x1,x2,...,xn}`。其期望被定义为：
$$ E(x)=\sum_{k=1}^nx_kP(x_k) $$
<!--more-->
## 性质

期望函数是线性函数（加性函数）：$E(\sum_{k=1}^na_ix_i+c)=\sum_{k=1}^na_iE(x_i)+c$

离散函数的期望即为其自变量的期望与自变量的概率之积的总和：$E(f(x))=\sum_{k=1}^nf(x_k)P(x_k)$

函数的期望不等于期望的函数。

如果事件 x 和事件 y 相互独立，则 $E(xy)=E(x)E(y)$。

不论 x,y 是否独立，$E(x+y)=E(x)+E(y)$ 恒成立。

*上述文段参考 [【期望、方差、协方差及相关系数的基本运算】](http://blog.codinglabs.org/articles/basic-statistics-calculate.html) 并做了修改。原作者：张洋*

# 简单数学期望 - 掷骰子

突然发现，骰念 tou 而不是 shai......

回归正题。问 6 面骰子掷出数字 6 的期望次数？

毫不犹豫：期望次数 6 次。

的确是这样，可是这样的过程未免太感性。我们设法以此构建一个数学模型：
- E 表示掷到 6 的期望次数。根据期望的定义，不同的事件的概率与权值之积的和：
    - 如果掷一次就掷到了 6，那么你相当于掷了 1 次，而这件事发生的概率是 1/6.

    - 否则，相当于你又得掷 E 次，才能期望掷到 6。则你掷了 E+1 次，事件发生概率为 5/6.

    - 所以 $E=\frac{1}{6}\cdot1+\frac{5}{6}(E+1)$

    - 解方程，得 $E=6$.

这个构建的数学模型带有递归的色彩，而在考虑期望值时，我们会假设期望值是已知的，并将其用于构建关系式。（事实上这有点像你假装知道 E 的值，然后你抽了风去构建一个和 E 有关等式，最后发现这个等式在 E 未知的情况下同样有效）

考虑一个升级版的问题：一个 n 面的骰子，求掷出**每一个面**的期望次数？

这时需要记录一些数据了。定义 E[i] 表示已经掷出 i 面，还需要的期望次数。

考虑这一次掷骰子：
- 如果掷到了已经有的面，概率为 $\frac{i}{n}$, 还需要的期望次数为 $E[i]$.
- 如果掷到了没掷到过的面，概率为 $\frac{n-i}{n}$, 还需要的期望次数为 $E[i+1]$.
- 另外，这一次你掷了一次，也要算入一次。
- 所以 $E[i]=\frac{i}{n}E[i]+\frac{n-i}{n}E[i+1]+1$. 变换一下，得到 $E[i]=E[i+1]+\frac{n}{n-i}$
- 显然，这是一个可递推的式子，求解即可。
- 边界条件 $E[n]=0$，目标 $E[0]$.

*上述文段参考[面试中的概率题 - 数学期望（1）](https://blog.csdn.net/pure_life/article/details/8100984) 并做了修改。原作者：pure_life*

# [LuoguP4316] 绿豆蛙的归宿 - 线性期望

## 分析

设到达点 i 的概率为 $p(i)$

对于入度为 0 的点 v，$p(v)=1$.

从当前点 v 出发，到达下一个点的概率是 p(v)*(1/v 的出度）

而走当前路径的期望即为路径的权值乘上概率。

根据期望的线性，最后将结果相加即可

利用拓扑排序

## 代码

```cpp
#include<bits/stdc++.h>
using namespace std;
const int N=100005;
int n,m;

int id[N],od[N];
struct qxx{int nex,t,v;};
qxx e[2*N];
int head[N],cnt;
void add_path(int f,int t,int v){e[++cnt]=(qxx){head[f],t,v},head[f]=cnt;}
queue<int> q;
double p[N],ans;

int main(){
	scanf("%d%d",&n,&m);
	for(int i=1,a,b,c;i<=m;i++){
		scanf("%d%d%d",&a,&b,&c);
		add_path(a,b,c);
		++od[a],++id[b];
	}
	for(int i=1;i<=n;i++){
		p[i]=0;
		if(!id[i])q.push(i),p[i]=1;
	}
	while(!q.empty()){
		int k=q.front();q.pop();
		double pk=p[k]/od[k];
		for(int i=head[k];i;i=e[i].nex){
			--id[e[i].t];
			p[e[i].t]+=pk;// 到达这个点的概率
			ans+=e[i].v*pk;// 路径期望累加
			if(id[e[i].t]==0)q.push(e[i].t);
		}
	}
	printf("%.2lf",ans);
	return 0;
}
```

# [NOIP2016] 换教室 - 离散期望

## 分析

期望 +DP

注意，并不是每一个教室都要考虑换还是不换。只有申请换教室的才考虑成功和失败的概率，没有申请的就不考虑。

定义 $f[i,j,p]$ 到第 i 个时段，**申请**更换了 j 次，目前在 C(0) 还是 D(1) 教室。

------
### 考虑 $f[i,j,0]$

考虑第 $i$ 个教室没有申请，则到达这个教室的概率为 1

#### 第 $i-1$ 个教室没有申请
若第 $i-1$ 个教室没有申请，那么走的路径将是 $c_{i-1}$ 到 $c_i$ ，概率为 1.
        期望为 $f[i-1,j,0]+1*dis[c_i,c_{i-1}]$

#### 第 $i-1$ 个教室申请

第 $i-1$ 个教室申请换，则分两种情况：即考虑 $f[i-1,j,1]$

- ##### 申请成功
  概率为 $k_{i-1}$，则期望为 $k_{i-1}dis[c_i,d_{i-1}]$

- ##### 申请失败
  概率为 $1-k_{i-1}$，则期望为 $(1-k_{i-1})dis[c_i,c_{i-1}]$

- ##### 总期望
  $f[i-1,j,1]+k_{i-1}dis[c_i,d_{i-1}]+(1-k_{i-1})dis[c_i,c_{i-1}]$

#### 上两者之间取最小值，即为 $f[i,j,0]$
------
### 考虑 $f[i,j,1]$
考虑第 $i$ 个教室申请
#### 申请失败
第 $i$ 个教室申请失败，概率为 $1-k_i$

##### 第 $i-1$ 个教室没有申请，到达第 $i-1$ 个教室的概率为 1
期望为 $(1-k_i)dis[c_i,c_{i-1}]$

##### 第 $i-1$ 个教室申请，考虑 $f[i-1,j-1,1]$

- ###### 申请成功
  概率为 $k_{i-1}$，则期望为 $k_{i-1}dis[c_i,d_{i-1}]$

- ###### 申请失败
  概率为 $1-k_{i-1}$，则期望为 $(1-k_{i-1})*dis[c_i,c_{i-1}]$

##### 总期望
**结合第 $i$ 个教室申请失败的概率**，期望为 $(1-k_i)k_{i-1}dis[c_i,d_{i-1}]+(1-k_i)(1-k{i-1})dis[c_i,c_{i-1}]$

#### 申请成功
第 $i$ 个教室申请成功，概率为 $k_i$

##### 第 $i-1$ 个教室没有申请
第 $i-1$ 个教室没有申请，到达第 $i-1$ 个教室的概率为 1，期望为 $k_idis[d_i,c_{i-1}]$

##### 第 $i-1$ 个教室申请
第 $i-1$ 个教室申请，考虑 $f[i-1,j-1,1]$

- ###### 申请成功
  概率为 $k_{i-1}$，则期望为 $k_{i-1}dis[c_i,d_{i-1}]$

- ###### 申请失败
  概率为 $1-k_{i-1}$，则期望为 $(1-k_{i-1})*dis[c_i,c_{i-1}]$

##### 总期望

**结合第 $i$ 个教室申请成功的概率**，期望为 $k_ik_{i-1}dis[c_i,d_{i-1}]+k_i(1-k_{i-1})dis[c_i,c_{i-1}]$

#### 第 $i-1$ 个教室没有申请的总期望
结合第 $i-1$ 个教室没有申请的两个情况（即 4.2.1.1 和 4.2.2.1），总的期望为 $f[i-1,j-1,0]+(1-k_i)dis[c_i,c_{i-1}]+k_idis[d_i,c_{i-1}]$

#### 第 $i-1$ 个教室有申请的总期望
结合第 $i-1$ 个教室有申请的 2 种情况（即 4.2.1.2 和 4.2.2.2）总的期望为 $f[i-1,j-1,1]+(1-k_i)k_{i-1}dis[c_i,d_{i-1}]+(1-k_i)(1-k_{i-1})dis[c_i,c_{i-1}]+k_ik_{i-1}dis[c_i,d_{i-1}]+k_i(1-k_{i-1})dis[c_i,c_{i-1}]$

#### 上两者取最小值即为 $f[i,j,1]$

------
## 代码

```cpp
#include<cstdio>
#include<algorithm>
using namespace std;
const int N=2003,V=302,M=302;
int n,m,v,e;
int c[N],d[N];
int dis[V][V];
double p[N];
double f[N][N][2];
//f[i,j,p] 到第 i 个时段，更换了 j 次，目前在 C(0) 还是 D(1) 教室
int main(){
//freopen("p1850.in","r",stdin);
	scanf("%d%d%d%d",&n,&m,&v,&e);
	for(int i=1;i<=n;i++)scanf("%d",&c[i]);
	for(int i=1;i<=n;i++)scanf("%d",&d[i]);
	for(int i=1;i<=n;i++)scanf("%lf",&p[i]);

	for(int i=1;i<=v;i++)
		for(int j=1;j<i;j++)
			dis[i][j]=dis[j][i]=800000000;

	for(int i=1,x,y,z;i<=e;i++)
		scanf("%d%d%d",&x,&y,&z),dis[x][y]=dis[y][x]=min(dis[x][y],z);

	for(int pi=1;pi<=v;pi++)
		for(int i=1;i<=v;i++)
			for(int j=1;j<=v;j++)
				if(dis[i][j]>dis[i][pi]+dis[pi][j])
					dis[i][j]=dis[i][pi]+dis[pi][j];

	for(int i=1;i<=n;i++)
		for(int j=0;j<=m;j++)
			f[i][j][0]=f[i][j][1]=800000000;

	f[1][0][0]=f[1][1][1]=0;
	for(int i=2;i<=n;i++){
		for(int j=0;j<=m&&j<=i;j++){
			f[i][j][0]=min(
				f[i-1][j][0]+dis[c[i]][c[i-1]],
				f[i-1][j][1]+p[i-1]*dis[c[i]][d[i-1]]
							+(1-p[i-1])*dis[c[i]][c[i-1]]
			);
			if(j>0)f[i][j][1]=min(
				f[i-1][j-1][0]+(1-p[i])*dis[c[i]][c[i-1]]
							+p[i]*dis[d[i]][c[i-1]],
				f[i-1][j-1][1]+p[i-1]*p[i]*dis[d[i]][d[i-1]]
							+(1-p[i-1])*p[i]*dis[d[i]][c[i-1]]
							+p[i-1]*(1-p[i])*dis[c[i]][d[i-1]]
							+(1-p[i-1])*(1-p[i])*dis[c[i]][c[i-1]]
			);
		}
	}
	double ans=800000000;
	for(int i=0;i<=m;i++){
		ans=min(ans,f[n][i][0]);
		ans=min(ans,f[n][i][1]);
	}
	printf("%.2lf",ans);
	return 0;
}
```
