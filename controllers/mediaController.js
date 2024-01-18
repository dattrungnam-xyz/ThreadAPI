import { Media } from "../models/mediaModel.js";
import {
  uploadPhotoCloudinary,
  uploadVideoCloudinary,
} from "../utils/uploadCloudinary.js";

let mediaController = {
  createOne: async function (file) {
    if (file.mimetype.startsWith("image")) {
      const imageObj = await uploadPhotoCloudinary(file);
      let media = await Media.create(imageObj);
      return media.id;
    } else if (file.mimetype.startsWith("video")) {
      const videoObj = await uploadVideoCloudinary(file);
      let media = await Media.create(videoObj);
      return media.id;
    }
  },
  createMany: async function (files) {
    let multiPromise = files.map((file) => {
     return mediaController.createOne(file);
    });
    let listMediaId = await Promise.all(multiPromise);
    return listMediaId;
  },
};
export { mediaController };
