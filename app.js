import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";

import userRoute from "./routes/userRoutes.js";
import commentRoute from "./routes/commentRoutes.js";
import postRoute from "./routes/postRoutes.js";
import likeRoute from "./routes/likeRoutes.js";
import notificationRoute from "./routes/notificationRoutes.js";
import testRoute from "./routes/testRoutes.js";
import { errorController } from "./controllers/errorController.js";
import { AppError } from "./utils/appError.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "template"));

app.use(cors());

app.use(
  express.json({
    limit: "50mb",
  })
);

// app.use("/api/v1/tour", tourRoute);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/post", postRoute);
app.use("/api/v1/like", likeRoute);
app.use("/api/v1/comment", commentRoute);
app.use("/api/v1/notification", notificationRoute);
app.use("/api/v1/test", testRoute);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(errorController.handleError);

export default app;
