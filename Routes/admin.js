const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Admin Routes before Authentication
router.use('/admin',require('./admin/admin-login'));


// ------- ROUTE MIDDLEWARE START ----//
router.use(function (req, res, next) { 
    var token =
      req.body.token || req.query.token || req.headers["x-access-token"];
    // decode token
    if (token) {
      // verifies the scret and checks expirationheight: 90px;
      jwt.verify(token, process.env.ADMIN_KEY, function (err, decoded) {
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

  // Routes after Authentication
  router.use('/users', require('./admin/admin-user'));
  router.use('/customer', require('./admin/admin-customer'));
  router.use('/nurse', require('./admin/admin-nurse'));
  router.use('/doctor', require('./admin/admin-doctor'));
  router.use('/specialty', require('./admin/admin-specialty'));
  router.use('/recommended', require('./admin/admin-recommended'));
  router.use('/diagnosis', require('./admin/admin-diagnosis'));
  router.use('/medicines', require('./admin/admin-medicine')); 
  router.use('/faq', require('./admin/admin-faq'));
  router.use('/contact', require('./admin/admin-contact')); 


  module.exports = router;