import joi from 'joi';

const userSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().required(),
    username: joi.string().min(3).max(20).required(),
    picture: joi.string().uri().required(),
});

export default userSchema;
