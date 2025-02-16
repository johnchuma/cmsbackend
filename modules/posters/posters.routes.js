const { Router } = require("express");
const { validateJWT } = require("../../utils/validateJWT");
const {
  getPoster,
  addPoster,
  updatePoster,
  deletePoster,
  getRequestPosters,
} = require("./posters.controllers");
const { getPagination } = require("../../utils/getPagination");
const router = Router();

router.post("/", validateJWT, addPoster);
router.get(
  "/poster-request/:uuid",
  validateJWT,
  getPagination,
  getRequestPosters
);
router.get("/:uuid", validateJWT, getPoster);
router.patch("/:uuid", validateJWT, updatePoster);
router.delete("/:uuid", validateJWT, deletePoster);

module.exports = router;
