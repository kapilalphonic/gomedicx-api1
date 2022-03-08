const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
// const passwordHash = require('password-hash');
const Customer = require('../../Models/customer');
// const Card = require('../../models/card');
const CMS = require("../../common-modules/index");
// const Forgetpass = require('../../models/forgotPass');
// const Otp = require('../../models/otp');
// const crypto = require('crypto')
// const Email = require('../../common-modules/email');
const bcrypt = require('bcryptjs');


/**
 * @function  Customer_Signup
 * @description API Will be /api/v1/c/signup
 * @example Customer_Signup
 */

router.post('/signup', async (req, res) => {
    try {

        let customerData = req.body;

        let array1 = ['name', 'email', 'phone', 'code', 'password']
        for (let index = 0; index < array1.length; index++) {
            const element = array1[index];
            if (!customerData[element]) {
                return res.status(400).json({
                    "message": element + CMS.Lang_Messages('en', 'feildmissing'),
                });
            }
        }
    
        if (!CMS.Config.phonenumbervalidator(customerData.phone)) {
            return res.status(400).json({
                "message": CMS.Lang_Messages('en', 'phonenotmatch')
            })
        }

        if (!CMS.Config.emailvalidator(customerData.email)) {
            return res.status(400).json({
                "message": CMS.Lang_Messages('en', 'emailnotmatch')
            })
        }

        if (!CMS.Config.passwordvalidator(customerData.password)) {
            return res.status(400).json({
                "message": CMS.Lang_Messages('en', 'passwordlenght')
            })
        }      

        let customer = await Customer.findOne({
            $or: [{
                    phone: customerData.phone,
                    code: customerData.code
                },
                {
                    email: customerData.email
                }
            ]
        })
        if (customer){
            return res.status(400).json({
                "message": CMS.Lang_Messages('en', 'customeraccountcreatealready')
            })
        }
        const salt = await bcrypt.genSalt(10);
        var newCustomer = new Customer();
        newCustomer.name = customerData.name;
        newCustomer.email = customerData.email;
        newCustomer.phone = customerData.phone;
        newCustomer.code = customerData.code;
        newCustomer.password = await bcrypt.hash(customerData.password, salt); // passwordHash.generate(customerData.password);
        newCustomer.status = 0;
        newCustomer.image = "60ff882a7f89d408f43e5b6c";
        newCustomer.isPhoneVerified = false;
        newCustomer.isEmailVerified = false;
        newCustomer.referralCode = customerData.referralCode;
        newCustomer.device_type = customerData.device_type;
        newCustomer.device_token = customerData.device_token;

        let doc = await newCustomer.save()

        // var newOtp = new Otp();
        // newOtp.userId = doc._id;
        // newOtp.otp = 1234;
        // newOtp.usedfor = "VERIFY-PHONE"
        // await newOtp.save();

        //Create Stripe account
        // const customerStripe = await stripe.customers.create({
        //         email: customerData.email,
        //         name: customerData.name,
        //         phone: customerData.phone
        // })

        // let newCard = new Card();
        // newCard.userId = doc._id;
        // newCard.stripeCustomerId = customerStripe.id
        // await newCard.save();

        let payLoad = {
            "id": doc._id
        };
        let token = jwt.sign(payLoad, process.env.CUSTOMER_KEY, {
            expiresIn: '24h' // expires in 1 Day
        });   

        delete doc._doc.password
        doc._doc.token = token
        return res.status(200).json({
            message: CMS.Lang_Messages('en', 'newcustomer'),
            "data": doc,
            // "Stripe_Data" : customerStripe
        });
    } catch (error) {
            console.error(error);
            return res.status(500).json({
                message: "Something went wrong",
            });
    } 
})

