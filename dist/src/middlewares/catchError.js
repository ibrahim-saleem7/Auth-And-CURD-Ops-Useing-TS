"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function catchAsyncError(fn) {
    return (req, res, next) => {
        fn(req, res, next).catch((error) => next(error));
    };
}
exports.default = catchAsyncError;
