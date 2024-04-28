const express = require("express");
const router = express.Router();
const authControl = require("../Controller/authController");
const validate = require("../Helpers/authValidator");
const auth = require("../Middleware/authMiddleware");
const adminRole = require("../Middleware/onlyAdminMiddleware");

router.post("/addUser", validate.userValidate, authControl.userRegister);
router.post("/login", validate.loginValidate, authControl.userLogin);

router.post("/createAdmin", validate.adminValidate, authControl.adminRegister);
router.post("/loginAdmin", validate.adminLoginValidate, authControl.adminLogin);

router.get(
  "/getData",
  auth.verifyToken,
  adminRole.onlyAdmin,
  authControl.getData
);
router.delete(
  "/deleteUser/:id",
  auth.verifyToken,
  adminRole.onlyAdmin,
  authControl.deleteUser
);
router.put(
  "/updateUser/:id",
  auth.verifyToken,
  adminRole.onlyAdmin,
  validate.updateValidate,
  authControl.updateUser
);
module.exports = router;
