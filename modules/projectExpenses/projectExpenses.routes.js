const { Router } = require("express");
const { validateJWT } = require("../../utils/validateJWT");
const {
  getProjectExpense,
  addProjectExpense,
  updateProjectExpense,
  deleteProjectExpense,
  getProjectExpenses,
  getProjectExpensesReport,
} = require("./projectExpenses.controllers");
const { getPagination } = require("../../utils/getPagination");

const router = Router();

router.post("/", validateJWT, addProjectExpense);
router.get("/project/:uuid", validateJWT, getPagination, getProjectExpenses);
router.get("/report/project/:uuid", validateJWT, getProjectExpensesReport);
router.get("/:uuid", validateJWT, getProjectExpense);
router.patch("/:uuid", validateJWT, updateProjectExpense);
router.delete("/:uuid", validateJWT, deleteProjectExpense);

module.exports = router;
