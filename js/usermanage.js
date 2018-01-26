$(function(){
	var $user_title = $("#user_title"),$user_list = $("#user_list"),$job_list = $("#job_list"),$userid = $("#userid"),$username = $("#username"),
	$pwd = $("#pwd"),$email = $("#email");

	var storage=window.localStorage;
	//判断用户是否登录
	function redcookie(){
		var cookie_username = $.cookie("username"),
			cookie_userid = $.cookie("userid");
		$user_title.text(cookie_username).attr('data-id', cookie_userid);
		if($user_title.text()){
			$("#login").hide();
		 	$("#regist").hide();
		 	$("#off").show();
		}else{
			alert("请先登录！");
			storage.pages = 1;
		    location = "/index.html";
		}
	}
	redcookie();

	//用户注销
	$("#off").on('click', function(){
	    $.cookie("username","",{path:'/'});
	    alert("用户已退出登录！");
	    location = "/index.html";
	});

	//加载用户列表
	function loaduser(){
		$.get('/api/userlist', function(data){
			// console.log(data);
			var html = template('listTemp',data);
			$user_list.append(html);
		}).then(function(){
			var len = $user_list.find('.add_user');
			for(let i = 0; i < len.length; i++){
				if($(len[i]).find('.userid').text() == "5a669663fb35e015ac3c1248"){
					$(len[i]).remove();
				}
			}
		});
		
	}
	loaduser();
	
	//搜索用户
	$("#search_btn").on('click',function(event){
		event.preventDefault();
		$user_list.find('.add_user').remove();
		var search_text = {};
		search_text.username = $("#search_box").val().trim();
		$.post('/api/usersearch', search_text, function(data) {
			var html = template('listTemp',data);
			$user_list.append(html);
		});
	});

	//删除用户列表
	$user_list.on('click','.del', function(event){
		event.preventDefault();
		var pamars = {};
		pamars._id = $(this).parent().siblings('.userid').text();
		$.post('/api/userdel',pamars, (data)=>{
			// console.log(data);
			$(this).parent().parent().remove();
		});
	});

	//修改按钮事件
	$user_list.on('click','.update', function(){
		var _id = $(this).parent().siblings('.userid').text(),
			username = $(this).parent().siblings('.username').text(),
			email = $(this).parent().siblings('.useremail').text();
		$("#userid").val(_id);
		$("#username").val(username);
		$("#email").val(email);
	});


	//修改用户信息
	$("#update_btn").on('click', function(event){
		event.preventDefault();
		var pamars = {};
		pamars._id = $userid.val().trim();
		pamars.pwd = $pwd.val().trim();
		pamars.email = $email.val().trim();

		if(!pamars.email){
			alert("邮箱不能为空");
			return
		}

		var reg = /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/;
		if(!reg.test(pamars.email)){
			alert("邮箱格式不正确！");
			return
		}

		$.post('/api/userupdate',pamars, function(data){
			// console.log(data);
			$user_list.find('.add_user').remove();
			loaduser();
			$("#addclose").click();
		});
	});


	//点击展开职位列表
	$user_list.on('click', '.down', function(event) {
		event.preventDefault();
		$(".up").hide();
		$(".down").show();
		$job_list.hide();
		$(".add_").remove();
		$(this).siblings('.up').show();
		$(this).hide();
		var pamars = {};
		pamars.userid = $(this).parent().siblings(".userid").text();
		$.post('/api/joblist',pamars, (data)=>{
			// console.log(data);
			var html = template('joblistTemp',data);
			$job_list.append(html);
			var aaa = $job_list;
			$(this).parent().parent().after(aaa);
			$job_list.show();
		});
	});

	//点击收起职位列表
	$user_list.on('click', '.up', function(event) {
		event.preventDefault();
		$(this).siblings('.down').show();
		$(this).hide();
		$job_list.hide();
		$(".add_").remove();
	});

});
