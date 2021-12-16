import { ObjectId } from "mongodb";
let ConversationCollection = null;

class ConversationDAO {
  static async injectDB(client) {
    if (ConversationCollection !== null) return;
    try {
      ConversationCollection = await client
        .db(process.env.DATABASE_NS)
        .collection("Conversation");
    } catch (error) {
      console.log(error);
    }
  }
  static async createConversation(idList) {
    try {
      idList.sort();
      const convo = await ConversationCollection.findOne({ members: idList });
      if (!convo) {
        const result = await ConversationCollection.insertOne({
          members: idList,
          messages: [],
        });
        return result;
      }

      return { message: "conversation existed" };
    } catch (error) {
      return { error: error.message };
    }
  }

  static async addMessage(id, sender, text) {
    try {
      const oid = ObjectId();
      const result = await ConversationCollection.updateOne(
        { _id: ObjectId(id) },
        { $push: { messages: { _id: oid, sender: sender, text: text } } }
      );
      return { ...result, _id: oid };
    } catch (error) {
      return { error: error.message };
    }
  }
  static async getMemberList(id) {
    try {
      const MemberList = await ConversationCollection.find({
        members: id,
      }).project({ messages: 0 });

      const returnList = await MemberList.toArray();
      return returnList;
    } catch (error) {
      return { error: error.message };
    }
  }

  static async getMessages(id, page = 1) {
    try {
      const Conversation = await ConversationCollection.findOne({
        _id: ObjectId(id),
      });
      const messages = Conversation.messages;
      const numOfMessages = messages.length;
      const messagesPerPage = 30;
      var startNumber = numOfMessages - messagesPerPage * parseInt(page);
      const endNumber = startNumber + messagesPerPage;
      startNumber = startNumber < 0 ? 0 : startNumber;
      const returnMessages = messages.slice(startNumber, endNumber);
      const totalPages =
        numOfMessages % messagesPerPage === 0
          ? parseInt(numOfMessages / messagesPerPage)
          : parseInt(numOfMessages / messagesPerPage + 1);
      return {
        page: page,
        messages: returnMessages,
        totalPages: totalPages,
        messagesPerPage: messagesPerPage,
      };
    } catch (error) {
      console.error(error.message);
      return {
        page: page,
        messages: [],
        totalPages: 0,
        messagesPerPage: 0,
      };
    }
  }
}

export default ConversationDAO;
