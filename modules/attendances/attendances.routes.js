const { Router } = require("express");
const { validateJWT } = require("../../utils/validateJWT");
const {
  getAttendance,
  addAttendance,
  updateAttendance,
  deleteAttendance,
  getServiceAttendances,
  getAttendanceReport,
} = require("./attendances.controllers");
const { getPagination } = require("../../utils/getPagination");

const router = Router();

router.post("/", validateJWT, addAttendance);
router.get("/service/:uuid", validateJWT, getPagination, getServiceAttendances);
router.get("/report/service/:uuid", validateJWT, getAttendanceReport);
router.get("/:uuid", validateJWT, getAttendance);
router.patch("/:uuid", validateJWT, updateAttendance);
router.delete("/:uuid", validateJWT, deleteAttendance);

module.exports = router;
