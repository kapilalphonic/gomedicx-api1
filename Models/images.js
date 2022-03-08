var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var Schema = mongoose.Schema;
/** 
 * @module Image_Schema 
 */

var ImageSchema = new Schema({
    name : {type : String},
    size:  {type : String},
    type:  {type : String}, 
    encoding :  {type : String},
    path :  {type : String}
}, {
	timestamps: {
		createdAt: 'createdAt',
		updatedAt: 'updatedAt'
	}
});

module.exports = mongoose.model('Image', ImageSchema);
