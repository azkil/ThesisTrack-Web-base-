import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import * as formsPdfController from "../controllers/formsPdfController.js";

const router = express.Router();

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(process.cwd(), "uploads", req.body.type || "other_pdf");
    if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => cb(null, `${req.body.type}-${Date.now()}${path.extname(file.originalname)}`)
});
const upload = multer({ storage });

// Routes
router.post("/upload", upload.single("file"), formsPdfController.uploadPdfController);
router.get("/student/:student_id", formsPdfController.getPdfByStudentController);
router.delete("/student/:student_id/:type", formsPdfController.deletePdfController);
router.get("/theses", formsPdfController.getAllThesesWithPdfsController);
router.get("/theses/student/:student_id", formsPdfController.getThesisWithPdfsByStudentController);
router.get("/theses/search", formsPdfController.searchThesesController);
router.get("/theses/year", formsPdfController.filterByYearController);
router.get("/theses/student/:id/pdfs", formsPdfController.getThesisWithPdfsByStudentIdController);

export default router;