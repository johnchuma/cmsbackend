const { Router } = require("express");
const { validateJWT } = require("../../utils/validateJWT");
const {
  getProject,
  addProject,
  updateProject,
  deleteProject,
  getGroupProjects,
} = require("./projects.controllers");

const router = Router();

router.post("/", validateJWT, addProject);
router.get("/group/:uuid", validateJWT, getGroupProjects);
router.get("/:uuid", validateJWT, getProject);
router.patch("/:uuid", validateJWT, updateProject);
router.delete("/:uuid", validateJWT, deleteProject);

module.exports = router;
