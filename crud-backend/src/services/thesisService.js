import { query } from "../db.js";
import ExcelJS from "exceljs";

/* ==========================================================
   🟩 BASIC FETCH
========================================================== */

// Get all theses
export const getTheses = async () => {
  const { rows } = await query(
    `SELECT * FROM theses ORDER BY created_at DESC`
  );
  return rows;
};

// Get thesis by ID
export const getThesisById = async (id) => {
  const { rows } = await query(
    `SELECT * FROM theses WHERE thesis_id = $1`,
    [id]
  );
  return rows[0];
};

// Get theses by student
export const getThesisByStudentId = async (studentId) => {
  const { rows } = await query(
    `SELECT * FROM theses WHERE student_id = $1`,
    [studentId]
  );
  return rows;
};

/* ==========================================================
   🔎 SEARCH (ALL COLUMNS)
========================================================== */

export const searchTheses = async (term) => {
  const { rows } = await query(
    `
    SELECT *
    FROM theses
    WHERE
      title ILIKE $1 OR
      adviser_name ILIKE $1 OR
      student1_name ILIKE $1 OR
      student2_name ILIKE $1 OR
      student3_name ILIKE $1 OR
      description ILIKE $1 OR
      problem_stmt ILIKE $1 OR
      objectives ILIKE $1 OR
      status ILIKE $1
    ORDER BY created_at DESC
    `,
    [`%${term}%`]
  );

  return rows;
};

/* ================= FILTER BY YEAR ================= */

export const filterThesesByYear = async (year) => {
  const { rows } = await query(
    `
    SELECT *
    FROM theses
    WHERE EXTRACT(YEAR FROM created_at) = $1
    ORDER BY created_at DESC
    `,
    [year]
  );

  return rows;
};

/* ==========================================================
   🟩 CREATE NEW THESIS
========================================================== */
export const createThesis = async (data) => {
  const {
    student_id,
    faculty_id,
    adviser_name,
    student1_name,
    student1_idno,
    student2_name,
    student2_idno,
    student3_name,
    student3_idno,
    title,
    description,
    problem_stmt,
    objectives,
    status,
  } = data;

  if (!student_id || !title) {
    throw new Error("Missing required fields: student_id or title");
  }

  const { rows } = await query(
    `
    INSERT INTO theses (
      student_id,
      faculty_id,
      adviser_name,
      student1_name,
      student1_idno,
      student2_name,
      student2_idno,
      student3_name,
      student3_idno,
      title,
      description,
      problem_stmt,
      objectives,
      status
    )
    VALUES (
      $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14
    )
    RETURNING *
    `,
    [
      student_id,
      faculty_id || null,
      adviser_name || null,
      student1_name || null,
      student1_idno || null,
      student2_name || null,
      student2_idno || null,
      student3_name || null,
      student3_idno || null,
      title,
      description || null,
      problem_stmt || null,
      objectives || null,
      status || "Acceptance waiting to adviser",
    ]
  );

  return rows[0];
};

/* ==========================================================
   🟩 UPDATE EXISTING THESIS
   Updates faculty_id and adviser_name if adviser changes
========================================================== */
export const updateThesis = async (id, data) => {
  const {
    faculty_id,
    adviser_name,
    student1_name,
    student1_idno,
    student2_name,
    student2_idno,
    student3_name,
    student3_idno,
    title,
    description,
    problem_stmt,
    objectives,
    status,
  } = data;

  const { rowCount, rows } = await query(
    `
    UPDATE theses
    SET
      faculty_id = $1,
      adviser_name = $2,
      student1_name = $3,
      student1_idno = $4,
      student2_name = $5,
      student2_idno = $6,
      student3_name = $7,
      student3_idno = $8,
      title = $9,
      description = $10,
      problem_stmt = $11,
      objectives = $12,
      status = $13,
      updated_at = CURRENT_TIMESTAMP
    WHERE thesis_id = $14
    RETURNING *
    `,
    [
      faculty_id || null,
      adviser_name || null,
      student1_name || null,
      student1_idno || null,
      student2_name || null,
      student2_idno || null,
      student3_name || null,
      student3_idno || null,
      title || null,
      description || null,
      problem_stmt || null,
      objectives || null,
      status || "Acceptance waiting to adviser",
      id,
    ]
  );

  if (rowCount === 0) return null;

  return rows[0];
};

/* ==========================================================
   🗑 DELETE
========================================================== */

export const deleteThesis = async (id) => {
  const { rows } = await query(
    `
    DELETE FROM theses 
    WHERE thesis_id = $1 
    RETURNING *
    `,
    [id]
  );

  return rows[0];
};

/* ==========================================================
   📤 EXPORT TO EXCEL
========================================================== */

