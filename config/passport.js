const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { findOrCreateGoogleUser } = require('../services/authService');

passport.use(new GoogleStrategy({
   clientID: process.env.GOOGLE_CLIENT_ID,
   clientSecret: process.env.GOOGLE_CLIENT_SECRET,
   callbackURL: '/api/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
   try {
      const user = await findOrCreateGoogleUser(profile);
      return done(null, user); // Este "user" estará disponible en el controller
   } catch (err) {
      return done(err, null);
   }
}));
