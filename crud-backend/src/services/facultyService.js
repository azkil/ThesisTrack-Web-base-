import ExcelJS from "exceljs";
import { query } from "../db.js";

/* =========================================================
   👩‍🏫 FACULTY CRUD
========================================================= */

// Get all faculty
export const getFaculty = async () => {
  const { rows } = await query(
    `SELECT * FROM faculty ORDER BY created_at DESC`
  );
  return rows;
};

// Get faculty by ID
export const getFacultyById = async (id) => {
  const { rows } = await query(
    `SELECT * FROM faculty WHERE faculty_id = $1`,
    [id]
  );
  return rows[0];
};
/* =========================================================
   🟩 GET ALL FACULTY WITH / WITHOUT THESES
========================================================= */
export const getAllFacultyWithTheses = async () => {
  const { rows } = await query(`
    SELECT
      f.faculty_id,
      f.username,
      f.email,
      f.full_name,
      f.department,
      f.role,
      f.is_active,
      f.created_at AS faculty_created_at,
      f.updated_at AS faculty_updated_at,
      t.thesis_id,
      t.student1_name,
      t.student1_idno,
      t.student2_name,
      t.student2_idno,
      t.student3_name,
      t.student3_idno,
      t.title,
      t.description,
      t.problem_stmt,
      t.objectives,
      t.status,
      t.created_at AS thesis_created_at,
      t.updated_at AS thesis_updated_at
    FROM faculty f
    LEFT JOIN theses t
      ON f.faculty_id = t.faculty_id
    ORDER BY f.full_name ASC, t.created_at DESC
  `);

  return rows;
};

// Create faculty
export const createFaculty = async (data) => {
  const {
    username,
    password,
    email,
    full_name,
    role = "faculty",
    department,
    is_active = true,
  } = data;

  const { rows } = await query(
    `
    INSERT INTO faculty
      (username, password, email, full_name, role, department, is_active)
    VALUES ($1,$2,$3,$4,$5,$6,$7)
    RETURNING *
    `,
    [username, password, email, full_name, role, department, is_active]
  );

  return rows[0];
};

// Update faculty
export const updateFaculty = async (id, data) => {
  const {
    username,
    password,
    email,
    full_name,
    role,
    department,
    is_active,
  } = data;

  const { rowCount } = await query(
    `
    UPDATE faculty SET
      username=$1,
      password=$2,
      email=$3,
      full_name=$4,
      role=$5,
      department=$6,
      is_active=$7,
      updated_at=CURRENT_TIMESTAMP
    WHERE faculty_id=$8
    `,
    [
      username,
      password,
      email,
      full_name,
      role,
      department,
      is_active,
      id,
    ]
  );

  if (rowCount === 0) return null;

  return { message: "Faculty updated successfully" };
};

// Delete faculty
export const deleteFaculty = async (id) => {
  const { rows } = await query(
    `DELETE FROM faculty WHERE faculty_id = $1 RETURNING *`,
    [id]
  );
  return rows[0];
};

/* =========================================================
   🟩 GET THESES BY FACULTY
========================================================= */

export const getThesesByFacultyId = async (facultyId) => {
  const { rows } = await query(
    `
    SELECT *
    FROM theses
    WHERE faculty_id = $1
    ORDER BY created_at DESC
    `,
    [facultyId]
  );
  return rows;
};


/* =========================================================
   🔎 SEARCH
========================================================= */

export const searchFaculty = async (term) => {
  const { rows } = await query(
    `
    SELECT *
    FROM faculty
    WHERE
      full_name ILIKE $1 OR
      email ILIKE $1 OR
      username ILIKE $1 OR
      department ILIKE $1 OR
      role ILIKE $1
    ORDER BY created_at DESC
    `,
    [`%${term}%`]
  );

  return rows;
};

/* =========================================================
   📤 EXPORT FACULTY → EXCEL
========================================================= */

export const exportFacultyExcelService = async () => {
  const { rows } = await query(`
    SELECT username, full_name, email, role, department, is_active, created_at
    FROM faculty
    ORDER BY created_at DESC
  `);

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Faculty");

  sheet.columns = [
    { header: "Username", key: "username", width: 20 },
    { header: "Full Name", key: "full_name", width: 30 },
    { header: "Email", key: "email", width: 30 },
    { header: "Role", key: "role", width: 15 },
    { header: "Department", key: "department", width: 25 },
    { header: "Active", key: "is_active", width: 10 },
    { header: "Created At", key: "created_at", width: 25 },
  ];

  rows.forEach((row) => sheet.addRow(row));

  return workbook.xlsx.writeBuffer();
};

/* =========================================================
   📥 IMPORT FACULTY (Robust, handles 'Status' or 'Active')
========================================================= */

export const importFacultyExcelService = async (buffer) => {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(buffer);

  const sheet = workbook.worksheets[0];
  if (!sheet) throw new Error("No worksheet found");

  // Map headers
  const headerRow = sheet.getRow(1);
  const headers = {};
  headerRow.eachCell((cell, colNumber) => {
    if (cell.value) {
      headers[cell.value.toString().trim().toLowerCase()] = colNumber;
    }
  });

  const required = ["username", "email", "full name"];
  for (const h of required) {
    if (!headers[h]) {
      throw new Error(`Missing required column: ${h}`);
    }
  }

  let successCount = 0;
  let errors = [];

  for (let i = 2; i <= sheet.rowCount; i++) {
    const row = sheet.getRow(i);

    // Skip completely empty rows
    if (!row.hasValues) continue;

    try {
      const username = String(row.getCell(headers["username"])?.value || "").trim();
      const password = String(row.getCell(headers["password"])?.value || "password123").trim();
      const email = String(row.getCell(headers["email"])?.value || "").trim();
      const full_name = String(row.getCell(headers["full name"])?.value || "").trim();
      const role = String(row.getCell(headers["role"])?.value || "faculty").trim();
      const department = String(row.getCell(headers["department"])?.value || "").trim();

      // Accept both "active" and "status"
      const statusCol = headers["active"] || headers["status"];
      const statusRaw = String(row.getCell(statusCol)?.value || "").trim().toLowerCase();

      if (!username || !email || !full_name) {
        throw new Error("Missing required fields");
      }

      if (!["faculty", "admin"].includes(role.toLowerCase())) {
        throw new Error("Invalid role (must be faculty or admin)");
      }

      const is_active = ["active", "true", "1", "yes"].includes(statusRaw);

      await query(
        `
        INSERT INTO faculty
          (username, password, email, full_name, role, department, is_active)
        VALUES ($1,$2,$3,$4,$5,$6,$7)
        ON CONFLICT (username)
        DO UPDATE SET
          password = EXCLUDED.password,
          full_name = EXCLUDED.full_name,
          email = EXCLUDED.email,
          role = EXCLUDED.role,
          department = EXCLUDED.department,
          is_active = EXCLUDED.is_active,
          updated_at = CURRENT_TIMESTAMP
        `,
        [username, password, email, full_name, role, department, is_active]
      );

      successCount++;
    } catch (err) {
      errors.push(`Row ${i}: ${err.message}`);
    }
  }

  return {
    successCount,
    errors,
  };
};