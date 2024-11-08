const { Router } = require("express");
const {
  sendEventRemainder,
  sendMessagesToGroup,
} = require("./messages.controllers");
const { validateJWT } = require("../../utils/validateJWT");

const router = Router();
router.post("/group/:uuid", validateJWT, sendMessagesToGroup);
module.exports = router;
