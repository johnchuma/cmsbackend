const { Router } = require("express");
const { validateJWT } = require("../../utils/validateJWT");
const {
  getAttendance,
  addAttendance,
  updateAttendance,
  deleteAttendance,
  getServiceAttendances,
} = require("./attendances.controllers");

const router = Router();

router.post("/", validateJWT, addAttendance);
router.get("/service/:uuid", validateJWT, getServiceAttendances);
router.get("/:uuid", validateJWT, getAttendance);
router.patch("/:uuid", validateJWT, updateAttendance);
router.delete("/:uuid", validateJWT, deleteAttendance);

module.exports = router;
