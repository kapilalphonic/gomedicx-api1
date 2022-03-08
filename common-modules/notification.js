const Notification  = require('../models/notification');


module.exports = {
    
    createNotification : async function (data) {
        try{

            let newNotification =   new Notification();      
            newNotification.title  = data.title
            newNotification.description = data.description
            newNotification.module = data.module
            newNotification.userId = data.userId
            newNotification.moduleId = data.moduleId
            newNotification.vendorId = data.vendorId

            return await newNotification.save();
        }catch(err){
            throw err;
        }
    }

}