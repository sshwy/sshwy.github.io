---
title: TopArc
comments: false
date: 2019-03-04 16:10:23
keywords: top, 阅读量排行
description: 博客文章阅读量排行榜
---

<div id="top"></div>
<script src="//cdn1.lncld.net/static/js/3.0.4/av-min.js"></script>
<script>AV.initialize("264TIQDwmMrw50ALoeJcgS16-gzGzoHsz", "hXqT5xIIBtn8JWo8AkTWu07F");</script>
<script type="text/javascript">
  var time=0
  var title=""
  var url=""
  var query = new AV.Query('Counter');
  query.notEqualTo('id',0);
  query.descending('time');
  query.limit(1000);
  query.find().then(function (todo) {
    for (var i=0;i<4;i++){
      var result=todo[i].attributes;
      time=result.time;
      title=result.title;
      url=result.url;
      var content="<div align=\"center\"><h1><a href='"+url+"'>"+title+"</a></h1></div>"+"<div align=\"center\"><font color='#555'>"+"阅读次数："+time+"</font></div>"+"<br />";
      document.getElementById("top").innerHTML+=content
    }
	for (var i=4;i<8;i++){
      var result=todo[i].attributes;
      time=result.time;
      title=result.title;
      url=result.url;
      var content="<div align=\"center\"><h2><a href='"+url+"'>"+title+"</a></h2></div>"+"<div align=\"center\"><font color='#555'>"+"阅读次数："+time+"</font></div>"+"<br />";
      document.getElementById("top").innerHTML+=content
    }
	for (var i=8;i<12;i++){
      var result=todo[i].attributes;
      time=result.time;
      title=result.title;
      url=result.url;
      var content="<div align=\"center\"><h3><a href='"+url+"'>"+title+"</a></h3></div>"+"<div align=\"center\"><font color='#555'>"+"阅读次数："+time+"</font></div>"+"<br />";
      document.getElementById("top").innerHTML+=content
    }
	for (var i=12;i<16;i++){
      var result=todo[i].attributes;
      time=result.time;
      title=result.title;
      url=result.url;
      var content="<div align=\"center\"><h4><a href='"+url+"'>"+title+"</a></h4></div>"+"<div align=\"center\"><font color='#555'>"+"阅读次数："+time+"</font></div>"+"<br />";
      document.getElementById("top").innerHTML+=content
    }
	for (var i=16;i<20;i++){
      var result=todo[i].attributes;
      time=result.time;
      title=result.title;
      url=result.url;
      var content="<div align=\"center\"><h5><a href='"+url+"'>"+title+"</a></h5></div>"+"<div align=\"center\"><font color='#555'>"+"阅读次数："+time+"</font></div>"+"<br />";
      document.getElementById("top").innerHTML+=content
    }
  }, function (error) {
    console.log("error");
  });
</script>

<style>.post-description { display: none; }</style>
