const { Router } = require("express");
const { validateJWT } = require("../../utils/validateJWT");
const {
  getOffering,
  addOffering,
  updateOffering,
  deleteOffering,
  getServiceOfferings,
} = require("./offerings.controllers");

const router = Router();

router.post("/", validateJWT, addOffering);
router.get("/service/:uuid", validateJWT, getServiceOfferings);
router.get("/:uuid", validateJWT, getOffering);
router.patch("/:uuid", validateJWT, updateOffering);
router.delete("/:uuid", validateJWT, deleteOffering);

module.exports = router;
