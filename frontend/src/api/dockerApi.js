import axios from "axios";

const API_URL = "http://localhost:5000/api";

export const getContainers = () => axios.get(`${API_URL}/containers`);
export const startContainer = (id) => axios.post(`${API_URL}/containers/start/${id}`);
export const stopContainer = (id) => axios.post(`${API_URL}/containers/stop/${id}`);
export const removeContainer = (id) => axios.delete(`${API_URL}/containers/${id}`);
export const createSimpleContainer = (type, name) => axios.post(`${API_URL}/containers/create`, { type, name });
export const getImages = () => axios.get(`${API_URL}/images`);
export const getVolumes = () => axios.get(`${API_URL}/volumes`);
export const getNetworks = () => axios.get(`${API_URL}/networks`);
export const getMonitoring = () => axios.get(`${API_URL}/monitoring/containers`);
