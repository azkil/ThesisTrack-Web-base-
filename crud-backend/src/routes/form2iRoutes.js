import express from "express";
import * as form2iController from "../controllers/form2iController.js";

const router = express.Router();

router.get("/", form2iController.getForm2I);
router.get("/:id", form2iController.getForm2IById);
router.post("/", form2iController.createForm2I);
router.put("/:id", form2iController.updateForm2I);
router.delete("/:id", form2iController.deleteForm2I);

export default router;
