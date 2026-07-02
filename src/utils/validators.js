import Joi from 'joi';

const createDumpSchema = Joi.object({
  text: Joi.string().trim().min(1).max(5000).required(),
  topic: Joi.string().trim().max(100).allow('', null),
  action: Joi.string().valid('Draft', 'Publish').default('Draft'),
});

const updateDumpSchema = Joi.object({
  text: Joi.string().trim().min(1).max(5000),
  topic: Joi.string().trim().max(100).allow('', null),
  status: Joi.string().valid('Draft', 'Processing', 'Visible', 'Review', 'Hidden'),
}).min(1);

const createCommentSchema = Joi.object({
  text: Joi.string().trim().min(1).max(2000).required(),
  action: Joi.string().valid('Draft', 'Publish').default('Draft'),
});

const updateCommentSchema = Joi.object({
  text: Joi.string().trim().min(1).max(2000),
  status: Joi.string().valid('Draft', 'Visible', 'Hidden'),
}).min(1);

export { createDumpSchema, updateDumpSchema, createCommentSchema, updateCommentSchema };
