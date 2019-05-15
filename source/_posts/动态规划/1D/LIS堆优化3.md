---
title: LIS堆优化
categories:
  - 动态规划
mathjax: true
abbrlink: 7710
date: 2018-10-01 20:22:00
updated: 2018-10-01 20:22:00
---
# LIS问题描述

给出一个数列，找出其中最长的单调递减（或递增）子序列。 
例如，A{10，22，9，33，21，50，41，60，80} LIS的长度是6，LIS为{10，22，33，50，60，80}。

<!--more-->

# 分析

定义f[i]表示以A[i]结尾的LIS的长度，动态转移方程如下：
**f[i]=max(f[i],f[j]+1) (j<i and A[j]<A[i])**

更人性化的解读参考[GavinZheng-最长上升子序列](http://www.gavinzheng.tk/index.php/archives/5/)

**时间复杂度O(n^2)**

# 方案优化

用l[i]表示已遍历的**长度为i的LIS**的**最小的结尾数字**
则可证明，l[]数组的元素保持单调上升，于是用二分优化，

```cpp
#include<iostream>
#include<cstdio>
using namespace std;
int n,a,l[10001],cnt;
int low_bound(int * arr,int l,int r,int v){
	while(l<r){
		int mid=(l+r+1)>>1;
		if(arr[mid]>=v)r=mid-1;
		else l=mid;
	}
	return l;
}
int main(){
	cin>>n;
	for(int i=1;i<=n;i++){
		cin>>a;
		int j=low_bound(l,0,cnt,a);
		if(++j>cnt)l[++cnt]=a;
		if(l[j]>a)l[j]=a;
	}
	cout<<cnt;
	return 0;
}
```
**时间复杂度O(nlogn)**