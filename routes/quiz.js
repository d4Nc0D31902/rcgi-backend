const express = require("express");
const router = express.Router();

const {
  getQuizzes,
  newQuiz,
  getSingleQuiz,
  updateQuiz,
  deleteQuiz,
} = require("../controllers/quizController");

const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth");

router.get(
  "/admin/quizzes",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  getQuizzes
);
router.get("/quiz/:id", getSingleQuiz);
router
  .route("/admin/quiz/:id")
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateQuiz)
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteQuiz);
router.post(
  "/admin/quiz/new",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  newQuiz
);

module.exports = router;
