const mongoose = require("mongoose");


module.exports = mongoose.model("blogger",new mongoose.Schema({

    title:"string",
    description:"string",
    markdown:"string",
    date:Date,
    id:String
  
 }))

