const mongoose = require("mongoose");

const chatroomSchema = new mongoose.Schema({
    Chatname: {
        type: String,
        required: "name is required!",
    },
    Users: [{
        type: String,
        required: "users are required!",
    }],
});

module.exports = mongoose.model("Chatroom", chatroomSchema);