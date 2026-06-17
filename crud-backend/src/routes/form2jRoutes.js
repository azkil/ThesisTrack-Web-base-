import express from "express";
import * as form2jController from "../controllers/form2jController.js";

const router = express.Router();

router.get("/", form2jController.getForm2J);
router.get("/:id", form2jController.getForm2JById);
router.post("/", form2jController.createForm2J);
router.put("/:id", form2jController.updateForm2J);
router.delete("/:id", form2jController.deleteForm2J);

export default router;
