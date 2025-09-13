const Joi = require('joi');

const base = {
  name: Joi.string().max(100).required(),
  ip_address: Joi.string().ip({ version: ['ipv4'] }).required(),
  provider: Joi.string().valid('aws','digitalocean','vultr','other').required(),
  status: Joi.string().valid('active','inactive','maintenance').default('inactive'),
  cpu_cores: Joi.number().integer().min(1).max(128).required(),
  ram_mb: Joi.number().integer().min(512).max(1048576).required(),
  storage_gb: Joi.number().integer().min(10).max(1048576).required()
};

const validateServer = (obj) =>
  Joi.object(base).validate(obj, { abortEarly: false, stripUnknown: true });

const validateServerUpdate = (obj) =>
  Joi.object(
    Object.fromEntries(Object.entries(base).map(([k, v]) => [k, v.optional()]))
  )
  .min(1)
  .validate(obj, { abortEarly: false, stripUnknown: true });

module.exports = { validateServer, validateServerUpdate };
