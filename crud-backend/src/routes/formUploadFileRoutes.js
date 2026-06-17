import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";

import * as formUploadController from
  "../controllers/formUploadFileController.js";

const router = express.Router();

/* ==========================================================
   📂 MULTER CONFIG
   ========================================================== */

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join("uploads", req.params.formType);

    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

/* ==========================================================
   🟦 STUDENT FILTERED ROUTES (MOST SPECIFIC FIRST)
   ========================================================== */

// 🔹 Grouped files per form
router.get(
  "/student/:student_id/grouped",
  formUploadController.getFormFilesGroupedByFormTypeController
);

// 🔹 Latest file per form
router.get(
  "/student/:student_id/latest",
  formUploadController.getLatestFormFilePerTypeController
);

// 🔹 Uploaded form types only
router.get(
  "/student/:student_id/forms",
  formUploadController.getUploadedFormTypesByStudentController
);

// 🔹 Files by student + specific form (2a–2k)
router.get(
  "/student/:student_id/:formType",
  formUploadController.getFormFilesByStudentAndFormController
);

// 🔹 All files by student
router.get(
  "/student/:student_id",
  formUploadController.getFormFilesByStudentController
);

/* ==========================================================
   🟩 GENERIC CRUD ROUTES (ALWAYS LAST)
   ========================================================== */

// Get ALL files (admin/debug)
router.get("/", formUploadController.getAllFormFilesController);

// Upload file
router.post(
  "/:formType/upload",
  upload.single("file"),
  formUploadController.uploadFormFileController
);

// Get file by ID
router.get("/:id", formUploadController.getFormFileByIdController);

// Delete file
router.delete("/:id", formUploadController.deleteFormFileController);

export default router;
