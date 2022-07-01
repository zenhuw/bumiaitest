import { NextFunction, Response } from 'express';
import { isNil } from 'ramda';
import { RequestModified } from '../interfaces/auth.interface';

export const isAdmin = (req: RequestModified, res: Response, next: NextFunction) => {
  if (isNil(req.user)) {
    return res.status(401).send('Not Authorized');
  }
  if (!req.user.isAdmin) {
    return res.status(401).send('Route only for admin');
  }
  next();
};
