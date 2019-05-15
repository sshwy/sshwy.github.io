---
title: 字典树|TRIE
categories:
  - 字符串
mathjax: true
abbrlink: 53862
date: 2018-10-01 20:22:00
updated: 2018-10-01 20:22:00
---
# 字典树|TRIE
## 简介
字典树，其实就是一颗树。
但是这颗树就像字典一样，能迅速匹配字典中的字符串。<!--more-->

基本性质：
- 根节点不包含字符，除根节点外每一个节点都只包含一个字符。
- 从根节点到某一节点，路径上经过的字符连接起来，为该节点对应的字符串。
- 每个节点的所有子节点包含的字符都不相同。

## 结构
```cpp
struct Trie_node
{
    struct Trie_node* next[26];   // 指向各个子树的指针
    bool exist;                   // 标记该结点处是否构成单词
};
typedef Trie_node* trie;
```
以下结构适用于竞赛，不需要动态分配内存
```cpp
int trie[10e6][27];//trie[i][j]表示结点i的j字符指向的下一个结点
```
## 操作
```cpp
struct trie{
	int nex[100000][26],cnt;
	bool exist[100000];//该结点结尾的字符串是否存在
	
	void insert(char *s,int l){//插入字符串
		int p=0;
		for(int i=0;i<l;i++){
			int c=s[i]-'a';
			if(!nex[p][c])nex[p][c]=++cnt;//如果没有，就添加结点
			p=nex[p][c];
		}
		exist[p]=1;
	}
	bool find(char *s,int l){//查找字符串
		int p=0;
		for(int i=0;i<l;i++){
			int c=s[i]-'a';
			if(!nex[p][c])return 0;
			p=nex[p][c];
		}
		return exist[p];
	}	
};
```