import mongoose from "mongoose";

const userSchema: mongoose.Schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      lowercase: true,
      minLength: [3, " name should be minimum 3 letters"],
      maxLength: [25, " name should be maximum 25 letters"],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      validate: {
        validator: (v: any) =>
          /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v),
        message: "Email should be XXX@XX.XX",
      },
    },
    password: {
      type: String,
      required: true,
      validate: {
        validator: (v: any) =>
          /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/.test(v),
        message:
          "Password must be at least 8 characters and contain at least one digit, one lowercase, and one uppercase letter.",
      },
    },
    passCode: String,
    isConfirm: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const userModel: mongoose.Model<any> = mongoose.model("user", userSchema);

export default userModel;
