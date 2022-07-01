import Joi from 'joi';
import { LoginData } from '../interfaces/auth.interface';

export function loginValidation(login: LoginData) {
  const schema = Joi.object({
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.required(),
  });

  return schema.validate(login);
}
