const mongoose = require("mongoose");   //required the mongoose 
const Schema = mongoose.Schema;   //creating the instance of the moongoose.Schema

const reviewSchema = new Schema({
    comment:String,
    rating:{
        type:Number,
        min:0 ,
        max: 5,
    },
    createdAt:{
        type: Date,
        default: Date.now(),
    },
    author:{
        type: Schema.Types.ObjectId,
        ref:"User",
    },
});

module.exports = mongoose.model("Review", reviewSchema);