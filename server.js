require('rootpath')();
var express = require('express');
var session = require('express-session');
var app = express(),
	_getAudio,
    _getImage,
    _startRoute,
    _trySubmission;

var bodyParser = require('body-parser');
var expressJwt = require('express-jwt');
var bcrypt = require('bcryptjs');
var config = require('config.json');
var async = require('async');
var multer  =   require('multer');
var email;
var password,resetPasswordToken,resetPasswordExpires;
var fs = require('fs');

var nodemailer = require('nodemailer');
var mongo = require('mongoskin');
var db = mongo.db(config.connectionString, { native_parser: true });
db.bind('users');

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({ secret: config.secret, resave: false, saveUninitialized: true }));
app.use(function(req, res, next) {
    if (!req.user) {
        res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
        res.header('Expires', '-1');
        res.header('Pragma', 'no-cache');
    }
    next();
});
// use JWT auth to secure the api
//app.use('/reset', require('./controllers/resetpwd.controller'));
app.use('/api', expressJwt({ secret: config.secret }).unless({ path: ['/api/users/authenticate', '/api/users/register','/reset/:token','/api/users/createnewreport'] }));
app.use("/uploads",express.static(__dirname+'/uploads'));
// routes
app.use('/login', require('./controllers/login.controller'));
//app.use('/logout', require('./controllers/logout.controller'));
app.use('/register', require('./controllers/register.controller'));

app.use('/forgotpassword', require('./controllers/forgotpwd.controller'));
app.use('/forgotpassword1', require('./controllers/forgotpwd1.controller'));
app.use('/createnewreport', require('./controllers/createnewreport.controller'));
app.use('/app', require('./controllers/app.controller'));
app.use('/api/users', require('./controllers/api/users.controller'));

app.use('/images', express.static('images'));








app.get('/reset/:token', function(req, res) {
  db.users.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
    if (!user) {
    	console.log(err);
      return res.render('forgotpassword1', { error: 'Password reset token is invalid or has expired.' });
    }
    //console.log("going to reset.ejs");
    res.render('reset');
  });
});



app.post('/reset/:token', function(req, res) {
  async.waterfall([
    function(done) {
      db.users.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
        if (!user) {
          console.log("12345");
          return res.render('forgotpassword1', { error: 'Password reset token is invalid or has expired.' });
        }

        password = req.body.newpassword;
        resetPasswordToken = undefined;
        resetPasswordExpires = undefined;
        email = req.body.username + "@teksystems.com";
        //console.log(req.body);
        //console.log(req.session);
        //console.log("Inside post " + password);
        //console.log("Inside post " + resetPasswordToken);
        //console.log("Inside post " + resetPasswordExpires);
        user.hash = bcrypt.hashSync(req.body.newpassword, 10);

        db.users.update({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } },{$set :{resetPasswordToken: undefined, resetPasswordExpires: undefined,confirmpassword:password,hash:user.hash}});
        //db.users.update({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } },{resetPasswordToken: undefined, resetPasswordExpires: undefined, password: req.body.password,confirmpassword:req.body.password});
        req.session.success = 'Password reset successfully';
        app.use(function(req, res, next) {
    if (!req.user) {
        res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
        res.header('Expires', '-1');
        res.header('Pragma', 'no-cache');
    }
    next();
	});
        return res.redirect('/login');
      });
    }
    /*function(user, done) {

    	console.log("inside 1");
      var smtpTransport = nodemailer.createTransport('SMTP', {
        service: 'SendGrid',
        auth: {
          user: 'rohansreekumar',
          pass: 'rohan1994'
        }
      });
      var mailOptions = {
        to: req.session.email ,
        from: 'passwordreset@demo.com',
        subject: 'Your password has been changed',
        text: 'Hello,\n\n' +
          'This is a confirmation that the password for your account has just been changed.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        console.log("inside 2");
         return res.render('/login', { success : 'Success! Your password has been changed.' });
        done(err);
      });
    }-*/
  ], function(err) {
  	console.log(err);
  	console.log("inside 3");
    res.redirect('/login');
  });
});




