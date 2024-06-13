const Enrollment = require("../models/enrollment");
const Course = require("../models/course");
const User = require("../models/user");
const Chapter = require("../models/chapter");
const ErrorHandler = require("../utils/errorHandler");
const Notifications = require("../models/notifications");
const Forum = require("../models/forum");

const checkUser = async (userId, courseId) => {
  const enrollment = await Enrollment.findOne({
    user: userId,
    course: courseId,
  });
  return enrollment ? true : false;
};

exports.newEnrollment = async (req, res, next) => {
  try {
    const enrollment = await Enrollment.create(req.body);
    res.status(201).json({
      success: true,
      enrollment,
    });
  } catch (error) {
    next(error);
  }
};

// exports.joinEnrollment = async (req, res, next) => {
//   try {
//     const { userId, courseId } = req.body;

//     const user = await User.findById(userId);
//     if (!user) {
//       return next(new ErrorHandler("User not found", 404));
//     }

//     const course = await Course.findById(courseId).populate({
//       path: "modules",
//       populate: [
//         {
//           path: "chapters",
//           populate: [{ path: "lessons" }, { path: "quizzes" }],
//         },
//         { path: "forum" },
//       ],
//     });
//     if (!course) {
//       return next(new ErrorHandler("Course not found", 404));
//     }

//     const enrollment = await Enrollment.findOne({
//       user: userId,
//       "course.courseId": courseId,
//     });
//     if (enrollment) {
//       return next(
//         new ErrorHandler("User is already enrolled in this course", 400)
//       );
//     }

//     // Construct enrollment data
//     const modules = course.modules.map((module) => {
//       const moduleData = {
//         moduleId: module._id,
//         forum: module.forum.map((forum) => ({ forumId: forum._id })),
//         chapter: module.chapters.map((chapter) => ({
//           chapterId: chapter._id,
//           lessons: chapter.lessons.map((lesson) => ({ lessonId: lesson._id })),
//           quizzes: chapter.quizzes.map((quiz) => ({ quizId: quiz._id })),
//         })),
//       };
//       return moduleData;
//     });

//     // Create enrollment
//     await Enrollment.create({
//       user: userId,
//       course: [{ courseId: courseId }],
//       module: modules,
//     });

//     res.status(201).json({
//       success: true,
//       message: "Enrollment created successfully",
//     });
//   } catch (error) {
//     next(error);
//   }
// };

exports.joinEnrollment = async (req, res, next) => {
  try {
    const { userId, courseId } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    const course = await Course.findById(courseId).populate({
      path: "modules",
      populate: [
        {
          path: "chapters",
          populate: [{ path: "lessons" }, { path: "quizzes" }],
        },
        { path: "forum" },
      ],
    });
    if (!course) {
      return next(new ErrorHandler("Course not found", 404));
    }

    const enrollment = await Enrollment.findOne({
      user: userId,
      "course.courseId": courseId,
    });
    if (enrollment) {
      return next(
        new ErrorHandler("User is already enrolled in this course", 400)
      );
    }

    // Filter chapters based on the user's company or no company
    const modules = course.modules.map((module) => {
      const filteredChapters = module.chapters.filter(
        (chapter) => !chapter.company || chapter.company === user.company
      );

      const moduleData = {
        moduleId: module._id,
        forum: module.forum.map((forum) => ({ forumId: forum._id })),
        chapter: filteredChapters.map((chapter) => ({
          chapterId: chapter._id,
          lessons: chapter.lessons.map((lesson) => ({ lessonId: lesson._id })),
          quizzes: chapter.quizzes.map((quiz) => ({ quizId: quiz._id })),
        })),
      };
      return moduleData;
    });

    // Create enrollment
    await Enrollment.create({
      user: userId,
      course: [{ courseId: courseId }],
      module: modules,
    });

    res.status(201).json({
      success: true,
      message: "Enrollment created successfully",
    });
  } catch (error) {
    next(error);
  }
};

