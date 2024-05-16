/* eslint-disable */

import axios from 'axios';

module.exports = async function () {
  axios.defaults.baseURL = globalThis.__BASE_URL__;
};
