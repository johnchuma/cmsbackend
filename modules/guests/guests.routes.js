const { Router } = require("express");
const { validateJWT } = require("../../utils/validateJWT");
const {
  getGuest,
  addGuest,
  updateGuest,
  deleteGuest,
  getServiceGuests,
  getServiceGuestsReport,
} = require("./guests.controllers");
const { getPagination } = require("../../utils/getPagination");

const router = Router();

router.post("/", validateJWT, addGuest);
router.get("/service/:uuid", validateJWT, getPagination, getServiceGuests);
router.get("/report/service/:uuid", validateJWT, getServiceGuestsReport);
router.get("/:uuid", validateJWT, getGuest);
router.patch("/:uuid", validateJWT, updateGuest);
router.delete("/:uuid", validateJWT, deleteGuest);

module.exports = router;
