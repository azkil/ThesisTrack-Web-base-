import express from "express";
import * as form2hController from "../controllers/form2hController.js";

const router = express.Router();

router.get("/", form2hController.getForm2H);
router.get("/:id", form2hController.getForm2HById);
router.post("/", form2hController.createForm2H);
router.put("/:id", form2hController.updateForm2H);
router.delete("/:id", form2hController.deleteForm2H);

export default router;
