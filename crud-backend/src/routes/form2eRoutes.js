import express from "express";
import * as form2eController from "../controllers/form2eController.js";

const router = express.Router();

router.get("/", form2eController.getForm2E);
router.get("/:id", form2eController.getForm2EById);
router.post("/", form2eController.createForm2E);
router.put("/:id", form2eController.updateForm2E);
router.delete("/:id", form2eController.deleteForm2E);

export default router;
