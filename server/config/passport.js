const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');
const crypto = require('crypto');

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback",
      proxy: true
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // 1. Check if user already exists
        let user = await User.findOne({ email: profile.emails[0].value });

        if (user) {
          return done(null, user);
        }

        // 2. If not, create a new user
        // We generate a random password because your schema requires it
        const randomPassword = crypto.randomBytes(20).toString('hex');

        user = await User.create({
          username: profile.displayName.split(' ').join('').toLowerCase() + Math.floor(Math.random() * 1000),
          email: profile.emails[0].value,
          password: randomPassword,
          profilePicture: profile.photos[0].value,
        });

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

// Serialize/Deserialize (Required for sessions, though we use JWTs, Passport needs this)
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => done(err, user));
});