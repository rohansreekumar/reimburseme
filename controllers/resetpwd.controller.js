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













module.exports = router;