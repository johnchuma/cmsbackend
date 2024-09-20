const { Router } = require("express");
const { validateJWT } = require("../../utils/validateJWT");
const {
  getProjectExpense,
  addProjectExpense,
  updateProjectExpense,
  deleteProjectExpense,
  getProjectExpenses,
} = require("./projectExpenses.controllers");

const router = Router();

router.post("/", validateJWT, addProjectExpense);
router.get("/project/:uuid", validateJWT, getProjectExpenses);
router.get("/:uuid", validateJWT, getProjectExpense);
router.patch("/:uuid", validateJWT, updateProjectExpense);
router.delete("/:uuid", validateJWT, deleteProjectExpense);

module.exports = router;
