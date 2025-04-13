import axios from "axios";

export const api = axios.create({
    baseURL: 'http://localhost:8000',
    headers: {
      'Content-Type': 'application/json',
    },
    // For development only - ignore SSL certificate errors
    // httpsAgent: new (require('https').Agent)({
    //   rejectUnauthorized: false
    // })
  });