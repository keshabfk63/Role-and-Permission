const onlyAdmin = (req, res, next) => {
  try {
    const role = req.all.role;
    if (role === "user") {
      return res.status(400).json({
        message: "You are not able to access this page!!!",
      });
    }
    next();
  } catch (e) {
    return res.status(400).json({
      status: "400",
      message: e.message,
    });
  }
};
module.exports = { onlyAdmin };
