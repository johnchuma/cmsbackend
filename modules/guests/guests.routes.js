const { Router } = require("express");
const { validateJWT } = require("../../utils/validateJWT");
const {
  getGuest,
  addGuest,
  updateGuest,
  deleteGuest,
  getServiceGuests,
} = require("./guests.controllers");

const router = Router();

router.post("/", validateJWT, addGuest);
router.get("/service/:uuid", validateJWT, getServiceGuests);
router.get("/:uuid", validateJWT, getGuest);
router.patch("/:uuid", validateJWT, updateGuest);
router.delete("/:uuid", validateJWT, deleteGuest);

module.exports = router;
