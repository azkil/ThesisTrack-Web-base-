import express from "express";
import * as form2kController from "../controllers/form2kController.js";

const router = express.Router();

/* ==========================================================
   🛣️ FORM 2K ROUTES
   ========================================================== */
router.get("/", form2kController.getForm2K);
router.get("/:id", form2kController.getForm2KById);
router.post("/", form2kController.createForm2K);
router.put("/:id", form2kController.updateForm2K);
router.delete("/:id", form2kController.deleteForm2K);

export default router;
