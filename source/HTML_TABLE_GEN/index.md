---
title: HTML在线生成表格
date: 2018-11-24 15:05:05
---

<html lang="en">
<head>
<meta charset="UTF-8">
<title>Document</title>
<style>
.tdcomments{
}
.comments {
width:60%;/*自动适应父布局宽度*/
height:130%;
overflow:auto;
word-break:break-all;
background:rgba(0, 0, 0, 0);
border:0;
}
</style>
</head>
<body>
<h1>在线生成html表格代码</h1>

<table border='0'>
<tr><td>行数</td><td><input type="text" id="rows" value=5></td></tr>
<tr><td>列数</td><td><input type="text" id="cols" value=5></td></tr>
<tr><td>边框</td><td><input type="text" id="border" value=1></td></tr>
<tr><td></td><td><input type="submit" value="提交" onclick="ok()"></td></tr>
</table>

<div id="box"></div>
<input type="submit" value="生成代码" onclick="gencode()"><br>
<textarea id="table_text" name="newCode" rows="20" cols="60"></textarea>

<script>
function ok(){
var rows=document.getElementById('rows').value;
var cols=document.getElementById('cols').value;
var border=document.getElementById('border').value;
var html_table_text=printTable(rows,cols,border);
var str=document.getElementById('box').innerHTML=html_table_text;//alert(str);
//document.getElementById('table_text').innerHTML=str;
}
function gencode(){
var rows=document.getElementById('rows').value;
var cols=document.getElementById('cols').value;
var border=document.getElementById('border').value;
var html_table_text=printTableCode(rows,cols,border);
var str=document.getElementById('table_text').innerHTML=html_table_text;
document.getElementById('table_text').innerHTML=str;
}
function printTable(rows,cols,border){
var html="<table border='"+border+"'>";
for(var i=0;i<rows;i++){                  
html+="<tr>";
for(var j=0;j<cols;j++){
html+="<td>"+"<textarea class=comments id=\"tr"+i+"td"+j+"t\" ></textarea>"+"</td>";
}
html+="</tr>"
}
html+="</table>";
return html;
}
function printTableCode(rows,cols,border){
var html="<table border='"+border+"'>\n";
for(var i=0;i<rows;i++){                  
html+="<tr>\n";
for(var j=0;j<cols;j++){
var content=document.getElementById("tr"+i+"td"+j+"t").value;
html+="<td>"+content+"</td>";
}
html+="</tr>\n"
}
html+="</table>";
return html;
}
</script>
</body>
</html>
