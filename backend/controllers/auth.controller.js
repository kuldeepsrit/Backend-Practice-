import User from "../models/User.js" ;

import bcrypt  from "bcryptjs";

import jwt  from "jsonwebtoken";

import {
  generateAccessToken,
  generateRefreshToken
} from "../utils/generateTokens.js";




 export const register =  async (req, res) => {
   console.log("yes", req.body);

  try {
    const { name, email, password } = req.body;
         console.log("Checking email:", email); 
         const userExist = await User.findOne({ email });


    console.log("User found:", userExist);

    if (userExist) {
      return res.status(400).json({ message: "User already exists, please login" });
    }

    const hashpassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashpassword
    });

    res.status(201).json({
  message: "User registered successfully"
});

  } catch (error) {
  console.error("REGISTER ERROR:", error);
  res.status(500).json({
    message: error.message
  });
}
};

// for  login 



export const login = async (req, res) => {

  console.log("login is ", req.body);
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "User not found"
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials"
      });
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(200).json({
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res.status(500).json({ message: "theres is error:" });
  }
};


export const refresh = async(req,res)=>{

    const token  = req.cookies.refreshToken;
    if(!token){
        return res.status(401).json({message:"NO refresh Token"});
    }

    const user = await User.findOne({refreshToken:token});

    if(!user){
        return res.status(403).json({message:"invalid  refresh token "});
    }

    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, decoded)=>{
        if(err){
         return res.status(403).json({ message: "Token expired" });
        }

        const newAccessToken = generateAccessToken(decoded.userId);

        res.json({accessToken :newAccessToken});
    });

};


export const logout = async (req, res) => {
  const token = req.cookies.refreshToken;

  if (!token) {
    return res.sendStatus(204);
  }

  const user = await User.findOne({ refreshToken: token });

  if (user) {
    user.refreshToken = null;
    await user.save();
  }

  res.clearCookie("refreshToken");
  res.json({ message: "Logged out successfully" });
};


    



