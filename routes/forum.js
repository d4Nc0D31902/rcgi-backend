const express = require("express");
const router = express.Router();

const {
  createForum,
  getAllForums,
  getForumById,
  updateForum,
  deleteForum,
  createReply,
} = require("../controllers/forumController");

const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth");

// Get all forum posts
router.get("/forums", getAllForums);

// Get a single forum post by ID
router.get("/forum/:id", getForumById);

// Create a new forum post
router.post("/forum/new", isAuthenticatedUser, createForum);

router.post("/forum/:forumId/reply", isAuthenticatedUser, createReply);

// Update a forum post by ID
router.put(
  "/forum/:id",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  updateForum
);

// Delete a forum post by ID
router.delete(
  "/admin/forum/:id",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  deleteForum
);

//Create Reply

module.exports = router;
