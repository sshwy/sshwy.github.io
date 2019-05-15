---
title: Hexo渲染Mathjax
categories:
  - Others
tags:
 - Hexo
abbrlink: 27315
date: 2018-10-12 13:06:10
updated: 2018-10-12 13:06:10
---

Hexo作为轻量级静态博客，默认是不支持渲染Mathjax的；即使启用了NexT主题中的Mathjax，也无法渲染复杂的数学公式。本文将介绍使用kramed引擎渲染Mathjax的方法.

<!--more-->

## Markdown与Mathjax的冲突

之所以无法渲染Mathjax，典型的原因在于`_`和的渲染：Markdown先将其渲染为斜体，而导致Mathjax在渲染的时候找不到该字符。因此我们的目标就是更换渲染引擎，并解除Markdown对`_`这类冲突字符的渲染。

## 关于Kramed引擎

据说kramed引擎是专门为了支持渲染Mathjax而设计的，用于取代marked的引擎。但是即使使用了Kramed，也无法解决上述冲突；仍需要我们修改正则表达式来解除。



## 操作

- 更换引擎（卸载原有的marked，改为kramed）：

  ```
  npm uninstall hexo-renderer-marked --save
  npm install hexo-renderer-kramed --save
  ```

- 打开`<YourRoot>/node_modules/kramed/lib/rules/inline.js`：

  - 将第11行的

    ```
    escape: /^\\([\\`*{}\[\]()#$+\-.!_>])/,
    ```

    修改为

    ```
    escape: /^\\([`*\[\]()# +\-.!_>])/,
    ```

  - 将第20行的

    ```
    em: /^\b_((?:__|[\s\S])+?)_\b|^\*((?:\*\*|[\s\S])+?)\*(?!\*)/,
    ```

    修改为

    ```
    em: /^\*((?:\*\*|[\s\S])+?)\*(?!\*)/,
    ```


修改完成（记得先`hexo clean`再generator）.