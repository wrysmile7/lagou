
$(function(){
	//打开页面是求情一次看是否是从职位管理页面回来的
	// $.get('/api/zxlg', function(data){
	// 	console.log(data);
	// });

	var storage=window.localStorage;
	//读取cookie
	var cookie_username = $.cookie("username"),
		cookie_userid = $.cookie("userid"),
		$user_title = $("#user_title");
	$user_title.text(cookie_username).attr('data-id', cookie_userid);;
	if($user_title.text()){
		$("#login").hide();
	 	$("#regist").hide();
	 	$("#off").show();
	}else{
		storage.pages = 1;
	}
	if(cookie_userid == "5a669663fb35e015ac3c1248" && $user_title.text() == "admin"){
 		$("#admin").show();
 	}else{
 		$("#admin").hide();
 	}

	//用户注册
	$("#rs_btn").on('click', function(){
		var pamars = {};
		pamars.username = $("#rsname").val().trim();
		pamars.pwd = $("#rspwd").val().trim();
		pamars.email = $("#rsemail").val().trim();
		if (!pamars.username) {
			 alert("用户名不能为空！");
			 return
		};

		if (!pamars.pwd) {
			 alert("密码不能为空！");
			 return
		};

        if (pamars.pwd != $("#rsrepwd").val().trim()) {
            alert("密码不一致！");
            return
        };

        if (!pamars.email) {
			 alert("邮箱不能为空！");
			 return
		};

		var reg = /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/;
		if(!reg.test(pamars.email)){
			alert("邮箱格式不正确！");
			return
		}

	    $.post('/api/regist', pamars, function(data) {
	    	 // console.log(data);
	    	 if (!data.code) {
	    	 	var userid = data.doc._id;
	    	 	$.cookie("username",pamars.username,{path:'/'});
	    	 	$.cookie("userid",userid,{path:'/'});
	    	 	$("#rsclose").click();
	    	 	$("#login").hide();
	    	 	$user_title.text(pamars.username).attr('data-id', userid);
	    	 	$("#regist").hide();
	    	 	$("#off").show();
	    	 	if(userid == "5a669663fb35e015ac3c1248"){
	    	 		$("#admin").show();
	    	 	}
	    	 }else{
	    	 	alert(data.msg);
	    	 };
	    });
	});

	//用户注销
	$("#off").on('click', function(){
		$user_title.text('');
		$("#login").show();
	    $("#off").hide();
	    $("#regist").show();
	    $.cookie("username","",{path:'/'});
	    $("#admin").hide();
	    location = "/index.html";
	});

	//打开登录模态框事件
	$("#login").click(function(){
	    $("#lgpwd").val('');
	});

	//用户登录
	$("#lg_btn").on('click',function(event) {
		event.preventDefault();
		var pamars = {};
		pamars.username = $("#lgname").val().trim();
		pamars.pwd = $("#lgpwd").val().trim();

	    $.post('/api/login', pamars, function(data) {
	    	 // console.log(data);
	    	 if (!data.code) {
	    	 	var userid = data.doc[0]._id;
	    	 	$.cookie("username",pamars.username,{path:'/'});
	    	 	$.cookie("userid",userid,{path:'/'});
                $("#lgclose").click();
	    	 	$("#login").hide();
	    	 	$user_title.text(pamars.username).attr('data-id', userid);
	    	 	$("#regist").hide();
	    	 	$("#off").show();
	    	 	if(userid == "5a669663fb35e015ac3c1248"){
	    	 		$("#admin").show();
	    	 	}
	    	 }else{
	    	 	alert(data.msg);
	    	 }
	    });
	});
});