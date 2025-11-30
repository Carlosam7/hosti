import type { Response, CookieOptions } from "express";

export class TokenService {
  private readonly cookieOptions: CookieOptions = {
    httpOnly: true,
    secure: false, // process.env.NODE_ENV === "production"
    sameSite: "lax",
  };

  setTokens(res: Response, accessToken: string, refreshToken: string) {
    res.cookie("accessToken", accessToken, {
      ...this.cookieOptions,
      maxAge: 10 * 60 * 1000,
    });
    res.cookie("refreshToken", refreshToken, {
      ...this.cookieOptions,
      maxAge: 60 * 60 * 1000,
    });
  }

  clearTokens(res: Response) {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
  }
}
