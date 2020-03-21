
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

 



router.get('/', function (req, res) {
    res.render('forgotpassword',{
  });
});


module.exports = router;