const nodemailer = require("nodemailer");
const { google } = require("googleapis");

//OAuth2 Credentials
const CLIENT_ID =
  "263231923688-1ejipdtijd01asjdecn93t3i8l70mskt.apps.googleusercontent.com";
const CLIENT_SECRET = "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";
const REDIRECT_URI = "https://developers.google.com/oauthplayground";
const REFRESH_TOKEN =
  "1//04sqHwpk01gjpCgYIARAAGAQSNwF-L9Irtj4HrtwJWPGTNPY5I6ZLrYpA8hyNKbNeMY0jS85CZ4TY6YuZ3ccsMms0lwqZ0hgiRzI";

//initialising OAuth2
const OAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);
OAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

module.exports = async function sendMail(req, res, email, emailCode) {
  try {
    const accessToken = await OAuth2Client.getAccessToken();

    // Creating transport object
    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: "horpeelo@gmail.com",
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken,
      },
    });

    const mailOptions = {
      from: "Abdulganiyy <horpeelo@gmail.com>",
      to: email,
      subject: "Email Confirmation",
      text: "Your Confirmation Email",
      html: `Please click on this link <a href="https://${req.headers.host}/verify/${emailCode}">here</a> to verify your account`,
    };

    const result = await transport.sendMail(mailOptions);

    // return success response

    return res.status(200).json({
      status: "success",
      message: "Check your email for verification link",
    });
  } catch (error) {
    // return error response
    return res.status(500).json({
      status: "fail",
      message: "Internal server error",
    });
  }
};