export const exportThesesExcelService = async () => {
  const { rows } = await query(
    `
    SELECT
      thesis_id,
      student_id,
      faculty_id,
      adviser_name,
      student1_name,
      student1_idno,
      student2_name,
      student2_idno,
      student3_name,
      student3_idno,
      title,
      description,
      problem_stmt,
      objectives,
      status,
      created_at
    FROM theses
    ORDER BY created_at DESC
    `
  );

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Theses");

  worksheet.columns = [
    { header: "Thesis ID", key: "thesis_id", width: 12 },
    { header: "Student ID", key: "student_id", width: 15 },
    { header: "Faculty ID", key: "faculty_id", width: 15 },
    { header: "Adviser Name", key: "adviser_name", width: 25 },
    { header: "Student 1 Name", key: "student1_name", width: 25 },
    { header: "Student 1 ID No", key: "student1_idno", width: 20 },
    { header: "Student 2 Name", key: "student2_name", width: 25 },
    { header: "Student 2 ID No", key: "student2_idno", width: 20 },
    { header: "Student 3 Name", key: "student3_name", width: 25 },
    { header: "Student 3 ID No", key: "student3_idno", width: 20 },
    { header: "Title", key: "title", width: 30 },
    { header: "Description", key: "description", width: 40 },
    { header: "Problem Statement", key: "problem_stmt", width: 40 },
    { header: "Objectives", key: "objectives", width: 40 },
    { header: "Status", key: "status", width: 25 },
    { header: "Created At", key: "created_at", width: 25 },
  ];

  rows.forEach((row) => worksheet.addRow(row));

  return workbook.xlsx.writeBuffer();
};

/* ==========================================================
   📥 IMPORT FROM EXCEL
========================================================== */

export const importThesesExcelService = async (buffer) => {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(buffer);

  const sheet = workbook.worksheets[0];
  if (!sheet) throw new Error("No worksheet found");

  const headerRow = sheet.getRow(1);
  const headers = {};

  headerRow.eachCell((cell, colNumber) => {
    if (cell.value) {
      headers[cell.value.toString().trim().toLowerCase()] = colNumber;
    }
  });

  const required = ["student id", "title"];
  for (const h of required) {
    if (!headers[h]) throw new Error(`Missing required column: ${h}`);
  }

  let count = 0;

  for (let i = 2; i <= sheet.rowCount; i++) {
    const row = sheet.getRow(i);

    const student_id = Number(row.getCell(headers["student id"])?.value || 0);
    const faculty_id = Number(row.getCell(headers["faculty id"])?.value || 0);
    const adviser_name = String(row.getCell(headers["adviser name"])?.value || "").trim();
    const student1_name = String(row.getCell(headers["student1 name"])?.value || "").trim();
    const student1_idno = String(row.getCell(headers["student1 idno"])?.value || "").trim();
    const student2_name = String(row.getCell(headers["student2 name"])?.value || "").trim();
    const student2_idno = String(row.getCell(headers["student2 idno"])?.value || "").trim();
    const student3_name = String(row.getCell(headers["student3 name"])?.value || "").trim();
    const student3_idno = String(row.getCell(headers["student3 idno"])?.value || "").trim();
    const title = String(row.getCell(headers["title"])?.value || "").trim();
    const description = String(row.getCell(headers["description"])?.value || "").trim();
    const problem_stmt = String(row.getCell(headers["problem statement"])?.value || "").trim();
    const objectives = String(row.getCell(headers["objectives"])?.value || "").trim();
    const status = String(row.getCell(headers["status"])?.value || "Acceptance waiting to adviser").trim();

    if (!student_id || !title) continue;

    await query(
      `
      INSERT INTO theses (
        student_id,
        faculty_id,
        adviser_name,
        student1_name,
        student1_idno,
        student2_name,
        student2_idno,
        student3_name,
        student3_idno,
        title,
        description,
        problem_stmt,
        objectives,
        status
      )
      VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14
      )
      ON CONFLICT (title)
      DO UPDATE SET
        adviser_name = EXCLUDED.adviser_name,
        status = EXCLUDED.status,
        updated_at = CURRENT_TIMESTAMP
      `,
      [
        student_id,
        faculty_id || null,
        adviser_name || null,
        student1_name || null,
        student1_idno || null,
        student2_name || null,
        student2_idno || null,
        student3_name || null,
        student3_idno || null,
        title,
        description || null,
        problem_stmt || null,
        objectives || null,
        status,
      ]
    );

    count++;
  }

  return count;
};

/* ==========================================================
   🔄 UPDATE STATUS ONLY
========================================================== */
export const updateThesisStatus = async (id, status) => {
  if (!id || !status) {
    throw new Error("Missing thesis ID or status");
  }

  const { rowCount, rows } = await query(
    `
    UPDATE theses
    SET
      status = $1,
      updated_at = CURRENT_TIMESTAMP
    WHERE thesis_id = $2
    RETURNING *
    `,
    [status, id]
  );
  
  if (rowCount === 0) return null;

  return rows[0];
};