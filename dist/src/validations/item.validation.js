"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
class Item {
}
Item.addItem = joi_1.default.object({
    name: joi_1.default.string().required(),
    phone: joi_1.default.string().required(),
    address: joi_1.default.string().required(),
    image: joi_1.default.string(),
});
Item.updateItem = joi_1.default.object({
    name: joi_1.default.string(),
    phone: joi_1.default.string(),
    address: joi_1.default.string(),
    image: joi_1.default.string(),
});
exports.default = Item;
