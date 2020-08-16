import Joi from 'joi';

const blocks = Joi.number().optional().default(30);

export const schemas = {
    averageFee: {
        query: Joi.object().keys({
            blocks,
        }),
    },
};

export const validateParams = (schema: any) => {
    return (req: any, _: any, next: any) => {
        const validBody = validate(req.body, schema.body);
        const validParams = validate(req.params, schema.params);
        const validQuery = validate(req.query, schema.query);
        req.valid = {
            ...validQuery,
            ...validParams,
            ...validBody,
        };
        next();
    };
};

// @ts-ignore
function validate(data: object, schema: Joi.Schema = Joi.any()) {
    return Joi.attempt(data, schema);
}
