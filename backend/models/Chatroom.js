const mongoose = require("mongoose");

const chatroomSchema = new mongoose.Schema({
  Chatname: {
    type: String,
    required: "Name is required!",
  },
  Users: [{
    type: String,
    required: "users are required!",
  }],
  History: [{
    Message: {
      chatroom: {type: mongoose.Schema.Types.ObjectId},
      user: {type: String,},
      message: {type: String},
    }
  }]
});

module.exports = mongoose.model("Chatroom", chatroomSchema);
