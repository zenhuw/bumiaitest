import { json } from 'express';
import { authRouter } from './controllers/auth.controller';
import { indexRouter } from './controllers/index.controller';
import { photosRouter } from './controllers/photos.controller';
import { seedRouter } from './controllers/seed.controller';
import { userRouter } from './controllers/users.controller';
import { authMiddleware } from './middlewares/auth.middleware';

export function initRoutes(app: any) {
  app.use(json());
  app.use(authMiddleware);
  app.use('/api/', indexRouter);
  app.use('/api/users', userRouter);
  app.use('/api/auth', authRouter);
  app.use('/api/seed', seedRouter);
  app.use('/api/photos', photosRouter);
}
