const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const flash = require('connect-flash');
const session = require('express-session');
const mongoose = require('mongoose');
const passport = require('passport');
const app = express();

//Remove deprecation
mongoose.Promise = global.Promise;

//Load and use routes
const idea = require('./routes/ideas');
const user = require('./routes/users');


//Load and initialize passport
require('./config/passport')(passport);

//DB config
const db = require('./config/database');

//Static folder
app.use(express.static(path.join(__dirname , 'public')));

//MongoDb connected
mongoose.connect(db.mongoURI , {
    useNewUrlParser : true
})
.then(() => console.log('MongoDB is connected'))
.catch((err) => console.log(err))

//Handlebars middleware
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

//Express-session middleware
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
    }));

//Passport middleware
app.use(passport.initialize());
app.use(passport.session());


app.use(flash());

//Global variables
app.use(function(req , res , next){
// res.locals.success_msg = req.flash('success_msg');
// res.locals.error_msg = req.flash('error_msg');
// res.locals.error = req.flash('error');
 res.locals.user = req.user || null;
 next();
 })



//Index route
app.get('/' , (req , res) =>{
    const title = 'Welcome'
    res.render('Index' , {
        title : title
    })
});

//Use routes
app.use('/ideas' , idea);
app.use('/users' , user);

//About route
app.get('/about' , (req ,res) =>{
 res.render('About');
})

const port = process.env.PORT || 4000;

app.listen(port , () =>{
    console.log(`Server started on port ${port}`);
})

