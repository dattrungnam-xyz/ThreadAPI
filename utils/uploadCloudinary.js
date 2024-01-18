import * as dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function uploadPhotoCloudinary(file) {
  const b64 = Buffer.from(file.buffer).toString("base64");
  let dataURI = "data:" + file.mimetype + ";base64," + b64;

  const res = await cloudinary.uploader.upload(dataURI, {
    resource_type: "auto",
  });
  return { url: res.url, type: "photo" };
}

async function uploadVideoCloudinary(file) {
  try {
    const uploadResult = await new Promise((resolve) => {
      cloudinary.uploader
        .upload_stream(
          { resource_type: "video" },
          async (error, uploadResult) => {
            return resolve(uploadResult);
          }
        )
        .end(file.buffer);
    });
    return { url: uploadResult.url, type: "video" };
  } catch (error) {
    console.error(error);
  }
}
export { uploadPhotoCloudinary, uploadVideoCloudinary };
