import express from "express";
import multer from "multer";
import {
  exportStudentsExcel,
  importStudentsExcel,
} from "../controllers/student.excel.controller.js";

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

router.get("/export", exportStudentsExcel);
router.post("/import", upload.single("file"), importStudentsExcel);

export default router;
