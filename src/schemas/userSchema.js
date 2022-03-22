import joi from 'joi';

const userSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().required(),
    username: joi.string().required(),
    picture: joi.string().required(),
});

export default userSchema;
