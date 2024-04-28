const User = require("../Models/userModel");
const Admin = require("../Models/adminModel");
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const userRegister = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: "400",
        message: "Error",
        errors: errors.array(),
      });
    }
    const { name, email, password, confirmPassword, phone } = req.body;
    const bpassword = await bcrypt.hash(password, 12);
    const bconfirmPassword = await bcrypt.hash(confirmPassword, 12);

    const user = new User({
      name,
      email,
      password: bpassword,
      confirmPassword: bconfirmPassword,
      phone,
    });

    const userData = await user.save();
    return res.status(200).json({
      status: "200",
      message: "Sucessfully added",
      userData,
    });
  } catch (e) {
    return res.status(400).json({
      status: "400",
      message: e.message,
    });
  }
};

//generating token for user
const generateAccessToken = async (user) => {
  const payload = {
    id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
  };
  const token = await jwt.sign(payload, process.env.jwt_salt, {
    expiresIn: "2d",
  });
  return token;
};
//generating token for admin
const generateAccesTokenForAdmin = async (admin) => {
  const payload = {
    id: admin._id,
    name: admin.name,
    userName: admin.userName,
    phone: admin.phone,
    role: admin.role,
  };
  const token = await jwt.sign(payload, process.env.jwt_salt, {
    expiresIn: "2d",
  });
  return token;
};

const userLogin = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: "400",
        message: "error",
        errors: errors.array(),
      });
    }
    const { email, password } = req.body;
    const userData = await User.findOne({ email: email });

    if (!userData) {
      return res.status(400).json({
        status: "400",
        message: "User doesnot exist!!! Login again ",
      });
    }

    const matchPassword = await bcrypt.compare(password, userData.password);

    if (!matchPassword) {
      return res.status(400).json({
        status: "400",
        message: "Email and password doesnot match!!!",
      });
    }
    const accessToken = await generateAccessToken(userData);
    return res.status(200).json({
      status: "200",
      message: "login sucessful!!!",
      accessToken,
    });
  } catch (e) {
    return res.status(400).json({
      status: "400",
      message: e.message,
    });
  }
};

const getData = async (req, res) => {
  // if (req.all.role === "user") {
  //   return res.status(400).json({
  //     status: "400",
  //     message: "You are not able to view this page...",
  //   });
  // }
  if (req.all.role === "admin") {
    try {
      const userData = await User.find();
      return res.status(200).json({
        data: userData,
      });
    } catch (e) {
      return res.status(400).json({
        error: e.message,
      });
    }
  }
};

const deleteUser = async (req, res) => {
  const userId = req.params.id;
  // if (req.all.role === "user") {
  //   return res.status(400).json({
  //     status: "400",
  //     message: "You are not able to access this page...",
  //   });
  // }

  if (req.all.role === "admin") {
    try {
      await User.deleteOne({ _id: userId });
      return res.status(200).json({
        status: "200",
        message: "Sucessfully deleted!!!",
      });
    } catch (e) {
      return res.status(400).json({
        error: e.message,
      });
    }
  }
};

const updateUser = async (req, res) => {
  const userId = req.params.id;
  const { name, email, password, confirmPassword, phone, role } = req.body;

  // if (req.all.role === "user") {
  //   return res.status(400).json({
  //     status: "400",
  //     message: "You are not able to access this page...",
  //   });
  // }
  if (req.all.role === "admin") {
    try {
      const bpassword = await bcrypt.hash(password, 12);
      const bconfirmPassword = await bcrypt.hash(confirmPassword, 12);
      const updateData = await User.updateOne(
        { _id: userId },
        {
          name,
          email,
          password: bpassword,
          confirmPassword: bconfirmPassword,
          phone,
          role,
        },
        { runValidators: true }
      );
      return res.status(200).json({
        status: "200",
        message: "Sucessfully updated!!!",
        updateData: updateData,
      });
    } catch (e) {
      return res.status(400).json({
        error: e.message,
      });
    }
  }
};

const adminRegister = async (req, res) => {
  try {
    const adminCount = await Admin.countDocuments({});
    console.log(adminCount);
    if (adminCount >= 2) {
      return res.status(400).json({ message: "Maximum admin limit reached" });
    }

    const { name, userName, password, confirmPassword, phone } = req.body;
    if (password !== confirmPassword) {
      return res.status(400).json({
        error: "password and cofirmPassword doesnot match",
      });
    }
    const bpassword = await bcrypt.hash(password, 12);
    const bconfirmPassword = await bcrypt.hash(confirmPassword, 12);
    const admin = new Admin({
      name,
      userName,
      password: bpassword,
      confirmPassword: bconfirmPassword,
      phone,
    });
    const adminData = await admin.save();
    return res.status(200).json({
      status: "200",
      message: "Admin created Sucessfully",
      data: adminData,
    });
  } catch (e) {
    return res.status(400).json({
      status: "400",
      message: "Error occured!!",
      error: e.message,
    });
  }
};

const adminLogin = async (req, res) => {
  try {
    const { userName, password } = req.body;
    const adminData = await Admin.findOne({ userName: userName });
    if (!adminData) {
      return res.status(400).json({
        status: "Error,",
        message: "Admin does not exist !!!",
      });
    }
    const verifyPassword = await bcrypt.compare(password, adminData.password);
    if (!verifyPassword) {
      return res.status(400).json({
        status: "Error,",
        message: "password and email are invalid!!!",
      });
    }

    const accessToken = await generateAccesTokenForAdmin(adminData);
    return res.status(200).json({
      status: "200",
      message: "Sucessfully logged in!!!",
      accessToken: accessToken,
    });
  } catch (e) {
    return res.status(400).json({
      status: "Error,",
      message: e.message,
    });
  }
};

module.exports = {
  userRegister,
  userLogin,
  getData,
  deleteUser,
  updateUser,
  adminRegister,
  adminLogin,
};
