const User = require("../models/user");

const jwt = require("jsonwebtoken");
const ErrorHandler = require("../utils/errorHandler");

// Checks if user is authenticated or not
// exports.isAuthenticatedUser = async (req, res, next) => {
//   const { token } = req.cookies;
//   console.log(token);

//   if (!token) {
//     return next(new ErrorHandler("Login first to access this resource.", 401));
//   }

//   const decoded = jwt.verify(token, process.env.JWT_SECRET);
//   req.user = await User.findById(decoded.id);

//   next();
// };

exports.isAuthenticatedUser = async (req, res, next) => {
  const { token } = req.cookies;
  console.log(token);

  if (!token) {
    return next(new ErrorHandler("Login first to access this resource.", 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    if (user.status === "inactive") {
      res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
      });

      return next(
        new ErrorHandler("User is inactive. Please log in again.", 401)
      );
    }

    req.user = user;
    next();
  } catch (error) {
    return next(
      new ErrorHandler("Unauthorized access. Please log in again.", 401)
    );
  }
};

exports.authorizeRoles = (...roles) => {
  console.log(roles);
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `Role (${req.user.role}) is not allowed to acccess this resource`,
          403
        )
      );
    }
    next();
  };
};
