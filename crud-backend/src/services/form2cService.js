// services/form2c.service.js
import { query } from "../db.js";

/* ============================================================
   FORM 2C — Adviser Change Service
   ============================================================ */

// Create new Form 2C request
export const createForm2C = async (data) => {
  const {
    student_id,
    faculty_id,
    thesis_id,
    student_name,
    student_idno,
    degree,
    original_adviser,
    new_adviser,
    reason_for_change,
    effective_date,
    recommending_chairperson,
    approved_by,
    status,
    file_path
  } = data;

  const sql = `
    INSERT INTO form2c (
      student_id, faculty_id, thesis_id, student_name, student_idno, degree,
      original_adviser, new_adviser, reason_for_change, effective_date,
      recommending_chairperson, approved_by, status, file_path, submitted_date
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,CURRENT_DATE)
    RETURNING *;
  `;

  const params = [
    student_id, faculty_id, thesis_id, student_name, student_idno, degree,
    original_adviser, new_adviser, reason_for_change, effective_date,
    recommending_chairperson, approved_by, status, file_path
  ];

  const { rows } = await query(sql, params);
  return rows[0];
};

// Get all Form 2C entries
export const getAllForm2C = async () => {
  const { rows } = await query(`SELECT * FROM form2c ORDER BY request_id DESC`);
  return rows;
};

// Get a Form 2C by request ID
export const getForm2CById = async (request_id) => {
  const { rows } = await query(
    `SELECT * FROM form2c WHERE request_id = $1`,
    [request_id]
  );
  return rows[0];
};

// Get Form 2C by student
export const getForm2CByStudent = async (student_id) => {
  const { rows } = await query(
    `SELECT * FROM form2c WHERE student_id = $1 ORDER BY request_id DESC`,
    [student_id]
  );
  return rows;
};

// Update Form 2C
export const updateForm2C = async (request_id, data) => {
  const {
    new_adviser,
    reason_for_change,
    effective_date,
    recommending_chairperson,
    approved_by,
    status,
    file_path
  } = data;

  const sql = `
    UPDATE form2c SET
      new_adviser = $1,
      reason_for_change = $2,
      effective_date = $3,
      recommending_chairperson = $4,
      approved_by = $5,
      status = $6,
      file_path = $7,
      updated_at = NOW()
    WHERE request_id = $8
    RETURNING *;
  `;

  const params = [
    new_adviser,
    reason_for_change,
    effective_date,
    recommending_chairperson,
    approved_by,
    status,
    file_path,
    request_id
  ];

  const { rows } = await query(sql, params);
  return rows[0];
};

// Delete a Form 2C request
export const deleteForm2C = async (request_id) => {
  const { rows } = await query(
    `DELETE FROM form2c WHERE request_id = $1 RETURNING *`,
    [request_id]
  );
  return rows[0];
};
