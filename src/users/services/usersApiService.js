import axios from "axios";
const baseUrl = "https://cards-server-oxw3.onrender.com";
export const registerUser = async (userDetailsForServer) => {
  try {
    const response = await axios.post(baseUrl + "/users", userDetailsForServer);
    return response;
  } catch (error) {
    console.log(error);
  }
};
export const login = async (user) => {
  try {
    const response = await axios.post(baseUrl + "/users/login", user);
    return response;
  } catch (error) {
    console.log(error);
  }
};
