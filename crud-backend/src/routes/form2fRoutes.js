import express from "express";
import * as form2fController from "../controllers/form2fController.js";

const router = express.Router();

router.get("/", form2fController.getForm2F);
router.get("/:id", form2fController.getForm2FById);
router.post("/", form2fController.createForm2F);
router.put("/:id", form2fController.updateForm2F);
router.delete("/:id", form2fController.deleteForm2F);

export default router;
