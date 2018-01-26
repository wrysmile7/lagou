var express = require('express'),
	bodyParser = require('body-parser'),
	mongoose = require('mongoose'),
	upload = require("./util/upload");

//连接数据库
mongoose.Promise = global.Promise;//node下面没有window，全局是global
mongoose.connect("mongodb://127.0.0.1:27017/lagou")//为了兼容老的mongodb连接，加了以后mongoose会帮我们增加很多配置
		.then(function(db){
			console.log("数据库连接成功！");
		});

var app = express();
// app.use(express.static("js"));//静态资源路径
app.use(express.static("./"));
// app.use(express.static("static"));
app.use(express.static("uploadcache"));

//导入model
var User = require('./model/user'),
	Job = require('./model/job.js');

//使用插件
app.use(bodyParser.json())//处理post请求的参数为json格式
app.use(bodyParser.urlencoded({ //处理post请求为form表单格式
   extended: true
}));

//处理用户注册
app.post('/api/regist',function(req, res) {
	//将获取到的数据存入到数据库
	let{username,pwd,email} = req.body;
	var u = new User({
		username,
		pwd,
		email
	});
	User.find({username},function(err,doc){
		if(doc.length){
			res.json({
				code:1,
				msg:"用户名已存在"
			});
			return
		}else{
			u.save(function(err,doc){
				if(err){					
					console.log(err);
					return
				}
				res.json({
					code:0,
					doc:doc
				});
			});
		}
	});
});

//处理用户登录
app.post('/api/login',function(req, res) {
	//查询数据库中用户是否存在
	let{username,pwd} = req.body;
	User.find({username},function(err,doc){
		if(doc.length){
			if(doc[0].pwd != pwd){
				res.json({
					code:1,
					msg:"密码错误"
				});
				return
			}
			res.json({
				code:0,
				doc:doc
			});
		}else{
			res.json({
				code:1,
				msg:"用户名不存在"
			});
		}
	});
});

//图片上传
app.post('/upload',function(req,res){
	upload.upload(req,res);
});

//处理职位添加
app.post('/api/job', function(req,res){
	let{userid,logo,jobname,cpname,jobexp,jobtype,jobstr,salary} = req.body;
	var j = new Job({
		userid,
		logo,
		jobname,
		cpname,
		jobexp,
		jobtype,
		jobstr,
		salary
	});
	j.save({new:true},function(err,doc){
		if (err) {
			console.log(err);
			return;
		}
		res.json({
			code:0,
			job:doc
		});
	});
});

//职位列表渲染
app.post('/api/joblist', function(req,res){
	let {userid,page} = req.body;
	if(userid == "5a669663fb35e015ac3c1248"){
		Job.find({},null, {skip: (page-1)*5, limit: 5}, function(err,doc){
			if (err) {
				return
			}
			res.json({
				code:0,
				list:doc
			});
		});
		return
	}
	Job.find({userid},null, {skip: (page-1)*5, limit: 5}, function(err,doc){
		if (err) {
			return
		}
		res.json({
			code:0,
			list:doc
		});
	});
});

//职位数量统计
app.post('/api/jobnum', function(req,res){
	let {userid} = req.body;
	if(userid == "5a669663fb35e015ac3c1248"){
		Job.count({},function(err,num){
			res.json({
				code:0,
				num:num
			});
		});
		return
	}
	Job.count({userid},function(err,num){
		res.json({
			code:0,
			num:num
		});
	});
});

//职位删除
app.post('/api/del', function(req,res){
	let {_id} = req.body;
	Job.remove({_id:_id}, function(err,doc){
		if (err) {
			console.log(err);
			return
		}
		res.json({
			code:0,
			msg:"删除成功"
		});
	});
});

//职位修改
app.post('/api/update', function(req,res){
	let {_id,logo,jobname,cpname,jobexp,jobtype,jobstr,salary} = req.body;
	Job.findOneAndUpdate({_id},{$set:{logo,jobname,cpname,jobexp,jobtype,jobstr,salary}},{new:true}, function(err, doc){
		if (err) {
			console.log(err);
			return
		}
		res.json({
			code:0,
			msg:"修改成功"
		});
	});
});

//用户列表渲染
app.get('/api/userlist', function(req,res){
	User.find({},function(err,doc){
		if (err) {
			return
		}
		res.json({
			code:0,
			userlist:doc
		});
	});
});


//用户搜索
app.post('/api/usersearch', function(req,res){
	let {username} = req.body;
	User.find({username},function(err,doc){
		if (err) {
			return
		}
		res.json({
			code:0,
			userlist:doc
		});
	});
});

//用户删除
app.post('/api/userdel', function(req,res){
	let {_id} = req.body;
	User.remove({_id}, function(err,doc){
		if (err) {
			console.log(err);
			return
		}
		res.json({
			code:0,
			msg:"删除成功"
		});
	});
});

//用户信息修改
app.post('/api/userupdate', function(req,res){
	let {_id,pwd,email} = req.body;
	if(pwd == ""){
		User.findOneAndUpdate({_id},{$set:{email}},{new:true}, function(err,doc){
			if (err) {
				console.log(err);
				return
			}
			res.json({
				code:0,
				doc:doc
			});	
		});
		return
	}
	User.findOneAndUpdate({_id},{$set:{pwd,email}},{new:true}, function(err,doc){
		if (err) {
			console.log(err);
			return
		}
		res.json({
			code:0,
			doc:doc
		});
	});
});




app.listen(8888,function(){
	console.log("启动成功！")
});