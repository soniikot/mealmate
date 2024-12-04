import 'express-session';

declare module 'express-session' {
  interface Session {
    userId?: number;
  }
}

declare global {
  namespace Express {
    interface Request {
      session: Session & {
        userId?: number;
      };
      user?: {
        id: number;
      };
    }
  }
}
