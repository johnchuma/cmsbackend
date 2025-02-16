const { Router } = require("express");
const { validateJWT } = require("../../utils/validateJWT");
const {
  getMemberStats,
  getFinanceStats,
  getSingleMemberStats,
} = require("./reports.controller");

const router = Router();
router.get("/member", validateJWT, getSingleMemberStats);
router.get("/members/church/:uuid", validateJWT, getMemberStats);
router.get("/finance/church/:uuid", validateJWT, getFinanceStats);

module.exports = router;
