const router = require("express").Router();
const { catchErrors } = require("../handlers/errorHandlers");
const chatroomController = require("../controllers/chatroomController");

const auth = require("../middlerwares/auth");

//router.put("", auth, catchErrors(chatroomController.getAllChatrooms));
router.post("", auth, catchErrors(chatroomController.post));

module.exports = router;