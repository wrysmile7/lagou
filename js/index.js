
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
	}
	if(cookie_userid == "5a669663fb35e015ac3c1248" && $user_title.text() == "admin"){
 		$("#admin").show();
 	}else{
 		$("#admin").hide();
 	}
	//用户注册
	$("#rs_btn").on('click', function(){
		var params = {};
		params.username = $("#rsname").val().trim();
		params.pwd = $("#rspwd").val().trim();
		params.email = $("#rsemail").val().trim();
		if (!params.username||!params.pwd ) {
			 alert("不能为空！");
			 return
		};

        if (params.pwd != $("#rsrepwd").val().trim()) {
            alert("密码不一致！");
            return
        };

	    $.post('/api/regist', params, function(data) {
	    	 // console.log(data);
	    	 if (!data.code) {
	    	 	var userid = data.doc._id;
	    	 	$.cookie("username",params.username,{path:'/'});
	    	 	$.cookie("userid",userid,{path:'/'});
	    	 	$("#rsclose").click();
	    	 	$("#login").hide();
	    	 	$user_title.text(params.username).attr('data-id', userid);
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
	    storage.pages = 1;
	});

	//打开登录模态框事件
	$("#login").click(function(){
	    $("#lgpwd").val('');
	});

	//用户登录
	$("#lg_btn").on('click',function(event) {
		event.preventDefault();
		var params = {};
		params.username = $("#lgname").val().trim();
		params.pwd = $("#lgpwd").val().trim();

	    $.post('/api/login', params, function(data) {
	    	 // console.log(data);
	    	 if (!data.code) {
	    	 	var userid = data.doc[0]._id;
	    	 	$.cookie("username",params.username,{path:'/'});
	    	 	$.cookie("userid",userid,{path:'/'});
                $("#lgclose").click();
	    	 	$("#login").hide();
	    	 	$user_title.text(params.username).attr('data-id', userid);
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