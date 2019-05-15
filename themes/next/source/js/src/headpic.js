var imgArr=[
	"https://hexo-source-1257756441.cos.ap-chengdu.myqcloud.com/blogpic/001.png",
	"https://hexo-source-1257756441.cos.ap-chengdu.myqcloud.com/blogpic/002.png",
	"https://hexo-source-1257756441.cos.ap-chengdu.myqcloud.com/blogpic/003.png",
	"https://hexo-source-1257756441.cos.ap-chengdu.myqcloud.com/blogpic/004.png",
	"https://hexo-source-1257756441.cos.ap-chengdu.myqcloud.com/blogpic/005.png",
	"https://hexo-source-1257756441.cos.ap-chengdu.myqcloud.com/blogpic/006.png",
	"https://hexo-source-1257756441.cos.ap-chengdu.myqcloud.com/blogpic/007.png",
	"https://hexo-source-1257756441.cos.ap-chengdu.myqcloud.com/blogpic/008.png",
	"https://hexo-source-1257756441.cos.ap-chengdu.myqcloud.com/blogpic/009.png",
	"https://hexo-source-1257756441.cos.ap-chengdu.myqcloud.com/blogpic/010.png",
	"https://hexo-source-1257756441.cos.ap-chengdu.myqcloud.com/blogpic/011.png",
	"https://hexo-source-1257756441.cos.ap-chengdu.myqcloud.com/blogpic/012.png",
	"https://hexo-source-1257756441.cos.ap-chengdu.myqcloud.com/blogpic/013.png",
	"https://hexo-source-1257756441.cos.ap-chengdu.myqcloud.com/blogpic/014.png",
	"https://hexo-source-1257756441.cos.ap-chengdu.myqcloud.com/blogpic/015.png",
	"https://hexo-source-1257756441.cos.ap-chengdu.myqcloud.com/blogpic/016.png",
	"https://hexo-source-1257756441.cos.ap-chengdu.myqcloud.com/blogpic/017.png",
	"https://hexo-source-1257756441.cos.ap-chengdu.myqcloud.com/blogpic/018.png",
	"https://hexo-source-1257756441.cos.ap-chengdu.myqcloud.com/blogpic/019.png",
	"https://hexo-source-1257756441.cos.ap-chengdu.myqcloud.com/blogpic/020.png",
	"https://hexo-source-1257756441.cos.ap-chengdu.myqcloud.com/blogpic/021.png"
];
for (let i = 1; i < imgArr.length; i++) {//数组乱序
    const random = Math.floor(Math.random() * (i + 1));
    [imgArr[i], imgArr[random]] = [imgArr[random], imgArr[i]];
}
var task=document.getElementsByClassName("post-block");
for(var i=0;i<task.length;i++){
	//var idx=parseInt(Math.random()*(imgArr.length));
    var idx=i%imgArr.length;
	task[i].style.backgroundImage="url("+imgArr[idx]+")";
	task[i].style.backgroundPosition="top";
	task[i].style.backgroundRepeat="no-repeat";
	task[i].style.backgroundSize="100%";
}
