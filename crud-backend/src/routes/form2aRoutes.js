import express from "express";
import * as form2aController from "../controllers/form2aController.js";

const router = express.Router();

/* ==========================================================
   🟦 FILTERED FETCH ROUTES
   ========================================================== */

// Get latest Form 2A by student
router.get("/student/:student_id", form2aController.getForm2AByStudentController);

// Get all Form 2A assigned to a faculty
router.get("/faculty/:faculty_id", form2aController.getForm2AByFacultyController);

/* ==========================================================
   🟩 BASIC CRUD ROUTES
   ========================================================== */

// Get all forms
router.get("/", form2aController.getAllForm2AController);

// Get one form by ID
router.get("/:id", form2aController.getForm2AByIdController);

// Create new form
router.post("/", form2aController.createForm2AController);

// Update existing form
router.put("/:id", form2aController.updateForm2AController);

// Delete form
router.delete("/:id", form2aController.deleteForm2AController);

export default router;
