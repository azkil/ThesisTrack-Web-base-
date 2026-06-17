import express from "express";
import * as form2gController from "../controllers/form2gController.js";

const router = express.Router();

router.get("/", form2gController.getForm2G);
router.get("/:id", form2gController.getForm2GById);
router.post("/", form2gController.createForm2G);
router.put("/:id", form2gController.updateForm2G);
router.delete("/:id", form2gController.deleteForm2G);

export default router;
