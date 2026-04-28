import axios from "axios";

const API = axios.create({
  baseURL: "https://backenddatabase.onrender.com",
});

export default API;