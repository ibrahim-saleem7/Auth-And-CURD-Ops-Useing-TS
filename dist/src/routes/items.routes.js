"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const item_controller_1 = __importDefault(require("../controllers/item.controller"));
const fileUpload_1 = __importDefault(require("../utils/fileUpload"));
const validation_1 = __importDefault(require("../middlewares/validation"));
const item_validation_1 = __importDefault(require("../validations/item.validation"));
const router = express_1.default.Router();
router
    .route("/")
    .get(item_controller_1.default.getAllItems)
    .post((0, fileUpload_1.default)("image"), (0, validation_1.default)(item_validation_1.default.addItem), item_controller_1.default.addItem);
router
    .get("/:id", item_controller_1.default.getItemById)
    .delete("/:id", item_controller_1.default.deleteItem)
    .put("/:id", (0, fileUpload_1.default)("image"), (0, validation_1.default)(item_validation_1.default.updateItem), item_controller_1.default.updateItem);
exports.default = router;
