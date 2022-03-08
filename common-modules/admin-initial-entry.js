const bcrypt = require('bcryptjs');
const Admin = require('../Models/admin')
// const Information = require('../models/information');

let globalValues = {
  serviceableArea: 0,
}


async function AdminInitialEntry(){
let adminentry = await Admin.findOne({
    email: 'admin@gomedicx.com'
  })
    if (!adminentry) {
    var newUser = new Admin();
    newUser.email = "admin@gomedicx.com";
    newUser.email.toLowerCase() ;
    let salt = bcrypt.genSaltSync(10);
    newUser.password = await bcrypt.hash("admin123", salt);  // passwordHash.generate("RS@12345");
    newUser.name = "Gomedicx off Admin";
    newUser.phone = 9090909091;
    // newUser.userImage = 'demo.png';
    await newUser.save()
    }
    else{}

}
AdminInitialEntry()


  module.exports = {
   
  };

