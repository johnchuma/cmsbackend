const { Router } = require("express");
const { validateJWT } = require("../../utils/validateJWT");
const {
  getGroupMember,
  getGroupMembers,
  addGroupMember,
  updateGroupMember,
  deleteGroupMember,
} = require("./groupMembers.controllers");

const router = Router();

router.post("/", validateJWT, addGroupMember);
router.get("/group/:uuid", validateJWT, getGroupMembers);
router.get("/:uuid", validateJWT, getGroupMember);
router.patch("/:uuid", validateJWT, updateGroupMember);
router.delete("/:uuid", validateJWT, deleteGroupMember);

module.exports = router;