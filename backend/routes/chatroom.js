const router = require("express").Router();
const { catchErrors } = require("../handlers/errorHandlers");
const chatroomController = require("../controllers/chatroomController");

const auth = require("../middlerwares/auth");

router.delete("", auth, catchErrors(chatroomController.deleteChat));
router.put("", auth, catchErrors(chatroomController.put));
router.post("", auth, catchErrors(chatroomController.post));

module.exports = router;
