import { query } from "../db.js";

/* =========================================================
   🧑‍🎓 STUDENT QUERIES
   ========================================================= */

// Get all students
export const getStudents = async () => {
  const { rows } = await query(`
    SELECT *
    FROM students
    ORDER BY student_id ASC
  `);
  return rows;
};

// Create a new student
export const createStudent = async (studentData) => {
  const {
    username,
    password,
    email,
    full_name,
    department,
    student_no,
    is_active = true,
  } = studentData;

  const { rows } = await query(
    `INSERT INTO students (
        username, password, email, full_name, department, student_no, is_active
     ) VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [username, password, email, full_name, department, student_no, is_active]
  );

  return rows[0];
};

// Update student
export const updateStudent = async (studentId, studentData) => {
  const {
    username,
    password,
    email,
    full_name,
    department,
    student_no,
    is_active,
  } = studentData;

  const { rows } = await query(
    `UPDATE students SET
        username = $1,
        password = $2,
        email = $3,
        full_name = $4,
        department = $5,
        student_no = $6,
        is_active = $7,
        updated_at = CURRENT_TIMESTAMP
     WHERE student_id = $8
     RETURNING *`,
    [
      username,
      password,
      email,
      full_name,
      department,
      student_no,
      is_active,
      studentId,
    ]
  );

  return rows[0];
};

// Delete student
export const deleteStudent = async (studentId) => {
  const { rowCount } = await query(
    `DELETE FROM students WHERE student_id = $1`,
    [studentId]
  );
  return rowCount > 0;
};

// Search students
export const searchStudents = async (searchTerm) => {
  const { rows } = await query(
    `SELECT *
     FROM students
     WHERE username ILIKE $1
        OR email ILIKE $1
        OR full_name ILIKE $1
        OR department ILIKE $1
        OR student_no ILIKE $1`,
    [`%${searchTerm}%`]
  );
  return rows;
};

// Get single student by ID
export const getStudentById = async (studentId) => {
  const { rows } = await query(
    `SELECT * FROM students WHERE student_id = $1`,
    [studentId]
  );
  return rows[0];
};

// Get single student by username
export const getStudentByUsername = async (username) => {
  const { rows } = await query(
    `SELECT * FROM students WHERE username = $1`,
    [username]
  );
  return rows[0];
};


/* =========================================================
   👨‍🏫 FACULTY QUERIES (Includes Admin)
   ========================================================= */

// Get all faculty (including admin)
export const getFaculty = async () => {
  const { rows } = await query(`
    SELECT *
    FROM faculty
    ORDER BY faculty_id ASC
  `);
  return rows;
};

// Create a new faculty user
export const createFaculty = async (facultyData) => {
  const {
    username,
    password,
    email,
    full_name,
    role, // 'faculty' or 'admin'
    department,
    is_active = true,
  } = facultyData;

  const { rows } = await query(
    `INSERT INTO faculty (
        username, password, email, full_name, role, department, is_active
     ) VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [username, password, email, full_name, role, department, is_active]
  );

  return rows[0];
};

// Update faculty
export const updateFaculty = async (facultyId, facultyData) => {
  const {
    username,
    password,
    email,
    full_name,
    role,
    department,
    is_active,
  } = facultyData;

  const { rows } = await query(
    `UPDATE faculty SET
        username = $1,
        password = $2,
        email = $3,
        full_name = $4,
        role = $5,
        department = $6,
        is_active = $7,
        updated_at = CURRENT_TIMESTAMP
     WHERE faculty_id = $8
     RETURNING *`,
    [
      username,
      password,
      email,
      full_name,
      role,
      department,
      is_active,
      facultyId,
    ]
  );

  return rows[0];
};

// Delete faculty
export const deleteFaculty = async (facultyId) => {
  const { rowCount } = await query(
    `DELETE FROM faculty WHERE faculty_id = $1`,
    [facultyId]
  );
  return rowCount > 0;
};

// Search faculty or admin
export const searchFaculty = async (searchTerm) => {
  const { rows } = await query(
    `SELECT *
     FROM faculty
     WHERE username ILIKE $1
        OR email ILIKE $1
        OR full_name ILIKE $1
        OR role ILIKE $1
        OR department ILIKE $1`,
    [`%${searchTerm}%`]
  );
  return rows;
};

// Get faculty by ID
export const getFacultyById = async (facultyId) => {
  const { rows } = await query(
    `SELECT * FROM faculty WHERE faculty_id = $1`,
    [facultyId]
  );
  return rows[0]; // returns single faculty object or undefined if not found
};

// Get faculty by username
export const getFacultyByUsername = async (username) => {
  const { rows } = await query(
    `SELECT * FROM faculty WHERE username = $1`,
    [username]
  );
  return rows[0];
};

// Login User (Student, Faculty, or Admin)
export const loginUser = async (username, password) => {
  // Check admin
  let { rows } = await query(`SELECT * FROM faculty WHERE username = $1 AND role = 'admin'`, [username]);
  if (rows.length > 0 && rows[0].password === password) {
    return { ...rows[0], role: "admin" };
  }

  // Check faculty
  ({ rows } = await query(`SELECT * FROM faculty WHERE username = $1 AND role = 'faculty'`, [username]));
  if (rows.length > 0 && rows[0].password === password) {
    return { ...rows[0], role: "faculty" };
  }

  // Check student
  ({ rows } = await query(`SELECT * FROM students WHERE username = $1`, [username]));
  if (rows.length > 0 && rows[0].password === password) {
    return { ...rows[0], role: "student" };
  }

  // No match
  return null;
};

export const getAdviseeTheses = async (facultyId) => {
  const { rows } = await query(
    `SELECT *
     FROM theses
     WHERE faculty_id = $1
     ORDER BY created_at DESC`,
    [facultyId]
  );
  return rows;
};

/* =========================================================
   🎓 Get All Advisers (Faculty only)
   ========================================================= */
export const getAllAdvisers = async () => {
  const { rows } = await query(`
    SELECT
      faculty_id,
      full_name,
      email,
      department
    FROM faculty
    WHERE role = 'faculty'
    ORDER BY full_name ASC
  `);
  return rows;
};
