// routes/facultyRoutes.js
import express from "express";
import multer from "multer";
import * as facultyController from "../controllers/facultyController.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

/* ==========================================================
   📥 EXCEL IMPORT/EXPORT
========================================================== */
router.get("/export/excel", facultyController.exportFacultyExcelController);
router.post("/import/excel", upload.single("file"), facultyController.importFacultyExcelController);

/* ==========================================================
   🔍 FILTER & SEARCH
========================================================== */
router.get("/search", facultyController.searchFacultyController);
router.get("/filter", facultyController.filterFacultyByYearController);

/* ==========================================================
   👩‍🏫 CUSTOM ROUTES (IMPORTANT FIRST)
========================================================== */
router.get("/with-theses", facultyController.getAllFacultyWithThesesController);
router.get("/theses/:id", facultyController.getThesesByFacultyIdController);

/* ==========================================================
   📝 CRUD ROUTES
========================================================== */
router.get("/", facultyController.getAllFacultyController);
router.get("/:id", facultyController.getFacultyByIdController);
router.post("/", facultyController.createFacultyController);
router.put("/:id", facultyController.updateFacultyController);
router.delete("/:id", facultyController.deleteFacultyController);

export default router;