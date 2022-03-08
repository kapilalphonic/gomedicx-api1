const express = require("express");
const router = express.Router();
const Specialty = require("../../Models/specialty");
const CMS = require("../../common-modules/index");
const langFunction = require("../../common-modules/lang-messages");

/**
 * @function  Admin_Pagin
 * @description API Will be /api/v1/a/specialty/pagin
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
 * @function  specialty_Insert
 * @description API Will be /api/v1/admin/specialty/insert
 * @example Admin_Insert
 */

 router.post('/insert', async (req, res) => {
    try {

        let userData = req.body;

        let array1 = ['name', 'email', 'password']
        for (let index = 0; index < array1.length; index++) {
            const element = array1[index];
            if (!userData[element]) {
                return res.status(400).json({
                    "message": element + langFunction('en', 'feildmissing'),
                });
            }
        }
    
       
            var newSpecilty = new Specialty();
            newSpecilty.name = userData.name;
            newSpecilty.status = userData.status;

            newSpecilty.save(function (err, user) {
                if (err) {
                    console.log(err)
                    res.status(400).json({
                         "message": err
                    })
                } else {
                    res.status(200).json({
                        message: langFunction('en', 'newspecialty'),
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
 * @function  Admin_Update
 * @description API Will be /api/v1/a/diagnosis/update/:id
 * @example Admin_Update
 */

 router.post('/update/:id', async (req, res) => {
    try {
        let userData = req.body;
        if (Object.keys(req.body).length === 0) {
            res.status(400).json({
                message: langFunction('en', 'updatedatamissing'),
            });
        } else {
            User.findOne({
                _id: req.params.id
            }, function (err, data) {
                if (data) {
                    if (userData.name) {
                        // data.email = userData.email
                    }
                    if (userData.status) {
                        data.name = userData.name
                    }
                    
                    data.name = userData.name;
                    data.status = userData.status;
                    data.save(function (err) {
                        if (err) {
                            var error = getErrorMessage(err)
                            res.status(400).json({
                                "message": error,
                            });
                        } else {
                            res.status(200).json({
                                message: langFunction('en', 'updatespecialty'),
                                "name": data,
                            });
                        }
                    });
                } else {
                    res.status(400).json({
                        message: langFunction('en', 'usernotfound'),
                    });
                }
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: langFunction('en', 'servererr'),
        });
    } 
});


/**
 * @function  Get_User_BY_Id
 * @description API Will be /api/v1/a/specialty/:id
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