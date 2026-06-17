import express from "express";
import * as userController from "../controllers/userController.js";

const router = express.Router();

/* ==========================================================
   🧑‍🎓 STUDENT ROUTES
   ========================================================== */

// Get all students
router.get("/students", userController.getStudents);

// Get student by ID
router.get("/students/:id", userController.getStudentById);

// Create new student
router.post("/students", userController.createStudent);

// Update student
router.put("/students/:id", userController.updateStudent);

// Delete student
router.delete("/students/:id", userController.deleteStudent);

// Search students
router.get("/students/search/:term", userController.searchStudents);


/* ==========================================================
   👨‍🏫 FACULTY ROUTES (Includes Admin)
   ========================================================== */

// ✅ Place specific route first
router.get("/faculty/:id/theses", userController.getAdviseeTheses);

// 🟩 General faculty routes below
router.get("/faculty", userController.getFaculty);
router.get("/faculty/advisers/list", userController.getAllAdvisers);
router.get("/faculty/search/:term", userController.searchFaculty);
router.get("/faculty/:id", userController.getFacultyById);
router.post("/faculty", userController.createFaculty);
router.put("/faculty/:id", userController.updateFaculty);
router.delete("/faculty/:id", userController.deleteFaculty);


/* ==========================================================
   🔐 LOGIN
   ========================================================== */
router.post("/login", userController.loginUser);

export default router;
