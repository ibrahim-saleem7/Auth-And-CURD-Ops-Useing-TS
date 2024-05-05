"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("./app"));
/*============================Config============================*/
process.on("uncaughtException", (err) => {
    console.log("Syntax error occurred: ", err);
});
dotenv_1.default.config();
const port = Number(process.env.PORT) || 8000;
const mongoUrl = process.env.DATABASE_Connection || "mongodb://localhost:27017";
/*================================Listener========================*/
function startServer(port, mongoUrl) {
    return __awaiter(this, void 0, void 0, function* () {
        yield mongoose_1.default.connect(mongoUrl);
        console.log("DB connected");
        app_1.default.listen(port, () => {
            console.log(`Listening on port ${port}`);
        });
    });
}
startServer(port, mongoUrl);
/*===================================Error============================*/
process.on("unhandledRejection", (err) => {
    console.log("Error occurred: ", err);
});
