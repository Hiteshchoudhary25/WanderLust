const User = require("../models/user.js");

module.exports.renderSignupForm = (req,res) =>{
    res.render("./users/signup.ejs")
};


module.exports.signUp = async(req,res) =>{
    try{
        let{username ,password , email} = req.body;
        const newUser =  new User({email, username});
        const registeredUser =  await User.register(newUser , password);
        console.log(registeredUser);
        req.login(registeredUser , (err) =>{
            if(err){
                return next(err);
            }
            req.flash("sucess" ,"Wellcome to WANDERLUST");
            res.redirect("/listings");
        });
        
    }catch(e){
        req.flash("error" , e.message);
        res.redirect("/signup");
    }
    
};

module.exports.renderLoginForm = (req,res) => {
    res.render("./users/login.ejs");
};

module.exports.login = async(req,res) =>{
    req.flash("sucess" ,"Wellcome Back to WanderLust ! ");
    let redirectUrl = res.locals.redirectUrl || "/listings"
    res.redirect(redirectUrl);
};

module.exports.logout =  (req,res, next) =>{
    req.logOut((err) =>{
        if(err){
            return next(err);
        }
        req.flash("sucess" ,"You Sucessfully Logout !");
        res.redirect("/listings");
    })
};