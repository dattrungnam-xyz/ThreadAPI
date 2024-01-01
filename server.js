import mongoose from "mongoose";
import app from "./app.js";

mongoose
  .connect(process.env.MONGO_CONNECTION)
  .then(() => console.log("DB connection successful!"));

const startServer = () => {
  app.listen(process.env.PORT, () => {
    console.log("app listening on port 3333");
  });
};

startServer();