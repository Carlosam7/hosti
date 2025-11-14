import type { Request, Response } from "express";
import { AuthService } from "../services/auth.service.js";
import { handleAxiosError } from "../utils/handleAxiosError.js";

export class AuthController {
  private authService = new AuthService();

  login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
      const { accessToken, refreshToken, user } = await this.authService.login(
        email,
        password
      );

      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });

      res.json({ user });
    } catch (err) {
      handleAxiosError(err, res);
    }
  };

  signup = async (req: Request, res: Response) => {
    const { name, email, password } = req.body;

    try {
      const response = await this.authService.signupDirect(
        name,
        email,
        password
      );
      res.json(response);
    } catch (err) {
      handleAxiosError(err, res);
    }
  };

  refreshToken = async (req: Request, res: Response) => {
    const _refreshToken = req.cookies.refreshToken;

    try {
      const { accessToken, refreshToken } =
        await this.authService.refreshToken(_refreshToken);

      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });
    } catch (err) {
      handleAxiosError(err, res);
    }
  };

  logout = async (req: Request, res: Response) => {
    const _accessToken = req.cookies.accessToken;

    try {
      await this.authService.logout(_accessToken);
      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");
      res.status(200).json({ message: "Logged out successfully" });
    } catch (err) {
      console.log(err);
      handleAxiosError(err, res);
    }
  };

  authMe = async (req: Request, res: Response) => {
    const accessToken = req.cookies.accessToken;

    try {
      const isValid = await this.authService.authMe(accessToken);
      res.status(200).json({ valid: isValid });
    } catch (err) {
      handleAxiosError(err, res);
    }
  };
}
