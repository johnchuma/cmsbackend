const axios = require("axios");
require("dotenv").config();

const sendSMS = async (number, message) => {
  try {
    const data = {
      from: "RMNDR",
      to: number,
      text: message,
    };
    const config = {
      method: "post",
      url: "https://messaging-service.co.tz/api/sms/v1/test/text/single",
      headers: {
        Authorization: process.env.SMS_AUTH,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      data,
    };
    const response = await axios(config);
    const jsonString = response.data;
    return jsonString;
  } catch (error) {
    console.log(error);
    return error;
  }
};

module.exports = sendSMS;
