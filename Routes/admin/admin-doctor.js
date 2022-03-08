const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../../Models/doctor');
const config = require('../../common-modules/config');
const langFunction =  require('../../common-modules/lang-messages');

/**
 * @function  Admin_Pagin
 * @description API Will be /api/v1/a/nurse/pagin
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
 * @function  Nurse_Insert
 * @description API Will be /api/v1/admin/nurse/insert
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
    
        if (!config.emailvalidator(userData.email)) {
            return res.status(400).json({
                "message": langFunction('en', 'emailnotmatch')
            })
        }

        if (!config.phonenumbervalidator(userData.phone)) {
            return res.status(400).json({
                "message": langFunction('en', 'phonenotmatch')
            })
        }

        let user =  await User.findOne({
            email: userData.email
            }).select("+password");
            if (user) {
                return res.status(400).json({
                    "message": langFunction('en', 'dracccreatealready')
                });
            }
            
            let totalCount =  await User.countDocuments();
            const salt = await bcrypt.genSalt(10);
            var newUser = new User();
            newUser.name = userData.name;
            newUser.email = userData.email;
            newUser.phone = userData.phone;
            newUser.nurse_id = totalCount+1;
            newUser.password = await bcrypt.hash(userData.password, salt); // passwordHash.generate(userData.password);
            // newUser.image = userData.userImage;
            newUser.dob = userData.dob;
            newUser.gender = userData.gender;
            newUser.exp = userData.exp;
            newUser.address = userData.address;
            newUser.pincode = userData.pincode;
            newUser.city = userData.city;
            newUser.state = userData.state;
            newUser.status = true;

            newUser.save(function (err, user) {
                if (err) {
                    console.log(err)
                    res.status(400).json({
                         "message": err
                    })
                } else {
                    delete user._doc.password
                    res.status(200).json({
                        message: langFunction('en', 'newdoctor'),
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
 * @description API Will be /api/v1/a/update/:id
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
                    if (userData.email) {
                        // data.email = userData.email
                    }
                    if (userData.name) {
                        data.name = userData.name
                    }
                    if (userData.phone) {
                        // data.phone = userData.phone
                    }
                    data.dob = userData.dob;
                    data.gender = userData.gender;
                    data.exp = userData.exp;
                    data.address = userData.address;
                    data.pincode = userData.pincode;
                    data.city = userData.city;
                    data.state = userData.state;
                    data.status = userData.status;
                    data.save(function (err) {
                        if (err) {
                            var error = getErrorMessage(err)
                            res.status(400).json({
                                "message": error,
                            });
                        } else {
                            res.status(200).json({
                                message: langFunction('en', 'dataupdated'),
                                "data": data,
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
 * @description API Will be /api/v1/a/users/:id
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
                "data": data,
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