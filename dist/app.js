"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const hpp_1 = __importDefault(require("hpp"));
const helmet_1 = __importDefault(require("helmet"));
const appError_1 = __importDefault(require("./src/utils/appError"));
const globalErrorHandler_1 = __importDefault(require("./src/utils/globalErrorHandler"));
const items_routes_1 = __importDefault(require("./src/routes/items.routes"));
const auth_routes_1 = __importDefault(require("./src/routes/auth.routes"));
/*------------------const-------------------*/
const fileUpload_1 = __importDefault(require("./src/utils/fileUpload"));
const app = (0, express_1.default)();
/*------------------Middlewares-------------------*/
app.use((0, cors_1.default)());
app.use(express_1.default.static(path_1.default.join(__dirname, "./uploads")));
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.use((0, hpp_1.default)());
app.use((0, helmet_1.default)());
/*------------------Routes-------------------*/
app.use("/api/items", items_routes_1.default);
app.use("/api/auth", auth_routes_1.default);
/*------------------Handlers-----------------*/
app.all("*", (req, res, next) => {
    next(new appError_1.default(`Can't find ${req.originalUrl} on this server!`, 404));
});
app.use((0, fileUpload_1.default)());
app.use(globalErrorHandler_1.default);
/*------------------------------------*/
exports.default = app;
