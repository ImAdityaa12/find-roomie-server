import { Express } from "express";

export const uploadMedia = (file: Express.Multer.File) => {
  return {
    url: file.path,
    publicId: file.filename,
  };
};
