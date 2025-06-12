import axios from "axios";

if (!process.env.FLEET_URL || !process.env.FLEET_TOKEN) {
  throw new Error("FLEET_URL or FLEET_TOKEN not found");
}

export const fleet = axios.create({
  baseURL: `${process.env.FLEET_URL}/api/v1/fleet`,
  headers: { Authorization: `Bearer ${process.env.FLEET_TOKEN}` },
});