_getAudio = function( req, res, next ) {
    var visualCaptcha;

    // Default file type is mp3, but we need to support ogg as well
    if ( req.params.type !== 'ogg' ) {
        req.params.type = 'mp3';
    }

    // Initialize visualCaptcha
    visualCaptcha = require( 'visualcaptcha' )( req.session, req.query.namespace );

    visualCaptcha.streamAudio( res, req.params.type );
};

// Fetches and streams an image file
_getImage = function( req, res, next ) {
    var visualCaptcha,
        isRetina = false;

    // Initialize visualCaptcha
    visualCaptcha = require( 'visualcaptcha' )( req.session, req.query.namespace );

    // Default is non-retina
    if ( req.query.retina ) {
        isRetina = true;
    }

    visualCaptcha.streamImage( req.params.index, res, isRetina );
};

// Start and refresh captcha options
_startRoute = function( req, res, next ) {
    var visualCaptcha;

    // Initialize visualCaptcha
    visualCaptcha = require( 'visualcaptcha' )( req.session, req.query.namespace );

    visualCaptcha.generate( req.params.howmany );

    // We have to send the frontend data to use on POST.
    res.status( 200 ).send( visualCaptcha.getFrontendData() );
};

// Try to validate the captcha
// We need to make sure we generate new options after trying to validate, to avoid abuse
_trySubmission = function( req, res, next ) {
    var visualCaptcha,
        namespace = req.query.namespace,
        frontendData,
        queryParams = [],
        imageAnswer,
        audioAnswer,
        responseStatus,
        responseObject;

    // Initialize visualCaptcha
    visualCaptcha = require( 'visualcaptcha' )( req.session, req.query.namespace );

    frontendData = visualCaptcha.getFrontendData();

    // Add namespace to query params, if present
    if ( namespace && namespace.length !== 0 ) {
        queryParams.push( 'namespace=' + namespace );
    }

    // It's not impossible this method is called before visualCaptcha is initialized, so we have to send a 404
    if ( typeof frontendData === 'undefined' ) {
        queryParams.push( 'status=noCaptcha' );

        responseStatus = 404;
        responseObject = 'Not Found';
    } else {
        // If an image field name was submitted, try to validate it
        if ( ( imageAnswer = req.body[ frontendData.imageFieldName ] ) ) {
            if ( visualCaptcha.validateImage( imageAnswer ) ) {
                queryParams.push( 'status=validImage' );

                responseStatus = 200;
                res.redirect('/forgotpassword1');
                
            } else {
                queryParams.push( 'status=failedImage' );

                responseStatus = 403;
            }
        } else if ( ( audioAnswer = req.body[ frontendData.audioFieldName ] ) ) {
            // We set lowercase to allow case-insensitivity, but it's actually optional
            if ( visualCaptcha.validateAudio( audioAnswer.toLowerCase() ) ) {
                queryParams.push( 'status=validAudio' );

                 responseStatus = 200;
                 res.redirect('/forgotpassword1');
                
            } else {
                queryParams.push( 'status=failedAudio' );

                responseStatus = 403;
            }
        } else {
            queryParams.push( 'status=failedPost' );

            responseStatus = 500;
        }
    }

    if ( req.accepts( 'ejs' ) !== undefined ) {
        res.redirect( '/?' + queryParams.join( '&' ) );
    } else {
        res.status( responseStatus );
    }
};

// Routes definition


app.post( '/try', _trySubmission );

// @param type is optional and defaults to 'mp3', but can also be 'ogg'
app.get( '/audio', _getAudio );
app.get( '/audio/:type', _getAudio );

// @param index is required, the index of the image you wish to get
app.get( '/image/:index', _getImage );

// @param howmany is required, the number of images to generate
app.get( '/start/:howmany', _startRoute );

module.exports = app;









// make '/app' default route
app.get('/', function (req, res) {

   return res.redirect('/app');
});







// start server
var server = app.listen(3000, function () {
    console.log('Server listening at http://' + server.address().address + ':' + server.address().port);
});