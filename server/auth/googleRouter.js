const router = require('express').Router()
const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const { User } = require('../db/models');

module.exports = router


// client ID 128040547674-4qg2gl6ju4u8a3m3i4ah52j5grlv12rp.apps.googleusercontent.com
//secret uKVhxsXbxo4tdY_Fy0N7YKHd

passport.use(
  new GoogleStrategy({
    clientID: '128040547674-4qg2gl6ju4u8a3m3i4ah52j5grlv12rp.apps.googleusercontent.com',
    clientSecret: 'uKVhxsXbxo4tdY_Fy0N7YKHd',
    callbackURL: 'http://localhost:1337/auth/google/verify'                     //this has to match the one written at line 59
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

    */
   const info = {
        name: profile.displayName,
        email: profile.emails[0].value,
        photo: profile.photos ? profile.photos[0].value : undefined
    }

   User.findOrCreate({
       where:{googleId:profile.id},
       defaults: info
    }).then(([user,createdBool])=>{                 //ES6 destructuring
        done(null,user)                     //done just passes the info onto the next step.
    }).catch(done)
   })
);


router.get('/', passport.authenticate('google',{scope:'email'}))        //sending user to google. the scope 'email' doesn't necessarily mean just getting the email - that's just the name of the specific scope, here still get displayName and email and profile photos. see line 33



router.get('/verify',                                   //when they come back they're going to hit this
    passport.authenticate('google',{                    //same function as before! with different second param..
        successRedirect:'/',
        failureRedirect:'/'
    })
)

