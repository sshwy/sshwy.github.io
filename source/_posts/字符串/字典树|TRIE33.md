---
title: 字典树
categories:
  - 字符串
mathjax: true
abbrlink: 53862
date: 2018-10-01 20:22:00
updated: 2018-10-01 20:22:00
---


# 简介
字典树，英文名Trie。顾名思义，就是一个像字典一样的树。先放一张图：

![trie1](https://hexo-source-1257756441.cos.ap-chengdu.myqcloud.com/2019/07/12/165207.png)

可以发现，这棵字典树用边来代表字母，而从根结点到树上某一结点的路径就代表了一个字符串。举个例子，$1\to4\to 8\to 12$表示的就是字符串 `caa`。

# 结构
```cpp
int trie[10e6][27];//trie[i][j] 表示结点 i 的 j 字符指向的下一个结点
```
# 操作
```cpp
struct trie{int nex[100000][26],cnt;
	bool exist[100000];// 该结点结尾的字符串是否存在
	
	void insert(char *s,int l){// 插入字符串
		int p=0;
		for(int i=0;i<l;i++){
            int c=s[i]-'a';
			if(!nex[p][c])nex[p][c]=++cnt;// 如果没有，就添加结点
			p=nex[p][c];
		}
		exist[p]=1;
	}
	bool find(char *s,int l){// 查找字符串
		int p=0;
		for(int i=0;i<l;i++){int c=s[i]-'a';
			if(!nex[p][c])return 0;
			p=nex[p][c];
		}
		return exist[p];
	}	
};
```