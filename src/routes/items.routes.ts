import express from "express";
import ItemController from "../controllers/item.controller";
import fileUpload from "../utils/fileUpload";
import validation from "../middlewares/validation";
import Item from "../validations/item.validation";

const router = express.Router();

router
  .route("/")
  .get(ItemController.getAllItems)
  .post(fileUpload("image"), validation(Item.addItem), ItemController.addItem);

router
  .get("/:id", ItemController.getItemById)
  .delete("/:id", ItemController.deleteItem)
  .put(
    "/:id",
    fileUpload("image"),
    validation(Item.updateItem),
    ItemController.updateItem
  );

export default router;
