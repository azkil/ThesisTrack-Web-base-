// controllers/form2cController.js
import * as form2cService from "../services/form2cService.js";

/* ==========================================================
   🟩 BASIC CRUD CONTROLLERS
   ========================================================== */

// Get all 2C forms
export const getAllForm2CController = async (req, res) => {
  try {
    const forms = await form2cService.getAllForm2C();
    res.json(forms);
  } catch (err) {
    console.error("❌ Error fetching all Form 2C:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// Get Form 2C by ID
export const getForm2CByIdController = async (req, res) => {
  try {
    const form = await form2cService.getForm2CById(req.params.id);

    if (!form) {
      return res.status(404).json({ message: "Form 2C not found" });
    }

    res.json(form);
  } catch (err) {
    console.error("❌ Error fetching Form 2C by ID:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// Create Form 2C
export const createForm2CController = async (req, res) => {
  try {
    const filePath = req.file ? req.file.path : null;

    const newForm = await form2cService.createForm2C({
      ...req.body,
      file_path: filePath,
    });

    res.status(201).json(newForm);
  } catch (err) {
    console.error("❌ Error creating Form 2C:", err.message);
    res.status(400).json({ error: err.message });
  }
};

// Update Form 2C request
export const updateForm2CController = async (req, res) => {
  try {
    const filePath = req.file ? req.file.path : null;

    const updated = await form2cService.updateForm2C(req.params.id, {
      ...req.body,
      file_path: filePath,
    });

    if (!updated) {
      return res.status(404).json({ message: "Form 2C not found" });
    }

    res.json(updated);
  } catch (err) {
    console.error("❌ Error updating Form 2C:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// Delete Form 2C
export const deleteForm2CController = async (req, res) => {
  try {
    const deleted = await form2cService.deleteForm2C(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Form 2C not found" });
    }

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting Form 2C:", err.message);
    res.status(500).json({ error: err.message });
  }
};

/* ==========================================================
   🟦 FILTERED CONTROLLERS
   ========================================================== */

// Get all Form 2C for a student
export const getForm2CByStudentController = async (req, res) => {
  try {
    const forms = await form2cService.getForm2CByStudent(req.params.student_id);
    res.json(forms);
  } catch (err) {
    console.error("❌ Error fetching Form 2C by student:", err.message);
    res.status(500).json({ error: err.message });
  }
};
