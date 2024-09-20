const { Router } = require("express");
const { validateJWT } = require("../../utils/validateJWT");
const {
  getGroupExpense,
  addGroupExpense,
  updateGroupExpense,
  deleteGroupExpense,
  getGroupExpenses,
} = require("./groupExpenses.controllers");

const router = Router();

router.post("/", validateJWT, addGroupExpense);
router.get("/group/:uuid", validateJWT, getGroupExpenses);
router.get("/:uuid", validateJWT, getGroupExpense);
router.patch("/:uuid", validateJWT, updateGroupExpense);
router.delete("/:uuid", validateJWT, deleteGroupExpense);

module.exports = router;
