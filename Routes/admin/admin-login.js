const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const CM = require('../../common-modules/index')
// const passwordHash = require('password-hash');
const User = require('../../Models/admin');
const bcrypt = require('bcryptjs');


/**
 * @function  Admin_Login
 * @description API Will be /api/v1/a/login 
 * @example Admin_Login
 */
 router.post('/login', async (req, res) => {
    try {
        
    let userData = req.body;
    
    let array1 = ['email','password']
    for (let index = 0; index < array1.length; index++) {
        const element = array1[index];
        if (!userData[element]) {
            return res.status(400).json({
                "message": element + langFunction('en', 'feildmissing'),
            });
        }
    }

    if (!CM.Config.emailvalidator(userData.email)) {
        return res.status(400).json({
            "message": langFunction('en', 'emailnotmatch')
        })
    }
    
    let responseBody = {
        "name": "",
        "_id":'',
        "phone": "",
        "email": "",
        "userImage": "",
        "message": "",
        "token": ""
    }
    let user =  await User.findOne({
        email: userData.email
        }).select("+password");
        if (!user) {
            return res.status(400).json({
            ...responseBody,
            message: langFunction('en', 'canntfind')
            });
        }
     
        let verify = await bcrypt.compare(userData.password, user.password);
        if(!verify){
            return res.status(400).json({
                message: 'password is wrong!'
            });
        }
        let payLoad = {
            "id": user._id
        };
        let token = jwt.sign(payLoad, process.env.ADMIN_KEY, {
            expiresIn: '24h' // expires in 1 Day
        });
        res.status(200).json({
        ...responseBody,
        "name": user.name,
        "phone": user.phone,
        "email": user.email,
        "_id": user._id,
        "userImage": user.userImage,
        "message":  "Login Success!",
        "token": token
        });
    } catch (error) {
        console.error(error);
        res.status(400).json({
            message: "server error",
        });
    } 
})

module.exports = router;