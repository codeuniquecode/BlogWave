const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../model/registerSchema'); // Renamed to 'User' for clarity

const GOOGLE_CLIENT_ID = process.env.clientid;
const GOOGLE_CLIENT_SECRET = process.env.clientsecret;

module.exports = function(passport) {
  passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      let existingUser = await User.findOne({ email: profile.emails[0].value });

      if (!existingUser) {
        const newUser = new User({
          name: profile.displayName,
          email: profile.emails[0].value,
          password: null,
          role: 'user'
        });
        await newUser.save();
        return done(null, newUser);
      }

      return done(null, existingUser);
    } catch (err) {
      return done(err, null);
    }
  }));

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const foundUser = await User.findById(id);
      done(null, foundUser);
    } catch (err) {
      done(err, null);
    }
  });
};
