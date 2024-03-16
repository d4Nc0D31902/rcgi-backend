const express = require("express");
const router = express.Router();
const upload = require("../utils/multer");

const {
  getModules,
  newModule,
  getSingleModule,
  updateModule,
  deleteModule,
  addChapter,
} = require("../controllers/moduleController");

const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth");

router.get("/admin/modules", getModules);
router.get("/module/:id", getSingleModule);
router
  .route("/admin/module/:id")
  .put(
    isAuthenticatedUser,
    authorizeRoles("admin"),
    upload.array("images", 10),
    updateModule
  )
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteModule);

router.post(
  "/admin/module/new",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  upload.array("images", 10),
  newModule
);

router.post(
  "/admin/module/:moduleId/chapter/new",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  addChapter
);

module.exports = router;
