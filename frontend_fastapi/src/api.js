import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api/v1",
  headers:{"Content-Type":"application/json"}
});

api.interceptors.request.use(async (config) => {
  const token = await localStorage.getItem("token");

  if(token) config.headers.Authorization = `Bearer ${token}`

  return config
},(error)=>{
  console.log(`api error : ${error}`)
  return Promise.reject(error)
});

export default api;
