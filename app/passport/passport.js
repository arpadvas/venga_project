var FacebookStrategy = require('passport-facebook').Strategy;
var User = require('../models/user');
var session = require('express-session');
var jwt = require('jsonwebtoken');
var secret = 'cora';

module.exports = function(app, passport) {

	app.use(passport.initialize());
	app.use(passport.session());
	app.use(session({ secret: 'keyboard cat', resave: false, saveUninitialized: true, cookie: { secure: false } }));

  passport.serializeUser(function(user, done) {
      token = jwt.sign({ name: user.name, email: user.email, picture: user.picture}, secret, {expiresIn: '24h'});
      done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
      User.findById(id, function(err, user) {
        done(err, user);
      });
  });

	passport.use(new FacebookStrategy({
    	clientID: '1839296899669021',
    	clientSecret: '13c3f2b45a0fc95e5416d6c34378bb7f',
    	callbackURL: "http://localhost:3000/auth/facebook/callback",
    	profileFields: ['id', 'displayName', 'photos', 'email']
  },
  function(accessToken, refreshToken, profile, done) {
      console.log(profile._json.picture.data);
      User.findOne({ email: profile._json.email }).select('name password email').exec(function(err, user) {
          if (err) done(err);

          if (user && user != null) {
            done(null, user);
          } else {
            done(err);
          }
      });

      //done(null, profile);
    }
  ));

  app.get('/auth/facebook/callback',passport.authenticate('facebook', { failureRedirect: '/login' }), function(req, res) {
    res.redirect('/facebook/' + token);
  });

  app.get('/auth/facebook', passport.authenticate('facebook', {scope: 'email'}));

	return passport;

};