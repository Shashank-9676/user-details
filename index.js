const express = require('express');
const dotenv = require('dotenv')
const mongoose = require('mongoose')

const app = express()
dotenv.config()
app.use(express.json())
mongoose.connect(process.env.MONGO_URI,{
    useNewUrlParser : true
})
.then(() => {
    console.log("MongoDB connected")
    app.listen(3000)
})
.catch(err => {
    console.error("MongoDB connection Error:",err)
    process.exit(1)
});

const userShema = new mongoose.Schema({
    name : String,
    email : String
})

const User = mongoose.model('User',userShema)

app.get('/users', async(req,res) => {
    try{
        const users = await User.find();
        res.status(200).send(users)
    }catch(err){
        res.status(500).send("Internal server error:",err)
    }
})

app.post('/users',async (req,res) => {
    const {name , email} = req.body
    try{
        const user = new User({name,email});
        await user.save()
        res.status(200).json({
            "message" : "User details added successfully"
        })
    }catch(err){
        console.log('Error while creating user',err)
    }
})
