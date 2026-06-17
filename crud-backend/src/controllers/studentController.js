  import * as studentService from "../services/studentService.js";

  /* =========================================================
    🟩 CRUD CONTROLLERS
  ========================================================== */

  // Get all students
  export const getAllStudentsController = async (req, res) => {
    try {
      const data = await studentService.getStudents();
      res.json(data);
    } catch (err) {
      console.error("❌ Error fetching students:", err.message);
      res.status(500).json({ error: err.message });
    }
  };

  // Get student by ID
  export const getStudentByIdController = async (req, res) => {
    try {
      const student = await studentService.getStudentById(req.params.id);

      if (!student) {
        return res.status(404).json({ message: "Student not found" });
      }

      res.json(student);
    } catch (err) {
      console.error("❌ Error fetching student:", err.message);
      res.status(500).json({ error: err.message });
    }
  };

  // Create student
  export const createStudentController = async (req, res) => {
    try {
      const student = await studentService.createStudent(req.body);
      res.status(201).json(student);
    } catch (err) {
      console.error("❌ Error creating student:", err.message);
      res.status(500).json({ error: err.message });
    }
  };

  // Update student
  export const updateStudentController = async (req, res) => {
    try {
      const student = await studentService.updateStudent(req.params.id, req.body);
      res.json(student);
    } catch (err) {
      console.error("❌ Error updating student:", err.message);
      res.status(500).json({ error: err.message });
    }
  };

  // Delete student
  export const deleteStudentController = async (req, res) => {
    try {
      const deleted = await studentService.deleteStudent(req.params.id);

      if (!deleted) return res.status(404).json({ message: "Student not found" });

      res.json({ message: "Deleted successfully" });
    } catch (err) {
      console.error("❌ Error deleting student:", err.message);
      res.status(500).json({ error: err.message });
    }
  };

  /* =========================================================
    🔎 SEARCH
  ========================================================== */

  export const searchStudentsController = async (req, res) => {
    try {
      const { term } = req.query;
      const results = await studentService.searchStudents(term || "");
      res.json(results);
    } catch (err) {
      console.error("❌ Error searching students:", err.message);
      res.status(500).json({ error: err.message });
    }
  };


  // Filter
  export const filterStudentsByYearController = async (req, res) => {
    try {
      const { year } = req.query;

      if (!year) {
        return res.status(400).json({ error: "Year is required" });
      }

      // ✅ Use thesisService
      const data = await studentService.filterStudentsByYear(year);
      res.json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error" });
    }
  };


  /* =========================================================
    📤 EXPORT EXCEL
  ========================================================== */

  export const exportStudentsExcelController = async (req, res) => {
    try {
      const buffer = await studentService.exportStudentsExcelService();

      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=students.xlsx"
      );

      res.send(buffer);
    } catch (err) {
      console.error("❌ Error exporting Excel:", err.message);
      res.status(500).json({ error: err.message });
    }
  };

  /* =========================================================
    📥 IMPORT EXCEL
  ========================================================== */

  export const importStudentsExcelController = async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const count = await studentService.importStudentsExcelService(req.file.buffer);

      res.json({
        message: "Import successful",
        recordsInserted: count,
      });
    } catch (err) {
      console.error("❌ Error importing Excel:", err.message);
      res.status(500).json({ error: err.message });
    }
  };
