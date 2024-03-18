const express = require("express");
const router = express.Router();

const {
  getEnrollments,
  newEnrollment,
  getSingleEnrollment,
  updateEnrollment,
  deleteEnrollment,
  myEnrollments,
} = require("../controllers/enrollmentController");

const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth");

router.get('/enrollment/me', isAuthenticatedUser, myEnrollments);

router.get(
  "/admin/enrollments",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  getEnrollments
);
router.get("/enrollment/:id", getSingleEnrollment);
router
  .route("/admin/enrollment/:id")
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateEnrollment)
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteEnrollment);
router.post(
  "/admin/enrollment/new",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  newEnrollment
);

module.exports = router;
