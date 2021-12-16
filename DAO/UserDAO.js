let UserCollection = null;

class UserDAO {
  static async injectDB(client) {
    if (UserCollection !== null) return;
    try {
      UserCollection = await client
        .db(process.env.DATABASE_NS)
        .collection("User");
    } catch (error) {
      console.log(error);
    }
  }
  static async addUser(id, name, password) {
    try {
      const insertResult = await UserCollection.insertOne({
        userID: id,
        name,
        password,
        contact: [],
      });
      return insertResult;
    } catch (error) {
      console.log(error.message);
      return { Error: error.message };
    }
  }
  static async findUser(id) {
    try {
      const result = await UserCollection.findOne({ userID: id });

      return result;
    } catch (error) {
      return { error: error.message };
    }
  }
  static async addContact(userID, targetID) {
    try {
      const user = await UserCollection.findOne({ userID: userID });
      console.log(userID);
      const targetUser = await UserCollection.findOne({ userID: targetID });
      if (
        targetUser &&
        (user.contact.length === 0 || !user.contact.includes(targetID))
      ) {
        const result = await UserCollection.updateOne(
          { userID: userID },
          { $push: { contact: targetID } }
        );
        return { status: "success" };
      } else if (!targetUser) {
        return { status: "user not found" };
      } else {
        return { status: "user already added" };
      }
    } catch (error) {
      console.log(error);
      return { error: error.message };
    }
  }
}

export default UserDAO;
