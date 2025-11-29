import { DBService } from "../db/db.service.js";
import { AuthController } from "./auth.controller.js";
import { AuthManager } from "./services/auth.manager.service.js";
import { AuthService } from "./services/auth.service.js";
import { TokenService } from "./services/token.service.js";

export class AuthModule {
  private static instance: AuthModule;

  public readonly controller: AuthController;
  private readonly authManager: AuthManager;

  constructor() {
    const authService = new AuthService();
    const dbService = new DBService();
    const tokenService = new TokenService();

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
