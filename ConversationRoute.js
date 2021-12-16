import express from "express";
import ConversationController from "./Controller/ConversationController.js";

const ConversationRouter = express.Router();

ConversationRouter.route("/members")
  .get(ConversationController.getMemberList)
  .post(ConversationController.createConversation);
ConversationRouter.route("/messages")
  .get(ConversationController.getMessages)
  .put(ConversationController.addMessage);

export default ConversationRouter;
