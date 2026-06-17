// routes/form2cRoutes.js
import express from "express";
import multer from "multer";
import * as form2cController from "../controllers/form2cController.js";

const router = express.Router();

/* ==========================================================
   🟦 FILE UPLOAD
   ========================================================== */

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/form2c/");
  },
  filename: (req, file, cb) => {
    cb(null, `form2c_${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({ storage });

/* ==========================================================
   🟦 FILTERED ROUTES
   ========================================================== */

// Get all Form 2C of a student
router.get("/student/:student_id", form2cController.getForm2CByStudentController);

/* ==========================================================
   🟩 BASIC CRUD ROUTES
   ========================================================== */

// Get all forms
router.get("/", form2cController.getAllForm2CController);

// Get single form by ID
router.get("/:id", form2cController.getForm2CByIdController);

// Create form
router.post("/", upload.single("file"), form2cController.createForm2CController);

// Update form
router.put("/:id", upload.single("file"), form2cController.updateForm2CController);

// Delete form
router.delete("/:id", form2cController.deleteForm2CController);

export default router;
