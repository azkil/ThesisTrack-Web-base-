import * as formFilesService from "../services/formUploadFilesService.js";

/* ==========================================================
   🟩 BASIC CRUD CONTROLLERS
   ========================================================== */

// Get ALL uploaded files (admin/debug)
export const getAllFormFilesController = async (req, res) => {
  try {
    const files = await formFilesService.getAllFormFiles();
    res.json(files);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get file by ID
export const getFormFileByIdController = async (req, res) => {
  try {
    const file = await formFilesService.getFormFileById(req.params.id);

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    res.json(file);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Upload / create form file
export const uploadFormFileController = async (req, res) => {
  try {
    const { student_id } = req.body;
    const { formType } = req.params;

    if (!student_id) {
      return res.status(400).json({ message: "student_id is required" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const savedFile = await formFilesService.createFormFile({
      student_id,
      form_type: formType,
      original_name: req.file.originalname,
      // ✅ FIXED PATH
      file_path: `${formType}/${req.file.filename}`,
    });

    res.status(201).json(savedFile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete uploaded file
export const deleteFormFileController = async (req, res) => {
  try {
    const deleted = await formFilesService.deleteFormFile(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "File not found" });
    }

    res.json({ message: "File deleted successfully", deleted });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ==========================================================
   🟦 FILTERED FETCH CONTROLLERS
   ========================================================== */

// Get all files by STUDENT
export const getFormFilesByStudentController = async (req, res) => {
  try {
    const files = await formFilesService.getFormFilesByStudent(
      req.params.student_id
    );
    res.json(files);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get files by STUDENT + FORM TYPE
export const getFormFilesByStudentAndFormController = async (req, res) => {
  try {
    const { student_id, formType } = req.params;

    const files =
      await formFilesService.getFormFilesByStudentAndForm(
        student_id,
        formType
      );

    res.json(files);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get DISTINCT uploaded form types per student
export const getUploadedFormTypesByStudentController = async (req, res) => {
  try {
    const types =
      await formFilesService.getUploadedFormTypesByStudent(
        req.params.student_id
      );

    res.json(types);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get files grouped by form type
export const getFormFilesGroupedByFormTypeController = async (req, res) => {
  try {
    const result =
      await formFilesService.getFormFilesGroupedByFormType(
        req.params.student_id
      );

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get latest file per form type
export const getLatestFormFilePerTypeController = async (req, res) => {
  try {
    const result =
      await formFilesService.getLatestFormFilePerType(
        req.params.student_id
      );

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
