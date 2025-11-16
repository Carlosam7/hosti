import { AuthService } from "./auth.service.js";
import { DBService } from "../db/index.js";

export class AuthManager {
  private readonly authService = new AuthService();
  private readonly dbService = new DBService();

  async login(email: string, password: string) {
    return await this.authService.login(email, password);
  }

  async signup(name: string, email: string, password: string) {
    // First create user directly
    await this.authService.signupDirect(name, email, password);
    // Then login to get tokens and user info
    const { accessToken, refreshToken, user } = await this.authService.login(
      email,
      password
    );
    // Create user in DB
    await this.dbService.createUser(
      accessToken,
      user.id,
      user.name,
      user.email,
      "user"
    );
    return { accessToken, refreshToken, user };
  }

  async refreshToken(refreshToken: string) {
    return await this.authService.refreshToken(refreshToken);
  }

  async logout(accessToken: string) {
    return await this.authService.logout(accessToken);
  }

  async authMe(accessToken: string) {
    return await this.authService.authMe(accessToken);
  }
}
