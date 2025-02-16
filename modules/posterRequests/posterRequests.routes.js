const { Router } = require("express");
const { validateJWT } = require("../../utils/validateJWT");
const {
  getPosterRequest,
  addPosterRequest,
  updatePosterRequest,
  deletePosterRequest,
  getChurchPosterRequests,
} = require("./posterRequests.controllers");

const router = Router();

router.post("/", validateJWT, addPosterRequest);
router.get("/church/:uuid", validateJWT, getChurchPosterRequests);
router.get("/:uuid", validateJWT, getPosterRequest);
router.patch("/:uuid", validateJWT, updatePosterRequest);
router.delete("/:uuid", validateJWT, deletePosterRequest);

module.exports = router;
