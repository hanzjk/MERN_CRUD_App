const mongoose=require('mongoose');
var bcrypt = require('bcrypt-nodejs');

const materialSchema=mongoose.Schema({
   
    name:{
        type:String,
    },
   
    img:{
        type:String,
        required:true
    },



});


module.exports=mongoose.model('meterials',materialSchema); //creat the collection in DB