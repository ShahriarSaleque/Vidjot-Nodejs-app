const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const {ensureAuthenticated} = require('../helpers/auth');
const {ensure} = require('../helpers/auth');

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
    next();
   })




//Bring in the Idea Model
require('../models/Ideas');
const Idea = mongoose.model('ideas');

//Body-parser middleware
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

//Method-Override Middleware
router.use(methodOverride('_method'));

//Idea index route
router.get('/' , ensureAuthenticated, (req , res) =>{
    Idea.find({user : req.user.id}).sort({date : 'desc'}).then(ideas =>{
        res.render('ideas/index' , {
            ideas : ideas
        })
    })

})

//Add ideas route
router.get('/add' , ensureAuthenticated, (req , res) =>{
    res.render('ideas/add')
})
//Add idea from HomePage
router.get('/add1' , ensure, (req , res) =>{
    res.render('ideas/add')
})

//Process data(handling post req from form)
router.post('/' , ensureAuthenticated, (req , res) =>{
    let errors = [];
    
    if(!req.body.title){
     errors.push({text : 'Please add a title'});
    }
    if(!req.body.details){
        errors.push({text : 'Please add some details'});
    }
 if(errors.length > 0){
   res.render('ideas/add' , {
       errors : errors,
       title : req.body.title,
       details : req.body.details
   })
 } else{
     const newUser = {
         title : req.body.title,
         details : req.body.details,
         user : req.user.id
     }

     new Idea(newUser)
         .save()
         .then((idea) =>{
             req.flash('success_msg' , 'Video idea has been added');
             res.redirect('/ideas')
         });
  }
})

//Edit idea
router.get('/edit/:id' , ensureAuthenticated, (req , res) =>{
 Idea.findOne({
     _id : req.params.id
 }).then(idea =>{
     if(idea.user != req.user.id){
         req.flash('error_msg' , 'Not Authorized');
         res.redirect('/users/login');

     } else{
        res.render('ideas/edit' , {
            idea : idea
        })
    
     }
    
 })
})

//Update idea
router.put('/:id' , ensureAuthenticated, (req,res) =>{
 Idea.findOne({
     _id : req.params.id
 }).then(idea =>{
     idea.title = req.body.title;
     idea.details = req.body.details;

     idea.save().then((idea) =>{
         req.flash('success_msg' , 'Video idea has been edited');
         res.redirect('/ideas');

     })

 })
})

//Delete idea
router.delete('/:id' , ensureAuthenticated, (req , res) =>{
 Idea.deleteOne({
     _id : req.params.id
 }).then( () =>{
    req.flash('success_msg' , 'Video idea has been deleted');
     res.redirect('/ideas')
 })
})

module.exports = router;
