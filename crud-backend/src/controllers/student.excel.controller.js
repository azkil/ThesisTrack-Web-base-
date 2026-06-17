import {
  exportStudentsExcelService,
  importStudentsExcelService,
} from "../services/student.excel.service.js";

export const exportStudentsExcel = async (req, res) => {
  try {
    const buffer = await exportStudentsExcelService();

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=students.xlsx"
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.send(buffer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Export failed" });
  }
};

export const importStudentsExcel = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const count = await importStudentsExcelService(req.file.buffer);

    res.json({
      message: "Students imported successfully",
      count,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Import failed" });
  }
};
