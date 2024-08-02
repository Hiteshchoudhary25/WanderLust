const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");


const MONGO_URL = "mongodb://127.0.0.1:27017/wangerLust";

main().then((res) =>{
    console.log("Succesfully Conected to DATABASE");
}).catch((err) =>{
    console.log(err);
})

async function main(){
    await mongoose.connect(MONGO_URL);
}

const initDB = async () =>{
    await Listing.deleteMany({});
    initData.data =  initData.data.map((obj) => ({...obj , owner: "66a3d6bede9f944dff2c003d"}))
    await Listing.insertMany(initData.data);
    console.log("Data was initialised !!");
}

initDB();