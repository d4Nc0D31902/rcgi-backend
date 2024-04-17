const express = require("express");
const router = express.Router();

const {
  getNotifications,
  newNotification,
  getSingleNotification,
  updateNotification,
  deleteNotification,
  markAsRead,
  markAllAsRead,
} = require("../controllers/notificationsController");

const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth");

router.get(
  "/notifications",
  isAuthenticatedUser,
  getNotifications
);

router.get("/notification/:id", getSingleNotification);

router
  .route("/admin/notification/:id")
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateNotification)
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteNotification);

router.post(
  "/admin/notification/new",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  newNotification
);

router.put("/notification/:id/markAsRead", isAuthenticatedUser, markAsRead);

router.put(
  "/notifications/markAllAsRead",
  isAuthenticatedUser,
  markAllAsRead
);

module.exports = router;
