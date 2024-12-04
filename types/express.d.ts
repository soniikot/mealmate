import 'express';
import { Session } from 'express-session';

declare module 'express' {
  interface Request {
    user?: {
      id: number;
    };
  }
}

declare module 'express-session' {
  interface SessionData {
    userId: number;
  }
}
