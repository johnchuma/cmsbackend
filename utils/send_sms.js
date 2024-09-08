const { errorResponse } = require("./responses");

// Set your app credentials
require("dotenv").config();

const credentials = {
  apiKey: process.env.SMS_API,
  username: "hakikiapp",
};

// Initialize the SDK
const AfricasTalking = require("africastalking")(credentials);

// Get the SMS service
const sms = AfricasTalking.SMS;

module.exports.sendMessage = async({ numbers,message }) => {
    const options = {
      to: numbers,
      message: message,
      from: "15054",
    };
    console.log("Options",options)
    const response = await sms.send(options)
    console.log("Response",response)
    return response;
 
};
