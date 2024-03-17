const express = require("express");
const router = express.Router();

const {
  getLessons,
  newLesson,
  getSingleLesson,
  updateLesson,
  deleteLesson,
  addContent,
} = require("../controllers/lessonController");

const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth");

router.get(
  "/admin/lessons",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  getLessons
);
router.get("/lesson/:id", getSingleLesson);
router
  .route("/admin/lesson/:id")
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateLesson)
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteLesson);
router.post(
  "/admin/lesson/new",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  newLesson
);

module.exports = router;
