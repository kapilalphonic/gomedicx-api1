var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var Schema = mongoose.Schema;

/**
 * Customer / Patient Schema
 */

 var CustomerSchema = new Schema({
    name: { type: String },
    // address: [{ type: Schema.Types.ObjectId, ref: 'Address'}],
    email: { type: String },
	phone: { type: String },
    customer_id: {type : String},
    dob: {type: String},
    gender: {type: String},
    aadhar: {type:Number},
    address: {type: String},
    pincode: {type: Number},
    city: {type: String},
    state: {type: String},
    blood_group: {type: String},
    password: { type: String, select: false },
    image: { type: Schema.Types.ObjectId, ref: 'Image' },
    status: { type: Boolean, default: false },
    isPhoneVerified: { type: Boolean, default: false},
    isEmailVerified: { type: Boolean, default: false },
 }, {
	timestamps: {
		createdAt: 'createdAt',
		updatedAt: 'updatedAt'
	}
});

module.exports = mongoose.model('Customer', CustomerSchema);