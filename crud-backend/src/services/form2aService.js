import { query } from "../db.js";

/* ==========================================================
   🟩 BASIC CRUD SERVICES
   ========================================================== */

// Get all Form 2A
export const getAllForm2A = async () => {
  const { rows } = await query(`SELECT * FROM form2a ORDER BY id DESC`);
  return rows;
};

// Get Form 2A by ID
export const getForm2AById = async (id) => {
  const { rows } = await query(`SELECT * FROM form2a WHERE id = $1`, [id]);
  return rows[0];
};
/* ==========================================================
   🟩 CREATE NEW FORM 2A
========================================================== */
export const createForm2A = async (data) => {
  const {
    thesis_id,
    student_id,
    faculty_id,
    faculty_name,
    student_name,
    project_title,
    semester,
    academic_year,
    department,
    recommending_approval_name,
    associate_dean_name,
    approved_by,
    dean_name,
    date,
    status,
  } = data;

  if (!thesis_id || !student_id || !faculty_id) {
    throw new Error(
      "Missing required fields: thesis_id, student_id, or faculty_id"
    );
  }

  const { rows } = await query(
    `INSERT INTO form2a (
      thesis_id, student_id, faculty_id, faculty_name,
      student_name, project_title, semester, academic_year, department,
      recommending_approval_name,
      associate_dean_name, approved_by, dean_name,
      date, status
    ) VALUES (
      $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15
    )
    RETURNING *`,
    [
      thesis_id,
      student_id,
      faculty_id,
      faculty_name,
      student_name,
      project_title,
      semester,
      academic_year,
      department,
      recommending_approval_name,
      associate_dean_name,
      approved_by,
      dean_name,
      date,
      status || "Acceptance waiting to adviser",
    ]
  );

  return rows[0];
};

/* ==========================================================
   🟩 UPDATE FORM 2A
========================================================== */
export const updateForm2A = async (id, data) => {
  const {
    faculty_id,
    faculty_name,
    student_name,
    project_title,
    semester,
    academic_year,
    department,
    recommending_approval_name,
    associate_dean_name,
    approved_by,
    dean_name,
    date,
    status,
  } = data;

  const { rows } = await query(
    `UPDATE form2a
     SET faculty_id=$1, faculty_name=$2, student_name=$3, project_title=$4,
         semester=$5, academic_year=$6, department=$7,
         recommending_approval_name=$8, associate_dean_name=$9,
         approved_by=$10, dean_name=$11, date=$12, status=$13,
         updated_at=CURRENT_TIMESTAMP
     WHERE id=$14
     RETURNING *`,
    [
      faculty_id,
      faculty_name,
      student_name,
      project_title,
      semester,
      academic_year,
      department,
      recommending_approval_name,
      associate_dean_name,
      approved_by,
      dean_name,
      date,
      status,
      id,
    ]
  );

  return rows[0];
};

// Delete Form 2A
export const deleteForm2A = async (id) => {
  const { rows } = await query(`DELETE FROM form2a WHERE id=$1 RETURNING *`, [
    id,
  ]);
  return rows[0];
};

/* ==========================================================
   🟦 FILTERED FETCH SERVICES
   ========================================================== */

// Get latest Form 2A by student
export const getForm2AByStudent = async (student_id) => {
  const { rows } = await query(
    `SELECT * FROM form2a WHERE student_id=$1 ORDER BY created_at DESC LIMIT 1`,
    [student_id]
  );
  return rows[0];
};

// Get all Form 2A assigned to a faculty
export const getForm2AByFaculty = async (faculty_id) => {
  const { rows } = await query(
    `SELECT * FROM form2a WHERE faculty_id=$1 ORDER BY created_at DESC`,
    [faculty_id]
  );
  return rows;
};
