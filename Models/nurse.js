var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var Schema = mongoose.Schema;

/**
 * Nurse  Schema
 */

var NurseSchema = new Schema({
    name: { type: String },
    email: { type: String },
	phone: { type: String },
    nurse_id: {type : String},
    dob: {type: String},
    gender: {type: String},
    exp: {type: Number},
    image: { type: Schema.Types.ObjectId, ref: 'Image' },
    address: {type: String},
    pincode: {type: Number},
    city: {type: String},
    state: {type: String},
    status: { type: Boolean, default: false },
}, {
	timestamps: {
		createdAt: 'createdAt',
		updatedAt: 'updatedAt'
	}
});

module.exports = mongoose.model("Nurse", NurseSchema);