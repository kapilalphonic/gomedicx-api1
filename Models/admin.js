var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var Schema = mongoose.Schema;

/** 
 * @module Admin_Schema 
 */

var UserSchema = new Schema({
    name: {
		type: String
	},
	email: {
		type: String
	},
	password: {
		type: String,
		select: false
	},
	phone: {
		type: String,
	},
	userImage: { type: Schema.Types.ObjectId, ref: 'Image' },
	balance: {type: Number, default: 0},
}, {
	timestamps: {
		createdAt: 'createdAt',
		updatedAt: 'updatedAt'
	}
});

module.exports = mongoose.model('Admin', UserSchema); 
