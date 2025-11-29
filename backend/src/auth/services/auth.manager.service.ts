import { AuthService } from "./auth.service.js";
import { DBService } from "../../db/index.js";
import { TokenService } from "./token.service.js";
import type { Request, Response } from "express";
import { UnauthorizedException } from "../../shared/exceptions/http.exception.js";

export class AuthManager {
  constructor(
    private readonly authService: AuthService,
    private readonly dbService: DBService,
    private readonly tokenService: TokenService
  ) {}

  async login(email: string, password: string) {
    return await this.authService.login(email, password);
  }

  async signup(name: string, email: string, password: string) {
    await this.authService.signupDirect(name, email, password);

    const { accessToken, refreshToken, user } = await this.authService.login(
      email,
      password
    );

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
      const userInfo = await this.dbService.getUser(tokenToValidate, user.sub);

      return {
        uid: user.sub,
        name: userInfo[0].name,
        email: userInfo[0].email,
        role: userInfo[0].role,
      };
    } catch (_err) {
      throw new UnauthorizedException("Invalid or expired token");
    }
  }
}
