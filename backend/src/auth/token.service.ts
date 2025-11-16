import type { Response, CookieOptions } from "express";

export class TokenService {
  private readonly cookieOptions: CookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  };

  setTokens(res: Response, accessToken: string, refreshToken: string) {
    res.cookie("accessToken", accessToken, this.cookieOptions);
    res.cookie("refreshToken", refreshToken, this.cookieOptions);
  }

  clearTokens(res: Response) {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
  }
}
