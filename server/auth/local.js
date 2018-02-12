const router = require('express').Router()
const HttpError = require('../utils/HttpError');
const { User } = require('../db/models');


// router.get('/',(req,res,next)=>{
//     res.json("jkfdlsja")
    
// })

router.put('/login',(req,res,next)=>{

    const email = req.body.email 
    const password = req.body.password

    User.findOrCreate({where:{
        email,
        password
    }}).spread((user,created) =>{
        
        if(!user){
            throw HttpError(404)
            
        }else{
            req.session.userId = user.id 
            res.end()
        }
    }).catch(next)
    

})
module.exports = router