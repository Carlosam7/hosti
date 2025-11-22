import axios from "axios";
import { config } from "./config.js";

export const authClient = axios.create({
  // https://roble-api.openlab.uninorte.edu.co/auth/hosting_a468c73968
  baseURL: `${config.robleUrl}/auth/${config.tokenContract}`,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export const dbClient = axios.create({
  baseURL: `${config.robleUrl}/database/${config.tokenContract}`,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});
