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

  async getUser(accessToken: string, UID: string) {
    const res = await dbClient.get("/read", {
      headers: { Authorization: `Bearer ${accessToken}` },
      params: {
        tableName: "_user",
        UID,
      },
    });
    return res.data;
  }

  async uploadDeploymentData(
    accessToken: string,
    user_id: string,
    repo_url: string,
    subdomain: string,
    description: string,
    created_at: string
  ) {
    const res = await dbClient.post(
      `/insert`,
      {
        tableName: "deployment",
        records: [
          {
            user_id,
            repo_url,
            subdomain,
            description,
            created_at,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return res.data;
  }

  async checkExistingRepository(accessToken: string, subdomain: string) {
    const res = await dbClient.get("/read", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        tableName: "deployment",
        subdomain,
      },
    });
    return res.data.length > 0;
  }
}
