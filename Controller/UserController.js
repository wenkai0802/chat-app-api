import UserDAO from "../DAO/UserDAO.js";
import bcrypt from "bcrypt";
bcrypt.genSalt;
class UserController {
  static async RegisterUser(req, res, next) {
    const id = req.body.id;
    const name = req.body.name;
    const password = req.body.password;
    var result;
    bcrypt.hash(
      password,
      parseInt(process.env.SALT_ROUND),
      async function (err, hash) {
        // Store hash in your password DB.
        console.log(hash);
        res.json(await UserDAO.addUser(id, name, hash));
      }
    );
  }
  static async VerifyUser(id, password) {
    try {
      const user = await UserDAO.findUser(id);
      if (!user) return { wrongID: "Wrong User ID" };
      else {
        const result = await bcrypt.compare(password, user.password);

        if (!result) return { wrongPassword: "Wrong Password" };
        return user;
      }
    } catch (error) {
      return { error: error.message };
    }
  }
  static async addContact(req, res, next) {
    try {
      const userID = req.body.userID;
      const targetID = req.body.targetID;

      const result = await UserDAO.addContact(userID, targetID);
      return res.json(result);
    } catch (error) {
      return res.json({ error: error.message });
    }
  }
}

export default UserController;
