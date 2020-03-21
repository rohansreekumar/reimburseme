
var express = require('express');
var router = express.Router();
var request = require('request');
var config = require('config.json');
var crypto = require('crypto');
var async = require('async');
var nodemailer = require('nodemailer');
var fs = require('fs');
var mongo = require('mongoskin');
var db = mongo.db(config.connectionString, { native_parser: true });
db.bind('users');
var user = this;
var email, userLockExpire;
var resetpwdcount=0;

 
 router.post('/', function(req, res, next) {
  async.waterfall([
    function(done) {
      crypto.randomBytes(20, function(err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function(token, done) {
      db.users.findOne({ username: req.body.username }, function(err, user) {
        if (!user) {
          
          return res.render('forgotpassword1', { error: 'No account with that username exists.' });

          
        }
      

          

              email = req.body.username +"@teksystems.com";
        
       
              req.session.email = email;
              req.body.resetPasswordToken =  token;
              req.body.resetPasswordExpires = Date.now() + config.timeforlock;
              req.session.access_token = global.token;
       // console.log(req.body.resetPasswordToken);
        
        //console.log(req.body.resetPasswordExpires);
       // console.log(req.body.username);


              db.users.update({username: req.body.username},{$set : {resetPasswordToken: req.body.resetPasswordToken, resetPasswordExpires: req.body.resetPasswordExpires}});

          


          

      
    



        done(err, token, user);

        //user.save(function(err) {
          
        });
      
    },




  function(token, user, done) {
      var smtpTransport = nodemailer.createTransport('SMTP', {
        service: 'SendGrid',
        auth: {
          user: 'rohansreekumar',
          pass: 'rohan1994'
        }
      });
        
      var mailOptions = {
        to: email,
        from: 'passwordreset@demo.com',
        subject: 'Reimburse me Password Reset',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://' + req.headers.host + '/reset/' + token + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      };



      //console.log(mailOptions);

      smtpTransport.sendMail(mailOptions, function(err,info) {
      	if(err){
        //console.log("error");
        return console.log(err);

   		 }

        return res.render('forgotpassword1', { success: 'An e-mail has been sent to ' + email + ' with further instructions.' });
        
      });

    }
  ], function(err) {
    if (err) return next(err);
    res.redirect('/forgotpassword1');
  });
});



router.get('/', function (req, res) {
    res.render('forgotpassword1',{
  });
});


module.exports = router;