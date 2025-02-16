const { Router } = require("express");
const { validateJWT } = require("../../utils/validateJWT");
const {
  getMember,
  addMember,
  updateMember,
  deleteMember,
  getChurchMembers,
  getChurchMemberCount,
  findUserByPhone,
} = require("./members.controllers");
const { getPagination } = require("../../utils/getPagination");

const router = Router();

router.post("/",  addMember);
router.get("/church/:uuid", validateJWT, getPagination, getChurchMembers);
router.get("/by-phone",  findUserByPhone);
router.get("/:uuid",  getMember);
router.get("/count/church/:uuid", validateJWT, getChurchMemberCount);
router.patch("/:uuid",  updateMember);
router.delete("/:uuid", validateJWT, deleteMember);

module.exports = router;
