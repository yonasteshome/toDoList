import axios from "axios";

const BASE_URL = `${process.env.REACT_APP_API_URL}/list`;

// Helper function to set request headers
const getConfig = (token) => {
    if (!token) {
        throw new Error("No token provided");
    }
    return { headers: { Authorization: `Bearer ${token}` } };
};

// List service functions
const listService = {
    createList: async (listData, token) => {
        const response = await axios.post(BASE_URL, listData, getConfig(token));
        return response.data;
    },
    getList: async (token) => {
        if (!token) return Promise.reject("Token is missing!");
        const response = await axios.get(BASE_URL, getConfig(token));
        return response.data;
    },
    deleteList: async (listId, token) => {
        const response = await axios.delete(`${BASE_URL}/${listId}`, getConfig(token));
        return response.data;
    },
    markAsCompleted: async (taskId, token) => {
        const response = await axios.put(`${BASE_URL}/done/${taskId}`, {}, getConfig(token));
        return response.data;
    },
    // Added a method to get completed tasks
    getCompletedTasks: async (token) => {
        const response = await axios.get(`${BASE_URL}/completed`, getConfig(token));
        return response.data;
    }
};

export default listService;
