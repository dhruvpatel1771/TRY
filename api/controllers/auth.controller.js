import bcrypt from "bcrypt";
import prisma from "../lib/prisma.js";
import jwt from "jsonwebtoken";

export const register = async (req,res) => {
    const { username, email, password } = req.body;
    
    try{

        //HASH THE PASSWORD
        
        const hashedPassword = await bcrypt.hash(password, 10);

        console.log(hashedPassword);
        //CREATE A NEW USER AND SAVE TO DB
        const newUSer = await prisma.user.create({
            data: {
                username,
                email,
            password: hashedPassword,
        }
    });
    
    console.log(newUSer);
    
    res.status(201).json({ message: "User created successfully"});
    }catch(err){
    console.log(err)
    res.status(500).json({message: "Failed to create user!"});
    }
};  
export const login = async(req,res) => {
    const {username, password} = req.body;

    try{

        //CHECK IF THE USER EXISTS
        const user = await prisma.user.findUnique({
            where: {username}
        })

        if(!user) return res.status(401).json({message:"Invalid Credentials"})
        
        //CHECK IF THE PASSWORD IS CORRECT

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        
        
        //GENERATE A COOKIE TOKEN AND SEND TO THE USER 

        // res.setHeader("Set-Cookie", "test=" + "myValue").json("success")
        const age = 1000 * 60 * 60 * 24 * 14;

        const token = jwt.sign(
            {
            id:user.id,
            isAdmin: true,
            },
             process.env.JWT_SECRET_KEY,
            {expiresIn: age }
        );

        const {password: userPassword, ...userInfo} = user

        res.cookie("token",token,{
            httpOnly:true,
            // secure:true,
            maxAge: age,
        })
        .status(200)
        .json(userInfo);
    }catch(err){
        console.log(err)
        res.status(500).json({message: "Failed to login!"});
    }
};
export const logout = (req,res) => {
    //db operations
    res.clearCookie("token").status(200).json({message:"Logout Successful"})
};
