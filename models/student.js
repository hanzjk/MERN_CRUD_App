const mongoose=require('mongoose');
var bcrypt = require('bcrypt-nodejs');

const studentSchema=mongoose.Schema({
    fname:{
        type:String,
        required:true
    },
    lname:{
        type:String,
        required:true
    },
    RegistrationNo:{
        type:String,
        required:true 
    },
   
   
    email:{
        type:String,
        required:false
    },
    contactNo:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:false
    },
    grade:{
        type:String,
        required:false
    }
   


});

// hash the password
studentSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
  };
  
// checking if password is valid
studentSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
  };

module.exports=mongoose.model('studentInfo',studentSchema); //creat the collection in DB