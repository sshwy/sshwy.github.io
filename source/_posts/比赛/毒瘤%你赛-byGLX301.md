---
title: 毒瘤%你赛-byGLX
categories:
  - 比赛
mathjax: true
abbrlink: 27282
date: 2018-10-01 20:22:00
updated: 2018-10-01 20:22:00
---
# 毒瘤%你赛-byGLX
![TIM截图20180821083912.png][1]
题面
[A.pdf][2]<!--more-->
[B.pdf][3]
[C.pdf][4]

## 总结
两次的比赛的小结：
- 勤写暴力
- 稳打模板
- 数组开大
- 心态不炸

## A. 吉吉买铅笔
- dijkstra分别以1,n为源节点走两次最短路
- 注意输出边的时候要取最优解
```cpp
#include<bits/stdc++.h>
#define int long long 
using namespace std;
const int N=100005,M=200005;
int n,m;

struct qxx{int nex,t,v,idx;};
qxx e[N*2];
int h[N],cnt;
void add_path(int f,int t,int v,int idx){
	e[++cnt]=(qxx){h[f],t,v,idx};
	h[f]=cnt;
}

struct my_pair{
	int idx,dis;
	bool operator<(my_pair tht)const{
		return dis>tht.dis;
	}
};
priority_queue<my_pair> q;

int d0[N],d1[N];
int u[M],v[M],w[M];

signed main(){
	scanf("%lld%lld",&n,&m);
	for(int i=1;i<=m;i++){
		scanf("%lld%lld%lld",&u[i],&v[i],&w[i]);
		add_path(u[i],v[i],w[i],i);
		add_path(v[i],u[i],w[i],i);
	}
	//d0
	memset(d0,0x3f,sizeof(d0));
	d0[1]=0;
	q.push((my_pair){1,0});
	while(!q.empty()){
		my_pair k=q.top();q.pop();
		for(int i=h[k.idx];i;i=e[i].nex){
			if(d0[e[i].t]>k.dis+e[i].v){
				d0[e[i].t]=k.dis+e[i].v;
				q.push((my_pair){e[i].t,d0[e[i].t]});
			}
		}
	}
	//d1
	memset(d1,0x3f,sizeof(d1));
	d1[n]=0;
	q.push((my_pair){n,0});
	while(!q.empty()){
		my_pair k=q.top();q.pop();
		for(int i=h[k.idx];i;i=e[i].nex){
			if(d1[e[i].t]>k.dis+e[i].v){
				d1[e[i].t]=k.dis+e[i].v;
				q.push((my_pair){e[i].t,d1[e[i].t]});
			}
		}
	}
	for(int i=1;i<=n;i++)printf("%lld\n",d0[i]+d1[i]);
	for(int i=1;i<=m;i++)
		printf("%lld\n",min(d0[u[i]]+d1[v[i]],d0[v[i]]+d1[u[i]])+w[i]);
	return 0;
}//long long!
```
## B. 吉吉的跳跃
- BFS乱搜。。。
- 附带GLX的快读模板
```cpp
#include <bits/stdc++.h>
using namespace std;

const int OutputBufferSize = 10000000;
namespace input {
    #define BUF_SIZE 100000 
    #define OUT_SIZE 100000 
    #define ll long long 
    bool IOerror = 0; 
    inline char nc() {
        static char buf[BUF_SIZE], *p1 = buf + BUF_SIZE, *pend = buf + BUF_SIZE; 
        if (p1 == pend) { 
            p1 = buf; pend = buf + fread(buf, 1, BUF_SIZE, stdin); 
            if (pend == p1) { IOerror = 1; return -1; } 
        } 
        return *p1++; 
    } 
    inline bool blank(char ch) {
        return ch ==' '||ch == '\n'||ch == '\r'||ch == '\t';
    } 
    inline void read(char &ch) { 
        ch = nc();
        while (blank(ch)) ch = nc();
    }
    inline void read(int &x) {
        char ch = nc(); x = 0; 
        for (; blank(ch); ch = nc()); 
        if (IOerror) return; 
        for (; ch >= '0' && ch <= '9'; ch = nc()) x = x * 10 + ch - '0';
    } 
    #undef ll 
    #undef OUT_SIZE 
    #undef BUF_SIZE 
}; 
namespace output {
    char buffer[OutputBufferSize];
    char *s = buffer;
    inline void flush() {
        assert(stdout != NULL);
        fwrite(buffer, 1, s - buffer, stdout);
        s = buffer;
        fflush(stdout);
    }
    inline void print(const char ch) {
        if (s - buffer > OutputBufferSize - 2) flush();
        *s++ = ch;
    }
    inline void print(char* str) {
        while (*str != 0) print(char(*str++));
    }
    inline void print(int x) {
        char buf[25] = {0}, *p = buf;
        if (x == 0) print('0');
        while (x) *(++p) = x % 10, x /= 10;
        while (p != buf) print(char(*(p--) + '0'));
    }
}

const int maxn = 2005;
const int inf = 0x3f3f3f3f;
char s[maxn][maxn];
int n,m,a[maxn][maxn];

struct crd{int x,y,d,v;};//(x,y),direction,value
queue<crd> q;

int main() {
    input::read(n), input::read(m);
    memset(a,0x3f,sizeof(a));
    for (int i=1;i<=n;i++){
        for (int j=1;j<=m;j++){
            input::read(s[i][j]);
            if(s[i][j]=='+'){
            	q.push((crd){i,j,0,0});
            	a[i][j]=0;
            }
            else if(s[i][j]=='#')a[i][j]=-1;
        }
    }
    while(!q.empty()){
    	crd k=q.front();q.pop();
    	if(a[k.x][k.y]<k.v)continue;
    	int v;
    	//up
    	if(k.d!=1)v=k.v+1;
    	else v=k.v;
    	for(int i=k.x-1;i>0;i--){
    		if(s[i][k.y]!='#'){
    			if(a[i][k.y]>v){
    				a[i][k.y]=v;
    				q.push((crd){i,k.y,1,v});
    			}
    		}
    		else break;
    	}
    	//down
    	if(k.d!=2)v=k.v+1;
    	else v=k.v;
    	for(int i=k.x+1;i<=n;i++){
    		if(s[i][k.y]!='#'){
    			if(a[i][k.y]>v){
    				a[i][k.y]=v;
    				q.push((crd){i,k.y,2,v});
    			}
    		}
    		else break;
    	}
    	//left
    	if(k.d!=3)v=k.v+1;
    	else v=k.v;
    	for(int i=k.y-1;i>0;i--){
    		if(s[k.x][i]!='#'){
    			if(a[k.x][i]>v){
    				a[k.x][i]=v;
    				q.push((crd){k.x,i,3,v});
    			}
    		}
    		else break;
    	}
    	if(k.d!=4)v=k.v+1;
    	else v=k.v;
    	for(int i=k.y+1;i<=n;i++){
    		if(s[k.x][i]!='#'){
    			if(a[k.x][i]>v){
    				a[k.x][i]=v;
    				q.push((crd){k.x,i,4,v});
    			}
    		}
    		else break;
    	}
    }
    for (int i=1;i<=n;i++) {
        for (int j=1;j<=m;j++) {
            if (a[i][j]==-1) {
                output::print('#');
            } else if (a[i][j]==inf) {
                output::print('X');
            } else {
                output::print(a[i][j]);
            }
            output::print(" \n"[j==m]);
        }
    }
    output::flush();
    return 0;
}
```
## C. 吉吉游西藏

[1]: https://hexo-source-1257756441.cos.ap-chengdu.myqcloud.com/2018/08/4194301406.png
[2]: https://hexo-source-1257756441.cos.ap-chengdu.myqcloud.com/2018/08/953450606.pdf
[3]: https://hexo-source-1257756441.cos.ap-chengdu.myqcloud.com/2018/08/1815831717.pdf
[4]: https://hexo-source-1257756441.cos.ap-chengdu.myqcloud.com/2018/08/4150363962.pdf