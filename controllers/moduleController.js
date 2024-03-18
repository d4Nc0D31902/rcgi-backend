const Module = require("../models/module");
const Chapter = require("../models/chapter");
const ErrorHandler = require("../utils/errorHandler");
const cloudinary = require("cloudinary");

exports.newModule = async (req, res, next) => {
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
  res.status(201).json({
    success: true,
    module,
  });
};

// exports.getSingleModule = async (req, res, next) => {
//   const module = await Module.findById(req.params.id);
//   if (!module) {
//     return next(new ErrorHandler("Module not found", 404));
//   }
//   res.status(200).json({
//     success: true,
//     module,
//   });
// };

exports.getSingleModule = async (req, res, next) => {
  try {
    const module = await Module.findById(req.params.id).populate({
      path: "chapters",
      populate: { path: "lessons quizzes" }, 
    });

    if (!module) {
      return next(new ErrorHandler("Module not found", 404));
    }

    res.status(200).json({
      success: true,
      module,
    });
  } catch (error) {
    next(error);
  }
};

exports.addChapter = async (req, res, next) => {
  const module = await Module.findById(req.params.moduleId);
  if (!module) {
    return next(new ErrorHandler("Module not found", 404));
  }

  const chapter = await Chapter.create(req.body);

  module.chapters.push(chapter._id);
  await module.save();

  res.status(201).json({
    success: true,
    chapter,
  });
};

exports.updateModule = async (req, res, next) => {
  let module = await Module.findById(req.params.id);
  if (!module) {
    return next(new ErrorHandler("Module not found", 404));
  }
  let images = [];

  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }
  if (images !== undefined) {
    // Deleting images associated with the module
    for (let i = 0; i < module.images.length; i++) {
      const result = await cloudinary.v2.uploader.destroy(
        module.images[i].public_id
      );
    }
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
  module = await Module.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindandModify: false,
  });

  return res.status(200).json({
    success: true,
    module,
  });
};

exports.deleteModule = async (req, res, next) => {
  const module = await Module.findById(req.params.id);
  if (!module) {
    return next(new ErrorHandler("Module not found", 404));
  }
  await module.remove();
  res.status(200).json({
    success: true,
    message: "Module deleted",
  });
};

exports.getModules = async (req, res, next) => {
  const modules = await Module.find();
  res.status(200).json({
    success: true,
    modules,
  });
};
