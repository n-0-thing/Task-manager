const mongoose = require("mongoose");
const validator = require("validator");
const Task = require("../models/task");

const bcrypt= require("bcryptjs");
const jwt = require("jsonwebtoken")
const userSchema=new mongoose.Schema({
    name: {
      type: String,
      required: true,
      trim: true,
    },
    age: {
      type: Number,
      default: 0,
      validate(value) {
        if (value < 0) throw new Error("Age must be greater than zero");
      },
    },
    email: {
      type: String,
      unique:true,
      required: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid");
        }
      },
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      minLength: 7,
      trim: true,
      validate(value) {
        if (value.toLowerCase().includes("password")) throw new Error("Invalid password");
      },
    },
    tokens:[{
        token:{
            type: String,
            required: true
        }

    }],
  },{
    timestamps:true
});
userSchema.virtual('tasks',{
  ref:'Task',
  localField:'_id',
  foreignField:'owner'
})
// userSchema.methods.getPublicProfile= async function(){
//   const user=this;
//   const userObject=user.toObject();
//   // console.log(userObject);
//   delete userObject.password;
//   delete userObject.tokens;
//   return userObject;
// }

userSchema.methods.toJSON= function(){
  const user=this;
  const userObject=user.toObject();
  // console.log(userObject);
  delete userObject.password;
  delete userObject.tokens;
  return userObject;
}

userSchema.methods.generateAuthToken = async function(){
 const user= this;
 const token =jwt.sign({_id:user._id.toString()},'highly secure');
 user.tokens=user.tokens.concat({token})
 await user.save();
 return token;
}
userSchema.statics.findByCredentials = async (email, password)=>{
    const user =await User.findOne({email});
    if(!user) throw new Error("unable to login")
    
    const isMatch =await bcrypt.compare(password, user.password);
    // console.log(isMatch);
    if(!isMatch) throw new Error({error:"password is wrong"});
    return user;
}
userSchema.pre('save',async function(next){
  const user=this;
  if(user.isModified('password')){
      user.password=await bcrypt.hash(user.password,8);
  }

  next();
});
userSchema.pre('remove',async function(next){
  const user=this;
  await Task.deleteMany({owner:user._id});
  next();
})
const User = mongoose.model("User",userSchema );
module.exports=User
