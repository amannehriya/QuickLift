const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
    fullname:{
        firstname:{
            type:String,
            required:true,
            min:[3,"first name must be atleast 3 letter"]
        },
        lastname:{
            type:String,
            min:[3,"first name must be atleast 3 letter"]
        }
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
        select:false
    },
    socketId:{
        type:String,
    }
})

userSchema.methods.generateAuthToken  = function(){
    const token = jwt.sign({_id:this._id},process.env.JWT_SECRET,{expiresIn:'24h'});
    return token;
}

// methods=means you can call it on a specific document (user object) created from the schema.

userSchema.methods.comparePassword = async function(password){
    return await bcrypt.compare(password,this.password)
};

//statics = means you call it directly on the model itself, not on an individual document.
userSchema.statics.hashPassword = async function(password){
    return await bcrypt.hash(password,10);
}

const userModel = mongoose.model('user',userSchema)

module.exports = userModel