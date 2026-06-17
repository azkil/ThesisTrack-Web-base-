import express from "express";
import multer from "multer";
import * as form2bController from "../controllers/form2bController.js";

const router = express.Router();

/* ==========================================================
   🟦 FILE UPLOAD
   ========================================================== */

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/form2b/");
  },
  filename: (req, file, cb) => {
    cb(null, `form2b_${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({ storage });

/* ==========================================================
   🟦 FILTERED FETCH ROUTES
   ========================================================== */

// Get latest Form 2B by student
router.get(
  "/student/:student_id",
  form2bController.getForm2BByStudentController
);

// Get all Form 2B where faculty is panel member
router.get(
  "/panel/:faculty_id",
  form2bController.getForm2BByPanelFacultyController
);

// Get all Form 2B assigned to a faculty
router.get(
  "/faculty/:faculty_id",
  form2bController.getForm2BByFacultyController
);

/* ==========================================================
   🟩 BASIC CRUD ROUTES
   ========================================================== */

// Get all forms
router.get("/", form2bController.getAllForm2BController);

// Get form by ID
router.get("/:id", form2bController.getForm2BByIdController);

// Create new form
router.post("/", upload.single("file"), form2bController.createForm2BController);

// Update existing form
router.put("/:id", upload.single("file"), form2bController.updateForm2BController);

// Delete form
router.delete("/:id", form2bController.deleteForm2BController);

export default router;
