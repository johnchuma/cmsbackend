const { Router } = require("express");
const { validateJWT } = require("../../utils/validateJWT");
const {
  getOfferingRecord,
  addOfferingRecord,
  updateOfferingRecord,
  deleteOfferingRecord,
  getOfferingRecords,
} = require("./offeringRecords.controllers");

const router = Router();

router.post("/", validateJWT, addOfferingRecord);
router.get("/offering/:uuid", validateJWT, getOfferingRecords);
router.get("/:uuid", validateJWT, getOfferingRecord);
router.patch("/:uuid", validateJWT, updateOfferingRecord);
router.delete("/:uuid", validateJWT, deleteOfferingRecord);

module.exports = router;
