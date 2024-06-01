const express = require("express");
const router = express.Router();

const {
  getEnrollments,
  newEnrollment,
  getSingleEnrollment,
  updateEnrollment,
  deleteEnrollment,
  myEnrollments,
  joinEnrollment,
  getSingleModule,
  getSingleChapter,
  getSingleLesson,
  getSingleQuiz,
  markChapterAsDone,
  markLessonAsDone,
  markQuizAsDone,
  markModuleAsDone,
  createSubmit,
  createRetake,
  checkProgress,
  forumCreateReply, // Import the forumCreateReply controller
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
router.get("/enrollment/:id/module/:moduleId", getSingleModule);
router.get(
  "/enrollment/:id/module/:moduleId/chapter/:chapterId",
  getSingleChapter
);
router.get(
  "/enrollment/:id/module/:moduleId/chapter/:chapterId/lesson/:lessonId",
  getSingleLesson
);
router.get(
  "/enrollment/:id/module/:moduleId/chapter/:chapterId/quiz/:quizId",
  getSingleQuiz
);
router
  .route("/admin/enrollment/:id")
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateEnrollment)
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteEnrollment);
router.post("/enrollment/new", isAuthenticatedUser, newEnrollment);

router.post("/enrollment/join", isAuthenticatedUser, joinEnrollment);

router.put(
  "/enrollment/:enrollmentId/module/:moduleId/chapter/:chapterId/mark-as-done",
  isAuthenticatedUser,
  markChapterAsDone
);

router.put(
  "/enrollment/:enrollmentId/module/:moduleId/chapter/:chapterId/lesson/:lessonId/mark-as-done",
  isAuthenticatedUser,
  markLessonAsDone
);

router.put(
  "/enrollment/:enrollmentId/module/:moduleId/chapter/:chapterId/quiz/:quizId/mark-as-done",
  isAuthenticatedUser,
  markQuizAsDone
);

router.put(
  "/enrollment/:enrollmentId/module/:moduleId/mark-as-done",
  isAuthenticatedUser,
  markModuleAsDone
);

router.post(
  "/enrollment/:enrollmentId/submit",
  isAuthenticatedUser,
  createSubmit
);

router.post(
  "/enrollment/:enrollmentId/retake",
  isAuthenticatedUser,
  createRetake
);

router.get("/enrollment/:id/progress", isAuthenticatedUser, checkProgress);

router.post("/forum/:forumId/reply", isAuthenticatedUser, forumCreateReply);

module.exports = router;
