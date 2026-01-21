import axios from "axios";
import { AppConfiguration } from "../configurations/app.config";

export const apiClient = axios.create({
    baseURL: AppConfiguration.API_URL,
    timeout: 3000
})