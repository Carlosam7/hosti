import { RobleDBService } from "../db/roble.db.service.js";
import { AuthController } from "./auth.controller.js";
import { AuthManager } from "./services/auth.manager.service.js";
import { AuthService } from "./services/auth.service.js";
import { TokenService } from "./services/token.service.js";

export class AuthModule {
  private static instance: AuthModule;

  public readonly controller: AuthController;
  public readonly authManager: AuthManager;

  private constructor() {
    const authService = new AuthService();
    const tokenService = new TokenService();
    const dbService = RobleDBService.getInstance();

    this.authManager = new AuthManager(authService, dbService, tokenService);

    this.controller = new AuthController(this.authManager, tokenService);
  }

  static getInstance(): AuthModule {
    if (!AuthModule.instance) {
      AuthModule.instance = new AuthModule();
    }
    return AuthModule.instance;
  }
}
