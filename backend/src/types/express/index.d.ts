declare global {
  namespace Express {
    interface Request {
      user?: {
        uid: string;
        name: string;
        email: string;
        role: string;
      };
    }
  }
}

export {};
