import { dbClient } from "../shared/config/axios.config.js";

export class DBService {
  private static instance: DBService;
  private constructor() {}

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

  async deleteDeploymentData(accessToken: string, projectName: string) {
    const res = await dbClient.delete("/delete", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      data: {
        tableName: "deployment",
        idColumn: "subdomain",
        idValue: projectName,
      },
    });
    return res.data;
  }

  async notifyAccess(accessToken: string, subdomain: string) {
    await dbClient.put(
      "/update",
      {
        tableName: "deployment",
        idColumn: "subdomain",
        idValue: subdomain,
        updates: { lastAccess: Date.now() },
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
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

  static getInstance(): DBService {
    if (!DBService.instance) {
      DBService.instance = new DBService();
    }
    return DBService.instance;
  }
}
