import { Request, Response } from "express";
import { uploadMedia as processUpload } from "./media.service";

export const uploadMedia = async (req: Request, res: Response) => {
  try {
    const file = req.file as Express.Multer.File;

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const data = processUpload(file);

    return res.status(200).json({ message: "Upload successful", data });
  } catch (error) {
    return res.status(500).json({ message: "Upload failed" });
  }
};