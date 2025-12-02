import axios from "axios";
import { appConfig } from "./config.js";

export const authClient = axios.create({
  // https://roble-api.openlab.uninorte.edu.co/auth/hosting_a468c73968
  baseURL: `${appConfig.robleUrl}/auth/${appConfig.tokenContract}`,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export const dbClient = axios.create({
  baseURL: `${appConfig.robleUrl}/database/${appConfig.tokenContract}`,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});
