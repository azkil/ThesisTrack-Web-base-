import * as form2kService from "../services/form2kService.js";

/* ==========================================================
   🟦 FORM 2K CONTROLLER
   ========================================================== */

// GET all
export const getForm2K = async (req, res) => {
  try {
    const result = await form2kService.getAllForm2K();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET by ID
export const getForm2KById = async (req, res) => {
  try {
    const result = await form2kService.getForm2KById(req.params.id);
    if (!result) return res.status(404).json({ message: "Form 2K not found" });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// CREATE
export const createForm2K = async (req, res) => {
  try {
    const result = await form2kService.createForm2K(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE
export const updateForm2K = async (req, res) => {
  try {
    const result = await form2kService.updateForm2K(req.params.id, req.body);
    if (!result) return res.status(404).json({ message: "Form 2K not found" });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE
export const deleteForm2K = async (req, res) => {
  try {
    const result = await form2kService.deleteForm2K(req.params.id);
    if (!result) return res.status(404).json({ message: "Form 2K not found" });
    res.json({ message: "Deleted successfully", deleted: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
