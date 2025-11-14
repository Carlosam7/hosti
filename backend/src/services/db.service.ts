import { dbClient } from "../config/axios.config.js";

export class DBService {
  async getTable(tableName: string, accessToken: string) {
    const res = await dbClient.get(`/read?tableName=${tableName}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return res.data;
  }
}
