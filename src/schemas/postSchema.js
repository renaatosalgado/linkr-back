import joi from "joi";

const postSchema = joi.object({
  url: joi.string().uri().required(),
  description: joi.string(),
});

export default postSchema;
