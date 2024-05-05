import mongoose from "mongoose";
const itemSchema: mongoose.Schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
  },
  { timestamps: true }
);

const itemModel: mongoose.Model<any> = mongoose.model("Item", itemSchema);

export default itemModel;
