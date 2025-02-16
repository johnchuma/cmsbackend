const { Router } = require("express");
const { validateJWT } = require("../../utils/validateJWT");
const {
  getContribution,
  addContribution,
  updateContribution,
  deleteContribution,
  getPledgeContributions,
  getSingleMemberContributions,
} = require("./contributions.controllers");
const { getPagination } = require("../../utils/getPagination");

const router = Router();

router.post("/", validateJWT, addContribution);
router.get("/member", validateJWT, getPagination, getSingleMemberContributions);
router.get("/pledge/:uuid", validateJWT, getPagination, getPledgeContributions);
router.get("/:uuid", validateJWT, getContribution);
router.patch("/:uuid", validateJWT, updateContribution);
router.delete("/:uuid", validateJWT, deleteContribution);

module.exports = router;
