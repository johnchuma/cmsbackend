const { Router } = require("express");
const { validateJWT } = require("../../utils/validateJWT");
const {
  getGroup,
  getGroups,
  addGroup,
  updateGroup,
  deleteGroup,
} = require("./group.controllers");

const router = Router();

router.post("/", validateJWT, addGroup);
router.get("/", validateJWT, getGroups);
router.get("/:uuid", validateJWT, getGroup);
router.patch("/:uuid", validateJWT, updateGroup);
router.delete("/:uuid", validateJWT, deleteGroup);

module.exports = router;
