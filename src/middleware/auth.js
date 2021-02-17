const jwt =require("jsonwebtoken")
const User=require("../models/user")
const auth = async(req,res,next)=>{
  try{
  //  console.log(req.headers['authorization']); 
   const token=req.header('Authorization').replace('Bearer','');
  //  console.log(token);
   const decoded=jwt.verify(token,'highly secure');
  //  console.log(decoded);
   const user=await User.findById({_id:decoded._id,'tokens.token':token});
  //  console.log(user);
   if(!user)
   throw new Error;
  // console.log("token",token);
  req.user=user;
next();
}

   catch(error)
   {
     res.status(401).send({"error":"please authenticate"});
    }
   
};
module.exports=auth;