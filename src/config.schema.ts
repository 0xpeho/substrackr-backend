import * as Joi from 'joi';

export const configSchema =Joi.object({
  STAGE: Joi.string().required(),
  DB_host: Joi.string().required(),
  DB_port: Joi.number().default(5432).required(),
  DB_username:Joi.string().required(),
  DB_password: Joi.string().required(),
  DB_database: Joi.string().required(),
  JWT_secret:Joi.string().required()
})