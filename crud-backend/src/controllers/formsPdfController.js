import * as formsPdfService from "../services/formsPdfService.js";

// GET by student
export const getPdfByStudentController = async (req, res) => {
  try {
    const data = await formsPdfService.getPdfByStudent(req.params.student_id);
    if (!data) return res.status(404).json({ message: "No PDF record found" });
    res.json(data);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// Upload / Replace
export const uploadPdfController = async (req, res) => {
  try {
    const { student_id, type } = req.body;
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const relativePath = req.file.path
      .replace(process.cwd(), "")
      .replace(/\\/g, "/")
      .replace(/^\/+/, "");

    const result = await formsPdfService.uploadOrReplacePdf(student_id, type, relativePath, req.file.originalname);
    res.json({ message: "File uploaded successfully", data: result, path: relativePath });
  } catch (err) {
    console.error("❌ Upload error:", err);
    res.status(400).json({ message: err.message });
  }
};

// Delete PDF
export const deletePdfController = async (req, res) => {
  try {
    const result = await formsPdfService.deletePdfColumn(req.params.student_id, req.params.type);
    res.json({ message: "File deleted successfully", data: result });
  } catch (err) { res.status(400).json({ message: err.message }); }
};

// All theses
export const getAllThesesWithPdfsController = async (_, res) => {
  try {
    const data = await formsPdfService.getAllThesesWithPdfs();
    res.json(data);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// Thesis by student
export const getThesisWithPdfsByStudentController = async (req, res) => {
  try {
    const data = await formsPdfService.getThesisWithPdfsByStudent(req.params.student_id);
    if (!data) return res.status(404).json({ message: "Thesis not found" });
    res.json(data);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// Search
export const searchThesesController = async (req, res) => {
  try { const data = await formsPdfService.searchThesesWithPdfs(req.query.search); res.json(data); }
  catch (err) { res.status(500).json({ message: err.message }); }
};

// Filter by year
export const filterByYearController = async (req, res) => {
  try { const data = await formsPdfService.filterThesesByYear(req.query.year); res.json(data); }
  catch (err) { res.status(500).json({ message: err.message }); }
};

// By ID
export const getThesisWithPdfsByStudentIdController = async (req, res) => {
  try {
    const data = await formsPdfService.getThesisWithPdfsByStudentId(req.params.id);
    if (!data) return res.status(404).json({ message: "Thesis not found" });
    res.json(data);
  } catch (err) { res.status(500).json({ message: err.message }); }
};