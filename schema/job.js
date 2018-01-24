var mongoose = require("mongoose");

var JobSchema = mongoose.Schema({
	userid:String,
	logo:String,
	jobname:String,
	cpname:String,
	jobexp:String,
	jobtype:String,
	jobstr:String,
	salary:String
});

module.exports = JobSchema;