import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL  || 'http://localhost:8000';
console.log("Base URL:", baseURL);


export const api = axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json',
    },
    // For development only - ignore SSL certificate errors
    // httpsAgent: new (require('https').Agent)({
    //   rejectUnauthorized: false
    // })
  });