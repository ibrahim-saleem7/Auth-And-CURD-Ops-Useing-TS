import dotenv from "dotenv";
import mongoose from "mongoose";
import app from "./app";

/*============================Config============================*/
process.on("uncaughtException", (err) => {
  console.log("Syntax error occurred: ", err);
});
dotenv.config();

const port: number = Number(process.env.PORT) || 8000;
const mongoUrl: string =
  process.env.DATABASE_Connection 

/*================================Listener========================*/
async function startServer(port: number, mongoUrl: string) {
  await mongoose.connect(mongoUrl);
  console.log("DB connected");
  app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });
}

startServer(port, mongoUrl);

/*===================================Error============================*/
process.on("unhandledRejection", (err) => {
  console.log("Error occurred: ", err);
});
