import { dbClient } from "../shared/config/axios.config.js";

export class DBService {
  async createUser(
    accessToken: string,
    UID: string,
    name: string,
    email: string,
    role: string
  ) {
    const res = await dbClient.post(
      `/insert`,
      {
        tableName: "_user",
        records: [{ UID, name, email, role }],
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return res.data;
  }
}
