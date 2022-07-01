import { compare } from 'bcrypt';
import config from 'config';
import { Request, Response, Router } from 'express';
import { sign } from 'jsonwebtoken';
import { pick } from 'ramda';
import { TokenData } from '../interfaces/auth.interface';
import { loginValidation } from '../validation/auth.validation';
import prisma from '../utils/prisma';
import { User } from '@prisma/client';

export const authRouter = Router();

authRouter.post('/login', async (req: Request, res: Response) => {
  const { error } = loginValidation(req.body);

  if (error) {
    return res.status(400).send({ error: error });
  }

  const findUser = await prisma.user.findFirst({ where: { email: req.body.email } });

  if (!findUser) {
    res.status(400).send({ error: 'Email not found' });
  }

  const isPasswordMatching = await compare(req.body.password, findUser.password);

  if (!isPasswordMatching) {
    res.status(400).send({ error: 'Password not matching' });
  }

  const tokenData = createToken(findUser);
  const cookie = createCookie(tokenData);

  res.setHeader('Set-Cookie', [cookie]);
  res.status(200).json({ data: pick(['id', 'name', 'email', 'isAdmin'], findUser), message: 'login' });
});

authRouter.post('/logout', async (req: Request, res: Response) => {
  res.clearCookie('Authorization');
  res.status(200).json({ message: 'logged out' });
});

function createToken(user: User): TokenData {
  const expiresIn = 60 * 60;

  return { expiresIn, token: sign({ _id: user.id }, config.get('secretKey'), { expiresIn }) };
}

function createCookie(tokenData: TokenData) {
  return `Authorization=${tokenData.token}; Max-Age=${tokenData.expiresIn}; path=/`;
}
