var mongoose = require("mongoose");

var UserSchema = require('../schema/user');

//生成model，model才具有数据库操作能力
//集合名必须是复数

var User = mongoose.model('users',UserSchema);


module.exports = User;