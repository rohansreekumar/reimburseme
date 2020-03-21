var config = require('config.json');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var express = require('express');
var session = require('express-session');
var nodemailer = require('nodemailer');
var json2xls = require('json2xls');
var crypto = require('crypto');
var fs= require('fs');
var mongoXlsx = require('mongo-xlsx');
var async = require('async');
var router = express.Router();
var XLSX = require('xlsx');
var Q = require('q');
var mongo = require('mongoskin');
var db = mongo.db(config.connectionString, { native_parser: true });
db.bind('users');
db.bind('expense');
var usercheck;
var service = {};
var logincount=0;
var usertype;
service.authenticate = authenticate;
service.getById = getById;
service.getreport = getreport;
service.getExpense = getExpense;
service.getExpenseMan = getExpenseMan;
service.create = create;
service.createnewreport1=createnewreport1;
service.update = update;
service.delete = _delete;
service.usertype= usertype;
service.updateverdict= updateverdict;
var email;
var count=0;
module.exports = service;

//module.exports = usertype;

function authenticate(username, password) {
    var deferred = Q.defer();

    db.users.findOne({ username: username }, function (err, user) {
        if (err) deferred.reject(err.name + ': ' + err.message);
        
        if (user && bcrypt.compareSync(password, user.hash)) {
            // authentication successful
            deferred.resolve(jwt.sign({ sub: user._id }, config.secret));
            usertype = user.usertype;
            
            //eferred.resolve(usertype);
        }
        

        else {
            // authentication failed
            deferred.resolve();
            
        }
    });

    return deferred.promise;
}

function getById(_id) {
    var deferred = Q.defer();

    db.users.findById(_id, function (err, user) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (user) {
            // return user (without hashed password)
            deferred.resolve(_.omit(user, 'hash'));
        } else {
            // user not found
            deferred.resolve();
        }
    });

    return deferred.promise;
}



function getreport(expensename) {
    var deferred = Q.defer();
   // console.log("inside get report:"+ expensename);
    db.expense.findOne({expname : expensename}, function (err, expenseitem) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (expenseitem) {
//});
            deferred.resolve(expenseitem);
        } else {
            //console.log("else");
            deferred.resolve();
        }
        //console.log("deff:"+ deferred.promise);
    });
     
    return deferred.promise;
}

function getById(_id) {
    var deferred = Q.defer();

    db.users.findById(_id, function (err, user) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (user) {
            // return user (without hashed password)
            deferred.resolve(_.omit(user, 'hash'));
        } else {
            // user not found
            deferred.resolve();
        }
    });

    return deferred.promise;
}


function getExpense(username) {
    var deferred = Q.defer();
   // console.log("username123:"+username);
    db.expense.find({empusername : username}).toArray(function (err, expenseitem) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (expenseitem!=undefined && expenseitem.length>0) {
            //console.log("inside if expenseitem");
            //console.log("Success : expense id 1 : "+expenseitem[0].empname);
            //console.log("Success : expense id 2 : "+expenseitem[1].empname);
            deferred.resolve(expenseitem);
        } else {
            deferred.resolve();
        }
        //console.log(deferred.promise);
         
    });
     return deferred.promise;   
   
}


function getExpenseMan(useremail) {
    var deferred = Q.defer();
    //console.log("username123:"+useremail);
    db.expense.find({manageremail : useremail}).toArray(function (err, expenseitem) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (expenseitem!=undefined && expenseitem.length>0) {
            //console.log("inside if expenseitem");
            //console.log("Success : expense id 1 : "+expenseitem[0].empname);
            //console.log("Success : expense id 2 : "+expenseitem[1].empname);
            deferred.resolve(expenseitem);
        } else {
            deferred.resolve();
        }
       // console.log(deferred.promise);
         
    });
     return deferred.promise;   
   
}



function create(userParam) {
    var deferred = Q.defer();

    // validation
    db.users.findOne(
        { username: userParam.username },
        function (err, user) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            if (user) {
                // username already exists
                deferred.reject('Username "' + userParam.username + '" is already taken');
            } else {
                createUser();
            }
        });

    function createUser() {
        // set user object to userParam without the cleartext password
        var user = _.omit(userParam, 'password');

        // add hashed password to user object
        user.hash = bcrypt.hashSync(userParam.password, 10);

        db.users.insert(
            user,
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);

                deferred.resolve();
            });
    }

    return deferred.promise;
}








