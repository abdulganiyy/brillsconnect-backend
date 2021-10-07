const jwt = require("jsonwebtoken");

module.exports = (req, res) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    let token = authHeader.split("Bearer ")[1];
    if (token) {
      try {
        user = jwt.verify(token, process.env.SECRET_KEY);
        return user;
      } catch (err) {
        return res.status(401).json({
          status: "fail",
          message: "Invalid/expired 'Bearer [token]",
        });
      }
    } else {
      return res.status(401).json({
        status: "fail",
        message: "Authentication token must be 'Bearer [token]",
      });
    }
  } else {
    return res.status(401).json({
      status: "fail",
      message: "Authorization header must be provided",
    });
  }
};
