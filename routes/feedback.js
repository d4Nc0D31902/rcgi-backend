const express = require("express");
const router = express.Router();

const {
  getFeedbacks,
  newFeedback,
  getSingleFeedback,
  updateFeedback,
  deleteFeedback,
} = require("../controllers/feedbackController");

const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth");

router.get(
  "/admin/feedbacks",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  getFeedbacks
);

router.get("/feedback/:id", getSingleFeedback);

router
  .route("/admin/feedback/:id")
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateFeedback)
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteFeedback);

router.post(
  "/feedback/new",
  isAuthenticatedUser,
  newFeedback
);

module.exports = router;
