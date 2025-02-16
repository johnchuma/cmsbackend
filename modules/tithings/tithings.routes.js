const { Router } = require("express");
const { validateJWT } = require("../../utils/validateJWT");
const {
  getTithing,
  addTithing,
  updateTithing,
  deleteTithing,
  getTithings,
  getChurchTithings,
  getMemberTithings,
  getSingleMemberTithings,
} = require("./tithings.controllers");
const { getPagination } = require("../../utils/getPagination");

const router = Router();

router.post("/", validateJWT, addTithing);
router.get("/church/:uuid", validateJWT, getPagination, getChurchTithings);
router.get("/member", validateJWT, getPagination, getSingleMemberTithings);
router.get("/member/:uuid", validateJWT, getPagination, getMemberTithings);
router.get("/:uuid", validateJWT, getTithing);
router.patch("/:uuid", validateJWT, updateTithing);
router.delete("/:uuid", validateJWT, deleteTithing);

module.exports = router;
