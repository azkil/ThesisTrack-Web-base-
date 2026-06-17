import * as form2aService from "../services/form2aService.js";

/* ==========================================================
   🟩 BASIC CRUD CONTROLLERS
   ========================================================== */

// Get all forms
export const getAllForm2AController = async (req, res) => {
  try {
    const data = await form2aService.getAllForm2A();
    res.json(data);
  } catch (err) {
    console.error("❌ Error fetching all Form 2A:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// Get form by ID
export const getForm2AByIdController = async (req, res) => {
  try {
    const data = await form2aService.getForm2AById(req.params.id);

    if (!data) {
      return res.status(404).json({ message: "Form 2A not found" });
    }

    res.json(data);
  } catch (err) {
    console.error("❌ Error fetching Form 2A by ID:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// Create new form
export const createForm2AController = async (req, res) => {
  try {
    const newForm = await form2aService.createForm2A(req.body);
    res.status(201).json(newForm);
  } catch (err) {
    console.error("❌ Error creating Form 2A:", err.message);
    res.status(400).json({ error: err.message });
  }
};

// Update existing form
export const updateForm2AController = async (req, res) => {
  try {
    const updatedForm = await form2aService.updateForm2A(
      req.params.id,
      req.body
    );

    if (!updatedForm) {
      return res.status(404).json({ message: "Form 2A not found" });
    }

    res.json(updatedForm);
  } catch (err) {
    console.error("❌ Error updating Form 2A:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// Delete form
export const deleteForm2AController = async (req, res) => {
  try {
    const deleted = await form2aService.deleteForm2A(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Form 2A not found" });
    }

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting Form 2A:", err.message);
    res.status(500).json({ error: err.message });
  }
};

/* ==========================================================
   🟦 FILTERED FETCH CONTROLLERS
   ========================================================== */

// Fetch the **latest** Form 2A by student
export const getForm2AByStudentController = async (req, res) => {
  try {
    const { student_id } = req.params;

    const form = await form2aService.getForm2AByStudent(student_id);

    if (!form) {
      return res.status(404).json({
        message: "No Form 2A found for this student.",
      });
    }

    res.json(form);
  } catch (err) {
    console.error("❌ Error fetching Form 2A by student:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Fetch all Form 2A submitted to a specific faculty
export const getForm2AByFacultyController = async (req, res) => {
  try {
    const forms = await form2aService.getForm2AByFaculty(
      req.params.faculty_id
    );

    res.json(forms);
  } catch (err) {
    console.error("❌ Error fetching Form 2A by faculty:", err.message);
    res.status(500).json({ error: err.message });
  }
};
