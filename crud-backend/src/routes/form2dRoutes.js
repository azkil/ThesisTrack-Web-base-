import express from "express";
import * as form2dController from "../controllers/form2dController.js";

const router = express.Router();

router.get("/", form2dController.getForm2D);
router.get("/:id", form2dController.getForm2DById);
router.post("/", form2dController.createForm2D);
router.put("/:id", form2dController.updateForm2D);
router.delete("/:id", form2dController.deleteForm2D);
router.patch("/:id/status", form2dController.updateForm2DStatus);

export default router;
