var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var Schema = mongoose.Schema;

/**
 * Recommended  Schema
 */

var FaqSchema = new Schema({
    quetion : {type : String},
    answer : {type : String },
}, {
	timestamps: {
		createdAt: 'createdAt',
		updatedAt: 'updatedAt'
	}
});

module.exports = mongoose.model("faq", FaqSchema); 