import { hash } from 'bcrypt';
import { Request, Response, Router } from 'express';
import { userValidatorsPost } from '../validation/user.validation';
import { pick } from 'ramda';
import prisma from '../utils/prisma';

export const userRouter = Router();

userRouter.post('/', async (req: Request, res: Response) => {
  const { error } = userValidatorsPost(req.body);

  if (error) {
    return res.status(400).send({ error: error });
  }

  const user = await prisma.user.findFirst({ where: { email: req.body.email } });

  if (user) {
    return res.status(400).send({ error: 'User already exist' });
  }

  const hashedPassword = await hash(req.body.password, 10);

  const createdUserData = await prisma.user.create({ data: { ...req.body, password: hashedPassword } });

  return res.status(201).json({ data: pick(['id', 'name', 'email', 'isAdmin'], createdUserData), message: 'created' });
});
