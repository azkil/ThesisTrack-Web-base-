import * as facultyService from "../services/facultyService.js";

/* ==========================================================
   🟩 BASIC CRUD CONTROLLERS
========================================================== */

// Get all faculty
export const getAllFacultyController = async (req, res) => {
  try {
    const data = await facultyService.getFaculty();
    res.json(data);
  } catch (err) {
    console.error("❌ Error fetching faculty:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// Get faculty by ID
export const getFacultyByIdController = async (req, res) => {
  try {
    const faculty = await facultyService.getFacultyById(req.params.id);

    if (!faculty) {
      return res.status(404).json({ message: "Faculty not found" });
    }

    res.json(faculty);
  } catch (err) {
    console.error("❌ Error fetching faculty:", err.message);
    res.status(500).json({ error: err.message });
  }
};

/* =========================================================
   🟩 GET ALL FACULTY WITH / WITHOUT THESES
========================================================= */
export const getAllFacultyWithThesesController = async (req, res) => {
  try {
    const data = await facultyService.getAllFacultyWithTheses();

    res.json(data); // no 404 here, we always return all faculty
  } catch (err) {
    console.error("❌ Error fetching faculty with theses:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// Create faculty
export const createFacultyController = async (req, res) => {
  try {
    const result = await facultyService.createFaculty(req.body);
    res.status(201).json(result);
  } catch (err) {
    console.error("❌ Error creating faculty:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// Update faculty
export const updateFacultyController = async (req, res) => {
  try {
    const result = await facultyService.updateFaculty(
      req.params.id,
      req.body
    );

    res.json(result);
  } catch (err) {
    console.error("❌ Error updating faculty:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// Delete faculty
export const deleteFacultyController = async (req, res) => {
  try {
    const deleted = await facultyService.deleteFaculty(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Faculty not found" });
    }

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting faculty:", err.message);
    res.status(500).json({ error: err.message });
  }
};

/* =========================================================
   📄 Get Theses for a Specific Faculty
========================================================= */


export const getThesesByFacultyIdController = async (req, res) => {
  const { id } = req.params;

  try {
    const theses = await facultyService.getThesesByFacultyId(id);
    res.json(theses);
  } catch (err) {
    console.error("❌ Error fetching theses for faculty:", err);
    res.status(500).json({ error: "Failed to fetch theses" });
  }
};



/* ==========================================================
   🔎 SEARCH + FILTER
========================================================== */

// Search faculty
export const searchFacultyController = async (req, res) => {
  try {
    const { term } = req.query;

    const results = await facultyService.searchFaculty(term);

    res.json(results);
  } catch (err) {
    console.error("❌ Error searching faculty:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// Filter by year (optional if faculty has created_at)
export const filterFacultyByYearController = async (req, res) => {
  try {
    const { year } = req.query;

    if (!year) {
      return res.status(400).json({ error: "Year is required" });
    }

    const data = await facultyService.filterFacultyByYear(year);
    res.json(data);
  } catch (error) {
    console.error("❌ Error filtering faculty:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};

/* ==========================================================
   📤 EXPORT EXCEL
========================================================== */

export const exportFacultyExcelController = async (req, res) => {
  try {
    const buffer = await facultyService.exportFacultyExcelService();

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=faculty.xlsx"
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

export const importFacultyExcelController = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Call service
    const result = await facultyService.importFacultyExcelService(req.file.buffer);

    // Send proper response
    res.json({
      message: "Import completed",
      inserted: result.successCount,
      errors: result.errors,
    });

  } catch (err) {
    console.error("❌ Error importing Excel:", err.message);
    res.status(500).json({ error: err.message });
  }
};