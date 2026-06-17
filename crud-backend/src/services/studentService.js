import ExcelJS from "exceljs";
import { query } from "../db.js";

/* =========================================================
   🧑‍🎓 STUDENT CRUD
   ========================================================= */

export const getStudents = async () => {
  const { rows } = await query(
    `SELECT * FROM students ORDER BY student_id ASC`
  );
  return rows;
};

export const getStudentById = async (id) => {
  const { rows } = await query(
    `SELECT * FROM students WHERE student_id = $1`,
    [id]
  );
  return rows[0];
};

// Create a new student (without hashing)
export const createStudent = async (data) => {
  const {
    username,
    password, // ⚠ plain text!
    email,
    full_name,
    department,
    student_no,
    is_active = true,
  } = data;

  const { rows } = await query(
    `
    INSERT INTO students
      (username, password, email, full_name, department, student_no, is_active)
    VALUES ($1,$2,$3,$4,$5,$6,$7)
    RETURNING *
    `,
    [username, password, email, full_name, department, student_no, is_active]
  );

  return rows[0];
};

export const updateStudent = async (id, data) => {
  const {
    username,
    password,
    email,
    full_name,
    department,
    student_no,
    is_active,
  } = data;

  const { rows } = await query(
    `
    UPDATE students SET
      username=$1,
      password=$2,
      email=$3,
      full_name=$4,
      department=$5,
      student_no=$6,
      is_active=$7,
      updated_at=CURRENT_TIMESTAMP
    WHERE student_id=$8
    RETURNING *
    `,
    [
      username,
      password,
      email,
      full_name,
      department,
      student_no,
      is_active,
      id,
    ]
  );

  return rows[0];
};


export const deleteStudent = async (id) => {
  const { rowCount } = await query(
    `DELETE FROM students WHERE student_id = $1`,
    [id]
  );
  return rowCount > 0;
};

export const searchStudents = async (term) => {
  const { rows } = await query(
    `
    SELECT *
    FROM students
    WHERE
      full_name ILIKE $1 OR
      email ILIKE $1 OR
      student_no ILIKE $1 OR
      department ILIKE $1 OR
      username ILIKE $1
    ORDER BY created_at DESC
    `,
    [`%${term}%`]
  );

  return rows;
};

export const filterStudentsByYear = async (year) => {
  const { rows } = await query(
    `
    SELECT *
    FROM students
    WHERE EXTRACT(YEAR FROM created_at) = $1
    ORDER BY created_at DESC
    `,
    [year]
  );

  return rows;
};

/* =========================================================
   📤 EXPORT TO EXCEL
   ========================================================= */

export const exportStudentsExcelService = async () => {
  const { rows } = await query(`
    SELECT student_no, full_name, email, department, is_active
    FROM students
    ORDER BY student_no ASC
  `);

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Students");

  sheet.columns = [
    { header: "Student No", key: "student_no", width: 20 },
    { header: "Full Name", key: "full_name", width: 30 },
    { header: "Email", key: "email", width: 30 },
    { header: "Department", key: "department", width: 25 },
    { header: "Active", key: "is_active", width: 10 },
  ];

  rows.forEach((r) => sheet.addRow(r));

  return workbook.xlsx.writeBuffer();
};

/* =========================================================
   📥 IMPORT FROM EXCEL (HEADER-SAFE)
   ========================================================= */

export const importStudentsExcelService = async (buffer) => {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(buffer);

  const sheet = workbook.worksheets[0];
  if (!sheet) throw new Error("No worksheet found");

  // 🔹 Map headers → column index
  const headerRow = sheet.getRow(1);
  const headers = {};

  headerRow.eachCell((cell, colNumber) => {
    if (cell.value) {
      headers[cell.value.toString().trim().toLowerCase()] = colNumber;
    }
  });

  // 🔹 Required headers
  const required = ["student no", "full name", "email", "department"];
  for (const h of required) {
    if (!headers[h]) {
      throw new Error(`Missing required column: ${h}`);
    }
  }

  let count = 0;

  for (let i = 2; i <= sheet.rowCount; i++) {
    const row = sheet.getRow(i);

    const student_no = String(
      row.getCell(headers["student no"]).value || ""
    ).trim();

    const full_name = String(
      row.getCell(headers["full name"]).value || ""
    ).trim();

    const email = String(
      row.getCell(headers["email"]).value || ""
    ).trim();

    const department = String(
      row.getCell(headers["department"]).value || ""
    ).trim();

    // Skip empty rows
    if (!student_no || !email) continue;

    await query(
      `
      INSERT INTO students
        (student_no, full_name, email, department, username, password, is_active)
      VALUES ($1,$2,$3,$4,$5,$6,TRUE)
      ON CONFLICT (student_no)
      DO UPDATE SET
        full_name = EXCLUDED.full_name,
        email = EXCLUDED.email,
        department = EXCLUDED.department,
        updated_at = CURRENT_TIMESTAMP
      `,
      [
        student_no,
        full_name,
        email,
        department,
        student_no.toLowerCase(),
        "password123", // TODO: hash later
      ]
    );

    count++;
  }

  return count;
};
