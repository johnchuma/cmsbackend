const { sendMail } = require("../utils/mail_controller");

const sendEmail = async (user, status) => {
  try {
    let subject = "";
    let message = "";
    let response;
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
    return response;
  } catch (error) {
    return error;
  }
};

module.exports = { sendEmail };
