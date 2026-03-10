import { Router } from "express";
import upload from "./media.middleware";
import { uploadMedia } from "./media.controller";
import { requireAuth } from "@/middleware/require-auth";

const router = Router();

router.post(
  "/upload",
  requireAuth,
  upload.single("file"),
  uploadMedia
);

export default router;