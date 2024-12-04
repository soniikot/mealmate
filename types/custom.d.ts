import 'express-session';

declare module 'express-session' {
  interface SessionData {
    userId?: number;
  }
}

declare global {
  namespace Express {
    interface Request {
      session: Session & Partial<SessionData>;
      user?: {
        id: number;
      };
    }
  }
}
