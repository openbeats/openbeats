import User from "../models/User";
import passport from "passport";
import {
  Strategy as localStrategy
} from "passport-local";
import bcrypt from "bcryptjs";

export default () => {
  passport.use(
    new localStrategy({
        usernameField: "email",
        passwordField: "password",
        session: false
      },
      async (email, password, done) => {
        try {
          const user = await User.findOne({
            email
          });

          if (!user) {
            return done(null, false, {
              message: "Invalid Credentials."
            });
          }
          const passwordValid = await bcrypt.compare(password, user.password);
          if (!passwordValid) {
            return done(null, false, {
              message: "Invalid Credentials."
            });
          }
          return done(null, {
            id: user.id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            admin: user.admin,
            likedPlaylists: user.likedPlaylists
          });
        } catch (error) {
          return done(error);
        }
      }
    )
  );
};