/**
 * @function  Customer_Login
 * @description API Will be /api/v1/c/login 
 * @example Customer_Login
 */

 router.post('/login', async (req, res) => {
    try {
        
    let customerData = req.body;
    
    let array1 = ['email','password']
    for (let index = 0; index < array1.length; index++) {
        const element = array1[index];
        if (!customerData[element]) {
            return res.status(400).json({
                "message": element + CMS.Lang_Messages('en', 'feildmissing'),
            });
        }
    }

    if (!CMS.Config.emailvalidator(customerData.email)) {
        return res.status(400).json({
            "message": CMS.Lang_Messages('en', 'emailnotmatch')
        })
    }

    let customer =  await Customer.findOne({
        email: customerData.email
        }).select("+password");
        if (!customer) {
            return res.status(200).json({
                message: CMS.Lang_Messages('en', 'customernotfound')
            });
        }

        if(!customer.isPhoneVerified){
            var newOtp = new Otp();
            newOtp.userId = customer._id;
            newOtp.otp = 1234;
            newOtp.usedfor = "VERIFY-PHONE"
            await newOtp.save();

            return res.status(200).json({
                message: CMS.Lang_Messages('en', 'firstverify'),
                "data": customer,
            });
        } else {
            // if (!passwordHash.verify(customerData.password, customer.password)) {
            //     return res.status(400).json({
            //         message: CMS.Lang_Messages('en', 'wrngpass')
            //     });
            // }
            let verify = await bcrypt.compare(customerData.password, customer.password);
            if(!verify){
                return res.status(400).json({
                    message: 'password is wrong!'
                });
            }
            let payLoad = {
                "id": customer._id
            };
            let token = jwt.sign(payLoad, process.env.CUSTOMER_KEY, {
                expiresIn: '24h' // expires in 1 Day
            });
    
            delete customer._doc.password
            customer._doc.token = token
            return res.status(200).json({
                message: CMS.Lang_Messages('en', 'loginsuccess'),
                "data": customer,
            });    
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: CMS.Lang_Messages('en', 'servererr'),
        });
    } 
})

/**
 * @function  API_Customer_Verify_Phone_Otp
 * @description API Will be /api/v1/c/verifyPhone 
 * @example API_Customer_Verify_Phone_Otp
 */

 router.post('/verifyPhone', async (req, res) => {
    try {
        let customerData = req.body;

        let array1 = ['email','otp']
        for (let index = 0; index < array1.length; index++) {
            const element = array1[index];
            if (!customerData[element]) {
                return res.status(400).json({
                    "message": element + CMS.Lang_Messages('en', 'feildmissing'),
                });
            }
        }    

        const customer = await Customer.findOne({email : customerData.email});
        if(!customer){
            return res.status(400).json({
                message: CMS.Lang_Messages('en', 'customernotfound'),
            });
        }else if(customer.isPhoneVerified){
            return res.status(200).json({
                message: CMS.Lang_Messages('en', 'alphoneverified'),
            });
        }else{
            var otp = await Otp.findOne({otp : customerData.otp});
            if(!otp){
                return res.status(400).json({
                    message: CMS.Lang_Messages('en', 'otpexpired'),
                });
            }
            customer.isPhoneVerified = true;
            await customer.save()
            return res.status(200).json({
                message: CMS.Lang_Messages('en', 'phoneverified'),
                "data": customer,
            });
        }
 } catch (error) {
        console.error(error);
        res.status(500).json({
            message: CMS.Lang_Messages('en', 'servererr'),
        });
    } 
})



/**
 * @function  API_Customer_forgot_password
 * @description API Will be /api/v1/c/forgotPassword 
 * @example Forgot_Password_Request
 */

 router.post('/forgotPassword', async (req, res) => {
    try {
        let customerData = req.body;

        let buffer = crypto.randomBytes(32)
        const token = buffer.toString("hex")

        html = `
        <p>You requested for password reset</p>
        <h5>click in this <a href="http://localhost:6002/api/v1/c/resetPassword/${token}">link</a> to reset password</h5>
        `

        let customer = await Customer.findOne({ email: customerData.email })
        if(customer){
            var newForgetpass = new Forgetpass();
            newForgetpass.email = customerData.email;
            newForgetpass.resetToken = token;
            newForgetpass.save();
            Email.testing(customerData.email, html)
            return res.status(200).json({message:"check your email"})
        }else {
            return res.status(400).json({
                message: CMS.Lang_Messages('en', 'customernotfound'),
            });
        }
 } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: CMS.Lang_Messages('en', 'servererr'),
        });
    } 
})


/**
 * @function  API_Customer_Reset_password
 * @description API Will be /api/v1/c/resetPassword/:token
 * @example Reset_password_Successfull
 */

 router.post('/resetPassword/:token', async (req, res) => {
    try {
        let customerData = req.body;

        let forgetpass = await Forgetpass.findOne({ resetToken: req.params.token })
        if(forgetpass){
            let customer = await Customer.findOne({ email: forgetpass.email })
            customer.password = passwordHash.generate(customerData.password);
            await customer.save();
            await Forgetpass.findOneAndDelete({ resetToken: customerData.resetToken })
            return res.status(200).json({
                message: CMS.Lang_Messages('en', 'passwordreset'),
            });
        } else {
            return res.status(400).json({
                message: CMS.Lang_Messages('en', 'invalidtoken'),
            });
        }
 } catch (error) {
        console.error(error);
        res.status(500).json({
            message: CMS.Lang_Messages('en', 'servererr'),
        });
    } 
})



module.exports = router;