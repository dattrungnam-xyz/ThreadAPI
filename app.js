import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";

import userRoute from "./routes/userRoutes.js";
import commentRoute from "./routes/commentRoutes.js";
import postRoute from "./routes/postRoutes.js";

// import errrorController from "./controllers/errorController.js";

// import tourRoute from "./routes/tourRoutes.js";

// import userRoute from "./routes/userRoutes.js";
// import { CustomError } from "./utils/CustomError.js";

dotenv.config();

const app = express();

app.use(cors());

app.use(
  express.json({
    limit: "50mb",
  })
);

// app.use("/api/v1/tour", tourRoute);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/post", postRoute);
app.use("/api/v1/comment", commentRoute);

// app.all("*", (req, res, next) => {
//   next(new CustomError(`Can't find ${req.originalUrl} on this server!`, 404));
// });

// app.use(errrorController.handleGlobalError);

export default app;
