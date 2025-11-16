import axios from "axios";
import { config } from "./config.js";

export const authClient = axios.create({
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
