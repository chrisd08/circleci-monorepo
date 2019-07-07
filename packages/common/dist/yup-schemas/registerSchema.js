"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const yup = require("yup");
exports.registerSchema = yup.object().shape({
    username: yup
        .string()
        .matches(/^[a-zA-Z0-9]*$/, "username can only contain letters and numbers")
        .min(3)
        .max(30)
        .required(),
    email: yup
        .string()
        .email()
        .min(3)
        .max(500)
        .required(),
    password: yup
        .string()
        .min(5)
        .max(1000)
        .required()
});
//# sourceMappingURL=registerSchema.js.map