exports.getSingleEnrollment = async (req, res, next) => {
  try {
    const enrollment = await Enrollment.findById(req.params.id)
      .populate({
        path: "course.courseId",
        select: "-modules -status",
      })
      .populate({
        path: "module.moduleId",
        select: "-chapters -status",
      })
      .populate("user");

    if (!enrollment) {
      return next(new ErrorHandler("Enrollment not found", 404));
    }

    res.status(200).json({
      success: true,
      enrollment,
    });
  } catch (error) {
    next(error);
  }
};

exports.getSingleModule = async (req, res, next) => {
  try {
    const enrollment = await Enrollment.findById(req.params.id)
      .populate({
        path: "course.courseId",
        select: "-modules -status",
      })
      .populate({
        path: "module.moduleId",
        select: "-chapters -forum -status",
      })
      .populate({
        path: "module.forum.forumId",
        select: "-reply",
      })
      .populate({
        path: "module.chapter.chapterId",
        select: "-lessons -quizzes -status",
      })
      .populate({
        path: "module.chapter.lessons.lessonId",
        select: "-status",
      })
      .populate({
        path: "module.chapter.quizzes.quizId",
        select: "-status",
      })
      .populate("user");

    if (!enrollment) {
      return next(new ErrorHandler("Enrollment not found", 404));
    }
    const singleModule = enrollment.module.find((module) =>
      module._id.equals(req.params.moduleId)
    );

    if (!singleModule) {
      return next(new ErrorHandler("Module not found in this enrollment", 404));
    }

    res.status(200).json({
      success: true,
      module: singleModule,
    });
  } catch (error) {
    next(error);
  }
};

// exports.getSingleModule = async (req, res, next) => {
//   try {
//     const enrollment = await Enrollment.findById(req.params.id)
//       .populate({
//         path: "course.courseId",
//         select: "-modules -status",
//       })
//       .populate({
//         path: "module.moduleId",
//         select: "-chapters -forum -status",
//       })
//       .populate({
//         path: "module.forum.forumId",
//         select: "-reply",
//       })
//       .populate({
//         path: "module.chapter.chapterId",
//         select: "-lessons -quizzes -status",
//       })
//       .populate({
//         path: "module.chapter.lessons.lessonId",
//         select: "-status",
//       })
//       .populate({
//         path: "module.chapter.quizzes.quizId",
//         select: "-status",
//       })
//       .populate("user");

//     if (!enrollment) {
//       return next(new ErrorHandler("Enrollment not found", 404));
//     }

//     const user = enrollment.user;
//     if (!user) {
//       return next(new ErrorHandler("User not found in this enrollment", 404));
//     }

//     const singleModule = enrollment.module.find((module) =>
//       module._id.equals(req.params.moduleId)
//     );

//     if (!singleModule) {
//       return next(new ErrorHandler("Module not found in this enrollment", 404));
//     }

//     // Filter chapters based on the user's company
//     singleModule.chapter = singleModule.chapter.filter((chapter) => {
//       return chapter.chapterId.company === user.company;
//     });

//     res.status(200).json({
//       success: true,
//       module: singleModule,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

exports.getSingleLesson = async (req, res, next) => {
  try {
    const enrollment = await Enrollment.findById(req.params.id)
      .populate({
        path: "module.chapter.lessons.lessonId",
        select: "-status",
      })
      .populate("user");

    if (!enrollment) {
      return next(new ErrorHandler("Enrollment not found", 404));
    }

    const singleLesson = enrollment.module
      .flatMap((mod) => mod.chapter)
      .flatMap((chap) => chap.lessons)
      .find((lesson) => lesson._id.equals(req.params.lessonId));

    if (!singleLesson) {
      return next(new ErrorHandler("Lesson not found in this enrollment", 404));
    }

    res.status(200).json({
      success: true,
      lesson: singleLesson,
    });
  } catch (error) {
    next(error);
  }
};

