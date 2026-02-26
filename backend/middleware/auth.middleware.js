

import jwt from "jsonwebtoken";

const protect = async (req,res ,next)=>{

    const authHeader  = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith("Bearer")){

    return res.status(401).json({meassge:"No token "});

    };

    const  token = authHeader.split(" ")[1];

 try {
      const decoded = jwt.verify(token , process.env.ACCESS_TOKEN_SECRET);

      req.user = decoded.userId;
      next();
   }

    catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }


};
export default protect;