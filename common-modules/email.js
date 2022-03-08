const path = require('path');
require('dotenv').config({
	path: path.join(__dirname) + '/.env'
});

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_KEY);

var handlebars = require('handlebars');
var fs = require('fs');
var readHTMLFile = function (path, callback) {
  fs.readFile(path, {
      encoding: 'utf-8'
  }, function (err, html) {
      if (err) {
          throw err;
          callback(err);
      } else {
          callback(null, html);
      }
  });
};

module.exports = {
    send_email: async (message)=>{
        console.log('Test: Email sent !')
    },
    testing: async function(email, htmlToSend){
        try{                           
            //temp1 = path.join(__dirname, 'email-templates/demo.html')
            //readHTMLFile(temp1, function (err, html) {
            //var template = handlebars.compile(html);										
            // let result = {name:"ashish"}
            // var htmlToSend = template(result); 
            const msg = {
                to: "aghaz.dev@gmail.com",
                from: process.env.EMAIL_NAME,
                subject: 'Testing Mail',
                text: 'Testing Mail',
                html: htmlToSend,		
            };
             let res = sgMail.send(msg);  
             console.log(res)                                       
            //}); 
        }catch(err){

            console.log("here asgis")
            console.log(err);
        }
    }
}