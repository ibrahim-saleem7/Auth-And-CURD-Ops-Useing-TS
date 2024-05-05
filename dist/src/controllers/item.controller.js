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
const lodash_1 = __importDefault(require("lodash"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const catchError_1 = __importDefault(require("../middlewares/catchError"));
const httpStatusText_1 = __importDefault(require("../utils/httpStatusText"));
const item_model_1 = __importDefault(require("../models/item.model"));
const appError_1 = __importDefault(require("../utils/appError"));
class ItemController {
}
/**
 * @description Get All item
 * @route /api/item
 * @method GET
 * @access public
 */
ItemController.getAllItems = (0, catchError_1.default)(function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const pageSize = Number(req.query.pageSize) || 20;
        const pageNumber = Number(req.query.pageNumber) || 1;
        const items = yield item_model_1.default
            .find({})
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize);
        const results = yield item_model_1.default.find().countDocuments();
        const pagesTotal = results > pageSize ? results / pageSize : 1;
        return res.status(200).json({
            status: httpStatusText_1.default.SUCCESS,
            data: {
                results,
                requestResults: items.length,
                pageNumber,
                pageSize,
                pagesTotal,
                items,
            },
        });
    });
});
/**
 * @description get item by id
 * @route /api/item/:id
 * @method GET
 * @access public
 */
ItemController.getItemById = (0, catchError_1.default)(function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const itemId = req.params.id;
        if (!itemId)
            return next(new appError_1.default(httpStatusText_1.default.BADREQUEST, 400));
        const item = yield item_model_1.default.findById(itemId);
        if (!item)
            return next(new appError_1.default(httpStatusText_1.default.NOTFOUND, 404));
        return res.status(200).json({
            status: httpStatusText_1.default.SUCCESS,
            data: {
                item,
            },
        });
    });
});
/**
 * @description Delete item
 * @route /api/item/:id
 * @method DELETE
 * @access public // if private change handling route to auth user
 */
ItemController.deleteItem = (0, catchError_1.default)(function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const itemId = req.params.id;
        if (!itemId)
            return next(new appError_1.default(httpStatusText_1.default.BADREQUEST, 400));
        const item = yield item_model_1.default.findByIdAndDelete(itemId);
        if (!item)
            return next(new appError_1.default(httpStatusText_1.default.NOTFOUND, 404));
        return res.status(200).json({
            status: httpStatusText_1.default.SUCCESS,
            data: {
                item,
            },
            message: `item detected successfully`,
        });
    });
});
/**
 * @description Add a new item
 * @route /api/item
 * @method POST
 * @access public
 */
ItemController.addItem = (0, catchError_1.default)(function (req, res, next) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const body = lodash_1.default.pick(req.body, ["name", "phone", "address", "image"]);
        if (!body)
            return next(new appError_1.default(httpStatusText_1.default.BADREQUEST, 400));
        const existingItem = yield item_model_1.default.findOne({
            name: body.name,
            owner: body.owner,
        });
        if (existingItem)
            return next(new appError_1.default("Item with the same Name and owner already exists", 409));
        const image = (_a = req.files) === null || _a === void 0 ? void 0 : _a.image;
        if (image) {
            body.image = yield image[0].filename;
        }
        const item = yield item_model_1.default.create(body);
        return res.status(200).json({
            status: httpStatusText_1.default.SUCCESS,
            data: {
                item,
            },
            message: `${item.name} created successfully`,
        });
    });
});
/**
 * @description update item
 * @route /api/item/:id
 * @method PUT
 * @access Private
 */
ItemController.updateItem = (0, catchError_1.default)(function (req, res, next) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const itemId = req.params.id;
        if (!itemId)
            return next(new appError_1.default(httpStatusText_1.default.BADREQUEST, 400));
        const body = lodash_1.default.pick(req.body, ["name", "phone", "address", "image"]);
        if (!body)
            return next(new appError_1.default(httpStatusText_1.default.BADREQUEST, 400));
        const item = yield item_model_1.default.findById(itemId);
        if (!item)
            return next(new appError_1.default(httpStatusText_1.default.NOTFOUND, 404));
        const image = (_a = req.files) === null || _a === void 0 ? void 0 : _a.image;
        if (image) {
            if (fs_1.default.existsSync(path_1.default.join(__dirname, `../../uploads/${item.image}`))) {
                fs_1.default.unlinkSync(path_1.default.join(__dirname, `../../uploads/${item.image}`));
            }
            body.image = yield image[0].filename;
        }
        Object.assign(item, body);
        const updatedItem = yield item.save();
        return res.status(200).json({
            status: httpStatusText_1.default.SUCCESS,
            data: {
                item: updatedItem,
            },
            message: `Updated ${updatedItem.name} successfully`,
        });
    });
});
exports.default = ItemController;
