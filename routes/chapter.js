const express = require("express");
const router = express.Router();

const {
  getChapters,
  newChapter,
  getSingleChapter,
  updateChapter,
  deleteChapter,
} = require("../controllers/chapterController");

const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth");

router.get(
  "/admin/chapters",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  getChapters
);
router.get("/chapter/:id", getSingleChapter);
router
  .route("/admin/chapter/:id")
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateChapter)
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteChapter);
router.post(
  "/admin/chapter/new",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  newChapter
);

module.exports = router;
