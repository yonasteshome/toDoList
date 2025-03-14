import axios from "axios";

const API_URL_SIGNUP = `${process.env.REACT_APP_API_URL}/signup`; 
const API_URL_LOGIN = `${process.env.REACT_APP_API_URL}/login`; 

// Register user
const register = async (formDataOfUser) => {
    try {
        const response = await axios.post(API_URL_SIGNUP, formDataOfUser);
        if (response.data) {
            localStorage.setItem("localStorageUser", JSON.stringify(response.data));
        }
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Registration failed";
    }
};

// Login user
const login = async (formDataOfUser) => {
    try {
        const response = await axios.post(API_URL_LOGIN, formDataOfUser);
        if (response.data) {
            // Store token separately for authentication
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("localStorageUser", JSON.stringify(response.data));
        }
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Login failed";
    }
};


// Logout user
const logout = () => {
    localStorage.removeItem("localStorageUser");
};

// Export all functions
const authService = {
    register,
    login,
    logout, 
};

export default authService;
