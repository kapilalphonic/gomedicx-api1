const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../../Models/admin');
const config = require('../../common-modules/config');
const langFunction =  require('../../common-modules/lang-messages');


/**
 * @function  Admin_Insert
 * @description API Will be /api/v1/admin/insert
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
                    "message": langFunction('en', 'accountcreatealready')
                });
            }
        
            var newUser = new User();
            newUser.email = userData.email;
            newUser.password = passwordHash.generate(userData.password);
            newUser.name = userData.name;
            newUser.phone = userData.phone;
            newUser.userImage = userData.userImage;

            newUser.save(function (err, user) {
                if (err) {
                    console.log(err)
                    res.status(400).json({
                         "message": err
                    })
                } else {
                    delete user._doc.password
                    res.status(200).json({
                        message: langFunction('en', 'newadmin'),
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
})



/**
 * @function  Get_User_BY_Id
 * @description API Will be /api/v1/a/users/:id
 * @example Get_User_BY_Id
 */

 router.get('/get/:id', async (req, res) => {
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
})


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
                        data.email = userData.email
                    }
                    if (userData.name) {
                        data.name = userData.name
                    }
                    if (userData.phone) {
                        data.phone = userData.phone
                    }
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
})


/**
 * @function  Admin_Pagin
 * @description API Will be /api/v1/admin/pagin
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
 * @function  API_ChangeOwnPassword
 * @description API Will be /api/v1/a/change_password
 * @example API_ChangeOwnPassword
 */

router.post('/change_password', async (req, res) => {
    try {
        let userData = req.body;

        let array1 = ['password', 'confirmPassword']
        for (let index = 0; index < array1.length; index++) {
            const element = array1[index];
            if (!userData[element]) {
                return res.status(400).json({
                    "message": element + langFunction('en', 'feildmissing'),
                });
            }
        }

        if(userData.password !== userData.confirmPassword){
            return res.status(400).json({
                "message": langFunction('en', 'confirmpassword')
            }); 
        }
        let user = await User.findOne({ _id: req.doc.id })
        const salt = await bcrypt.genSalt(10);
        if(user) {
            user.password = await bcrypt.hash(userData.password, salt); // passwordHash.generate(userData.password);
            user.save();
            res.status(200).json({
                "message": langFunction('en', 'passupdated'),
                "data": user,
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
})


/**
 * @function  API_ChangeOtherPassword
 * @description API Will be /api/v1/a/change_other_password/:id
 * @example API_ChangeOtherPassword
 */

 router.post('/change_other_password/:id', async (req, res) => {
    try {
        let userData = req.body;

        let array1 = ['password', 'confirmPassword']
        for (let index = 0; index < array1.length; index++) {
            const element = array1[index];
            if (!userData[element]) {
                return res.status(400).json({
                    "message": element + langFunction('en', 'feildmissing'),
                });
            }
        }

        if(userData.password !== userData.confirmPassword){
            return res.status(400).json({
                "message": langFunction('en', 'confirmpassword')
            }); 
        }
        let user = await User.findOne({ _id: req.params.id })
        if(user) {
            user.password = passwordHash.generate(userData.password);
            user.save();
            return res.status(200).json({
                "message": langFunction('en', 'passupdated'),
                "data": user,
            });
        } else {
            return res.status(400).json({
                message: langFunction('en', 'usernotfound'),
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: langFunction('en', 'servererr'),
        });
    } 
})




/**
 * @function  API_refresh_token
 * @description API Will be /api/v1/a/token/refresh
 * @example API_token_refresh
 */

 router.get('/token/refresh', async (req, res) => {
    try {
        var payLoadNew = {
            id: req.doc.id,
          };
          var tokenNew = jwt.sign(payLoadNew, process.env.ADMIN_KEY, {
            expiresIn: "24h" // expires in 1 Day
          });
          res.json({token:tokenNew});
         
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: langFunction('en', 'servererr'),
        });
    } 
})


module.exports = router;