var express = require('express');
var router = express.Router();
var request = require('request');
var config = require('config.json');
var session = require('express-session');
var userService = require('services/user.service');
var logincount=0;


var sess;

router.get('/', function (req, res) {
    // log user out
    delete req.session.token;
   var viewData = { success: req.session.success };
    delete req.session.success;
    
  
    // move success message into local variable so it only appears once (single read)
    

    res.render('login', viewData);
});

router.post('/', function (req, res) {
    // authenticate using api to maintain clean separation between layers

    
    request.post({
        url: config.apiUrl + '/users/authenticate',
        form: req.body,
        json: true
    }, function (error, response, body) {
        
       

        if (error) {
            logincount++;
            //console.log(logincount + " inside error");
            return res.render('login', { error: 'An error occurred' });


        }  


        if (!body.token) {
            logincount++;
            //console.log(logincount + " inside body token");
            return res.render('login', { error: body, username: req.body.username });
        }
         if(logincount == 2 && (error || !body.token))
        {
            logincount=0;
           // console.log("inside if logincount");
            return res.render('forgotpassword');
        }

        
        
        // save JWT token in the session to make it available to the angular app
        req.session.token = body.token;
        req.session.user = req.body.username;

        // redirect to returnUrl

        var returnUrl = req.query.returnUrl && decodeURIComponent(req.query.returnUrl) || '/';
        //console.log("return url : "+ returnUrl);
        res.redirect(returnUrl);
    });
});

module.exports = router;