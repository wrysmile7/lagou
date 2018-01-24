var mongoose = require("mongoose");

//创建schema ：文档集合的映射 

var UserSchema = mongoose.Schema({
      username:String,
      pwd:String,
      email:String
})

module.exports =  UserSchema