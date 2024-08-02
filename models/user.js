const mongoose = require("mongoose");   //required the mongoose 
const Schema = mongoose.Schema;   //creating the instance of the moongoose.Schem
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    email: {
        type: String,
        require:true,
    },
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);