const { Router } = require("express");
const { validateJWT } = require("../../utils/validateJWT");
const {
  getChurch,
  getChurches,
  addChurch,
  updateChurch,
  deleteChurch,
  getUserChurches,
} = require("./churches.controllers");

const router = Router();

router.post("/", validateJWT, addChurch);
router.get("/", getChurches);
router.get("/user", validateJWT, getUserChurches);
router.get("/:uuid", getChurch);
router.patch("/:uuid", validateJWT, updateChurch);
router.delete("/:uuid", validateJWT, deleteChurch);

module.exports = router;
