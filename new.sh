#!/bin/bash
hexo new post $1
nohup typora source/_posts/$1* &
