const { Router } = require("express");
const { validateJWT } = require("../../utils/validateJWT");
const { getMemberStats, getFinanceStats } = require("./reports.controller");

const router = Router();
router.get("/members/church/:uuid", validateJWT, getMemberStats);
router.get("/finance/church/:uuid", validateJWT, getFinanceStats);

module.exports = router;
