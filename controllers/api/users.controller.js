var config = require('config.json');
var express = require('express');
var router = express.Router();
var userService = require('services/user.service');
var username="",useremail;
// routes
router.get('/verdict', updateVerdict);
router.get('/currentexp', getCurrentExpense);

router.get('/currentexpman', getCurrentExpenseMan);
router.get('/current', getCurrentUser);
router.get('/:expname', getCurrentReport);

router.post('/authenticate', authenticateUser);
router.post('/register', registerUser);
router.post('/createnewreport', createnewreport);


router.put('/:_id', updateUser);
//router.put('/username', updateUserToken);

router.delete('/:_id', deleteUser);

module.exports = router;

function authenticateUser(req, res) {
    userService.authenticate(req.body.username, req.body.password)
        .then(function (token) {
            if (token) {
                // authentication successful
                res.send({ token: token });
            } else {
                // authentication failed
                res.status(401).send('Username or password is incorrect');
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function registerUser(req, res) {
    userService.create(req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}


function createnewreport(req, res) {
    userService.createnewreport1(req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getCurrentUser(req, res) {
    userService.getById(req.user.sub)
        .then(function (user) {
            if (user) {
                res.send(user);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}


function getCurrentReport(req, res) {
    //console.log("inside get current report:"+ req.params.expname);
    userService.getreport(req.params.expname)
        .then(function (expenseitem) {
            if (expenseitem) {
                //console.log("success 2 :"+ expenseitem.expname);
                res.send(expenseitem);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getCurrentExpense(req, res) {
   
    //console.log("inside getCurrentExpense username:"+ req.user.sub);
    userService.getById(req.user.sub)
        .then(function (user) {
            if (user) {
                
                 username = user.username;
                //console.log("username:"+user.username);
                userService.getExpense(username).then(function (expenseitem) {
                                
                            if (expenseitem) {
                                //console.log("before res.send :"+ expenseitem);   
                                res.send(expenseitem);
                            } else {
                                res.send("error");
                            }
                })
            .catch(function (err) {
                
                res.send(err);
            });
  
            } else {

               res.send("err");
            }
        })
        .catch(function (err) {
             res.send(err);
        });
        
   
}


function getCurrentExpenseMan(req, res) {
    //console.log("inside getCurrentExpense");
    //console.log("inside getCurrentExpense username:"+ req.user.sub);
    userService.getById(req.user.sub)
        .then(function (user) {
            if (user) {
                   
                 useremail = user.useremail;
               
                userService.getExpenseMan(useremail).then(function (expenseitem) {
                                
                            if (expenseitem) {
                                //console.log("before res.send :"+ expenseitem);   
                                res.send(expenseitem);
                            } else {
                                res.send("error");
                            }
                })
            .catch(function (err) {
                //console.log("error insdie catch");
                res.send(err);
            });
  
            } else {

               res.send("err");
            }
        })
        .catch(function (err) {
             res.send(err);
        });
       
   
}


function updateUser(req, res) {
    var userId = req.user.sub;
    if (req.params._id !== userId) {
        // can only update own account
        return res.status(401).send('You can only update your own account');
    }

    userService.update(userId, req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function updateVerdict(req, res) {
    var verdict = req.query.verdict;
    var exp = req.query.exp;
    var comment = req.query.comment;
    //console.log("hello from update vrdict");
    //console.log("Inside user controller verdict:"+ verdict );
    //console.log("Inside user controller expense:"+ exp );
    //console.log("Inside user controller expense:"+ exp);

    userService.updateverdict(verdict,exp,comment)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function updateUserToken(req, res) {
    var username = req.body.username;
    //console.log("inside update user token "+ username);
    if (req.params.username !== username) {
        // can only update own account
        return res.status(401).send('You can only update your own account');
    }

    userService.update(username, req.body)
        .then(function () {
            console.log("Updated");
            res.sendStatus(200);
        })
        .catch(function (err) {
            console.log("error updating");
            res.status(400).send(err);
        });
}

function deleteUser(req, res) {
    var userId = req.user.sub;
    if (req.params._id !== userId) {
        // can only delete own account
        return res.status(401).send('You can only delete your own account');
    }

    userService.delete(userId)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}