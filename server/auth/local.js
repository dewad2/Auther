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
            req.login(user, function(err) {
                if (err) { return next(err); }
                return res.redirect('/users/' + req.user.username);
            });
        }
    }).catch(next)
})
//remove user from session
router.delete('/logout',(req,res,next)=>{
   //this destroys the session, including the session key and userID
    // destroys entire session
  /* Below are alternatives to the above  
  delete req.session.userId; // deletes one item on session
  req.session.userId = null;
  */
    req.logout()
//    req.session.destroy() we no longer need to destroy the session becuase we are logging out 
   res.sendStatus(204)
})


module.exports = router