/*对应rem换算为px/100*/
//此处是对应设计图宽度为640px的(/6.4),对应多少,数字改为多少
// https://www.jianshu.com/p/dffa036d7595
// document.documentElement.style.fontSize = document.documentElement.clientWidth / 7.5 + 'px';
if(document.documentElement.clientWidth / 7.5<105){//限制最大字体
	document.documentElement.style.fontSize = document.documentElement.clientWidth / 7.5 + 'px';
}else{
	document.documentElement.style.fontSize = 110 + 'px';
}
