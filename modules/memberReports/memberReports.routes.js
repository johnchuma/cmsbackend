const { Router } = require("express");
const { validateJWT } = require("../../utils/validateJWT");

const {
  getChurchMemberReports,
  getMemberReport,
  addMemberReport,
  updateMemberReport,
  deleteMemberReport,
  getMemberReports,
} = require("./memberReports.controllers");
const { getPagination } = require("../../utils/getPagination");

const router = Router();

router.post("/", validateJWT, addMemberReport);
router.get("/church/:uuid", validateJWT, getPagination, getChurchMemberReports);
router.get("/member/:uuid", validateJWT, getMemberReports);
router.get("/:uuid", validateJWT, getMemberReport);
router.patch("/:uuid", validateJWT, updateMemberReport);
router.delete("/:uuid", validateJWT, deleteMemberReport);

module.exports = router;
