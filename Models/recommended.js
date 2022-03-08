var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var Schema = mongoose.Schema;

/**
 * Recommended  Schema
 */

var RecommendedSchema = new Schema({
    name : {type : String},
    status : {type : Boolean, default : false}
}, {
	timestamps: {
		createdAt: 'createdAt',
		updatedAt: 'updatedAt'
	}
});

module.exports = mongoose.model("recommended", RecommendedSchema); 