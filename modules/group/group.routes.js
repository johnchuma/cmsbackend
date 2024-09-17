const { Router } = require("express");
const { validateJWT } = require("../../utils/validateJWT");
const {
  getGroup,
  addGroup,
  updateGroup,
  deleteGroup,
  getChurchGroups,
} = require("./group.controllers");

const router = Router();

router.post("/", validateJWT, addGroup);
router.get("/church/:uuid", validateJWT, getChurchGroups);
router.get("/:uuid", validateJWT, getGroup);
router.patch("/:uuid", validateJWT, updateGroup);
router.delete("/:uuid", validateJWT, deleteGroup);

module.exports = router;
