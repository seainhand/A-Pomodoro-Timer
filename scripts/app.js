// var main_minutes = getId("main_minutes").value;
// var main_time = setTime(1000 * 60 * 40 + 1000)(); 
var cur_main_time = new Date(1000 * 60 * 25);
var cur_next_time = new Date(1000 * 60 * 5);
var cur_long_time = new Date(1000 * 60 * 40);
var temp_time = null;
var goal_main_num = 4;
var goal_turn = 2;
var goal_all_num = goal_main_num * 2 * goal_turn;
var main_num = 0;
var all_num = 0;
var interval = null;

function setCookieMin(){
	var data= new Date();
	data.setHours(data.getHours() + (24 * 30 * 6)); //保存六个月 
	var cookieString = "PomodoroTimer:"+window.cur_main_time.getMinutes()+"n"+window.cur_next_time.getMinutes()+"n"+window.cur_long_time.getMinutes()+"n"+window.goal_main_num+"n"+window.goal_turn;
	document.cookie = cookieString+";visited=yes; expires=" + data.toGMTString();  
}

function getCookieMin(){  
	if (document.cookie) {
		var cString = document.cookie;
		var bString = cString.split(";");
		var	arrString = bString[0].split(":");
		var arr = arrString[1].split("n");
		getId("main_minutes").options[arr[0]-1].selected = true;
		setTimer("main");
		getId("next_minutes").options[arr[1]-1].selected = true;
		setTimer("next");
		getId("long_minutes").options[arr[2]-1].selected = true;
		setTimer("long");
		getId("select_goal_main_num").options[arr[3]-1].selected = true;
		setMainNum();
		getId("select_goal_turn").options[arr[4]-1].selected = true;
		setTurn();
	}else{
		return false;
	}
}

function getSelect(id) {
	var objS = getId(id);
	var time = objS.options[objS.selectedIndex].value;
	return time;
}

function setMainNum() {
	var num = getSelect("select_goal_main_num");
	window.goal_main_num = num;
	window.goal_all_num = window.goal_main_num * 2 * window.goal_turn;
	getId("goal_all_num").innerText = window.goal_all_num;
	getId("goal_main_num").innerText = num;
	setCookieMin();
}

function setTurn() {
	var num = getSelect("select_goal_turn");
	window.goal_turn = num;
	window.goal_all_num = window.goal_main_num * 2 * window.goal_turn;
	getId("goal_all_num").innerText = window.goal_all_num;
	setCookieMin();
}

function timerStart(timer_btn, timer) {
	btnReset();
	window.clearInterval(interval)
	if (timer == "main") {
		var time = getSelect("next_minutes");
		window.cur_next_time = new Date(1000 * 60 * time);
		getId("next_timer").innerHTML = time + ":" + "00";
	};
	if (timer == "next") {
		var time = getSelect("main_minutes");
		window.cur_main_time = new Date(1000 * 60 * time);;
		getId("main_timer").innerHTML = time + ":" + "00";
	};
	play(timer_btn, timer);

}

function skip(skip) {
	if (skip.id == "skip_main") {
		window.main_num += 1;
		window.all_num += 1;
		if (window.main_num % window.goal_main_num == 0) {
			window.temp_time = window.cur_next_time;
			window.cur_next_time = window.cur_long_time;
			var objS = getId("long_minutes");
			var time = objS.options[objS.selectedIndex].value;
			getId("next_timer").innerHTML = time + ":" + "00";
		}
		timerStart("next_timer_play", "next");
		skip.id = "skip_next";
		document.getElementById("main").className = "next";
		document.getElementById("next").className = "main";
	} else if (skip.id == "skip_next") {
		timerStart("main_timer_play", "main");
		skip.id = "skip_main";
		window.all_num += 1;
		if ((window.main_num % window.goal_main_num == 0) && (window.all_num % window.main_num == 0)) {
			var objS = getId("long_minutes");
		}
		if (window.all_num == goal_all_num) {
			window.all_num = 0;
			window.main_num = 0;
			btnReset();
			window.clearInterval(interval)
			alert("恭喜你！完成了！");
		}
		document.getElementById("main").className = "main";
		document.getElementById("next").className = "next";
	}
	getId("main_num").innerText = window.main_num;
	getId("all_num").innerText = window.all_num;
}

function getId(id) {
	return document.getElementById(id);
}

function btnReset() {
	getId("main_timer_play").style.display = "block";
	getId("main_timer_pause").style.display = "none";
	getId("next_timer_play").style.display = "block";
	getId("next_timer_pause").style.display = "none";
}

function setTimer(timer) {
	if (timer == "long") {
		var objS = getId(timer + "_minutes");
		var time = objS.options[objS.selectedIndex].value;
		window.cur_long_time = new Date(1000 * 60 * time);;
	};
	btnReset();
	window.clearInterval(interval)
	var objS = getId(timer + "_minutes");
	var time = objS.options[objS.selectedIndex].value;
	if (timer == "main") {
		window.cur_main_time = new Date(1000 * 60 * time);
		getId(timer + "_timer").innerHTML = time + ":" + "00";
	};
	if (timer == "next") {
		window.cur_next_time = new Date(1000 * 60 * time);
		getId(timer + "_timer").innerHTML = time + ":" + "00";
	};
	setCookieMin();
}

function play(play_btn, timer) {
	var timer_play = getId(timer + "_timer_play");
	var timer_pause = getId(timer + "_timer_pause");
	if (play_btn == timer + "_timer_play") {
		timer_play.style.display = "none";
		timer_pause.style.display = "block";
		if (timer == "main") {
			window.clearInterval(interval);
			window.interval = setInterval("timer('main')", 1000);
		};
		if (timer == "next") {
			window.clearInterval(interval);
			window.interval = setInterval("timer('next')", 1000);
		};
	} else if (play_btn == timer + "_timer_pause") {
		timer_pause.style.display = "none";
		timer_play.style.display = "block";
		window.clearInterval(interval)
	}
}

function timer(timer) {
	if (timer == "main") {
		var t = window.cur_main_time.getTime();
		t -= 1000; //一个小时的毫秒数
		window.cur_main_time = new Date(t);
		var mm = parseInt(window.cur_main_time / 1000 / 60 % 60, 10); //计算剩余的分钟数  
		var ss = parseInt(window.cur_main_time / 1000 % 60, 10); //计算剩余的秒数  
		mm = checkTime(mm);
		ss = checkTime(ss);
		getId("main_timer").innerHTML = mm + ":" + ss;
		if (mm == 00 & ss == 00) {
			skip(getId("skip_main"));
		}
	} else if (timer == "next") {
		var t = window.cur_next_time.getTime();
		t -= 1000; //一个小时的毫秒数
		window.cur_next_time = new Date(t);
		var mm = parseInt(window.cur_next_time / 1000 / 60 % 60, 10); //计算剩余的分钟数  
		var ss = parseInt(window.cur_next_time / 1000 % 60, 10); //计算剩余的秒数  
		mm = checkTime(mm);
		ss = checkTime(ss);
		getId("next_timer").innerHTML = mm + ":" + ss;
		if (mm == 00 & ss == 00) {
			skip(getId("skip_next"));
		}
	};
}


function checkTime(i) {
	if (i < 10) {
		i = "0" + i;
	}
	return i;
}


// function setTime(interTimes) {
// 	var add_Times = parseInt(interTimes);
// 	var final_time = new Date(Date.parse(cur_main_time) + add_Times);
// 	return function() {
// 		return final_time;
// 	}
// }