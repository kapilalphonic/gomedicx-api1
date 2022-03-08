const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
var multer  = require('multer');
// const upload = multer()


// Cutomer Routes before Authentication
// router.use(require('./customer/customer-signup'));
router.use('/customer',require('./customer/customer-signup'));
// router.use(require('./customer/customer-faqs'));
// router.use(require('./customer/customer-terms'));
// router.use(require('./customer/customer-category'));

// ------- ROUTE MIDDLEWARE START ----//
router.use(function (req, res, next) { 
    var token =
      req.body.token || req.query.token || req.headers["x-access-token"];
    // decode token
    if (token) {
      // verifies the scret and checks expirationheight: 90px;
      jwt.verify(token, process.env.CUSTOMER_KEY, function (err, decoded) {
        if (err) {
          return res
            .status(401)
            .json({
              message: "Fail to authenticate token."
            });
        } else {
          // if everything is good, save to request for use in other routes
          var decoded = jwt.decode(token, {
            complete: true
          });
          req.doc = decoded.payload;
         
         
          next();
        }
      });
    } else {
      // if there is no token
      // return an error
  
      return res.status(401).send({
        message: "No token provided."
      });
    }
    // ------- ROUTE MIDDLEWARE END  ----//
  
    // next();
  });
  
//   router.use('/user', require('./customer/customer-cart'));
//   router.use('/order', require('./customer/customer-order'));

  module.exports = router;