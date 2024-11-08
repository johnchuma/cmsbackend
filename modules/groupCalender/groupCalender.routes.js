const { Router } = require("express");
const { validateJWT } = require("../../utils/validateJWT");
const {
  addGroupCalender,
  getGroupCalenders,
  getGroupCalender,
  updateGroupCalender,
  deleteGroupCalender,
  getChurchCalenders,
} = require("./groupCalender.controller");
const { getPagination } = require("../../utils/getPagination");

const router = Router();

router.post("/", validateJWT, addGroupCalender);
router.get("/group/:uuid", validateJWT, getPagination, getGroupCalenders);
router.get("/church/:uuid", validateJWT, getPagination, getChurchCalenders);
router.get("/:uuid", validateJWT, getGroupCalender);
router.patch("/:uuid", validateJWT, updateGroupCalender);
router.delete("/:uuid", validateJWT, deleteGroupCalender);

module.exports = router;
