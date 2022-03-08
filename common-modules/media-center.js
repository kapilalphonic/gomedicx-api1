const express = require('express');
const router = express.Router();
const Images = require('../Models/images')
const Path1 = require('path')
const tinify = require('tinify');
const aws = require('aws-sdk');
const path = require('path')
var fs = require('fs');
var multer  = require('multer');
const Image = require('../Models/images');
const langFunction =  require('./lang-messages');

function randName() {
	var text = "";
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	for (var i = 0; i < 5; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text;
}
const units = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

function niceBytes(x){

  let l = 0, n = parseInt(x, 10) || 0;

  while(n >= 1024 && ++l){
      n = n/1024;
  }
  //include a decimal point and a tenths-place digit if presenting 
  //less than ten of KB or greater units
  return(n.toFixed(n < 10 && l > 0 ? 1 : 0) + ' ' + units[l]);
}
    async function TinifyImage(pathOfImage,typeofImage){
        // var type = typeofImage
        // console.log(type)
        // if(type == 'image/jpeg'){
        //     var extension = '.jpeg'
        // }
        // if(type == 'image/jpg'){
        //     var extension = '.jpg'
        // }
        // if(type == 'image/png'){
        //     var extension = '.png'
        // }
        // it will require when path is different or in s3 bucket Thats  why above code is commented

        const source = tinify.fromFile(pathOfImage);
        source.toFile(pathOfImage);
    }
    async function SaveSizeTinifiedImage(id,pathOfImage){
    const source = tinify.fromFile(pathOfImage);
        source.result().size(async function(err, size) {
            let img = await Image.findOne({_id: id})
            if(img){
                img.size = niceBytes(size)
                await img.save()
            }
       
          });
    }
    async function SaveTinifyImageToS3bucket(pathOfImage,typeofImage){
        var type = typeofImage
        console.log(type)
        if(type == 'image/jpeg'){
            var extension = '.jpeg'
        }
        if(type == 'image/jpg'){
            var extension = '.jpg'
        }
        if(type == 'image/png'){
            var extension = '.png'
        }
        const source = tinify.fromFile(pathOfImage);
        source.store({
          service: "s3",
          aws_access_key_id: "AKIAIOSFODNN7EXAMPLE",
          aws_secret_access_key: "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY",
          region: "us-west-1",
          headers: {
            "Cache-Control": "public, max-age=31536000"
          },
          path: "example-bucket/my-images/" + randName() + extension
        })
      }
 var profileStorage = multer.diskStorage({
        destination: function (req, file, cb) {
        //	console.log(file.fieldname)
            cb(null, './uploads');
        },
        filename: function (req, file, cb) {
            var extension = file.originalname.split('.').pop();
            cb(null, Date.now() + '-' + randName() + '.' + extension );
        }
    });
    var fileUplaodNew = multer({
        storage: profileStorage
    }).single('0');



    async function validateImage(file) {
        try {
          console.log(file.mimetype)
            if(file.mimetype == 'image/png' || file.mimetype == 'image/jpg' || file.mimetype == 'image/jpeg' 
            || file.mimetype == 'image/mp4' || file.mimetype == 'image/mov'){
                return {status: true}
          }
    
          return {
            status: false,
            message: 'Invalid image formate. png, jpg and jpeg are allowed!',
          };
        } catch (error) {
          return {
            status: false,
            message: 'Invalid file!',
          };
        }
      }
    
    aws.config.update({
      accessKeyId:  process.env.ACCESS_KEY,
      secretAccessKey: process.env.SECRET_ACCESS_KEY,
      region: process.env.REGION
    });
    
    const s3 = new aws.S3();
      
    async function uploadFile(key, file) {
      const params = {
        Bucket: "meanstaging",
        Key: key,
        Body: file.buffer || file,
        ACL: 'public-read',
        ContentType: file.mimetype,
        CacheControl: 'public, max-age=86400'
      };
      try {
        return await s3.upload(params).promise();
      } catch (error) {
        console.error(error);
        return null;
      }
    }

    async function uploadMediaFiles(file) {
      try {
        const result = await validateImage(file);
        console.log(file)
        if (result.status) {
          const key = `${process.env.S3_FOLDER}/${randName()}_${file.originalname}`;
          const stored = await uploadFile(key, file);
          let cloudFrontUrl = stored.Location.replace("meanstaging.s3.us-east-2.amazonaws.com", "d2o16grlb19pkv.cloudfront.net")
          // console.log(key)
          // console.log(stored)

          var newImage = new Image();
          newImage.name = file.originalname;
          newImage.size = niceBytes(file.size);
          newImage.type = file.mimetype;
          newImage.encoding = file.encoding;
          newImage.path = cloudFrontUrl;

          let doc = await newImage.save()
          return doc;

        } else {
          throw new Error(langFunction('en', 'invformat'));
         
        }
      } catch (error) {
       throw error;
      }
    }

    async function deleteFileFromS3(key, prevImage) {
      const params = {
        Bucket: "meanstaging",
        Key: key,
      };
      try {
        await Image.findByIdAndDelete({_id: prevImage })
        return await s3.deleteObject(params).promise();
      } catch (error) {
        console.error(error);
        return null;
      }
    }
  
    
module.exports = {
  uploadMediaFiles,
  deleteFileFromS3
}
    // Image upload api and function with whether s3 or normal file upload
    // if you will do by s3 use the fucntion of above for tinfy the 
    
