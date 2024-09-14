const { Router } = require("express");
const { validateJWT } = require("../../utils/validateJWT");

const {
  getChurchMemberReports,
  getMemberReport,
  addMemberReport,
  updateMemberReport,
  deleteMemberReport,
} = require("./memberReports.controllers");

const router = Router();

router.post("/", validateJWT, addMemberReport);
router.get("/church/:uuid", validateJWT, getChurchMemberReports);
router.get("/:uuid", validateJWT, getMemberReport);
router.patch("/:uuid", validateJWT, updateMemberReport);
router.delete("/:uuid", validateJWT, deleteMemberReport);

module.exports = router;
