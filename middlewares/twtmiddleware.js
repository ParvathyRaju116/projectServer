const jwt=require('jsonwebtoken')

exports.jwtMiddleWare=(req,res,next)=>{
    console.log("inside middleware");
    // token access
    const token=req.headers['access_token'].split(" ")[1]

    // verify token
   try{
      const JWTresponses=jwt.verify(token,'supersecretkey123')
      console.log(JWTresponses);
      req.payload=JWTresponses._id 
      next()
   }
   catch{
     res.status(401).json("Autherization failed ! please login")
   }
} 