const mongoose=require('mongoose');
var bcrypt = require('bcrypt-nodejs');

const adminSchema=mongoose.Schema({
   
    username:{
        type:String,
        required:true 
    },
   
    password:{
        type:String,
        required:true
    },

     resetToken:String,
     expireToken:Date,
    


});

// hash the password
adminSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
  };
  
// checking if password is valid
adminSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
  };

module.exports=mongoose.model('adminInfo',adminSchema); //creat the collection in DB