const { Router } = require("express");
const { validateJWT } = require("../../utils/validateJWT");
const {
  getPosterRequestAttachment,
  addPosterRequestAttachment,
  updatePosterRequestAttachment,
  deletePosterRequestAttachment,
} = require("./posterRequestAttachment.controllers");
const { getPagination } = require("../../utils/getPagination");

const router = Router();

router.post("/", validateJWT, addPosterRequestAttachment);
router.get("/:uuid", validateJWT, getPosterRequestAttachment);
router.patch("/:uuid", validateJWT, updatePosterRequestAttachment);
router.delete("/:uuid", validateJWT, deletePosterRequestAttachment);

module.exports = router;
