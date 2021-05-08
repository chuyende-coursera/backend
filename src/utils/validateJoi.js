import Joi from '../utils/joi/lib/index';
import _ from 'lodash';

const noArguments = { noArguments : true };

export {noArguments, Joi};

export default class ValidateJoi {
    static assignSchema(schema, updates) {
        const copySchema = _.assign({}, schema);

        _.forIn(updates, (v, k) => {
            copySchema[k] = Object.keys(v).reduce(
                (schemaProp, ops) => {
                    return v[ops] === noArguments ? schemaProp[ops]() : schemaProp[ops](v[ops]);
                }
            , copySchema[k]) 
        })

        return copySchema;
    }

    static createSchemaProp(options) {
        return Object.keys(options).reduce((r, k) => options[k] === noArguments ? r[k]() : r[k](options[k])
        , Joi);
    }

    static createArraySchema(objectSchemas) {
        return Joi.array().items(objectSchemas);
    }
    
    
    static createObjectSchema(object) {
        return Joi.object(object);
    }

    static validate(data, schema) {
        data = _.pickBy(data, (prop) => prop !== undefined);

        return Joi.validate(data, schema, { abortEarly: false }, err => {
            if (err) {
                return Promise.reject(err);
            }

            return Promise.resolve(data);
        });
    }

    static transStringToArray(obj, key) {
        const arr = obj[key].split(',');

        if (arr.length === 1) {
            obj[key] == parseInt(obj[key]);
        } else {
            obj[key] = arr.map(n => parseInt(n));
            obj[key] = {
                "$in": obj[key]
            }
        }

        return obj;
    }
}