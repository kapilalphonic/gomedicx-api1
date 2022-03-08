var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var Schema = mongoose.Schema;
/** 
 * @module OtpSchema 
 */


var OtpSchema = new Schema({
    userId: {type: Schema.Types.ObjectId, ref:"user"},
    otp: {type: Number},
    usedfor: {type: String},
    created: {type: Date, default: Date},
    expired: {type: Date, default: Date.now, index: { expires: '15m' }},
  }, {
    timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt'
    }
})

module.exports = mongoose.model('Otp', OtpSchema);
