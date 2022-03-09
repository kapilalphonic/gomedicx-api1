const express = require("express");
const router = express.Router();
const User  = require("../../Models/contact");
const CMS = require("../../common-modules/index");
const langFunction = require("../../common-modules/lang-messages");


/**
 * @function  Admin_Pagin
 * @description API Will be /api/v1/a/contact/pagin
 * @example Admin_Get_Pagin
 */

 router.post('/pagin', async (req, res) => {
    try {
        let userData = req.body;

        let array1 = ['page', 'perPage']
        for (let index = 0; index < array1.length; index++) {
            const element = array1[index];
            if (!userData[element]) {
                return res.status(400).json({
                    "message": element + langFunction('en', 'feildmissing'),
                });
            }
        }

        let startIndex = ((userData.page - 1) * userData.perPage);
        let perPage = parseInt(userData.perPage);
        skipCondition = {
            skip: startIndex,
            limit: perPage,
            sort: {'createdAt':-1}
        };
        let con = {

        }

        if (userData.searchString) {
            con['$or'] = [
                {
                'email': new RegExp(userData.searchString, 'i')
                } ,
                {
                'name': new RegExp(userData.searchString, 'i')
                } 
            ]
        }

        let doc =  await User.find(
            con, {},
            skipCondition  
            )
        let totalCount =  await User.countDocuments(con);
        res.status(200).json({
            "result": doc,
            totalCount,
            "message": langFunction('en', 'success'),
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: langFunction('en', 'servererr')            
        });             
    }
})


/**
 * @function  faq_Insert
 * @description API Will be /api/v1/a/contact/insert
 * @example Admin_Insert
 */

 router.post('/insert', async (req, res) => {
    try {

        let userData = req.body;

        let array1 = ['name', 'status']
        for (let index = 0; index < array1.length; index++) {
            const element = array1[index];
            if (!userData[element]) {
                return res.status(400).json({
                    "message": element + langFunction('en', 'feildmissing'),
                });
            }
        }
    
        
            var newUser = new User();
            newUser.quetion = userData.quetion;
            newUser.answer = (userData.answer);

            newUser.save(function (err, user) {
                if (err) {
                    console.log(err)
                    res.status(400).json({
                         "message": err
                    })
                } else {
                    res.status(200).json({
                        message: langFunction('en', 'newcontact'),
                        "data": user,
                    });
                }
            })
    } catch (error) {
            console.error(error);
            res.status(500).json({
                message: langFunction('en', 'servererr'),
            });
    } 
});



/**
 * @function  Get_User_BY_Id
 * @description API Will be /api/v1/a/contact/:id
 * @example Get_User_BY_Id
 */

 router.get('/:id', async (req, res) => {
    try {
        let data = await User.findOne({
            _id: req.params.id
        })
        if (data) {
            res.status(200).json({
                message: langFunction('en', 'success'),
                "name": data,
            });
        } else {
            res.status(400).json({
                message: langFunction('en', 'usernotfound'),
            });
        }
 } catch (error) {
        console.error(error);
        res.status(500).json({
            message: langFunction('en', 'servererr'),
        });
    } 
});

module.exports = router;
