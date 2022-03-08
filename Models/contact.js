var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var Schema = mongoose.Schema;

/**
 * Nurse  Schema
 */

var ContactSchema = new Schema({
    address: {type: String},
    pincode: {type: Number},
    city: {type: String},
    state: {type: String},
	phone: { type: String },
    email: { type: String },
}, {
	timestamps: {
		createdAt: 'createdAt',
		updatedAt: 'updatedAt'
	}
});

module.exports = mongoose.model("contact", ContactSchema);