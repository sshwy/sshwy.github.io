---
title: ZROI菜鸡互啄杯III
categories:
  - 比赛
mathjax: true
abbrlink: 36782
date: 2018-10-01 20:22:00
updated: 2018-10-01 20:22:00
---
# ZROI菜鸡互啄杯III
2018.8.14
![Siyuan小姐姐系列.png][1]

讲题解以前，先膜拜一下Siyuan小姐姐家族的人<!--more-->
题面 [0814.pdf][2]

## A.
数学水题
*by sshwy & xry*
```cpp
#include<bits/stdc++.h>
using namespace std;
typedef long long ll;
ll n,t,mx;

int main(){
	scanf("%lld",&t);
	for(ll i=1;i<=t;i++){
		scanf("%lld",&n);
		mx=-1;
		ll x,y,z;
		//a==2
		if(n%2==0){
			x=n/2;
			ll n2=n-x;
			if(n%3==0){//b==3
				y=n/3,z=n-x-y;
				if(n%z==0)mx=max(mx,x*y*z);
			}
			if(n%4==0){//b==4
				y=n/4,z=n-x-y;
				if(n%z==0)mx=max(mx,x*y*z);
			}
		}		
		//a==3
		if(n%3==0){
			x=n/3,mx=max(mx,x*x*x);
		}
		printf("%lld\n",mx);
	}
	return 0;
}
```

## B.
乘法原理
*by GavinZHeng & sshwy*
```cpp
#include<bits/stdc++.h>
using namespace std;
typedef long long ll;
ll t,n,m,b[200];
int main(){
	scanf("%lld",&t);
	while(t--){
		scanf("%lld%lld",&n,&m);
		for(ll i=1;i<=n;i++)scanf("%*d%lld",&b[i]),b[i]++;
		sort(b+1,b+n+1);
		ll ans=1,i;
		for(i=1;i<=n;i++){
			if(ans*b[i]>m)break;
			ans*=b[i];
			
		}
		printf("%lld\n",i-1);
	}
	return 0;
}
```

## C.
矩阵加速（加分块？）
*by sry*
```cpp
#include<bits/stdc++.h>
using namespace std;
const long long mod=1e9+7;
struct matrix{
	long long r,c,m[5][5];
	matrix operator *(matrix t)const{
		matrix tmp;
		tmp.r=r,tmp.c=t.c;
		for(int i=1;i<=tmp.r;i++){
			for(int j=1;j<=tmp.c;j++){
				tmp.m[i][j]=0;
			}
		}
		for(int i=1;i<=r;i++){
			for(int j=1;j<=t.c;j++){
				for(int k=1;k<=c;k++){
					tmp.m[i][j]+=m[i][k]*t.m[k][j];
					tmp.m[i][j]%=mod;
				}
			}
		}
		return tmp;
	}
};
matrix mt,z;
void printmat(matrix x){
	for(int i=1;i<=x.r;i++){
		for(int j=1;j<=x.c;j++)cout<<x.m[i][j]<<" ";
		puts("");
	}
}
matrix POW(matrix mat,long long p){
	//cout<<"POW\n";
	//printmat(mat);
	//cout<<"^"<<p<<"\n";
	matrix tmp;
	tmp.r=mat.r,tmp.c=mat.c;
	for(int i=1;i<=tmp.r;i++){
		for(int j=1;j<=tmp.c;j++){
			if(i==j)tmp.m[i][j]=1;
			else tmp.m[i][j]=0;
		}
	}
	while(p){
		if(p%2)tmp=tmp*mat;
		mat=mat*mat,p/=2;
	}
	//cout<<"TMP:\n";
	//printmat(tmp);
	return tmp;
}
long long T,a,b,c,d,p,n,l,r,v;
int main(){
	scanf("%lld",&T);
	while(T--){
		scanf("%lld%lld%lld%lld%lld%lld",&a,&b,&c,&d,&p,&n);
		if(n==1){
			printf("%lld\n",a);
			continue;
		}
		if(n==2){
			printf("%lld\n",b);
			continue;
		}
		mt.r=1;
		mt.c=3;
		mt.m[1][1]=1,mt.m[1][2]=a,mt.m[1][3]=b;
		z.c=z.r=3;
		z.m[1][1]=1,z.m[1][2]=0;
		z.m[2][1]=0,z.m[2][2]=0,z.m[2][3]=c;
		z.m[3][1]=0,z.m[3][2]=1,z.m[3][3]=d;
		l=3;
		while(l<=n){
			v=p/l;
			if(v)r=min(n,p/v);
			else r=n;
			z.m[1][3]=v,mt=mt*POW(z,r-l+1);
			//cout<<"l="<<l<<" r="<<r<<"\n";
			//cout<<"MAT=\n";
			//printmat(mt);
			l=r+1;
		}
		printf("%lld\n",mt.m[1][3]);
	}
	return 0;
}
```

## H.
不读题+瞎想系列
*by sshwy & GavinZheng & zry*
```cpp
#include<bits/stdc++.h>
using namespace std;
int main(){
	int n;
	while(~scanf("%d",&n)){
		printf("Yes\n");
	}
	return 0;
}
```
## I.
逆序对
*by sshwy*
```cpp
#include<bits/stdc++.h>
using namespace std;
typedef long long ll;
const ll N=100005;
ll n,x,y,tot;
ll a[N],tmp[N];

void merge_sort(ll *arr,ll l,ll r){
	if(l==r)return;
	ll mid=(l+r)>>1;
	merge_sort(arr,l,mid);
	merge_sort(arr,mid+1,r);
	for(ll i=l,j=mid+1,k=l;i<=mid||j<=r;k++){
		if(i>mid)tmp[k]=arr[j],j++;
		else if(j>r||arr[i]<=arr[j])tmp[k]=arr[i],i++,tot+=j-mid-1;
		else tmp[k]=arr[j],j++;
	}
	for(ll i=l;i<=r;i++)arr[i]=tmp[i];
}

int main(){
	while(~scanf("%lld%lld%lld",&n,&x,&y)){
		for(ll i=1;i<=n;i++)scanf("%lld",&a[i]);
		tot=0;
		merge_sort(a,1,n);
		printf("%lld\n",min(x,y)*tot);
	}
	return 0;
}//sshwy
```

## J.
数据读入处理
*by sshwy & GavinZheng*
```cpp
#include<bits/stdc++.h>
using namespace std;
int t,a,b;
char s[100];

void rd(int & x,int & y){
	x=y=0;
	char c=getchar();bool isN=0;
	while(!isdigit(c)){
		c=getchar();
		if(c=='-')isN=1;
	}
	while(isdigit(c))x=x*10+c-'0',c=getchar();
	if(isN)x=0-x;
	if(c!='.')return;
	c=getchar();
	while(isdigit(c))y=y*10+c-'0',c=getchar();
	if(isN)y=0-y;
}

int main(){
	scanf("%d",&t);
	while(t--){
		scanf("%d%d",&a,&b);
		int p,q;
		rd(p,q);
		q=q*6,b=(b+q);
		a=(a+p-8+(int)floor(b*1.0/60)+24)%24,b=(b+60)%60;
		printf("%02d:%02d\n",a,b);
	}
	return 0;
}
```

[1]: https://hexo-source-1257756441.cos.ap-chengdu.myqcloud.com/2018/08/1385527949.png

[2]: https://hexo-source-1257756441.cos.ap-chengdu.myqcloud.com/2018/08/3927650941.pdf