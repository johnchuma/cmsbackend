const { Router } = require("express");
const { validateJWT } = require("../../utils/validateJWT");
const {
  getChurch,
  getChurches,
  addChurch,
  updateChurch,
  deleteChurch,
} = require("./churches.controllers");

const router = Router();

router.post("/", validateJWT, addChurch);
router.get("/", validateJWT, getChurches);
router.get("/:uuid", validateJWT, getChurch);
router.patch("/:uuid", validateJWT, updateChurch);
router.delete("/:uuid", validateJWT, deleteChurch);

module.exports = router;
