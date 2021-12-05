const axios = require('axios');

const OtpRouter = axios.create({
  baseURL: 'https://otp.airdady.com/otp',
  headers: {
    'Content-Type': 'application/json',
    accept: 'application/json',
  },
});

const generateOtp = (phoneNumber) => {
  return OtpRouter.post(`/generate/${phoneNumber}?keys=61ac32638ec943b8eae71201`);
};

const verifyCode = (phoneNumber, code) => {
  return OtpRouter.post(`/verify/${phoneNumber}/${code}?keys=61ac32638ec943b8eae71201`);
};

module.exports = { generateOtp, verifyCode };
