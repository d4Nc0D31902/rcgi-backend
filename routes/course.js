const express = require("express");
const router = express.Router();
const upload = require("../utils/multer");

const {
  getCourses,
  newCourse,
  getSingleCourse,
  updateCourse,
  deleteCourse,
  addModule,
  deactivateCourse,
  reactivateCourse,
} = require("../controllers/courseController");

const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth");

router.get("/admin/courses", getCourses);
router.get("/course/:id", getSingleCourse);
router
  .route("/admin/course/:id")
  .put(
    isAuthenticatedUser,
    authorizeRoles("admin"),
    upload.array("images", 10),
    updateCourse
  )
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteCourse);
router.post(
  "/admin/course/new",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  upload.array("images", 10),
  newCourse
);

router.post(
  "/admin/course/:id/module",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  upload.array("images", 10),
  addModule
);

router.put(
  "/admin/course/deactivate/:id",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  deactivateCourse
);
router.put(
  "/admin/course/reactivate/:id",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  reactivateCourse
);

module.exports = router;
