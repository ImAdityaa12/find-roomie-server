import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "@/config/cloudinary";

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "roommate-app",
    resource_type: "auto"
  }
});

const upload = multer({ storage });

export default upload;