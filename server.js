import express from "express";
import UserController from "./Controller/UserController.js";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import session from "express-session";
import dotenv from "dotenv";
import userRouter from "./UserRoute.js";

import cors from "cors";
import UserDAO from "./DAO/UserDAO.js";
import ConversationRouter from "./ConversationRoute.js";

dotenv.config();

const app = express();

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.urlencoded());
app.use(express.json());
app.set("trust proxy", 1); // trust first proxy
app.use(
  session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function (user, done) {
  done(null, user.userID);
});

passport.deserializeUser(async function (id, done) {
  const user = await UserDAO.findUser(id);
  done(null, user);
});
passport.use(
  new LocalStrategy(
    {
      usernameField: "id",
      passwordField: "password",
    },
    async function (id, password, done) {
      const result = await UserController.VerifyUser(id, password);
      if (result.error) {
        return done(result.error);
      }
      if (result.wrongID) {
        return done(null, false, { message: "Incorrect username." });
      }
      if (result.wrongPassword) {
        return done(null, false, { message: "Incorrect password." });
      }

      return done(null, result);
    }
  )
);
app.use("/user", userRouter);
app.use("/conversation", ConversationRouter);
export default app;
export { passport };
