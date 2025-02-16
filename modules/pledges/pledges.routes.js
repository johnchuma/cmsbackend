const { Router } = require("express");
const { validateJWT } = require("../../utils/validateJWT");
const {
  getPledge,
  addPledge,
  updatePledge,
  deletePledge,
  getProjectPledges,
  getProjectPledgesReport,
  getMemberPledges,
  getSingleMemberPledges,
} = require("./pledges.controllers");
const { getPagination } = require("../../utils/getPagination");

const router = Router();

router.post("/", validateJWT, addPledge);
router.get("/project/:uuid", validateJWT, getPagination, getProjectPledges);
router.get("/member/:uuid",  getPagination, getMemberPledges);
router.get("/report/project/:uuid", validateJWT, getProjectPledgesReport);
router.get("/:uuid", validateJWT, getPledge);
router.patch("/:uuid", validateJWT, updatePledge);
router.delete("/:uuid", validateJWT, deletePledge);

module.exports = router;
