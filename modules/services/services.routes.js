const { Router } = require("express");
const { validateJWT } = require("../../utils/validateJWT");
const {
  getService,
  addService,
  updateService,
  deleteService,
  getGroupServices,
} = require("./services.controllers");
const { getPagination } = require("../../utils/getPagination");

const router = Router();

router.post("/", validateJWT, addService);
router.get("/group/:uuid", validateJWT, getPagination, getGroupServices);
router.get("/:uuid", validateJWT, getService);
router.patch("/:uuid", validateJWT, updateService);
router.delete("/:uuid", validateJWT, deleteService);

module.exports = router;
