const router = require('express').Router()
const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const { User } = require('../db/models');

// const auth = passport.authenticate('google',{scope:'email'}) //google is our strategy, and we now need to define how we want it to work.
//client request to login though google 

// client ID 128040547674-4qg2gl6ju4u8a3m3i4ah52j5grlv12rp.apps.googleusercontent.com

//secret uKVhxsXbxo4tdY_Fy0N7YKHd

passport.use(
  new GoogleStrategy({
    clientID: '128040547674-4qg2gl6ju4u8a3m3i4ah52j5grlv12rp.apps.googleusercontent.com',
    clientSecret: 'uKVhxsXbxo4tdY_Fy0N7YKHd',
    callbackURL: 'http://localhost:1337/auth/google/verify'
  },
  /* The following callback will be used when passport successfully 
     authenticates with Google (the provider) for us, 
     using our `clientId`, `clientSecret` and the temporary token from the client
     Google sends the `token`, `refreshToken` and `profile`
     passport provides the `done` function
  */
  function (token, refreshToken, profile, done) {
    /* the callback will pass back user profile information 
       each service (Facebook, Twitter, and Google)
       will pass it back a different way. 
       Passport standardizes the data that comes back in its profile object.
    ---
    Now that we have Google profile information for the client what should we do??
    --- fill this part in ---
    */
   const info = {
        name: profile.displayName, 
        email: profile.emails[0].value,
        photo: profile.photos ? profile.photos[0].value : undefined
    }
   
   User.findOrCreate({
       where:{googleId:profile.id}, 
       defaults: info
    }).spread((user,created)=>{

   
       done(null,user)  //where does the token and refresh token come in
   }).catch(done)

    //console.log('---', 'in verification callback', profile, '---');
  
  })
);
router.get('/', passport.authenticate('google',{scope:'email'}))



router.get('/verify',
    passport.authenticate('google',{
        successRedirect:'/',
        failureRedirect:'/'
    })
)

module.exports = router 