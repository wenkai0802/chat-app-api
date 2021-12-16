import express from "express";
import UserController from "./Controller/UserController.js";
import { passport } from "./server.js";
const userRouter = express.Router();
userRouter.get("/", (req, res) => {
  const { userID, name, contact } = req.user;

  res.json({ userID, name, contact });
});
userRouter.get("/logout", (req, res) => {
  req.logout();
  res.json({ status: "logout" });
});
userRouter.post("/register", UserController.RegisterUser);
userRouter.post("/login", function (req, res, next) {
  passport.authenticate("local", function (err, user, info) {
    if (err) {
      return res.json({ message: err });
    }
    if (!user) {
      return res.json(info);
    }
    req.logIn(user, function (err) {
      if (err) {
        return next(err);
      }
      return res.redirect("/user");
    });
  })(req, res, next);
});
userRouter.post("/contact/add", UserController.addContact);

export default userRouter;
