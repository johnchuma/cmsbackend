const { Router } = require("express");
const { validateJWT } = require("../../utils/validateJWT");
const {
  getMember,
  addMember,
  updateMember,
  deleteMember,
  getChurchMembers,
} = require("./members.controllers");

const router = Router();

router.post("/", validateJWT, addMember);
router.get("/church/:uuid", validateJWT, getChurchMembers);
router.get("/:uuid", validateJWT, getMember);
router.patch("/:uuid", validateJWT, updateMember);
router.delete("/:uuid", validateJWT, deleteMember);

module.exports = router;
