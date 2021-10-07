const express = require("express");

const router = express.Router();

const {
  signup,
  login,
  getUser,
  verify,
  updateUser,
  forgotpassword,
} = require("../controllers/userControllers");

router.post("/signup", signup);

router.post("/login", login);

router.post("/forgotpassword", forgotpassword);

router.get("/verify/:emailCode", verify);

router.get("/:userId", getUser);

router.patch("/:id", updateUser);

module.exports = router;
