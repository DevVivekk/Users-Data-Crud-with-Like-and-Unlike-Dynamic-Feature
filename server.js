const express = require('express')
const app = express();
const dotenv = require('dotenv')
require("dotenv").config()
const path = require('path')
const cors  = require('cors')
const UserModel = require('./db')
app.use(express.json())
app.use(cors())
app.listen(4000);


app.post('/submit',async(req,res)=>{
    try{
        const {name,email,username,mobile,website} = req.body;
        if(!name || !email || !username || !mobile || !website){
            return res.status(401).json("No data")
        }else{
            const save = await new UserModel({name,email,username,mobile,website}).save()
            res.status(201).json('saved')
        }
    }catch(e){
        console.log(e)
        return res.status(401).json(e)
    }
})

app.delete('/delete/:id',async(req,res)=>{
    try{
        const {id} = req.params;
        const check = await UserModel.findOne({_id:id})
        if(check){
        const del = await UserModel.findByIdAndDelete({_id:id})
        res.status(201).json("deleted!")
        }else{
            res.status(401).json("error")
        }
    }catch(e){
        console.log(e)
        res.status(401).json(e);
    }
})
app.put('/update/:id',async(req,res)=>{
    try{
        const {name,email,username,mobile,website} = req.body;
        console.log(req.body)
        const {id} = req.params;
        const checkid = await UserModel.findById({_id:id})
        if(checkid){
            const update = await UserModel.findByIdAndUpdate({_id:id},{name,email,username,mobile,website},{new:true})
            res.status(201).json(update)
            console.log(update)
        }else{
            res.status(401).json("error")
        }
    }catch(e){
        console.log(e)
        res.status(401).json(e)
    }
})

app.get('/api',async(req,res)=>{
    const find = await UserModel.find({})
    res.status(201).json(find)
})

//findbyId 
app.get('/:id',async(req,res)=>{
    try{
        const {id} = req.params;
        const find = await UserModel.findById({_id:id})
        res.status(201).json(find)
    }catch(e){
        console.log(e)
        res.status(401).json(e);
    }
})


//saving likes
app.put('/likes/:id',async(req,res)=>{
    try{
        const liked = {
            like:req.body.token
        }
        const {id} = req.params;
        const check = await UserModel.findById({_id:id})
        if(check){
            const save = await UserModel.findByIdAndUpdate(req.params.id,{$push:{likes:liked}},{new:true})
            console.log(save)
            res.status(201).json('sucess')
        }else{
            return res.status(401).json("error")
        }
        }catch(e){
        console.log(e)
        res.status(401).json(e);
    }
})

//unlike 
app.put('/unlikes/:id',async(req,res)=>{
    try{
        const liked = {
            like:req.body.token
        }
        const {id} = req.params;
        const check = await UserModel.findById({_id:id})
        if(check){
            const save = await UserModel.findByIdAndUpdate(req.params.id,{$pull:{likes:liked}},{new:true})
            console.log(save)
            res.status(201).json('sucess')
        }else{
            return res.status(401).json("error")
        }
        }catch(e){
        console.log(e)
        res.status(401).json(e);
    }
})


//production
if(process.env.NODE_ENV ==="production"){
    app.use(express.static(path.join(__dirname,"build")));
   app.get('/',(req,res)=>{
    res.sendFile(path.resolve(__dirname,'build','index.html'));
   })
}

//