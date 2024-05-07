const Course = require("../models/course");
const Module = require("../models/module");
const APIFeatures = require("../utils/apiFeatures");
const ErrorHandler = require("../utils/errorHandler");
const cloudinary = require("cloudinary");

exports.newCourse = async (req, res, next) => {
  let images = [];
  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }

  let imagesLinks = [];

  for (let i = 0; i < images.length; i++) {
    const result = await cloudinary.v2.uploader.upload(images[i], {
      folder: "courses",
    });

    imagesLinks.push({
      public_id: result.public_id,
      url: result.secure_url,
    });
  }
  req.body.images = imagesLinks;

  const course = await Course.create(req.body);
  res.status(201).json({
    success: true,
    course,
  });
};

exports.addModule = async (req, res, next) => {
  try {
    let images = [];
    if (typeof req.body.images === "string") {
      images.push(req.body.images);
    } else {
      images = req.body.images;
    }

    let imagesLinks = [];

    for (let i = 0; i < images.length; i++) {
      const result = await cloudinary.v2.uploader.upload(images[i], {
        folder: "modules",
      });

      imagesLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }

    req.body.images = imagesLinks;

    const module = await Module.create(req.body);

    const courseId = req.body.courseId;
    if (courseId) {
      await Course.findByIdAndUpdate(courseId, {
        $push: { modules: module._id },
      });
    } else {
      throw new Error("Course ID is required.");
    }

    res.status(201).json({
      success: true,
      module,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// exports.getSingleCourse = async (req, res, next) => {
//   const course = await Course.findById(req.params.id);
//   if (!course) {
//     return next(new ErrorHandler("Course not found", 404));
//   }
//   res.status(200).json({
//     success: true,
//     course,
//   });
// };

exports.getSingleCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id).populate("modules");
    if (!course) {
      return next(new ErrorHandler("Course not found", 404));
    }
    res.status(200).json({
      success: true,
      course,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateCourse = async (req, res, next) => {
  let course = await Course.findById(req.params.id);
  if (!course) {
    return next(new ErrorHandler("Course not found", 404));
  }
  let images = [];

  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }
  if (images !== undefined) {
    // Deleting images associated with the course
    for (let i = 0; i < course.images.length; i++) {
      const result = await cloudinary.v2.uploader.destroy(
        course.images[i].public_id
      );
    }
  }
  let imagesLinks = [];
  for (let i = 0; i < images.length; i++) {
    const result = await cloudinary.v2.uploader.upload(images[i], {
      folder: "courses",
    });
    imagesLinks.push({
      public_id: result.public_id,
      url: result.secure_url,
    });
  }
  req.body.images = imagesLinks;
  course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindandModify: false,
  });

  return res.status(200).json({
    success: true,
    course,
  });
};

exports.deleteCourse = async (req, res, next) => {
  const course = await Course.findById(req.params.id);
  if (!course) {
    return next(new ErrorHandler("Course not found", 404));
  }
  await course.remove();
  res.status(200).json({
    success: true,
    message: "Course deleted",
  });
};

exports.getCourses = async (req, res, next) => {
  const courses = await Course.find();
  res.status(200).json({
    success: true,
    courses,
  });
};

exports.deactivateCourse = async (req, res, next) => {
  const course = await Course.findByIdAndUpdate(
    req.params.id,
    { status: "inactive" },
    { new: true }
  );

  if (!course) {
    return next(
      new ErrorHandler(`Course not found with id: ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    message: "Course deactivated successfully",
  });
};

exports.reactivateCourse = async (req, res, next) => {
  const course = await Course.findByIdAndUpdate(
    req.params.id,
    { status: "active" },
    { new: true }
  );

  if (!course) {
    return next(
      new ErrorHandler(`Course not found with id: ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    message: "Course reactivated successfully",
  });
};
