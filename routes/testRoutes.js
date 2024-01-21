import express from "express";
const router = express.Router();

router.get("/", (req, res, next) => {
  console.log(req.query);
  res.status(200).json({ status: "OK" });
});

export default router;
