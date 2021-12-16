import ConversationRouter from "../ConversationRoute.js";
import ConversationDAO from "../DAO/ConversationDAO.js";

class ConversationController {
  static async getMemberList(req, res, next) {
    try {
      const memberList = await ConversationDAO.getMemberList(req.user.userID);

      res.json(memberList);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  static async addMessage(req, res, next) {
    try {
      const id = req.body.id,
        sender = req.body.sender,
        text = req.body.text;
      const result = await ConversationDAO.addMessage(id, sender, text);
      if (result.modifiedCount === 0) {
        res.json({ status: "conversation not exist" });
      } else res.json({ status: "success", _id: result.id });
    } catch (error) {
      res.status(500).json({ status: "request failed" });
    }
  }
  static async createConversation(req, res, next) {
    try {
      const idList = req.body.idList;
      const result = await ConversationDAO.createConversation(idList);

      if (result.insertedId)
        res.json({ status: "success", _id: result.insertedId });
      else res.json({ status: result.message });
    } catch (error) {
      res.status(500).json({ status: "request failed" });
    }
  }
  static async getMessages(req, res) {
    try {
      const page = req.query.page === null ? 1 : req.query.page;
      const messages = await ConversationDAO.getMessages(req.query._id, page);
      res.json(messages);
    } catch (err) {
      res.json({ messages: [] });
    }
  }
}

export default ConversationController;
