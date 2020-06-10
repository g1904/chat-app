const mongoose = require("mongoose");
const Chatroom = mongoose.model("Chatroom");
const User = mongoose.model("User");
const Message = mongoose.model("Message");
const jwt = require("jwt-then");

exports.createChatroom = async (req, res) => {
  const Chatname = req.body.Chatname;
  const Users = req.body.Users;

  const nameRegex = /^[A-Za-z\s]+$/;

  if (!nameRegex.test(Chatname)) throw "Chatroom name can contain only alphabets.";

  const chatroomExists = await Chatroom.findOne({ Chatname: Chatname });

  if (chatroomExists) throw "Chatroom with that name already exists!";
  if (Users.length < 2) throw "Chatroom must contain at least 2 users!";

    for (i = 0; i < Users.length; i++) {
        const user = await User.findOne({ email: Users[i] });
        if (!user) throw "User with one of email addresses does not exist.";
    }

  const chatroom = new Chatroom({
    Chatname,
    Users,
  });

  await chatroom.save();

  res.json({
    message: "Chatroom created!",
  });
};

exports.getAllChatrooms = async (req, res) => {
  const chatrooms = await Chatroom.find({Users: req.payload.id});
   res.json(chatrooms);
};

exports.post = async (req, res) => {
  if (req.message) {
    this.saveMessage(req, res);
  } else if (req.ChatID) {
    this.setHistory(req, res);
  } else if (req.body.Chatname && req.body.Users) {
    this.createChatroom(req, res);
  } else {
    this.getAllChatrooms(req, res);
  }
}

exports.deleteChat = async (req, res) => {
  console.log("delete called");
  const name = await Message.findById({_id: req.ChatID}).Chatname;
  Chatroom.updateOne({Chatname: name}, {$pullAll: {uid: req.payload.id}});
  Chatroom.find({Users: {$size: 0}}).remove().exec();
  res.json({ message: "Deleted successfully!"});
  console.log("delete finished");
}

exports.setHistory = async (req, res) => {
  const name = await Message.findById({_id: req.ChatID}).Chatname;
  const history = await Message.findById({_id: req.ChatID}).History;
  res.json({
    History: history,
    Chatname: name
  })
}

exports.saveMessage = async (req, res) => {
  console.log("message saving invoked")
  const history = new History({
    Message: new Message({
      chatroom: req.ChatID,
      user: req.payload.id,
      message: req.Message
    })
  });
  History.push(history);
  console.log(req.Message + " SAVED");
  res.json({
    message: "message saved!"
  })
}

exports.put = async (req, res) => {
  if (req.message) {
    this.saveMessage(req, res);
  } else {
    this.setHistory(req, res);
  }
}