function createnewreport1(userParam) {
    var deferred = Q.defer();

    var user=userParam;
    //var myEnum = new Enum({'Sl No.': user.serialno11, 'date': user.date11, 'billno': user.billno11, 'value':user.value11, 'remark': user.remark11});

    
    //console.log("111":+foodbill1);
    /*var foodbill2={user.serialno12,user.date12,user.billno12,user.value12,user.remark12};
    var foodbill3={user.serialno13,user.date13,user.billno13,user.value13,user.remark13};
    var foodbill4={user.serialno14,user.date14,user.billno14,user.value14,user.remark14};
    var foodbill5={user.serialno15,user.date15,user.billno15,user.value15,user.remark15};


    var foodbills = {foodbill1,foodbill2,foodbill3,foodbill4,foodbill5};

    var accbill1={user.serialno21,user.date21,user.billno21,user.value21,user.remark21};
    var accbill2={user.serialno22,user.date22,user.billno22,user.value22,user.remark22};
    var accbill3={user.serialno23,user.date23,user.billno23,user.value23,user.remark23};
    var accbill4={user.serialno24,user.date24,user.billno24,user.value24,user.remark24};
    var accbill5={user.serialno25,user.date25,user.billno25,user.value25,user.remark25};

    var accbills = {accbill1,accbill2,accbill3,accbill4,accbill5};


    var commbill1={user.serialno31,user.date31,user.billno31,user.value31,user.remark31};
    var commbill2={user.serialno32,user.date32,user.billno32,user.value32,user.remark32};
    var commbill3={user.serialno33,user.date33,user.billno33,user.value33,user.remark33};
    var commbill4={user.serialno34,user.date34,user.billno34,user.value34,user.remark34};
    var commbill5={user.serialno35,user.date35,user.billno35,user.value35,user.remark35};

    var commbills ={commbill1,commbill2,commbill3,commbill4,commbill5};


    var convbill1={user.serialno41,user.date41,user.billno41,user.value41,user.remark41};
    var convbill2={user.serialno42,user.date42,user.billno42,user.value42,user.remark42};
    var convbill3={user.serialno43,user.date43,user.billno43,user.value43,user.remark43};
    var convbill4={user.serialno44,user.date44,user.billno44,user.value44,user.remark44};
    var convbill5={user.serialno45,user.date45,user.billno45,user.value45,user.remark45};

    var convbills = {convbill1,convbill2,convbill3,convbill4,convbill5};

    var perdbill1={user.serialno51,user.date51,user.billno51,user.value51,user.remark51};
    var perdbill2={user.serialno52,user.date52,user.billno52,user.value52,user.remark52};
    var perdbill3={user.serialno53,user.date53,user.billno53,user.value53,user.remark53};
    var perdbill4={user.serialno54,user.date54,user.billno54,user.value54,user.remark54};
    var perdbill5={user.serialno55,user.date55,user.billno55,user.value55,user.remark55};

    var perdbills = {perdbill1,perdbill2,perdbill3,perdbill4,perdbill5}; */

    var serialno11=user.serialno11;
    var billno11=user.billno11;
    var remark11=user.remark11;
    var date11=user.date11;
    var serialno12=user.serialno12;
    var billno12=user.billno12;
    var remark12=user.remark12;
    var date12=user.date12;
    var serialno13=user.serialno13;
    var billno13=user.billno13;
    var remark13=user.remark13;
    var date13=user.date13;
    var serialno14=user.serialno14;
    var billno14=user.billno14;
    var remark14=user.remark14;
    var date14=user.date14;
    var serialno15=user.serialno15;
    var billno15=user.billno15;
    var remark15=user.remark15;
    var date12=user.date15;

    var value21=parseInt(user.value21);
    var value22=parseInt(user.value22);
    var value23=parseInt(user.value23);
    var value24=parseInt(user.value24);
    var value25=parseInt(user.value25);
    var value11=parseInt(user.value11);
    var value12=parseInt(user.value12);
    var value13=parseInt(user.value13);
    var value14=parseInt(user.value14);
    var value15=parseInt(user.value15);
    var value31=parseInt(user.value31);
    var value32=parseInt(user.value32);
    var value33=parseInt(user.value33);
    var value34=parseInt(user.value34);
    var value35=parseInt(user.value35);
    var value41=parseInt(user.value41);
    var value42=parseInt(user.value42);
    var value43=parseInt(user.value43);
    var value44=parseInt(user.value44);
    var value45=parseInt(user.value45);
    var value51=parseInt(user.value51);
    var value52=parseInt(user.value52);
    var value53=parseInt(user.value53);
    var value54=parseInt(user.value54);
    var value55=parseInt(user.value55);
    var foodexpense=parseInt(user.foodexpense);
    var accexpense=parseInt(user.accexpense);
    var commexpense=parseInt(user.commexpense);
    var convexpense=parseInt(user.convexpense);
    var perdexpense=parseInt(user.perdexpense);
    var totexpense=parseInt(user.totexpense);
    var refund=parseInt(user.refund);
    var cheque=parseInt(user.cheque);
    var onlinepayment=parseInt(user.onlinepayment);
    var totadvance=parseInt(user.totadvance);

  
    foodexpense = value11 + value12 +value13 +value14 + value15;
    accexpense = value21 + value22 + value23 + value24 + value25;
    commexpense = value31 + value32 +value33 +value34 + value35;
    convexpense = value41 + value42 +value43 +value44 + value45;
    perdexpense = value51 + value52 +value53 +value54 + value55;

    totexpense = accexpense + foodexpense + commexpense + convexpense + perdexpense ;
    totadvance = cheque + onlinepayment;
    refund = totexpense - totadvance;
    

   


    user.value22=value22;
    user.value23=value23;
    user.value24=value24;
    user.value25=value25;
    user.value11=value11;
    user.value12=value12;
    user.value13=value13;
    user.value14=value14;
    user.value15=value15;
    user.value31=value31;
    user.value32=value32;
    user.value33=value33;
    user.value34=value34;
    user.value35=value35;
    user.value41=value41;
    user.value42=value42;
    user.value43=value43;
    user.value44=value44;
    user.value45=value45;
    user.value51=value51;
    user.value52=value52;
    user.value53=value53;
    user.value54=value54;
    user.value55=value55;
    user.accexpense=accexpense;
    user.foodexpense=foodexpense;
    user.commexpense=commexpense;
    user.convexpense=convexpense;
    user.perdexpense=perdexpense;
    user.totexpense=totexpense;
    user.refund=refund;
    user.cheque=cheque;
    user.onlinepayment=onlinepayment;
    user.totadvance=totadvance;
    
    
    email = user.manageremail;
        db.expense.insert(
               user,
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);

                deferred.resolve();
            });
    
     /*  async.waterfall([
    function(done) {
      crypto.randomBytes(20, function(err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function(token, done) {
        db.users.findOne({}, function(err, user) {
        if (!user) {
          
        
        }
      

          

              
                //console.log("email:"+ email);
          


          

      
    



        done(err, token, user);

        //user.save(function(err) {
          
        });
    },




  function(token, user, done) {
    //console.log("manager email" +user.manageremail);
      var smtpTransport = nodemailer.createTransport('SMTP', {
        service: 'SendGrid',
        auth: {
          user: 'rohansreekumar',
          pass: 'rohan1994'
        }
      });
        
      var mailOptions = {
        to: email,
        from: 'reimburseme@demo.com',
        subject: 'Reimburse me Report Submission',
        text: 'You are receiving this because your employee has requested for reimbursement.\n\n' +
          'Please check the application to accept/reject the report.\n\n'
      };



      //console.log(mailOptions);

      smtpTransport.sendMail(mailOptions, function(err,info) {
        if(err){
        //console.log("error");
        return console.log(err);

         }

       console.log("Mailed Successfully");
        
      });

    }
  ], function(err) {
    if (err) 
        console.log("error:");
        console.log(err);
  });*/
   
    return deferred.promise;
}




























