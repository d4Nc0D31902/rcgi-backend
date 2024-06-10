const Forum = require("../models/forum");
const User = require("../models/user");

// Create a new forum post
exports.createForum = async (req, res) => {
  try {
    const forum = new Forum(req.body);
    await forum.save();
    res.status(201).json(forum);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all forum posts
exports.getAllForums = async (req, res, next) => {
  try {
    const forums = await Forum.find().populate("reply.user", "name");

    res.status(200).json({
      success: true,
      forums,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
    });
  }
};

// Get a single forum post by ID
exports.getForumById = async (req, res) => {
  try {
    const forum = await Forum.findById(req.params.id).populate(
      "reply.user",
      "name avatar"
    );
    if (!forum) {
      return res.status(404).json({ error: "Forum post not found" });
    }
    res.status(200).json(forum);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update a forum post by ID
exports.updateForum = async (req, res) => {
  try {
    const forum = await Forum.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!forum) {
      return res.status(404).json({ error: "Forum post not found" });
    }
    res.status(200).json(forum);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a forum post by ID
exports.deleteForum = async (req, res) => {
  try {
    const forum = await Forum.findByIdAndDelete(req.params.id);
    if (!forum) {
      return res.status(404).json({ error: "Forum post not found" });
    }
    res.status(200).json({ message: "Forum post deleted" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Create Reply
exports.createReply = async (req, res, next) => {
  try {
    const { forumId } = req.params;
    const { reply } = req.body;
    const userId = req.user._id;

    console.log("Creating reply for forum ID:", forumId);
    console.log("Reply content:", reply);
    console.log("User ID:", userId);

    const forum = await Forum.findById(forumId);
    if (!forum) {
      console.log("Forum post not found");
      return next(new ErrorHandler("Forum post not found", 404));
    }

    const newReply = {
      user: userId,
      reply,
      createdAt: new Date(),
    };

    forum.reply.push(newReply);
    await forum.save();

    console.log("Reply added successfully");

    res.status(201).json({
      success: true,
      message: "Reply added successfully",
      forum,
    });
  } catch (error) {
    console.error("Error creating reply:", error);
    next(error);
  }
};
