const axios = require('axios');

const Router = axios.create({
  baseURL: `https://api.namefake.com/`,
  headers: {
    'Content-Type': 'application/json',
    accept: 'application/json',
  },
});

exports.getNamesByNumber = async (phoneNumber) => {
  try {
    const response = await Router.get(`/?phone=${phoneNumber}`);
    return response.data.name;
  } catch (error) {
    return error.response;
  }
};
