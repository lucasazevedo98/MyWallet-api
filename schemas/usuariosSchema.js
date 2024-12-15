import joi from "joi"



export const signupShema = joi.object({

    name: joi.string()
        .required(),
    email: joi.string()
        .email()
        .required()
        .messages({
            'string.base': '"email" deve ser uma string',
            'string.email': '"email" deve ser um email válido',
            'any.required': '"email" é obrigatório'
        }),
    password: joi.string()
        .required()
        .min(6)
        .messages({
            'string.base': '"password" deve ser uma string',
            'string.min': '"password" deve ter pelo menos 6 caracteres',
            'any.required': '"password" é obrigatório'
        })
})


export const signinShema = joi.object({
    email: joi.string()
        .email()
        .required()
        .messages({
            'string.base': '"email" deve ser uma string',
            'string.email': '"email" deve ser um email válido',
            'any.required': '"email" é obrigatório'
        }),

        password: joi.string()
        .required()
        .min(6)
        .messages({
            'string.base': '"password" deve ser uma string',
            'string.min': '"password" deve ter pelo menos 6 caracteres',
            'any.required': '"password" é obrigatório'
        })
})