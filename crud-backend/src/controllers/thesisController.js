import * as thesisService from "../services/thesisService.js";


/* ==========================================================
   🟩 BASIC CRUD CONTROLLERS
========================================================== */

// Get all theses
export const getAllThesesController = async (req, res) => {
  try {
    const data = await thesisService.getTheses();
    res.json(data);
  } catch (err) {
    console.error("❌ Error fetching theses:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// Get thesis by ID
export const getThesisByIdController = async (req, res) => {
  try {
    const thesis = await thesisService.getThesisById(req.params.id);

    if (!thesis) {
      return res.status(404).json({ message: "Thesis not found" });
    }

    res.json(thesis);
  } catch (err) {
    console.error("❌ Error fetching thesis:", err.message);
    res.status(500).json({ error: err.message });
  }
};

/* ==========================================================
   🟩 CREATE NEW THESIS (Form2A EXCLUDED)
========================================================== */

export const createThesisController = async (req, res) => {
  try {
    const student_id = req.body.student_id;

    if (!student_id) {
      return res.status(400).json({ message: "Missing student_id" });
    }

    // Prepare thesis data directly from request body
    const thesisData = { ...req.body };

    const newThesis = await thesisService.createThesis(thesisData);

    res.status(201).json(newThesis);
  } catch (err) {
    console.error("❌ Error creating thesis:", err);
    res.status(500).json({
      message: "Failed to create thesis",
      error: err.message,
    });
  }
};

// Update full thesis
export const updateThesisController = async (req, res) => {
  try {
    const result = await thesisService.updateThesis(
      req.params.id,
      req.body
    );

    res.json(result);
  } catch (err) {
    console.error("❌ Error updating thesis:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// Update thesis status only
export const updateThesisStatusController = async (req, res) => {
  try {
    const { status } = req.body;

    await thesisService.updateThesisStatus(
      req.params.id,
      status
    );

    res.json({ message: "Status updated successfully" });
  } catch (err) {
    console.error("❌ Error updating thesis status:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// Delete thesis
export const deleteThesisController = async (req, res) => {
  try {
    const deleted = await thesisService.deleteThesis(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Thesis not found" });
    }

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting thesis:", err.message);
    res.status(500).json({ error: err.message });
  }
};

/* ==========================================================
   🟦 FILTERED FETCH CONTROLLERS
========================================================== */

// Get theses by student
export const getThesisByStudentIdController = async (req, res) => {
  try {
    const theses = await thesisService.getThesisByStudentId(
      req.params.student_id
    );

    if (!theses.length) {
      return res.status(404).json({
        message: "No theses found for this student",
      });
    }

    res.json(theses);
  } catch (err) {
    console.error("❌ Error fetching by student:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// Get theses by faculty
export const getThesesByFacultyController = async (req, res) => {
  try {
    const theses = await thesisService.getThesesByFacultyId(
      req.params.faculty_id
    );

    res.json(theses);
  } catch (err) {
    console.error("❌ Error fetching by faculty:", err.message);
    res.status(500).json({ error: err.message });
  }
};

/* ==========================================================
   🔎 SEARCH + FILTER
========================================================== */

// Search by title
export const searchThesesController = async (req, res) => {
  try {
    const { term } = req.query;

    const results = await thesisService.searchTheses(term);

    res.json(results);
  } catch (err) {
    console.error("❌ Error searching:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// Filter
export const filterThesesByYearController = async (req, res) => {
  try {
    const { year } = req.query;

    if (!year) {
      return res.status(400).json({ error: "Year is required" });
    }

    // ✅ Use thesisService
    const data = await thesisService.filterThesesByYear(year);
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};



/* ==========================================================
   📤 EXPORT EXCEL
========================================================== */

export const exportThesesExcelController = async (req, res) => {
  try {
    const buffer = await thesisService.exportThesesExcelService();

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=theses.xlsx"
    );

    res.send(buffer);
  } catch (err) {
    console.error("❌ Error exporting Excel:", err.message);
    res.status(500).json({ error: err.message });
  }
};

/* ==========================================================
   📥 IMPORT EXCEL
========================================================== */

export const importThesesExcelController = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const count = await thesisService.importThesesExcelService(
      req.file.buffer
    );

    res.json({
      message: "Import successful",
      recordsInserted: count,
    });
  } catch (err) {
    console.error("❌ Error importing Excel:", err.message);
    res.status(500).json({ error: err.message });
  }
};