exports.getSingleQuiz = async (req, res, next) => {
  try {
    const enrollment = await Enrollment.findById(req.params.id)
      .populate({
        path: "module.chapter.quizzes.quizId",
        select: "-status",
      })
      .populate("user");

    if (!enrollment) {
      return next(new ErrorHandler("Enrollment not found", 404));
    }

    const singleQuiz = enrollment.module
      .flatMap((mod) => mod.chapter)
      .flatMap((chap) => chap.quizzes)
      .find((quiz) => quiz._id.equals(req.params.quizId));

    if (!singleQuiz) {
      return next(new ErrorHandler("Quiz not found in this enrollment", 404));
    }

    res.status(200).json({
      success: true,
      quiz: singleQuiz,
    });
  } catch (error) {
    next(error);
  }
};

exports.getSingleChapter = async (req, res, next) => {
  try {
    const enrollment = await Enrollment.findById(req.params.id)
      .populate({
        path: "module.chapter.chapterId",
        select: "-lessons -quizzes -status",
      })
      .populate("user");

    if (!enrollment) {
      return next(new ErrorHandler("Enrollment not found", 404));
    }

    const singleChapter = enrollment.module
      .flatMap((mod) => mod.chapter)
      .find((chapter) => chapter._id.equals(req.params.chapterId));

    if (!singleChapter) {
      return next(
        new ErrorHandler("Chapter not found in this enrollment", 404)
      );
    }

    res.status(200).json({
      success: true,
      chapter: singleChapter,
    });
  } catch (error) {
    next(error);
  }
};

exports.myEnrollments = async (req, res, next) => {
  try {
    const enrollments = await Enrollment.find({ user: req.user._id })
      .populate({
        path: "user",
        select: "name",
      })
      .populate({
        path: "course.courseId",
        select: "title",
      });

    res.status(200).json({
      success: true,
      enrollments,
    });
  } catch (error) {
    next(new ErrorHandler("Server Error", 500));
  }
};

