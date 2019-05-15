echo -e "\033[42m[Hexo]Generating...\033[0m"
hexo g;
echo -e "\033[42m[Gulp]Making Mathjax SVG...\033[0m"
gulp mathjax;
echo -e "\033[42m[Gulp]Encrypting...\033[0m"
gulp encrypt;
echo -e "\033[42m[Hexo]Deploying...\033[0m"
hexo d;
echo -e "\033[42m[Github]Backing up...\033[0m"
sh git-push.sh
echo -e "\033[42m[Done].\033[0m"

