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
  loginWithGoogle,
  sendRecoveryCode,
  resetPassword,
} = require("./users.controllers");
const router = Router();

router.post("/", addUser);
router.post("/login-with-google", loginWithGoogle);
router.post("/login", login);
router.post("/send-recovery-code", sendRecoveryCode);
router.post("/reset-password/:uuid", resetPassword);
router.post("/login", login);
router.get("/", validateJWT, getUsers);
router.get("/me", validateJWT, getMyInfo);
router.get("/:uuid", validateJWT, getUserInfo);
router.patch("/:uuid", validateJWT, updateUser);
router.delete("/:uuid", validateJWT, deleteUser);

module.exports = router;
