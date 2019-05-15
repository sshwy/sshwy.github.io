---
title: ZROI 提高组 Day4
categories:
  - 比赛
mathjax: true
abbrlink: 45138
date: 2018-10-01 20:22:00
updated: 2018-10-01 20:22:00
---
## A. 天
将 n 个数拆成左右两列, 左边表示买, 右边表示卖, 从左向右连边即表示买入和卖出。

考虑第 $i$ 天是否卖出, 一定是在左边列的前 $i-1$ 个中找一个还未配对的最小值和其配对进行买卖获益最大, 如果最小值 $\geq$ 当前第 $i$ 天的价格就不交易。

配对时需要注意, 如果当前配对的买入价格和之前某次配对的卖出价格相同, 那么我们就可以将两条边合并为 $1$ 条, 交易次数减少而获利不变。

用堆维护可买入的东西即可。使用二元组 pair 维护物品的价格，状态：

- 其中 0 表示该价格的**一个**物品处于卖出的状态，所以当买到这个东西的时候交易为 0（可合并）
- 其中 2 表示该价格的**一个**物品处于没有卖的状态，所以当买到这个东西的时候交易为 2.


```cpp
#include<cstdio>
#include<queue>
#include<utility>
using namespace std;
typedef pair<int,int> pii;
const int N=50004;
int n,a[N];
void Main(){
	long long ans=0,tot=0;
	priority_queue<pii,vector<pii>,greater<pii> > q;
		// 数值小的优先级高，并且 pair 以 first 为第一关键字
	scanf("%d",&n);
	for(int i=1;i<=n;i++)scanf("%d",&a[i]);
	q.push(make_pair(a[1],2));
	for(int i=2;i<=n;i++){pii k=q.top();
		if(a[i]>k.first){q.pop();
			ans+=a[i]-k.first;
			if(k.second==0)q.push(make_pair(k.first,2));// 边合并后，中间的那个元素又可以使用
			else tot+=k.second;
			q.push(make_pair(a[i],0));// 当前元素做了交易，处于卖出状态
		}
		else q.push(make_pair(a[i],2));// 未做交易
	}
	printf("%lld %lld\n",ans,tot);
}
int main(){
	int t;
	scanf("%d",&t);
	while(t--)Main();
	return 0;
}
```

## B. 的
- 二分直径，并查集验证
- 总复杂度 $O((n^2+2n)log_2L)$
```cpp
#include<cstdio>
#include<cmath>
using namespace std;
const int N=502;
int n,L;

// 并查集
int fa[N+2];//0 表示上边界，n+1 表示下边界
void clear(int k){for(int i=0;i<=k;i++)fa[i]=i;}
int gf(int k){return fa[k]==k?k:fa[k]=gf(fa[k]);}
int find(int a,int b){return gf(a)==gf(b);}
void un(int a,int b){if(!find(a,b))fa[gf(a)]=gf(b);}

struct point{int x,y;}p[N];
double dis(point a,point b){return sqrt((a.x-b.x)*(a.x-b.x)+(a.y-b.y)*(a.y-b.y));
}
double w[N][N];

bool check(double k){clear(n+1);// 并查集初始化
	for(int i=1;i<=n;i++){if(L-p[i].y<=k)un(i,0);// 上边界
		if(p[i].y<=k)un(i,n+1);// 下边界
		for(int j=1;j<i;j++)
			if(w[i][j]<=k)un(i,j);
	}
	if(find(0,n+1))return false;// 上下边界连通，无法到达
	else return true;
}
int main(){scanf("%d%d",&n,&L);
	for(int i=1;i<=n;i++){scanf("%d%d",&p[i].x,&p[i].y);
		for(int j=1;j<i;j++)// 预处理两点之间的距离
			w[i][j]=w[j][i]=dis(p[i],p[j]);
	}
	double l=0,r=L;
	while(r-l>1e-5){double mid=(r+l)/2;
		if(check(mid))l=mid;
		else r=mid;
	}
	printf("%.3lf",l);
	return 0;
}
```