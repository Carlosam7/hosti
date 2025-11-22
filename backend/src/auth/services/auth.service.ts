import { authClient } from "../../shared/config/axios.config.js";
export class AuthService {
  async login(email: string, password: string) {
    const { data } = await authClient.post("/login", {
      email,
      password,
    });
    return data;
  }

  async signup(name: string, email: string, password: string) {
    const { data } = await authClient.post("/signup", {
      name,
      email,
      password,
    });
    return data;
  }

  async signupDirect(name: string, email: string, password: string) {
    const { data } = await authClient.post("/signup-direct", {
      name,
      email,
      password,
    });
    return data;
  }

  async refreshToken(refreshToken: string) {
    const { data } = await authClient.post("/refresh-token", {
      refreshToken,
    });
    return data;
  }

  async logout(accessToken: string) {
    const { data } = await authClient.post(
      "/logout",
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return data;
  }

  async authMe(accessToken: string) {
    const { data } = await authClient.get("/verify-token", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return data;
  }
}
