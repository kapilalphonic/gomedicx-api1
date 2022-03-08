var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var Schema = mongoose.Schema;

/**
 * Medicines Schema
 */

var MedicineSchema = new Schema({
  
    name: { type : String },
    description: { type : String },
    price: { type : Number },
    status : {type : Boolean, default : false},

},{
    timestamps:{
        createdAt: 'createdAt',
        updatedAt: 'updatedAt',
    }
});

module.exports = mongoose.model("medicine", MedicineSchema );