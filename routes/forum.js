const express = require("express");
const router = express.Router();

const {
  createForum,
  getAllForums,
  getForumById,
  updateForum,
  deleteForum,
  createReply,
  updateReply,
  deleteReply,
} = require("../controllers/forumController");

const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth");

// Get all forum posts
router.get("/forums", getAllForums);

// Get a single forum post by ID
router.get("/forum/:id", getForumById);

// Create a new forum post
router.post("/forum/new", isAuthenticatedUser, createForum);

//Create Reply
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

//Update & Delete Reply
router
  .route("/forum/:forumId/reply/:replyId")
  .put(isAuthenticatedUser, updateReply)
  .delete(isAuthenticatedUser, deleteReply);

module.exports = router;
