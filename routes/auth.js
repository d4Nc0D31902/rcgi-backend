const express = require("express");
const router = express.Router();
const upload = require("../utils/multer");

const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth");
const {
  importUsers,
  registerUser,
  loginUser,
  logout,
  forgotPassword,
  resetPassword,
  getUserProfile,
  updatePassword,
  updateProfile,
  allUsers,
  getUserDetails,
  updateUser,
  deleteUser,
  deactivateUser,
  reactivateUser,
} = require("../controllers/authController");
router.post("/register", upload.single("avatar"), registerUser);
router.post("/login", loginUser);

router.post("/password/forgot", forgotPassword);
router.route("/password/reset/:token").put(resetPassword);

router.get("/me", isAuthenticatedUser, getUserProfile);
router.put("/password/update", isAuthenticatedUser, updatePassword);
router.put(
  "/me/update",
  isAuthenticatedUser,
  upload.single("avatar"),
  updateProfile
);

router.put(
  "/admin/user/deactivate/:id",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  deactivateUser
);
router.put(
  "/admin/user/reactivate/:id",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  reactivateUser
);

router
  .route("/admin/users")
  .get(isAuthenticatedUser, authorizeRoles("admin"), allUsers);
router
  .route("/admin/user/:id")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getUserDetails)
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateUser)
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteUser);

router.get("/logout", logout);

router.post(
  "/import-users",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  upload.single("csvFile"),
  importUsers
);

module.exports = router;
