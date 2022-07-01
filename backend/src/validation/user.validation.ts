import { User } from '@prisma/client';
import Joi from 'joi';
import PasswordComplexity from 'joi-password-complexity';

export function userValidatorsPost(user: User) {
  const complexityOptions = {
    min: 5,
    max: 250,
    lowerCase: 1,
    upperCase: 1,
    numeric: 1,
    symbol: 1,
    requirementCount: 2,
  };

  const schema = Joi.object({
    name: Joi.string().min(5).max(255).required(),
    email: Joi.string().min(5).max(255).required().email(),
    isAdmin: Joi.boolean().required(),
    password: PasswordComplexity(complexityOptions).required(),
  });

  return schema.validate(user);
}

export function userValidatorsPut(user: User) {
  const complexityOptions = {
    min: 5,
    max: 250,
    lowerCase: 1,
    upperCase: 1,
    numeric: 1,
    symbol: 1,
    requirementCount: 2,
  };

  const schema = Joi.object({
    name: Joi.string().min(5).max(255),
    email: Joi.string().min(5).max(255).email(),
    password: PasswordComplexity(complexityOptions),
  });

  return schema.validate(user);
}