exports.updateEnrollment = async (req, res, next) => {
  try {
    let enrollment = await Enrollment.findById(req.params.id);
    if (!enrollment) {
      return next(new ErrorHandler("Enrollment not found", 404));
    }
    enrollment = await Enrollment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });
    res.status(200).json({
      success: true,
      enrollment,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteEnrollment = async (req, res, next) => {
  try {
    const enrollment = await Enrollment.findById(req.params.id);
    if (!enrollment) {
      return next(new ErrorHandler("Enrollment not found", 404));
    }
    await enrollment.remove();
    res.status(200).json({
      success: true,
      message: "Enrollment deleted",
    });
  } catch (error) {
    next(error);
  }
};

exports.getEnrollments = async (req, res, next) => {
  try {
    const enrollments = await Enrollment.find()
      .populate({
        path: "user",
        select: "name company",
      })
      .populate({
        path: "course.courseId",
        select: "title",
      })
      .populate({
        path: "module.moduleId",
        select: "-__v",
      })
      .populate({
        path: "module.chapter.chapterId",
        select: "-__v",
      })
      .populate({
        path: "module.chapter.lessons.lessonId",
        select: "-__v",
      })
      .populate({
        path: "module.chapter.quizzes.quizId",
        select: "-__v",
      })
      .populate({
        path: "retake.user",
        select: "name company",
      })
      .populate({
        path: "retake.chapter",
        select: "title",
      })
      .populate({
        path: "retake.quiz",
        select: "title",
      })
      .populate({
        path: "submit.user",
        select: "name company",
      })
      .populate({
        path: "submit.chapter",
        select: "title",
      })
      .populate({
        path: "submit.quiz",
        select: "title",
      });

    res.status(200).json({
      success: true,
      enrollments,
    });
  } catch (error) {
    next(error);
  }
};

exports.markChapterAsDone = async (req, res, next) => {
  try {
    const { enrollmentId, moduleId, chapterId } = req.params;

    const enrollment = await Enrollment.findById(enrollmentId);
    if (!enrollment) {
      return next(new ErrorHandler("Enrollment not found", 404));
    }

    const moduleToUpdate = enrollment.module.find((mod) =>
      mod._id.equals(moduleId)
    );
    if (!moduleToUpdate) {
      return next(new ErrorHandler("Module not found in this enrollment", 404));
    }

    const chapterToUpdate = moduleToUpdate.chapter.find((chap) =>
      chap._id.equals(chapterId)
    );
    if (!chapterToUpdate) {
      return next(new ErrorHandler("Chapter not found in this module", 404));
    }

    chapterToUpdate.status = "Done";

    await enrollment.save();

    res.status(200).json({
      success: true,
      message: "Chapter marked as done successfully",
    });
  } catch (error) {
    next(error);
  }
};

exports.markLessonAsDone = async (req, res, next) => {
  try {
    const { enrollmentId, moduleId, chapterId, lessonId } = req.params;

    const enrollment = await Enrollment.findById(enrollmentId);
    if (!enrollment) {
      return next(new ErrorHandler("Enrollment not found", 404));
    }

    const moduleToUpdate = enrollment.module.find((mod) =>
      mod._id.equals(moduleId)
    );
    if (!moduleToUpdate) {
      return next(new ErrorHandler("Module not found in this enrollment", 404));
    }

    const chapterToUpdate = moduleToUpdate.chapter.find((chap) =>
      chap._id.equals(chapterId)
    );
    if (!chapterToUpdate) {
      return next(new ErrorHandler("Chapter not found in this module", 404));
    }

    const lessonToUpdate = chapterToUpdate.lessons.find((lesson) =>
      lesson._id.equals(lessonId)
    );
    if (!lessonToUpdate) {
      return next(new ErrorHandler("Lesson not found in this chapter", 404));
    }

    lessonToUpdate.status = "Done";

    await enrollment.save();

    res.status(200).json({
      success: true,
      message: "Lesson marked as done successfully",
    });
  } catch (error) {
    next(error);
  }
};

exports.markQuizAsDone = async (req, res, next) => {
  try {
    const { enrollmentId, moduleId, chapterId, quizId } = req.params;

    const enrollment = await Enrollment.findById(enrollmentId);
    if (!enrollment) {
      return next(new ErrorHandler("Enrollment not found", 404));
    }

    const moduleToUpdate = enrollment.module.find((mod) =>
      mod._id.equals(moduleId)
    );
    if (!moduleToUpdate) {
      return next(new ErrorHandler("Module not found in this enrollment", 404));
    }

    const chapterToUpdate = moduleToUpdate.chapter.find((chap) =>
      chap._id.equals(chapterId)
    );
    if (!chapterToUpdate) {
      return next(new ErrorHandler("Chapter not found in this module", 404));
    }

    const quizToUpdate = chapterToUpdate.quizzes.find((quiz) =>
      quiz._id.equals(quizId)
    );
    if (!quizToUpdate) {
      return next(new ErrorHandler("Quiz not found in this chapter", 404));
    }

    quizToUpdate.status = "Done";

    await enrollment.save();

    res.status(200).json({
      success: true,
      message: "Quiz marked as done successfully",
    });
  } catch (error) {
    next(error);
  }
};

exports.markModuleAsDone = async (req, res, next) => {
  try {
    const { enrollmentId, moduleId } = req.params;

    const enrollment = await Enrollment.findById(enrollmentId);
    if (!enrollment) {
      return next(new ErrorHandler("Enrollment not found", 404));
    }

    const moduleToUpdate = enrollment.module.find((mod) =>
      mod._id.equals(moduleId)
    );
    if (!moduleToUpdate) {
      return next(new ErrorHandler("Module not found in this enrollment", 404));
    }

    moduleToUpdate.status = "Done";

    await enrollment.save();

    res.status(200).json({
      success: true,
      message: "Module marked as done successfully",
    });
  } catch (error) {
    next(error);
  }
};

exports.createSubmit = async (req, res, next) => {
  try {
    const { enrollmentId } = req.params;
    const { user, chapter, quiz, score, result } = req.body;

    const enrollment = await Enrollment.findById(enrollmentId);
    if (!enrollment) {
      return next(new ErrorHandler("Enrollment not found", 404));
    }

    enrollment.submit.push({ user, chapter, quiz, score, result });
    await enrollment.save();

    res.status(201).json({
      success: true,
      message: "Submission created successfully",
    });
  } catch (error) {
    next(error);
  }
};

exports.createRetake = async (req, res, next) => {
  try {
    const { enrollmentId } = req.params;
    const { user, chapter, quiz, retake } = req.body;

    const enrollment = await Enrollment.findById(enrollmentId);
    if (!enrollment) {
      return next(new ErrorHandler("Enrollment not found", 404));
    }

    enrollment.retake.push({ user, chapter, quiz, retake });
    await enrollment.save();

    res.status(201).json({
      success: true,
      message: "Retake created successfully",
    });
  } catch (error) {
    next(error);
  }
};

exports.checkProgress = async (req, res, next) => {
  try {
    const enrollment = await Enrollment.findById(req.params.id)
      .populate({
        path: "course.courseId",
        select: "title",
      })
      .populate({
        path: "user",
        select: "name company avatar",
      });

    if (!enrollment) {
      return next(new ErrorHandler("Enrollment not found", 404));
    }

    const isDone =
      enrollment.module.every((module) =>
        module.chapter.every(
          (chapter) =>
            chapter.lessons.every((lesson) => lesson.status === "Done") &&
            chapter.quizzes.every((quiz) => quiz.status === "Done")
        )
      ) && enrollment.module.every((module) => module.status === "Done");

    const progress = isDone ? "Completed" : "In Progress";

    // await global.io
    //   .timeout(1000)
    //   .emit(`notification`, {
    //     type: "success",
    //     message: "Notif completed",
    //     user: req.user._id,
    //   });

    if (progress === "Completed") {
      const requesterNotification = new Notifications({
        message: `Congratulations on Completing ${enrollment.course[0].courseId.title}`,
        user: req.user._id,
      });
      await requesterNotification.save();

      const admins = await User.find({
        role: "admin",
      });

      // await global.io.timeout(1000).emit(`notification`, {
      //   message: "Sending notifications to admins...",
      //   user: req.user._id,
      // }); TRUE SOCKET USE THIS

      for (const admin of admins) {
        const adminNotification = new Notifications({
          message: `<img src="${enrollment.user[0].avatar.url}" style="vertical-align: middle; width: 30px; height: 30px; border-radius: 50%;"> ${enrollment.user[0].name} from ${enrollment.user[0].company} Completed the Course!`,
          user: admin._id,
        });
        await adminNotification.save();
      }
    }

    res.status(200).json({
      success: true,
      progress,
    });
  } catch (error) {
    next(error);
  }
};

exports.forumCreateReply = async (req, res, next) => {
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

    // Update forum status to "Done" in the enrollment model
    const enrollment = await Enrollment.findOne({
      "module.forum.forumId": forumId,
    });
    if (!enrollment) {
      console.log("Enrollment not found");
      return next(new ErrorHandler("Enrollment not found", 404));
    }

    let forumUpdated = false;
    enrollment.module.forEach((module) => {
      module.forum.forEach((forum) => {
        if (forum.forumId.equals(forumId)) {
          forum.status = "Done";
          forumUpdated = true;
        }
      });
    });

    if (forumUpdated) {
      await enrollment.save();
      console.log("Enrollment forum status updated to Done");
    } else {
      console.log("Forum not found in enrollment");
    }

    res.status(201).json({
      success: true,
      message: "Reply added successfully and forum status updated to Done",
      forum,
    });
  } catch (error) {
    console.error("Error creating reply:", error);
    next(error);
  }
};
