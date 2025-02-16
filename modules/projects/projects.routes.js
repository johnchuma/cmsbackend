const { Router } = require("express");
const { validateJWT } = require("../../utils/validateJWT");
const {
  getProject,
  addProject,
  updateProject,
  deleteProject,
  getGroupProjects,
  getGroupProjectsReport,
  getSingleMemberProjects,
} = require("./projects.controllers");
const { getPagination } = require("../../utils/getPagination");

const router = Router();

router.post("/", validateJWT, addProject);
router.get("/member", validateJWT, getPagination, getSingleMemberProjects);
router.get("/group/:uuid", validateJWT, getPagination, getGroupProjects);
router.get("/report/group/:uuid", validateJWT, getGroupProjectsReport);
router.get("/:uuid", getProject);
router.patch("/:uuid", validateJWT, updateProject);
router.delete("/:uuid", validateJWT, deleteProject);

module.exports = router;
