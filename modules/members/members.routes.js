const { Router } = require("express");
const { validateJWT } = require("../../utils/validateJWT");
const {
  getMember,
  getMembers,
  addMember,
  updateMember,
  deleteMember,
} = require("./members.controllers");

const router = Router();

router.post("/", validateJWT, addMember);
router.get("/", validateJWT, getMembers);
router.get("/:uuid", validateJWT, getMember);
router.patch("/:uuid", validateJWT, updateMember);
router.delete("/:uuid", validateJWT, deleteMember);

module.exports = router;
