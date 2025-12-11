// src/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:6767',   // your Node/Express backend
});

export default api;
