const jwt = require("jsonwebtoken");

const verifyToken = async (req, res, next) => {
  const authorization = req.headers.authorization;
  if (!authorization) {
    return res.status(403).json({
      error: "A token is required!!!",
    });
  }
  try {
    const splitToken = authorization.split("Bearer ")[1];
    const token = await jwt.verify(splitToken, process.env.jwt_salt);
    req.all = token;
    //console.log(req.user);
  } catch (e) {
    return res.status(403).json({
      error: e.message,
    });
  }
  next();
};
module.exports = { verifyToken };
