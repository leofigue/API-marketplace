registroActividad = (req, res, next) => {
    const timestamp = new Date().toISOString();
    const ipAddress = req.ip;
    const method = req.method;
    const url = req.originalUrl;
    const status = res.statusCode;
  
    console.log(
      "Data Report:",
      `[${timestamp}] ${method} ${url} - IP: ${ipAddress} - Status: ${status}`,
      ":::END DATA REPORT"
    );
    next();
  };
  
  module.exports = registroActividad;