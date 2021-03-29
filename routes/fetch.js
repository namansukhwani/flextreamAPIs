const express=require('express');
const router=express.Router();
const fetch=require('node-fetch');
const cors=require('cors')

const validateRequest=(body)=>{
    if("username" in body && "password" in body && "url" in body){
        if(body.username==="Hitman12355" && body.password==="qwerty123456"){
            return true
        }
        else{
            return false
        }
    }
    else{
        return false
    }
}

router.post('/',cors({origin:"*",credentials:true}),(req,res,next)  =>{
    if(validateRequest(req.body)){
        if("options" in req.body){
            fetch(req.body.url,req.body.options)
            .then(response=>response.json())
            .then(data=>{
                // console.log(data);
                res.statusCode=200;
                res.setHeader('Content-Type','application/json');
                res.json(data);
            })
            .catch(err=>next(err))
        }
        else{
            fetch(req.body.url)
            .then(response=>response.json())
            .then(data=>{
                // console.log(data);
                res.statusCode=200;
                res.setHeader('Content-Type','application/json');
                res.json(data);
            })
            .catch(err=>next(err))
        }
    }
    else{
        var err=new Error("Invalid user request either a wrong user or wrong body parameters.")
        next(err)
    }
})

module.exports=router