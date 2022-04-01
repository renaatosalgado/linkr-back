import joi from 'joi';

const commentSchema = joi.object({
    text: joi.string().required(),
});

export default commentSchema;
