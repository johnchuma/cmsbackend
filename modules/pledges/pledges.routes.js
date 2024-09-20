const { Router } = require("express");
const { validateJWT } = require("../../utils/validateJWT");
const {
  getPledge,
  addPledge,
  updatePledge,
  deletePledge,
  getProjectPledges,
} = require("./pledges.controllers");

const router = Router();

router.post("/", validateJWT, addPledge);
router.get("/project/:uuid", validateJWT, getProjectPledges);
router.get("/:uuid", validateJWT, getPledge);
router.patch("/:uuid", validateJWT, updatePledge);
router.delete("/:uuid", validateJWT, deletePledge);

module.exports = router;
