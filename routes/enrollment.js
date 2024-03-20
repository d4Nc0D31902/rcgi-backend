const express = require("express");
const router = express.Router();

const {
  getEnrollments,
  newEnrollment,
  getSingleEnrollment,
  updateEnrollment,
  deleteEnrollment,
  myEnrollments,
  joinEnrollment, // Import the joinEnrollment function
} = require("../controllers/enrollmentController");

const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth");

router.get("/enrollment/me", isAuthenticatedUser, myEnrollments);

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
router.post("/enrollment/new", isAuthenticatedUser, newEnrollment);

router.post("/enrollment/join", isAuthenticatedUser, joinEnrollment);

module.exports = router;
