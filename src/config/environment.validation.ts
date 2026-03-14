import * as Joi from "joi";

export default Joi.object({
  NODE_ENV: Joi.string()
    .valid("development", "production", "test", "provision")
    .default("development"),
  JWT_SECRET: Joi.string().required(),
  JWT_TOKEN_AUDIENCE: Joi.string().required(),
  JWT_TOKEN_ISSUER: Joi.string().required(),
  JWT_ACCESS_TOKEN_TTL: Joi.number().required(),
  REFRESH_TOKEN_TTL: Joi.number().required(),
  API_VERSION: Joi.string().required(),
  MAIL_HOST: Joi.string().required(),
  SMTP_USERNAME: Joi.string().required(),
  SMTP_PASSWORD: Joi.string().required()
});
