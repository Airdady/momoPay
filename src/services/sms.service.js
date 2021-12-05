const axios = require('axios');

const otpKeys = `${process.env.OTP_KEYS || '61ac6ec633314e5fd1b6f614'}`;

const OtpRouter = axios.create({
  baseURL: `${process.env.USEND_API || 'http://localhost:5000'}/otp`,
  headers: {
    'Content-Type': 'application/json',
    accept: 'application/json',
  },
});

const generateOtp = (phoneNumber) => {
  try {
    const response = OtpRouter.post(`/generate/${phoneNumber}?keys=${otpKeys}`);
    return response;
  } catch (error) {
    return error.response;
  }
};

const verifyCode = (phoneNumber, code) => {
  try {
    const response = OtpRouter.post(`/verify/${phoneNumber}/${code}?keys=${otpKeys}`);
    return response;
  } catch (error) {
    return error.response;
  }
};

module.exports = { generateOtp, verifyCode };
