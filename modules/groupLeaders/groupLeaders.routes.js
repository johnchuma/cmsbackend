const { Router } = require("express");
const { validateJWT } = require("../../utils/validateJWT");
const {
  getActiveGroupLeaders,
  getGroupLeader,
  getGroupLeaders,
  addGroupLeader,
  updateGroupLeader,
  deleteGroupLeader,
} = require("./groupLeaders.controllers");
const { getPagination } = require("../../utils/getPagination");

const router = Router();

router.post("/", validateJWT, addGroupLeader);
router.get("/group/:uuid", validateJWT, getPagination, getGroupLeaders);
router.get(
  "/active/group/:uuid",
  validateJWT,
  getPagination,
  getActiveGroupLeaders
);
router.get("/:uuid", validateJWT, getGroupLeader);
router.patch("/:uuid", validateJWT, updateGroupLeader);
router.delete("/:uuid", validateJWT, deleteGroupLeader);

module.exports = router;
