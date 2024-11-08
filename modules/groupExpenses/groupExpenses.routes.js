const { Router } = require("express");
const { validateJWT } = require("../../utils/validateJWT");
const {
  getGroupExpense,
  addGroupExpense,
  updateGroupExpense,
  deleteGroupExpense,
  getGroupExpenses,
  getGroupExpensesReport,
} = require("./groupExpenses.controllers");
const { getPagination } = require("../../utils/getPagination");

const router = Router();

router.post("/", validateJWT, addGroupExpense);
router.get("/group/:uuid", validateJWT, getPagination, getGroupExpenses);
router.get("/report/group/:uuid", validateJWT, getGroupExpensesReport);
router.get("/:uuid", validateJWT, getGroupExpense);
router.patch("/:uuid", validateJWT, updateGroupExpense);
router.delete("/:uuid", validateJWT, deleteGroupExpense);

module.exports = router;
