import express from "express";
import path from "path";
import mongoose, { mongo } from "mongoose";
const uri = 'mongodb://localhost:27017'
mongoose.connect(uri, { 
    dbName: "backend",
 }).then(() => console.log("Connected to database")).catch((err) => console.log(err));
const app = express();

const messageSchema= new mongoose.Schema({
    name: String,
    email: String,
});

const Message = mongoose.model("Message", messageSchema);
app.get("/add", (req, res) => {
Message.create({name:"Vinay mishra", email:"XXXXXXXXXXXXXXX"}).then((result) => {
    res.send(result);
});
});


//Using middlewares
app.use(express.static(path.join(path.resolve(),"public")));
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.get("/", (req, res) => {
    res.render("index",{name:"Vinay mishra"});
});
app.post("/login", (req, res) => {
    users.push({name:req.body.username,email:req.body.password});
    console.log("content is",users);
    res.redirect("success");
});
app.get("/success", (req, res) => {
    res.render("success");
});
app.listen(8080, () => {
    console.log("Server is running on port 8080");
});
