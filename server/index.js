const express = require('express');
const app = express();
const path = require('path');
const volleyball = require('volleyball');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport')
const { User } = require('./db/models');
/* "Enhancing" middleware (does not send response, server-side effects only) */
app.use(volleyball);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//session middleware
app.use(session({
  // this mandatory configuration ensures that session IDs are not predictable
  secret: 'SunnyB3aches', // or whatever you like
  // this option says if you haven't changed anything, don't resave. It is recommended and reduces session concurrency issues
  resave: false,
  // this option says if I am new but not modified still save
  saveUninitialized: true
}));

app.use(passport.initialize()); // middleware required to initialize Passport     //PASSPORT MIDDLEWARE MUST BE AFTER SESSION MIDDLEWARE BECAUSE WORKS ON TOP
 // hooks into the persistent sessions we are using                              //OF SESSION. DOES THE INTERACTING WITH IT FOR US (creating+ending the session with login and logout)

passport.serializeUser(function (user, done) {
  /* Remember you want to go from a big object (user instance)
     to a small identifying key that is easily stored as a string
     You give this key to done in the appropriate order
     ------------ YOUR CODE HERE ------------
  */

  done(null,user.id)
});

passport.deserializeUser(function (id, done) {
  /* We want to go from a small item (userId)
     to a large object! The reverse of serialization
     How do we get that object?
     Don't forget about `done`
     ------------ YOUR CODE HERE ------------
  */
    User.findById(id)
      .then(user=>{
        done(null,user)
      })
      .catch(done)
});

app.use(passport.session());

// place right after the session setup middleware
app.use(function (req, res, next) {
  console.log('SESSION: ', req.session);
  console.log('SESSION USER: ', req.user);
  next();
});



app.use(function (req, res, next) {
  if (!req.session.counter) req.session.counter = 0;
  console.log('counter', ++req.session.counter); // increment THEN log
  next(); // needed to continue through express middleware
});

/* "Responding" middleware (may send a response back to client) */
app.use('/auth', require('./auth'))
app.use('/api', require('./api'));

const validFrontendRoutes = ['/', '/stories', '/users', '/stories/:id', '/users/:id', '/signup', '/login'];
const indexPath = path.join(__dirname, '../public/index.html');
validFrontendRoutes.forEach(stateRoute => {
  app.get(stateRoute, (req, res, next) => {
    res.sendFile(indexPath);
  });
});

/* Static middleware */
app.use(express.static(path.join(__dirname, '../public')))
app.use(express.static(path.join(__dirname, '../node_modules')))

app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(err.status || 500).send(err.message || 'Internal Error');
});

module.exports = app;
