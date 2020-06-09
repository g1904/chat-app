const mongoose = require("mongoose");
const Chatroom = mongoose.model("Chatroom");
const User = mongoose.model("User");
const jwt = require("jwt-then");

exports.createChatroom = async(req, res) => {
    // console.log(req);
    const {Authorization, Chatname, Users} = req.body;

    const nameRegex = /^[A-Za-z\s]+$/;

    if (!nameRegex.test(Chatname)) throw "Chatroom name can contain only alphabets.";

    const chatroomExists = await Chatroom.findOne({ Chatname: Chatname });

    if (chatroomExists) throw "Chatroom with that name already exists!";
    if (Users.length < 2) throw "Chatroom must contain at least 2 users!";

    for (i = 0; i < Users.length; i++) {
        const userExists = await User.findOne({ email: Users[i] });
        if (!userExists) throw "User with one of email addresses does not exist.";
    }

    const chatroom = new Chatroom({ Chatname, Users, });

    await chatroom.save();

    res.json({
        message: "Chatroom created!",
    });
};

exports.getAllChatrooms = async(req, res) => {
    // console.log(req);
    const token = req.body.Authorization.split(" ")[1];
    const payload = await jwt.verify(token, process.env.SECRET);

    const chatrooms = await Chatroom.find({Users: payload.id});
    res.json(chatrooms);
};

/*
exports.newMessage = async(req, res) => {
    console.log(req);
    const name = req.body.Chatname;
    const users = req.body.Users;
    const userExists = await User.findOne(users);
    if (!userExists) throw "User with this email address does not exist.";

    res.json({
        message: "Chatroom history updated!",
    });
}
*/