import express from "express";
import multer from "multer";
import * as thesisController from "../controllers/thesisController.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

/* ==========================================================
   📊 EXCEL ROUTES (PUT THESE FIRST)
========================================================== */

router.get(
  "/export/excel",
  thesisController.exportThesesExcelController
);

router.post(
  "/import/excel",
  upload.single("file"),
  thesisController.importThesesExcelController
);

/* ==========================================================
   🟦 FILTERED ROUTES
========================================================== */

router.get(
  "/student/:student_id",
  thesisController.getThesisByStudentIdController
);

router.get(
  "/faculty/:faculty_id",
  thesisController.getThesesByFacultyController
);

router.get(
  "/search",
  thesisController.searchThesesController
);

router.get(
  "/filter",
  thesisController.filterThesesByYearController
);

/* ==========================================================
   🟩 CRUD ROUTES
========================================================== */

router.get("/", thesisController.getAllThesesController);

router.get("/:id", thesisController.getThesisByIdController);

router.post("/", thesisController.createThesisController);

router.put("/:id", thesisController.updateThesisController);

router.patch("/:id/status", thesisController.updateThesisStatusController);

router.delete("/:id", thesisController.deleteThesisController);


export default router;
