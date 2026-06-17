import { query } from "../db.js";

/* ==========================================================
   🟩 BASIC CRUD SERVICES (FORM FILES)
   ========================================================== */

// Get ALL uploaded files (admin / debugging)
export const getAllFormFiles = async () => {
  const { rows } = await query(
    `SELECT * FROM form_files ORDER BY uploaded_at DESC`
  );
  return rows;
};

// Get file by ID
export const getFormFileById = async (id) => {
  const { rows } = await query(
    `SELECT * FROM form_files WHERE id = $1`,
    [id]
  );
  return rows[0];
};

// Create (UPLOAD) form file
export const createFormFile = async (data) => {
  const {
    student_id,
    form_type,
    original_name,
    file_path,
  } = data;

  if (!student_id || !form_type || !file_path) {
    throw new Error("Missing required fields");
  }

  const { rows } = await query(
    `
    INSERT INTO form_files
      (student_id, form_type, original_name, file_path)
    VALUES
      ($1, $2, $3, $4)
    RETURNING *
    `,
    [
      student_id,
      form_type.toLowerCase(),
      original_name,
      file_path,
    ]
  );

  return rows[0];
};

// Delete uploaded file record
export const deleteFormFile = async (id) => {
  const { rows } = await query(
    `DELETE FROM form_files WHERE id = $1 RETURNING *`,
    [id]
  );
  return rows[0];
};

/* ==========================================================
   🟦 FILTERED FETCH SERVICES
   ========================================================== */

// Get uploaded files by STUDENT
export const getFormFilesByStudent = async (student_id) => {
  const { rows } = await query(
    `
    SELECT *
    FROM form_files
    WHERE student_id = $1
    ORDER BY uploaded_at DESC
    `,
    [student_id]
  );

  return rows;
};

// Get uploaded files by STUDENT + FORM TYPE (2a–2k)
export const getFormFilesByStudentAndForm = async (
  student_id,
  form_type
) => {
  const { rows } = await query(
    `
    SELECT *
    FROM form_files
    WHERE student_id = $1
      AND form_type = $2
    ORDER BY uploaded_at DESC
    `,
    [student_id, form_type.toLowerCase()]
  );

  return rows;
};

/* ==========================================================
   🟨 ADVANCED SELECT (PER FORM TYPE)
   ========================================================== */

// Get DISTINCT form types uploaded by a student
export const getUploadedFormTypesByStudent = async (student_id) => {
  const { rows } = await query(
    `
    SELECT DISTINCT form_type
    FROM form_files
    WHERE student_id = $1
    ORDER BY form_type
    `,
    [student_id]
  );

  return rows;
};

// Get uploaded files GROUPED by form type
export const getFormFilesGroupedByFormType = async (student_id) => {
  const { rows } = await query(
    ` 
    SELECT
      form_type,
      json_agg(
        json_build_object(
          'id', id,
          'original_name', original_name,
          'file_path', file_path,
          'uploaded_at', uploaded_at
        )
        ORDER BY uploaded_at DESC
      ) AS files
    FROM form_files
    WHERE student_id = $1
    GROUP BY form_type
    ORDER BY form_type
    `,
    [student_id]
  );

  return rows;
};

// Get LATEST uploaded file per form type
export const getLatestFormFilePerType = async (student_id) => {
  const { rows } = await query(
    `
    SELECT DISTINCT ON (form_type)
      *
    FROM form_files
    WHERE student_id = $1
    ORDER BY form_type, uploaded_at DESC
    `,
    [student_id]
  );

  return rows;
};
