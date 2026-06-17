import fs from "fs";
import path from "path";
import { query } from "../db.js";

const allowedTypes = [
  "form2a",

  "form2b198",
  "form2b199",

  "form2c",

  "form2d198",
  "form2d199",

  "form2e198",
  "form2e199",

  "form2f198",
  "form2f199",

  "form2g198",
  "form2g199",

  "form2h198",
  "form2h199",

  "form2i198",
  "form2i199",

  "form2j",
  "form2k",

  "manuscript",
  "other_pdf",
];

const validateType = (type) => {
  if (!allowedTypes.includes(type)) throw new Error("Invalid file type");
};

// 🔹 Get PDF by student
export const getPdfByStudent = async (student_id) => {
  const { rows } = await query(
    `SELECT * FROM formsPdf_files WHERE student_id = $1`,
    [student_id]
  );
  return rows[0] || null;
};

// 🔹 Create record if not exists
export const createPdfRecordIfNotExists = async (student_id) => {
  const existing = await getPdfByStudent(student_id);
  if (existing) return existing;

  const { rows } = await query(
    `INSERT INTO formsPdf_files (student_id) VALUES ($1) RETURNING *`,
    [student_id]
  );
  return rows[0];
};

// 🔹 Safely delete file
const deletePhysicalFile = async (filePath) => {
  if (!filePath) return;
  const fullPath = path.join(process.cwd(), filePath);
  if (fs.existsSync(fullPath)) await fs.promises.unlink(fullPath);
};

// 🔹 Upload or replace PDF
export const uploadOrReplacePdf = async (student_id, type, filePath, originalName) => {
  validateType(type);
  const columnPath = `${type}_path`;
  const columnName = `${type}_name`;

  await createPdfRecordIfNotExists(student_id);

  const relativePath = filePath
    .replace(process.cwd(), "")
    .replace(/\\/g, "/")
    .replace(/^\/+/, "");

  const { rows } = await query(
    `SELECT ${columnPath} FROM formsPdf_files WHERE student_id = $1`,
    [student_id]
  );

  const oldFile = rows[0]?.[columnPath];
  await deletePhysicalFile(oldFile);

  const { rows: updatedRows } = await query(
    `UPDATE formsPdf_files
     SET ${columnPath} = $1,
         ${columnName} = $2,
         uploaded_at = CURRENT_TIMESTAMP
     WHERE student_id = $3
     RETURNING *`,
    [relativePath, originalName, student_id]
  );

  return updatedRows[0];
};

// 🔹 Delete PDF column
export const deletePdfColumn = async (student_id, type) => {
  validateType(type);
  const columnPath = `${type}_path`;
  const columnName = `${type}_name`;

  const { rows } = await query(
    `SELECT ${columnPath} FROM formsPdf_files WHERE student_id = $1`,
    [student_id]
  );
  const filePath = rows[0]?.[columnPath];
  await deletePhysicalFile(filePath);

  const { rows: updatedRows } = await query(
    `UPDATE formsPdf_files
     SET ${columnPath} = NULL,
         ${columnName} = NULL,
         uploaded_at = CURRENT_TIMESTAMP
     WHERE student_id = $1
     RETURNING *`,
    [student_id]
  );
  return updatedRows[0];
};

// 🔹 Theses + PDFs
export const getAllThesesWithPdfs = async () => {
  const { rows } = await query(`
    SELECT t.*, f.*
    FROM theses t
    LEFT JOIN formsPdf_files f
      ON t.student_id = f.student_id
    ORDER BY t.created_at DESC
  `);
  return rows;
};

// 🔹 By Student
export const getThesisWithPdfsByStudent = async (student_id) => {
  const { rows } = await query(`
    SELECT t.*, f.*
    FROM theses t
    LEFT JOIN formsPdf_files f
      ON t.student_id = f.student_id
    WHERE t.student_id = $1
  `, [student_id]);
  return rows[0] || null;
};

// 🔹 Search
export const searchThesesWithPdfs = async (search) => {
  const { rows } = await query(`
    SELECT t.*, f.*
    FROM theses t
    LEFT JOIN formsPdf_files f
      ON t.student_id = f.student_id
    WHERE LOWER(t.title) LIKE LOWER($1)
       OR LOWER(t.adviser_name) LIKE LOWER($1)
       OR LOWER(t.student1_name) LIKE LOWER($1)
       OR LOWER(t.student2_name) LIKE LOWER($1)
       OR LOWER(t.student3_name) LIKE LOWER($1)
  `, [`%${search}%`]);
  return rows;
};

// 🔹 Filter by year
export const filterThesesByYear = async (year) => {
  const { rows } = await query(`
    SELECT t.*, f.*
    FROM theses t
    LEFT JOIN formsPdf_files f
      ON t.student_id = f.student_id
    WHERE EXTRACT(YEAR FROM t.created_at) = $1
  `, [year]);
  return rows;
};

// 🔹 By ID
export const getThesisWithPdfsByStudentId = async (studentId) => {
  const { rows } = await query(`
    SELECT t.*, f.*
    FROM theses t
    LEFT JOIN formsPdf_files f
      ON t.student_id = f.student_id
    WHERE t.student_id = $1
    LIMIT 1
  `, [studentId]);
  return rows[0] || null;
};