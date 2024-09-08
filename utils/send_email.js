const { errorResponse, successResponse } = require("../utils/responses");
const { sendMail } = require("../utils/mail_controller");

const sendEmail = async (req, res, user, status, { recoveryCode }) => {
  try {
    var subject = "",
      message = "";
    var response;
    switch (status) {
      case "recovery-code":
        code = recoveryCode;
        subject = "CMS password recovery code";
        message =
          "Hi! " +
          user.name +
          ",<br>Your password recovery code is" +
          recoveryCode;
        response = await sendMail(user, subject, message, status);
        break;
      default:
        break;
    }
    // successResponse(res, response);
  } catch (error) {
    return error;
    errorResponse(res, error);
  }
};

module.exports = { sendEmail };
