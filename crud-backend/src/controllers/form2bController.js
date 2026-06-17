import * as form2bService from "../services/form2bService.js";

/* ==========================================================
   🟩 BASIC CRUD CONTROLLERS
   ========================================================== */

// Get all forms
export const getAllForm2BController = async (req, res) => {
  try {
    const data = await form2bService.getAllForm2B();
    res.json(data);
  } catch (err) {
    console.error("❌ Error fetching all Form 2B:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// Fetch all Form 2B where faculty is part of panel
export const getForm2BByPanelFacultyController = async (req, res) => {
  try {
    const { faculty_id } = req.params;

    const forms = await form2bService.getForm2BByPanelFaculty(
      faculty_id
    );

    res.json(forms);
  } catch (err) {
    console.error("❌ Error fetching Form 2B by panel faculty:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// Get form by ID
export const getForm2BByIdController = async (req, res) => {
  try {
    const data = await form2bService.getForm2BById(req.params.id);

    if (!data) {
      return res.status(404).json({ message: "Form 2B not found" });
    }

    res.json(data);
  } catch (err) {
    console.error("❌ Error fetching Form 2B by ID:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// Create new form
export const createForm2BController = async (req, res) => {
  try {
    const filePath = req.file ? req.file.path : null;

    const newForm = await form2bService.createForm2B({
      ...req.body,
      file_path: filePath,
    });

    res.status(201).json(newForm);
  } catch (err) {
    console.error("❌ Error creating Form 2B:", err.message);
    res.status(400).json({ error: err.message });
  }
};

// Update existing form
export const updateForm2BController = async (req, res) => {
  try {
    const filePath = req.file ? req.file.path : null;

    const updatedForm = await form2bService.updateForm2B(
      req.params.id,
      {
        ...req.body,
        file_path: filePath,
      }
    );

    if (!updatedForm) {
      return res.status(404).json({ message: "Form 2B not found" });
    }

    res.json(updatedForm);
  } catch (err) {
    console.error("❌ Error updating Form 2B:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// Delete form
export const deleteForm2BController = async (req, res) => {
  try {
    const deleted = await form2bService.deleteForm2B(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Form 2B not found" });
    }

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting Form 2B:", err.message);
    res.status(500).json({ error: err.message });
  }
};

/* ==========================================================
   🟦 FILTERED FETCH CONTROLLERS
   ========================================================== */

// Fetch latest Form 2B by student
export const getForm2BByStudentController = async (req, res) => {
  try {
    const { student_id } = req.params;

    const form = await form2bService.getForm2BByStudent(student_id);

    if (!form) {
      return res.status(404).json({
        message: "No Form 2B found for this student.",
      });
    }

    res.json(form);
  } catch (err) {
    console.error("❌ Error fetching Form 2B by student:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Fetch all Form 2B related to a faculty
export const getForm2BByFacultyController = async (req, res) => {
  try {
    const forms = await form2bService.getForm2BByFaculty(
      req.params.faculty_id
    );

    res.json(forms);
  } catch (err) {
    console.error("❌ Error fetching Form 2B by faculty:", err.message);
    res.status(500).json({ error: err.message });
  }
};
