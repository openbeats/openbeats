import express from "express";
import User from "../models/User";
import passport from "passport";
import jwt from "jsonwebtoken";
import config from "config";
import { check, validationResult } from "express-validator";
import gravatar from "gravatar";
import bcrypt from "bcryptjs";
import auth from "../config/auth";

const router = express.Router();

router.post("/login", (req, res, next) => {
  passport.authenticate("local", (error, user, info) => {
    if (error) {
      console.error(error.message);
      res.status(500).send({ error: "Internal Server Error" });
    }
    if (info !== undefined) {
      res.status(400).send({ error: info.message });
    } else {
      const payload = { user: { id: user.id } };
      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: 360000 },
        (err, token) => {
          try {
            if (err) throw error;
            res.send({
              token,
              name: user.name,
              email: user.email,
              id: user.id,
              avatar: user.avatar
            });
          } catch (error) {
            res.status(500).send({ error: "Internal Server Error" });
          }
        }
      );
    }
  })(req, res, next);
});

router.post(
  "/register",
  [
    check("name", "Name is required")
      .not()
      .isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      let msg = "";
      if (errors.errors.length > 0) {
        errors.errors.forEach(element => {
          msg += element.msg + "\n";
        });
      }
      return res.status(400).send({ msg });
    }

    const { name, email, password } = req.body;

    try {
      let user = await User.findOne({ email });
      if (user) {
        return res
          .status(400)
          .send({ error: "User with that email id already exist" });
      }

      const avatar = gravatar.url(email, {
        s: "200",
        r: "pg",
        d: "mm"
      });

      user = new User({
        name,
        email,
        password,
        avatar
      });

      const salt = await bcrypt.genSalt(config.get("saltRound"));
      user.password = await bcrypt.hash(password, salt);
      await user.save();
      const payload = { user: { id: user.id } };
      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: 360000 },
        (err, token) => {
          try {
            if (err) throw err;
            res.send({
              token,
              name: user.name,
              email: user.email,
              id: user.id,
              avatar: user.avatar
            });
          } catch (error) {
            res.status(500).send({ error: "Internal Server Error" });
          }
        }
      );
    } catch (error) {
      console.error(error.message);
      res.status(500).send({ error: "Internal Server Error" });
    }
  }
);

export default router;