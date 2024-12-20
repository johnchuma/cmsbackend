const { Router } = require("express");
const { validateJWT } = require("../../utils/validateJWT");
const {
  getMember,
  addMember,
  updateMember,
  deleteMember,
  getChurchMembers,
  getChurchMemberCount,
} = require("./members.controllers");
const { getPagination } = require("../../utils/getPagination");

const router = Router();

router.post("/", validateJWT, addMember);
router.get("/church/:uuid", validateJWT, getPagination, getChurchMembers);
router.get("/:uuid", validateJWT, getMember);
router.get("/count/church/:uuid", validateJWT, getChurchMemberCount);
router.patch("/:uuid", validateJWT, updateMember);
router.delete("/:uuid", validateJWT, deleteMember);

module.exports = router;
