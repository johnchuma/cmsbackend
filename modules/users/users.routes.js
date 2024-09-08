const { Router } = require("express");
const { validateJWT } = require("../../utils/validateJWT");
const {
  addUser,
  login,
  getUsers,
  getMyInfo,
  getUserInfo,
  updateUser,
  deleteUser,
} = require("./users.controllers");
const router = Router();

router.post("/", addUser);
router.post("/login", login);
router.get("/", validateJWT, getUsers);
router.get("/me", validateJWT, getMyInfo);
router.get("/:uuid", validateJWT, getUserInfo);
router.patch("/:uuid", validateJWT, updateUser);
router.delete("/:uuid", validateJWT, deleteUser);

module.exports = router;
