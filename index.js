import express from "express";
import path from "path";
import mongoose, { mongo } from "mongoose";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

//Connecting to database

const uri = 'mongodb://localhost:27017'
mongoose.connect(uri, { 
    dbName: "backend",
 }).then(() => console.log("Connected to database")).catch((err) => console.log(err));
const app = express();

const userSchema= new mongoose.Schema({
    username: String,
    email: String,
    password: String,
});

const User = mongoose.model("User", userSchema);

//Using middlewares
app.use(express.static(path.join(path.resolve(),"public")));
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(cookieParser());



const isAuthenticated = async (req,res,next)=>
{
    const {token} = req.cookies;
    console.log("cookies are::",token)
    if(token){
        const decode = jwt.verify(token,"secretkeywords");
        req.user = await User.findById(decode._id);
        next();
    }
    else{
        res.render("login");
    }
};

app.get("/",isAuthenticated,(req,res)=>{
    res.render("logout",{name:req.user.name});
});

app.get("/register",(req,res)=>{
    res.render("register");
});

app.post("/register", async (req,res)=>
{
    const {username,email,password} = req.body;
    console.log("name is:",username,email,password)
    let user = await User.findOne({email});
    if(user){
        return res.redirect("/login");
    }
    user = await User.create({
        username,
        email,
        password
    });
    const token = jwt.sign({_id:user._id},"secretkeywords");
    console.log("toeken is ::",token)
    res.cookie("token",token,{
        httpOnly:true,
        expires:new Date(Date.now()+60*1000)
    })
    res.redirect("/");
});

app.get("/login",(req,res)=>
{
    res.render("login");
});



app.post("/login", async (req, res) => {
    const {email,password} = req.body;
    let user = await User.findOne({ email }).select("+password");
    console.log("user data is::",user.password)
    if(!user){
        return res.redirect("/register");
    }
    const isMatch = user.password === password;
    console.log("passwords are:::::",user.password,password)
    if(!isMatch){
        return res.render('login');
    }   
    const token = jwt.sign({_id:user._id},"secretkeywords");
    res.cookie("token",token,{
        httpOnly:true,
        expires:new Date(Date.now()+60*1000)
    });
    res.redirect("/");
});







app.listen(8080, () => {
    console.log("Server is running on port 8080");
});
