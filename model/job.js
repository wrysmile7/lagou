var mongoose = require("mongoose");

var JobSchema = require("../schema/job");

var Job = mongoose.model('jobs',JobSchema);

module.exports = Job;