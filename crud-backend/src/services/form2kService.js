import { query } from "../db.js";

export const getAllForm2K = async () => {
  const { rows } = await query(`SELECT * FROM form2k ORDER BY id DESC`);
  return rows;
};

export const getForm2KById = async (id) => {
  const { rows } = await query(`SELECT * FROM form2k WHERE id=$1`, [id]);
  return rows[0];
};

export const getForm2KByStudent = async (student_id) => {
  const { rows } = await query(`SELECT * FROM form2k WHERE student_id=$1 ORDER BY created_at DESC`, [student_id]);
  return rows;
};

export const createForm2K = async (data) => {
  const {
    student_id, faculty_id, thesis_id, author, thesis_title,
    capstone_thesis_adviser_received_by, capstone_thesis_adviser_signature, capstone_thesis_adviser_date,
    ccis_e_library_received_by, ccis_e_library_signature, ccis_e_library_date,
    department_received_by, department_signature, department_date,
    university_library_received_by, university_library_signature, university_library_date,
    file_path
  } = data;

  const { rows } = await query(
    `INSERT INTO form2k (
      student_id, faculty_id, thesis_id, author, thesis_title,
      capstone_thesis_adviser_received_by, capstone_thesis_adviser_signature, capstone_thesis_adviser_date,
      ccis_e_library_received_by, ccis_e_library_signature, ccis_e_library_date,
      department_received_by, department_signature, department_date,
      university_library_received_by, university_library_signature, university_library_date,
      file_path
    ) VALUES (
      $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18
    ) RETURNING *`,
    [
      student_id, faculty_id, thesis_id, author, thesis_title,
      capstone_thesis_adviser_received_by, capstone_thesis_adviser_signature, capstone_thesis_adviser_date,
      ccis_e_library_received_by, ccis_e_library_signature, ccis_e_library_date,
      department_received_by, department_signature, department_date,
      university_library_received_by, university_library_signature, university_library_date,
      file_path
    ]
  );
  return rows[0];
};

export const updateForm2K = async (id, data) => {
  const {
    author, thesis_title,
    capstone_thesis_adviser_received_by, capstone_thesis_adviser_signature, capstone_thesis_adviser_date,
    ccis_e_library_received_by, ccis_e_library_signature, ccis_e_library_date,
    department_received_by, department_signature, department_date,
    university_library_received_by, university_library_signature, university_library_date,
    file_path
  } = data;

  const { rows } = await query(
    `UPDATE form2k
     SET author=$1, thesis_title=$2,
         capstone_thesis_adviser_received_by=$3, capstone_thesis_adviser_signature=$4, capstone_thesis_adviser_date=$5,
         ccis_e_library_received_by=$6, ccis_e_library_signature=$7, ccis_e_library_date=$8,
         department_received_by=$9, department_signature=$10, department_date=$11,
         university_library_received_by=$12, university_library_signature=$13, university_library_date=$14,
         file_path=$15, updated_at=CURRENT_TIMESTAMP
     WHERE id=$16 RETURNING *`,
    [
      author, thesis_title,
      capstone_thesis_adviser_received_by, capstone_thesis_adviser_signature, capstone_thesis_adviser_date,
      ccis_e_library_received_by, ccis_e_library_signature, ccis_e_library_date,
      department_received_by, department_signature, department_date,
      university_library_received_by, university_library_signature, university_library_date,
      file_path, id
    ]
  );
  return rows[0];
};

export const deleteForm2K = async (id) => {
  const { rows } = await query(`DELETE FROM form2k WHERE id=$1 RETURNING *`, [id]);
  return rows[0];
};
