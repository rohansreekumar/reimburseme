
var express = require('express');
var router = express.Router();
var request = require('request');
var config = require('config.json');
var crypto = require('crypto');
var async = require('async');
var nodemailer = require('nodemailer');
var multer  =   require('multer');
var multerdragdrop = require('multer');
var fs = require('fs');
var mongo = require('mongoskin');
var db = mongo.db(config.connectionString, { native_parser: true });
db.bind('users');
var user = this;
var count=0;



router.get('/', function (req, res) {


	if(!req.session.token){
		res.render('login');
	}
	else
	{     
        //console.log("user:"+ req.session.user);
        db.users.findOne({ username: req.session.user }, function(err, user) {
            //console.log("user username:"+ user.username);
            //console.log("user firstname:"+ user.firstName);
            res.locals.firstName = user.firstName;
            res.locals.username = user.username;
            //console.log("user firstname:"+ res.locals.firstName);
            //console.log("user username:"+ res.locals.username);
        
		res.render('createnewreport');
        });
	}
    

});



var storage =   multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, 'uploads');
  },
  filename: function (req, file, callback) {
    console.log("inside file name");
    callback(null, req.body.expname +'.jpg');
  }
});
var upload = multer({ storage : storage});

router.post('/', upload.single('myFile'), function(req, res, next){


request.post({
        url: config.apiUrl + '/users/createnewreport',
        form: req.body,
        json: true
    }, function (error, response, body) {
        if (error) {
            return res.render('createnewreport', { error: 'An error occurred' });
        }

        if (response.statusCode !== 200) {
            return res.render('createnewreport', {
                error: response.body,
                empName: req.body.empname,
               
            });
        }
        else 
            console.log("details uploaded");
        return res.redirect("./app/#/employeedashboard");
        
    });

    
});




module.exports = router;