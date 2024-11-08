const { Router } = require("express");
const { validateJWT } = require("../../utils/validateJWT");
const {
  getOfferingRecord,
  addOfferingRecord,
  updateOfferingRecord,
  deleteOfferingRecord,
  getOfferingRecords,
  getOfferingRecordsReport,
} = require("./offeringRecords.controllers");
const { getPagination } = require("../../utils/getPagination");

const router = Router();

router.post("/", validateJWT, addOfferingRecord);
router.get("/offering/:uuid", validateJWT, getPagination, getOfferingRecords);
router.get("/report/offering/:uuid", validateJWT, getOfferingRecordsReport);
router.get("/:uuid", validateJWT, getOfferingRecord);
router.patch("/:uuid", validateJWT, updateOfferingRecord);
router.delete("/:uuid", validateJWT, deleteOfferingRecord);

module.exports = router;
