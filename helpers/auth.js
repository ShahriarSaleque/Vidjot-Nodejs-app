module.exports = {
    ensureAuthenticated : function(req , res , next){ 
        if(req.isAuthenticated()){
            return next();
        }
        req.flash('error_msg' , 'Not Authorized');
        res.redirect('/users/login');
    } , ensure : function(req , res , next){ 
        if(req.isAuthenticated()){
            return next();
        }
        req.flash('error_msg' , 'Login first');
        res.redirect('/users/login');
    } 

}