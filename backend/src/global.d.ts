import 'express';
import mongoose from 'mongoose';

declare global {
  namespace Express {
    interface User {
      userId: mongoose.Types.ObjectId;
      phone: string
    }

    interface Request {
      user?: User;
    }
  }
}
