const Enrollment = require("../models/enrollment");
const Course = require("../models/course");
const User = require("../models/user");
const Chapter = require("../models/chapter");
const ErrorHandler = require("../utils/errorHandler");

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

//     const course = await Course.findById(courseId).populate("modules");
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

//     const modules = course.modules.map((module) => ({ moduleId: module._id }));

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

// exports.joinEnrollment = async (req, res, next) => {
//   try {
//     const { userId, courseId } = req.body;

//     const user = await User.findById(userId);
//     if (!user) {
//       return next(new ErrorHandler("User not found", 404));
//     }

//     const course = await Course.findById(courseId).populate("modules");
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

//     const modules = course.modules.map((module) => {
//       const moduleData = {
//         moduleId: module._id,
//         chapter: module.chapters.map((chapter) => ({ chapterId: chapter._id })),
//       };
//       return moduleData;
//     });

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

// exports.joinEnrollment = async (req, res, next) => {
//   try {
//     const { userId, courseId } = req.body;

//     const user = await User.findById(userId);
//     if (!user) {
//       return next(new ErrorHandler("User not found", 404));
//     }

//     const course = await Course.findById(courseId).populate({
//       path: "modules",
//       populate: {
//         path: "chapters",
//         populate: {
//           path: "lessons",
//         },
//       },
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

//     const modules = course.modules.map((module) => {
//       const moduleData = {
//         moduleId: module._id,
//         chapter: module.chapters.map((chapter) => ({
//           chapterId: chapter._id,
//           lessons: chapter.lessons.map((lesson) => ({ lessonId: lesson._id })),
//         })),
//       };
//       return moduleData;
//     });

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
      populate: {
        path: "chapters",
        populate: [{ path: "lessons" }, { path: "quizzes" }],
      },
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

    const modules = course.modules.map((module) => {
      const moduleData = {
        moduleId: module._id,
        chapter: module.chapters.map((chapter) => ({
          chapterId: chapter._id,
          lessons: chapter.lessons.map((lesson) => ({ lessonId: lesson._id })),
          quizzes: chapter.quizzes.map((quiz) => ({ quizId: quiz._id })),
        })),
      };
      return moduleData;
    });

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

// exports.getSingleModule = async (req, res, next) => {
//   try {
//     const enrollment = await Enrollment.findById(req.params.id)
//       .populate({
//         path: "course.courseId",
//         select: "-modules -status",
//       })
//       .populate({
//         path: "module.moduleId",
//         select: "-chapters -status",
//       })
//       .populate({
//         path: "module.chapter.chapterId",
//         select: "-lessons -quizzes -status",
//       })
//       .populate("user");

//     if (!enrollment) {
//       return next(new ErrorHandler("Enrollment not found", 404));
//     }
//     const singleModule = enrollment.module.find((module) =>
//       module._id.equals(req.params.moduleId)
//     );

//     if (!singleModule) {
//       return next(new ErrorHandler("Module not found in this enrollment", 404));
//     }

//     res.status(200).json({
//       success: true,
//       module: singleModule,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

exports.getSingleModule = async (req, res, next) => {
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

// exports.getEnrollments = async (req, res, next) => {
//   try {
//     const enrollments = await Enrollment.find();
//     res.status(200).json({
//       success: true,
//       enrollments,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

exports.getEnrollments = async (req, res, next) => {
  try {
    const enrollments = await Enrollment.find()
      .populate({
        path: "user",
        select: "name",
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
