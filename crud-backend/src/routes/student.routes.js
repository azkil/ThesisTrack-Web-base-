import express from "express";
import multer from "multer";
import * as studentController from "../controllers/studentController.js";

const router = express.Router();
const upload = multer();

// ✅ Static routes FIRST
router.get("/", studentController.getAllStudentsController);
router.get("/search", studentController.searchStudentsController);
router.get("/filter", studentController.filterStudentsByYearController);
router.get("/export/excel", studentController.exportStudentsExcelController);
router.post("/import/excel", upload.single("file"), studentController.importStudentsExcelController);

// ✅ Dynamic routes LAST
router.get("/:id", studentController.getStudentByIdController);
router.post("/", studentController.createStudentController);
router.put("/:id", studentController.updateStudentController);
router.delete("/:id", studentController.deleteStudentController);

export default router;
