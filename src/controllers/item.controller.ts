import { Request, Response } from "express";
import _ from "lodash";
import fs from "fs";
import path from "path";

import catchAsyncError from "../middlewares/catchError";
import httpStatusText from "../utils/httpStatusText";
import itemModel from "../models/item.model";
import AppError from "../utils/appError";

class ItemController {
  /**
   * @description Get All item
   * @route /api/item
   * @method GET
   * @access public
   */

  static getAllItems = catchAsyncError(async function (
    req: Request,
    res: Response,
    next: any
  ) {
    const pageSize: number = Number(req.query.pageSize) || 20;
    const pageNumber: number = Number(req.query.pageNumber) || 1;

    const items = await itemModel
      .find({})
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize);

    const results = await itemModel.find().countDocuments();
    const pagesTotal = results > pageSize ? results / pageSize : 1;

    return res.status(200).json({
      status: httpStatusText.SUCCESS,
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

  /**
   * @description get item by id
   * @route /api/item/:id
   * @method GET
   * @access public
   */

  static getItemById = catchAsyncError(async function (
    req: Request,
    res: Response,
    next: any
  ) {
    const itemId: string = req.params.id;
    if (!itemId) return next(new AppError(httpStatusText.BADREQUEST, 400));

    const item: any = await itemModel.findById(itemId);
    if (!item) return next(new AppError(httpStatusText.NOTFOUND, 404));

    return res.status(200).json({
      status: httpStatusText.SUCCESS,
      data: {
        item,
      },
    });
  });

  /**
   * @description Delete item
   * @route /api/item/:id
   * @method DELETE
   * @access public // if private change handling route to auth user
   */
  static deleteItem = catchAsyncError(async function (
    req: Request,
    res: Response,
    next: any
  ) {
    const itemId: string = req.params.id;
    if (!itemId) return next(new AppError(httpStatusText.BADREQUEST, 400));

    const item: any = await itemModel.findByIdAndDelete(itemId);
    if (!item) return next(new AppError(httpStatusText.NOTFOUND, 404));

    return res.status(200).json({
      status: httpStatusText.SUCCESS,
      data: {
        item,
      },
      message: `item detected successfully`,
    });
  });

  /**
   * @description Add a new item
   * @route /api/item
   * @method POST
   * @access public
   */
  static addItem = catchAsyncError(async function (
    req: Request | any,
    res: Response,
    next: any
  ) {
    const body: any = _.pick(req.body, ["name", "phone", "address", "image"]);
    if (!body) return next(new AppError(httpStatusText.BADREQUEST, 400));

    const existingItem: any = await itemModel.findOne({
      name: body.name,
      owner: body.owner,
    });

    if (existingItem)
      return next(
        new AppError("Item with the same Name and owner already exists", 409)
      );

    const image: any = req.files?.image;
    if (image) {
      body.image = await image[0].filename;
    }

    const item = await itemModel.create(body);

    return res.status(200).json({
      status: httpStatusText.SUCCESS,
      data: {
        item,
      },
      message: `${item.name} created successfully`,
    });
  });

  /**
   * @description update item
   * @route /api/item/:id
   * @method PUT
   * @access Private
   */

  static updateItem = catchAsyncError(async function (
    req: Request | any,
    res: Response,
    next: any
  ) {
    const itemId: string = req.params.id;
    if (!itemId) return next(new AppError(httpStatusText.BADREQUEST, 400));

    const body: any = _.pick(req.body, ["name", "phone", "address", "image"]);
    if (!body) return next(new AppError(httpStatusText.BADREQUEST, 400));

    const item: any = await itemModel.findById(itemId);
    if (!item) return next(new AppError(httpStatusText.NOTFOUND, 404));

    const image: any = req.files?.image;

    if (image) {
      if (fs.existsSync(path.join(__dirname, `../../uploads/${item.image}`))) {
        fs.unlinkSync(path.join(__dirname, `../../uploads/${item.image}`));
      }
      body.image = await image[0].filename;
    }

    Object.assign(item, body);
    const updatedItem = await item.save();

    return res.status(200).json({
      status: httpStatusText.SUCCESS,
      data: {
        item: updatedItem,
      },
      message: `Updated ${updatedItem.name} successfully`,
    });
  });
}

export default ItemController;
