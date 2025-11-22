import type { Request, Response } from "express";
import { AuthManager } from "./services/auth.manager.service.js";
import { TokenService } from "./services/token.service.js";
import { handleAxiosError } from "../shared/utils/handleAxiosError.js";

export class AuthController {
  private readonly authManager = new AuthManager();
  private readonly tokenService = new TokenService();

  login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
      const { accessToken, refreshToken, user } = await this.authManager.login(
        email,
        password
      );

      this.tokenService.setTokens(res, accessToken, refreshToken);

      res.status(200).json({ user });
    } catch (err) {
      handleAxiosError(err, res);
    }
  };

  signup = async (req: Request, res: Response) => {
    const { name, email, password } = req.body;

    try {
      const { accessToken, refreshToken, user } = await this.authManager.signup(
        name,
        email,
        password
      );

      this.tokenService.setTokens(res, accessToken, refreshToken);

      res.status(201).json({ user });
    } catch (err) {
      handleAxiosError(err, res);
    }
  };

  refreshToken = async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;

    try {
      const { accessToken, refreshToken: newRefreshToken } =
        await this.authManager.refreshToken(refreshToken);

      this.tokenService.setTokens(res, accessToken, newRefreshToken);

      res.status(200).json({ message: "Tokens refreshed successfully" });
    } catch (err) {
      handleAxiosError(err, res);
    }
  };

  logout = async (req: Request, res: Response) => {
    const accessToken = req.cookies.accessToken;

    try {
      await this.authManager.logout(accessToken);

      this.tokenService.clearTokens(res);

      res.status(200).json({ message: "Logged out successfully" });
    } catch (err) {
      handleAxiosError(err, res);
    }
  };

  authMe = async (req: Request, res: Response) => {
    const accessToken = req.cookies.accessToken;

    try {
      const data = await this.authManager.authMe(accessToken);

      res.status(200).json({
        valid: data.valid,
        user: {
          sub: data.user.sub,
          email: data.user.email,
          role: data.user.role,
        },
      });
    } catch (err) {
      handleAxiosError(err, res);
    }
  };
}