function update(_id, userParam) {
    var deferred = Q.defer();

    // validation
    db.users.findById(_id, function (err, user) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (user.username !== userParam.username) {
            // username has changed so check if the new username is already taken
            db.users.findOne(
                { username: userParam.username },
                function (err, user) {
                    if (err) deferred.reject(err.name + ': ' + err.message);

                    if (user) {
                        // username already exists
                        deferred.reject('Username "' + req.body.username + '" is already taken')
                    } else {
                        updateUser();
                    }
                });
        } else {
            updateUser();
        }
    });

    function updateUser() {
        // fields to update
        var set = {
            firstName: userParam.firstName,
            lastName: userParam.lastName,
            username: userParam.username,
        };

        // update password if it was entered
        if (userParam.password) {
            set.hash = bcrypt.hashSync(userParam.password, 10);
        }

        db.users.update(
            { _id: mongo.helper.toObjectID(_id) },
            { $set: set },
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);

                deferred.resolve();
            });
    }

    return deferred.promise;
}


 function updateverdict(verdict, exp,comment) {
        
    var deferred = Q.defer();

        var exp= exp;
        var ver = verdict;
        //console.log("hi from updateverdict");
        //console.log("updateverdict exp :"+exp);
        //console.log("updateverdict ver :"+ver);
        console.log("Expense:"+ exp);
        db.expense.update(
            { expname : exp },
            { $set: {managerremark : ver, managercomment : comment} },
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);
                if(ver == 'Approved')
                {
                    db.expense.find({ expname : exp }).toArray(function (err, expense) {
                    if (err) deferred.reject(err.name + ': ' + err.message);

                    //console.log("expense item 1: "+ expense[0].empname);
                    var JSONexpense1 = JSON.stringify(expense);
                    var JSONexpense = JSON.parse(JSONexpense1);
                    
                    console.log("type1: "+typeof(JSONexpense1));
                    console.log("type: "+typeof(JSONexpense));
                    console.log("jsonexpense:"+ JSONexpense);
                    var xls = json2xls(JSONexpense);

                    
                    
                    fs.writeFileSync('reportdata.xlsx', xls,'binary');
                    



                    
                    

    
                    //console.log('File saved at:', expense); 





                    async.waterfall([
                                function(done) {
                                    crypto.randomBytes(20, function(err, buf) {
                                    var token = buf.toString('hex');
                                    done(err, token);
                                    });
                                },
                                function(token, done) {
                                    db.users.findOne({}, function(err, user) {
                                    if (!user) {
                                    }
                                    done(err, token, user);
                                    });
                                },
                                function(token, user, done) {
                                    //console.log("manager email" +user.manageremail);
                                    var smtpTransport = nodemailer.createTransport('SMTP', {
                                    service: 'SendGrid',
                                    auth: {
                                            user: 'rohansreekumar',
                                            pass: 'rohan1994'
                                        }
                                    });
                                   
                                    
                                    var mailOptions = {
                                    to: 'rsreekum@teksystems.com',
                                    from: 'reimburseme@demo.com',
                                    attachments : [{fileName: 'reportdata.xlsx' , filePath : "./reportdata.xlsx"}],

                                    subject: 'Reimburse me Report Submission',
                                    text: 'You are receiving this because an employee had requested for reimbursement and the manager has accepted the request.\n\n' +
                                    'Please find the attached excel file of the report.\n\n'
                                     };
                                    
                                     //console.log("attachment:"+ mailOptions.attachment.filename);
                                     //console.log("attachment:"+ mailOptions.attachment.path);


      //console.log(mailOptions);

                                    smtpTransport.sendMail(mailOptions, function(err,info) {
                                        if(err){
                                                console.log("error");
                                                return console.log(err);

                                         }

                                    console.log("Mailed Successfully");
                                    fs.unlinkSync('./reportdata.xlsx');
        
                                    });
                                    
                                  

                                    }
                                    ], function(err) {
                                            if (err) 
                                                console.log("error:");
                                                console.log(err);
                                        });



                                    
                                });
                }
                deferred.resolve();
            });
    

    return deferred.promise;
}

function _delete(_id) {
    var deferred = Q.defer();

    db.users.remove(
        { _id: mongo.helper.toObjectID(_id) },
        function (err) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            deferred.resolve();
        });

    return deferred.promise;
}