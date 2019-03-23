const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');


//Express-session middleware
router.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
    }));

//Flash middleware
router.use(flash());

//Global variables
router.use(function(req , res , next){
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;

    next();
   })


//Body-parser middleware
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

//Load the User model
require('../models/User');
const User = mongoose.model('users');

//User login route
router.get('/login' , (req ,res) =>{
    res.render('users/login');
   });

//User login post
router.post('/login' , (req ,res ,next) =>{
  passport.authenticate('local' , {
      successRedirect : '/ideas',
      failureRedirect : '/users/login',
      failureFlash : true
      
      
  })(req , res , next)
});
   

//User register route
router.get('/register' , (req , res) =>{
    res.render('users/register');
   });

//Form data process
router.post('/register' , (req ,res) =>{
   let errors = [];
   if(req.body.password != req.body.password2){
       errors.push({text : 'Password does not match'});
   }
   if(req.body.password.length < 4){
      errors.push({text : 'Password is too short'});
   }

   if(errors.length > 0 ){
    res.render('users/register' , {
        errors : errors,
        name: req.body.name,
        email : req.body.email,
        password: req.body.password,
        password2 : req.body.password2
    })
   } else{
       User.findOne({email : req.params.email}).then(user =>{
           if(user){

           }else{
            const newUser = new User({
                name : req.body.name,
                email : req.body.email,
                password : req.body.password
        
              });
        
              bcrypt.genSalt(10 , (err , salt) =>{
                bcrypt.hash(newUser.password , salt , (err , hash) =>{
                    if (err) throw err;
                    newUser.password = hash;
        
                    newUser.save().then(user =>{
                        req.flash('success_msg' , 'You have registered successfully')
                        res.redirect('/users/login');
                    }).catch(err =>{
                        console.log(err);
                        return;
                    });
                })
              });
               
           }
       });
    }
      
   

});

//User Logout 
router.get('/logout' , (req , res) =>{
 req.logOut();
 req.flash('success_msg' , 'You have successfully logged out');
 res.redirect('/users/login');
});
   

module.exports = router;

  

