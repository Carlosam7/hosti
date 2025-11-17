import { AuthService } from "./auth.service.js";
import { DBService } from "../db/index.js";
import { TokenService } from "./token.service.js";
import type { Request, Response } from "express";
import { UnauthorizedException } from "../shared/exceptions/http.exception.js";

export class AuthManager {
  private readonly authService = new AuthService();
  private readonly dbService = new DBService();
  private readonly tokenService = new TokenService();

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

  async validateSession(req: Request, res: Response) {
    const { accessToken, refreshToken } = req.cookies;

    if (!refreshToken) {
      throw new UnauthorizedException("Invalid session");
    }

    let tokenToValidate = accessToken;

    if (!accessToken) {
      try {
        const tokens = await this.authService.refreshToken(refreshToken);
        await this.tokenService.setTokens(
          res,
          tokens.accessToken,
          tokens.refreshToken
        );
        tokenToValidate = tokens.accessToken;
      } catch (_err) {
        throw new UnauthorizedException(
          "Expired session. Please log in again."
        );
      }
    }

    try {
      const { user } = await this.authService.authMe(tokenToValidate);
      return {
        uid: user.sub,
        email: user.email,
        role: user.role,
      };
    } catch (_err) {
      throw new UnauthorizedException("Invalid or expired token");
    }
  }
}
