const { Router } = require("express");
const { validateJWT } = require("../../utils/validateJWT");
const {
  getOffering,
  addOffering,
  updateOffering,
  deleteOffering,
  getServiceOfferings,
  getServiceOfferingsReport,
} = require("./offerings.controllers");
const { getPagination } = require("../../utils/getPagination");

const router = Router();

router.post("/", validateJWT, addOffering);
router.get("/service/:uuid", validateJWT, getPagination, getServiceOfferings);
router.get("/:uuid", validateJWT, getOffering);
router.patch("/:uuid", validateJWT, updateOffering);
router.delete("/:uuid", validateJWT, deleteOffering);

module.exports = router;
