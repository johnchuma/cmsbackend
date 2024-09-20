const { Router } = require("express");
const { validateJWT } = require("../../utils/validateJWT");
const {
  getTithing,
  addTithing,
  updateTithing,
  deleteTithing,
  getTithings,
  getChurchTithings,
} = require("./tithings.controllers");

const router = Router();

router.post("/", validateJWT, addTithing);
router.get("/church/:uuid", validateJWT, getChurchTithings);
router.get("/:uuid", validateJWT, getTithing);
router.patch("/:uuid", validateJWT, updateTithing);
router.delete("/:uuid", validateJWT, deleteTithing);

module.exports = router;
