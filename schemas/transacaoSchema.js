
import Joi from 'joi';


export const adicionarTransacaoShema = Joi.object({
    value: Joi.number().positive().required().messages({
        'number.base': '"value" deve ser um número',
        'number.positive': '"value" deve ser um número positivo',
        'any.required': '"value" é um campo obrigatório',
    }),
    description: Joi.string().min(3).required().messages({
        'string.base': '"description" deve ser uma string',
        'string.min': '"description" deve ter pelo menos 3 caracteres',
        'any.required': '"description" é um campo obrigatório',
    }),
    type: Joi.string().valid('deposit', 'withdraw').required().messages({
        'string.base': '"type" deve ser uma string',
        'any.only': '"type" deve ser um dos valores: "deposit", "withdraw"',
        'any.required': '"type" é um campo obrigatório',
    })
});