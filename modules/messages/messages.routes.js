const { Router } = require("express");
const {
  sendEventRemainder,
  sendMessagesToGroup,
  buySMS,
  sendMessages,
} = require("./messages.controllers");
const { validateJWT } = require("../../utils/validateJWT");

const router = Router();
router.post("/buy", buySMS);
router.post("/send", sendMessages);
router.post("/group/:uuid", validateJWT, sendMessagesToGroup);
module.exports = router;
