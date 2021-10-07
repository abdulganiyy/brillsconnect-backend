const User = require("../models/User");
const crypto = require("crypto");
const sendMail = require("../utils/sendMail");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const checkAuth = require("../utils/checkAuth");

exports.signup = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({
    email,
  });

  if (user) {
    return res.status(400).json({
      status: "fail",
      message:
        "User with this email already exists, please use a different email",
    });
  }

  const emailCode = crypto.randomBytes(64).toString("hex");
  const isVerified = false;

  const hash = await bcrypt.hash(password, 8);

  const newUser = new User({
    emailCode,
    isVerified,
    ...req.body,
    password: hash,
  });

  await newUser.save();

  sendMail(req, res, email, emailCode);
};

exports.verify = async (req, res) => {
  const emailCode = req.params.emailCode;

  const user = User.findOne({
    emailCode,
  });

  if (user) {
    await user.update({
      emailCode: null,
      isVerified: true,
    });

    return res.status(200).json({
      status: "success",
      message: "Verification successfully completed",
    });
  } else {
    return res.status(404).json({
      status: "fail",
      message: "User not found",
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: "fail",
        message: "Please provide correct fields details",
      });
    }

    const user = await User.findOne({
      email,
    });

    if (!user) {
      return res.status(400).json({
        status: "fail",
        message: "Please provide correct email",
      });
    }

    const isCorrectPassword = await bcrypt.compare(password, user.password);

    if (!isCorrectPassword) {
      return res.status(400).json({
        status: "fail",
        message: "Please provide correct password",
      });
    }

    // if (user.isVerified !== true) {
    //   return res.status(400).json({
    //     status: "fail",
    //     message: "Please check your email for verification link",
    //   });
    // }

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        username: user.username,
      },
      process.env.SECRET_KEY,
      { expiresIn: "1hr" }
    );

    return res.status(200).json({
      status: "success",
      token,
      user,
    });
  } catch (err) {
    return res.status(500).json({
      status: "fail",
      message: "Internal Server Error",
    });
  }
};

exports.getUser = async (req, res) => {
  const userId = req.params.userId;

  const user = await User.findById(userId);

  if (user) {
    return res.status(200).json({
      status: "success",
      user,
    });
  } else {
    return res.status(404).json({
      status: "fail",
      message: "User not found",
    });
  }
};

exports.updateUser = async (req, res) => {
  checkAuth(req, res);

  const user = await User.findById(req.params.id);

  if (user) {
    const hash = await bcrypt.hash(req.body.password, 8);

    user.password = hash;
    user.username = req.body.username;
    user.email = req.body.email;

    await user.save();

    return res.status(200).json({
      status: "success",
      user,
    });
  } else {
    return res.status(404).json({
      status: "fail",
      message: "User not found",
    });
  }
};

exports.forgotpassword = async (req, res) => {
  const { email, newPassword } = req.body;

  const user = await User.findOne({ email });

  if (user) {
    const hash = await bcrypt.hash(newPassword, 8);

    user.password = hash;

    await user.save();

    return res.status(200).json({
      status: "success",
      message: "Password changed successfully",
    });
  } else {
    return res.status(404).json({
      status: "fail",
      message: "User not found",
    });
  }
};
