const { errorResponse, successResponse } = require("../utils/responses");
const { sendMail } = require("../utils/mail_controller");

const sendEmail = async (res, user, status) => {
  try {
    var subject = "",
      message = "";
    var response;
    switch (status) {
      case "recovery-code":
        subject = "CMS password recovery code";
        message =
          "Hi! " +
          user.name +
          ",<br>Your password recovery code is" +
          user.recoveryCode;
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
