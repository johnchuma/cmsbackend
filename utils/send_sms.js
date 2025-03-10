const axios = require("axios");
require("dotenv").config();

const sendSMS = async (number, message, language = "English") => {
  try {
    // Decode the password to ensure special characters like '@' appear correctly
    const decodedPwd = decodeURIComponent(process.env.SMS_PASS);
console.log(decodedPwd)
    const response = await axios.get("https://mshastra.com/sendurlcomma.aspx", {
      params: {
        user: process.env.SMS_USER, // Profile ID
        pwd: decodedPwd, // Decoded Password
        senderid: process.env.SMS_SENDER, // Sender ID
        mobileno: number, // Mobile number with country code
        msgtext: message, // Text message
        language: language, // Unicode/English
        CountryCode: 255,
      },
    });

    console.log(response);
    return response.data;
  } catch (error) {
    console.error("SMS Sending Error:", error);
    return error;
  }
};

module.exports = sendSMS;
