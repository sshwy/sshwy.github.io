---
title: CF10D LCIS
categories:
  - 动态规划
mathjax: true
abbrlink: 2308
date: 2018-10-01 20:22:00
updated: 2018-10-01 20:22:00
---
# 题意

求两个串的最长公共上升子序列。

n,m<=500

<!--more-->

# 分析

用$f[i][j]$表示A与B构成的以$B_j$为结尾的LCIS的长度：

$$
f[i][j]=\max_{k=0}^{j-1}\{f[i-1][k]+1\},B_k<B_j
$$

时间复杂度$O(n^3)$.

```cpp
#include<iostream>
#define FOR(a,b,c) for(int a=b;a<=c;a++)
using namespace std;

int n,m,mx,mxn;
int a[600],b[600],f[600][600],pre_b[600];

void print_pre(int nk){
	if(!nk)return;
	print_pre(pre_b[nk]);
	cout<<b[nk]<<' ';
}
int main(){
	cin>>n;
    FOR(i,1,n)cin>>a[i];
	cin>>m;
    FOR(i,1,m)cin>>b[i];
	FOR(i,1,n)FOR(j,1,m)f[i][j]=1;
    FOR(i,1,n)FOR(j,1,m){
		if(a[i]!=b[j])f[i][j]=f[i-1][j];
		else {
            for(int k=j-1;k>=0;k--)if(b[k]<b[j]&&f[i][j]<f[i-1][k]+1)
                f[i][j]=f[i-1][k]+1,pre_b[j]=k;
		}
	}
    FOR(i,1,m)if(f[n][i]>mx)mx=f[n][i],mxn=i;
	cout<<mx<<endl;
	print_pre(mxn);
	return 0;
}
```