---
title: UVA437The Tower of Babylon
categories:
  - 动态规划
mathjax: true
abbrlink: 12755
date: 2018-10-01 20:22:00
updated: 2018-10-01 20:22:00
---
# UVA437The Tower of Babylon

你可能已经听说过巴比伦塔的传说。现在这个传说的许多细节已经被遗忘。所以本着本场比赛的教育性质，我们现在会告诉你整个传说：

巴比伦人有 n 种长方形方块，每种有无限个，第 i 种方块的三边边长是 xi,yi,zi。对于每一个方块，你可以任意选择一面作为底，这样高就随着确定了。举个例子，同一种方块，可能其中一个是竖着放的，一个是侧着放的，一个是横着放的。
他们想要用堆方块的方式建尽可能高的塔。问题是，只有一个方块的底的两条边严格小于另一个方块的底的两条边，这个方块才能堆在另一个上面。这意味着，一个方块甚至不能堆在一个底的尺寸与它一样的方块的上面。<!--more-->

你的任务是编写一个程序，计算出这个塔可以建出的最高的高度。

## 输入格式

输入会包含至少一组数据，每组数据的第一行是一个整数 n(n<=30)，表示方块的种类数。 这组数据接下来的 n 行，每行有三个整数，表示 xi,yi,zi。 输入数据会以 0 结束。

## 输出格式

对于每组数据，输出一行，其中包含组号 (从 1 开始) 和塔最高的高度。按以下格式： Case : maximum height = __

## 样例输入
```
1
10 20 30
2
6 8 10
5 5 5
7
1 1 1
2 2 2
3 3 3
4 4 4
5 5 5
6 6 6
7 7 7
5
31 41 59
26 53 58
97 93 23
84 62 64
33 83 27
0
```

## 样例输出
```
Case 1: maximum height = 40
Case 2: maximum height = 21
Case 3: maximum height = 28
Case 4: maximum height = 342
```

# 题解 -DAG 求最长路

把长方体 <x,y,z> 分为 **<x,y,z><x,z,y><y,z,x>** 三个

把第三个参数当做高度 (h)

于是当长方体 i 上能放一个长方体 j 时，就连一条 (i,j) 的有向路径。

可以证明，这样连出来的图一定无环（不然就能无限加高了）

于是，DP 上场了

当然要注意的是，权值是**点权**不是边权

## 代码实现

```cpp

#include<iostream>
#include<cstdio>

using namespace std;

int n,cnt,xx,yy,zz,mx,t;
struct cube{int x,y,h;};
cube r[120];

struct graph{// 结构体封装
    struct path{int nex,t;};
    int head[120],hcnt;
    path e[10000];
    int l[120];

    void add_path(int f,int t){e[++hcnt]=(path){head[f],t};
        head[f]=hcnt;
    }
    int lp(int st){if(l[st])return l[st];
        int s=0;
        for(int i=head[st],tt;i;i=e[i].nex){tt=lp(e[i].t);
            if(tt>s)s=tt;
        }
        return l[st]=s+r[st].h;
    }
    void clr(){for(int i=1;i<10000;i++)e[i].nex=e[i].t=0;
        for(int i=0;i<120;i++)head[i]=l[i]=0;
        hcnt=0;
    }
};

graph g;

int main(){while(scanf("%d",&n)!=EOF){if(n==0)return 0;
        g.clr();
        cnt=mx=0;
        ++t;
        for(int i=1;i<=n;i++){scanf("%d%d%d",&xx,&yy,&zz);
	        r[++cnt]=(cube){xx,yy,zz};
    	    if(zz!=yy)r[++cnt]=(cube){zz,xx,yy};
        	if(zz!=xx)r[++cnt]=(cube){yy,zz,xx};
		}
        n=cnt;
        for(int i=1;i<=n;i++)
            for(int j=1;j<=n;j++)
                if(r[i].x>r[j].x&&r[i].y>r[j].y||r[i].x>r[j].y&&r[i].y>r[j].x)
					g.add_path(i,j);
        for(int i=1;i<=n;i++)if(mx<g.lp(i))mx=g.lp(i);
        printf("Case %d: maximum height = %d\n",t,mx);
    }
    return 0;
}

```