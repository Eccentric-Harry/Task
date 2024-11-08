import axios from 'axios';

const baseURL = `http://localhost:3100`;

const constructUrl = (url) => {
    // Ensure there's no double slash by trimming leading slash from `url`
    return `${baseURL}${url.startsWith('/') ? url : `/${url}`}`;
};

export const axiosGet = (url) => {
    return axios.get(`${baseURL}${url}`, {
        headers: {
            "Content-Type": "application/json"
        }
    });
}

export const axiosPost = (url, data) => {
    return axios.post(`${baseURL}${url}`, data, {
        headers: {
            "Content-Type": "application/json"
        }
    });
}

export const axiosDelete = (url) => {
    return axios.delete(`${baseURL}${url}`, {
        headers: {
            "Content-Type": "application/json"
        }
    });
}

export const axiosPut = (url, data) => {
    return axios.put(`${baseURL}${url}`, data, {
        headers: {
            "Content-Type": "application/json"
        }
    });
}

// Function to get signature for image upload
export const generateSignature = (data) => {
    return axios.post(`${baseURL}/generate-signature`, data, {
        headers: {
            "Content-Type": "application/json"
        }
    });
}

export const loginAdmin = (username, password) => {
    return axios.post(`${baseURL}/admin/login`, { username, password });
};
