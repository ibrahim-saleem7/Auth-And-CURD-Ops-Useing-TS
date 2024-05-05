"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_rate_limit_1 = require("express-rate-limit");
function limiter(limit, skipSuccessful) {
    return (0, express_rate_limit_1.rateLimit)({
        windowMs: 60 * 60 * 1000,
        max: limit,
        handler: (req, res) => {
            res.status(429).json({
                message: `You finished the Number of adapters , you can try again later after an hour`,
            });
        },
        requestWasSuccessful: (req, res) => res.statusCode < 400,
        skipSuccessfulRequests: skipSuccessful,
    });
}
const limiterRequest = (0, express_rate_limit_1.rateLimit)({
    windowMs: 60 * 60 * 1000,
    max: 100,
    handler: (req, res) => {
        res.status(429).json({
            message: `Too many request , you can try again later after an hour`,
        });
    },
    requestWasSuccessful: (req, res) => res.statusCode < 400,
    skipSuccessfulRequests: false,
});
exports.default = limiter;
