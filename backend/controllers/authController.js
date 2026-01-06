import User from "../models/User.js";
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";

export const register = async(req,res) =>{
    try{
        const{name,email,password} = req.body;

        const emailExists = await User.findOne({email});
        if(!email || !name || !password){
             return res.status(400).json({msg:'All fields are required'});

        } 

        if(emailExists){
            return res.status(400).json({msg:'Email already exists'});
        }

        const hashedPassword = await bcrypt.hash(password,10);

        const newUser = await User.create({
            name,
            email,
            password:hashedPassword
        });


        res.status(200).json({msg:"User registered successfully" ,userId: newUser._id })


    }catch(error){
        res.status(500).json({msg:'server error'});
    }

};
export const login = async (req,res)=>{
    try{
        const {email , password} = req.body;

        const user = await User.findOne({email});
        if(!user) return res.status(400).json({msg:"User does not exist"});
        
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) return res.status(400).json({msg: "Incorrect password"});

        const token = jwt.sign({userId:user._id},process.env.JWT_SECRET,{expiresIn:'7d'});
        console.log(token);

        res.json({msg:'Login successful',token,user:{id:user._id, name:user.name,email:user.email}})
    }catch(error){
         res.status(500).json({ msg: "Server error" });
    }
}
