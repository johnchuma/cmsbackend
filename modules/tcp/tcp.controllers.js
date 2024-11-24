const ModbusRTU = require("modbus-serial");
const { successResponse, errorResponse } = require("../../utils/responses");
const client = new ModbusRTU();

const connectTCP = async (req,res)=>{
    try {
       const tcp = await client.connectTCP("192.168.0.22", { port: 502 })
       successResponse(res,tcp)
    } catch (error) {
        console.log(error)
        errorResponse(res,error)
    }
}

module.exports = {connectTCP}