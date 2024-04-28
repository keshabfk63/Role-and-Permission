const { check } = require("express-validator");

exports.userValidate = [
  check("name", "Name is Required").not().isEmpty(),
  check("email", "Email is Required").not().isEmpty().isEmail().normalizeEmail({
    gmail_remove_dots: true,
  }),
  check("password", "Password is Required").not().isEmpty(),
  check("confirmPassword", "ConfirmPassword is required").not().isEmpty(),
];

exports.loginValidate = [
  check("email", "Email is Required").not().isEmpty().isEmail().normalizeEmail({
    gmail_remove_dots: true,
  }),
  check("password", "Password is Required").not().isEmpty(),
];

exports.updateValidate = [
  check("name", "Name is Required").not().isEmpty(),
  check("email", "Email is Required").not().isEmpty().isEmail().normalizeEmail({
    gmail_remove_dots: true,
  }),
  check("password", "Password is Required").not().isEmpty(),
  check("confirmPassword", "ConfirmPassword is required").not().isEmpty(),
];
exports.adminValidate = [
  check("name", "Name is required").not().isEmpty(),
  check("userName", "UserName is Required").not().isEmpty(),
  check("password", "Password is Require").not().isEmpty(),
  check("ConfirmPassword", "ConfirmPassword is required").not().isEmpty(),
];
exports.adminLoginValidate = [
  check("userName", "UserName is Required").not().isEmpty(),
  check("password", "Password is Require").not().isEmpty(),
];
