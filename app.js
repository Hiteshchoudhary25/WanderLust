if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}


const express = require("express");
const app = express();
const mongoose = require("mongoose");
// const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");    //Ejs mate is helped in rendering the template for the different pages , EX- navbar , footer , sidebar 
// const wrapAsync = require("./utils/wrapAsync.js");   //used to simplify error handling in asynchronous functions,  
const ExpressError = require("./utils/ExpressError.js"); //used to create custom class express error 
// const {listingSchema ,reviewSchema} = require("./schema.js"); //validation for the listing schema and review Schema
// const Review = require("./models/review.js"); //Importing the review schema from the Models and schema
const session =  require("express-session")  // Express session is used to store some data which is not saved in the database 
const MongoStore =  require("connect-mongo") // Online database used for storing sessions
const flash =  require("connect-flash"); //Pops us the temporary message for the client side 
const passport =  require("passport"); //password used for the authenication process
const LocalStrategy = require("passport-local"); //authenticate using a username and password in your Node.js applications
const User = require("./models/user.js"); //Importing the user schema from the Models 



const listingRouter = require("./routes/listing.js"); // Requiring the listing route 
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");



// const MONGO_URL = "mongodb://127.0.0.1:27017/wangerLust";
const dbUrl = process.env.ATLASDB_URL;

main().then((res) =>{
    console.log("Succesfully Conected to DATABASE");
}).catch((err) =>{
    console.log(err);
})

async function main(){
    await mongoose.connect(dbUrl);
};

app.set("view engine" , "ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true})) // to parse the data from the parms
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, 'public'))); 
app.engine("ejs",ejsMate);  //Used for boilerplate code 

const store = MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter: 24 * 3600,
});

store.on("error" ,(err) =>{
    console.log("ERROR IN MONGO SESSION" , err);
})
const sessionOptions = {
    store,
    secret : process.env.SECRET,
    resave :false,
    saveUninitialized:true,
    cookie:{
        expires : Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge : 7 * 24 * 60 * 60 * 1000,
        httpOnly : true,
    },
};

// app.get("/" , (req,res) =>{
//     // console.log("connected success");
//     res.send("Hi , i am root folder")
// });



app.use(session(sessionOptions));
app.use(flash()); //setting up the flash means user will get some msg when he log in or other activity after that it deletes from the memory

app.use(passport.initialize()); //A middleware that initializes the passport
app.use(passport.session()); //session is used to store the user data in the memory
passport.use(new LocalStrategy(User.authenticate())); 

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser()); //Generates a function that is used by Passport to serialize users into the session
passport.deserializeUser(User.deserializeUser()); //Generates a function that is used by Passport to deserialize users into the session


app.use((req,res,next) =>{
    res.locals.sucess = req.flash("sucess");
    res.locals.error = req.flash("error");
    res.locals.currUser =  req.user;
    next();
});

// app.get("/demouser" , async(req,res) =>{
//     let fakeUser = new User({
//         email:"student@gmail.com",
//         username:"delta-student"
//     });
    
//    let registerUser =  await User.register(fakeUser,"heloworld");  //register(user, password, cb) Convenience method to register a new user instance with a given password. Checks if username is unique.
//    res.send(registerUser);
// });

app.use("/listings" , listingRouter);
app.use("/listings/:id/reviews" , reviewRouter);
app.use("/" , userRouter);


app.all("*",(req,res,next) =>{
    next(new ExpressError(404,"Page not Found !!"));
});

app.use((err,req,res,next) =>{
   let{statusCode=500, message="Something Went Wrong"} =err;
   res.status(statusCode).render("error.ejs",{err});
//    res.status(statusCode).send(message);
});

app.listen(8080,() =>{
    console.log("App is running on Port 8080")
});