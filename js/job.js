$(function(){
	var $user_title = $("#user_title"),$job_list = $("#job_list"),$showImg = $("#showImg"),$jobname = $("#jobname"),
		$cpname = $("#cpname"),$jobexp = $("#jobexp"),$jobtype = $("#jobtype"),$jobstr = $("#jobstr"),$salary = $("#salary"),
		$addclose = $("#addclose"),$add_btn = $("#add_btn"),$update_btn = $("#update_btn"),$tip = $("#tip");
	
	var storage=window.localStorage;
	//判断用户是否登录
	var cookie_username = $.cookie("username"),
		cookie_userid = $.cookie("userid");
	$user_title.text(cookie_username).attr('data-id', cookie_userid);
	if($user_title.text()){
		$("#login").hide();
	 	$("#regist").hide();
	 	$("#off").show();
	}else{
		alert("请先登录！");
	    location = "/index.html";
	}
	if(cookie_userid == "5a669663fb35e015ac3c1248"){
 		$("#admin").show();
 	}

	//用户注销
	$("#off").on('click', function(){
	    $.cookie("username","",{path:'/'});
	    alert("用户已退出登录！");
	    location = "/index.html";
	    storage.pages = 1;
	});

	
	//定义全局变量
	var user_id = {};
	user_id.userid = $user_title.attr('data-id');
	user_id.page = storage.pages;


	pageload();
	loadjob(user_id);

	//加载职位列表函数
	function loadjob(user_id){
		$.post('/api/joblist',user_id, function(data){
			// console.log(data);
			var html = template('listTemp',data);
			$job_list.append(html);
			shp();
		}).then(function(){
			index(storage.pages);
		});	
	}
	
	//空空如也判断函数
	function shp(){
		if($job_list.find('.add_').length == 0){
			$tip.show();
		}else{
			$tip.hide();
		}
	}

	//单击翻页查询渲染页面函数
	function pageload(){
		$.post('/api/jobnum',user_id, function(data){
			var nums = data.num;
			$('.M-box1').pagination({
			    totalData: nums,
			    showData: 5,
			    coping: true,
			    isHide:true,
			    pageCount:1,
			    current : storage.pages,
			    callback: function (api) {
			    	$job_list.find('.add_').remove();
			    	user_id.page = api.getCurrent();			    	
			    	storage.pages = api.getCurrent();
			       	loadjob(user_id);
			    }
			});
		});
	}
	
	
	//序号
	function index(pag){
		var len = $('.add_').length;
		for(let i = 0; i < len; i++){
			// console.log(i);
			$($('.add_')[i]).find('.num').text(i+1+(pag-1)*5);
		}
	}


	//点击添加按钮是将模态框初始化
	$(".tj").click(function(){
		$("form").find("input").val('');
		$showImg.attr('src','');
		$update_btn.hide();
		$add_btn.show();
	});

	//图片上传
	$("#InputFile").on('change', function(event) {
    	event.preventDefault();
    	//判断用户上传的是否为图片
    	var file = this.files[0];
    	if(file.type=="image/png"||file.type=="image/jpeg"){
    		//开始上传
    		var form = new FormData();//返回一个假的form对象
    		form.append('upload',file);
    		$.ajax({
    			url:'/upload',
    			type:'POST',
    			dataType:'json',
    			data:form,
    			contentType:false,//发送信息到服务器的内容类型，告诉jq不要去设置Content-Type请求头，默认是application/x-www-form-urlencoded(dorm类型)
    			processData:false//processData是jq独有的参数，用于对data参数进行序列化处理，默认值是true，所谓序列化就是比如{width:1680, height:1050}参数对象序列化为width=1680&height=1050这样的字符串
    		})
    		.done(function(res){
    			// console.log(res);
    			if(!res.code){
    				$showImg.attr({
    					src:res.img
    				});
    			}
    		});
    	}
    });



	//职位添加
	$add_btn.on('click', function(event) {
		event.preventDefault();
		var lists = {};
		lists.userid = $user_title.attr('data-id');
		lists.logo = $showImg.attr('src');
		lists.jobname = $jobname.val().trim();
		lists.cpname = $cpname.val().trim();
		lists.jobexp = $jobexp.val().trim();
		lists.jobtype = $jobtype.val().trim();
		lists.jobstr = $jobstr.val().trim();
		lists.salary = $salary.val().trim();
		// console.log(lists);
		if(lists.jobname == ""){
			alert('职位名称不能为空');
		}else{
			if (lists.cpname == ""){
				alert('公司名称不能为空');
			}else{
				if(lists.jobstr == ""){
					alert('工作地点不能为空');
				}else{
					$.post('/api/job', lists, function(res){
						if($('.add_').length < 5){
							var trd = template("listTemp",{list:[res.job]});
							$job_list.append(trd);	
						}else{
							pageload();
						}
					}).then(function(){
						index(storage.pages);
						shp();
					});
					$showImg.attr('src','');
					$("form").find("input").val('');
					$addclose.click();
				}
			}
		}
	});

	//职位删除
	$job_list.on('click','.del', function(event){
		event.preventDefault();
		var del = {};
		del._id = $(this).attr('data-id');
		$.post('/api/del',del,function(data){
			// console.log(data);
		});			
		if($(".add_").length == 1){
			$job_list.find('.add_').remove();
			if(storage.pages == 1){
				storage.papges ==1
			}else{
				storage.pages -= 1;
			}			
			user_id.page = storage.pages;
			loadjob(user_id);
			pageload();
		}else{
			$job_list.find('.add_').remove();
			user_id.page = storage.pages;
			loadjob(user_id);
		}
	});

	//职位修改
	$job_list.on('click','.update', function(event){
		event.preventDefault();
		var _upd = $(this).parent(),
			id = $(this).attr('data-id'),
			logo = _upd.siblings('td').find('img').attr('src'),
			jobname = _upd.siblings('.jobname').text(),
			cpname = _upd.siblings('.cpname').text(),
			jobexp = _upd.siblings('.jobexp').text(),
			jobtype = _upd.siblings('.jobtype').text(),
			jobstr = _upd.siblings('.jobstr').text(),
			salary = _upd.siblings('.salary').text();
		$add_btn.hide();
		$update_btn.show().attr('data-id',id);
		$showImg.attr('src',logo);
		$jobname.val(jobname);
		$cpname.val(cpname);
		$jobexp.val(jobexp);
		$jobtype.val(jobtype);
		$jobstr.val(jobstr);
		$salary.val(salary);
	});

	//职位修改提交
	$update_btn.on('click', function(event) {
		event.preventDefault();
		var lists = {};
		lists._id = $(this).attr('data-id');
		lists.logo = $showImg.attr('src');
		lists.jobname = $jobname.val().trim();
		lists.cpname = $cpname.val().trim();
		lists.jobexp = $jobexp.val().trim();
		lists.jobtype = $jobtype.val().trim();
		lists.jobstr = $jobstr.val().trim();
		lists.salary = $salary.val().trim();
		// console.log(lists);
		if(lists.jobname == ""){
			alert('职位名称不能为空');
		}else{
			if (lists.cpname == ""){
				alert('公司名称不能为空');
			}else{
				if(lists.jobstr == ""){
					alert('工作地点不能为空');
				}else{
					$.post('/api/update', lists, function(data){
						// console.log(data);
					});
					$job_list.find('.add_').remove();
					user_id.page = storage.pages;
					loadjob(user_id);
					$addclose.click();
				}
			}
		}
	});
});