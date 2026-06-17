import { query } from "../db.js";

export const getAllForm2D = async () => {
  const { rows } = await query(`SELECT * FROM form2d ORDER BY id DESC`);
  return rows;
};

export const getForm2DById = async (id) => {
  const { rows } = await query(`SELECT * FROM form2d WHERE id=$1`, [id]);
  return rows[0];
};

export const getForm2DByStudent = async (student_id) => {
  const { rows } = await query(`SELECT * FROM form2d WHERE student_id=$1 ORDER BY created_at DESC`, [student_id]);
  return rows;
};

export const createForm2D = async (data) => {
  const {
    student_id, faculty_id, thesis_id, document_type, date, dean_name, department,
    panel_member_statement, panel_member_signature, oral_exam_panel,
    noted_by, department_chair, recommending_approval, approved_by, file_path
  } = data;

  const { rows } = await query(
    `INSERT INTO form2d (
      student_id, faculty_id, thesis_id, document_type, date, dean_name, department,
      panel_member_statement, panel_member_signature, oral_exam_panel,
      noted_by, department_chair, recommending_approval, approved_by, file_path
    ) VALUES (
      $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15
    ) RETURNING *`,
    [
      student_id, faculty_id, thesis_id, document_type, date, dean_name, department,
      panel_member_statement, panel_member_signature, oral_exam_panel,
      noted_by, department_chair, recommending_approval, approved_by, file_path
    ]
  );
  return rows[0];
};

export const updateForm2D = async (id, data) => {
  const {
    document_type, date, dean_name, department, panel_member_statement,
    panel_member_signature, oral_exam_panel, noted_by, department_chair,
    recommending_approval, approved_by, file_path
  } = data;

  const { rows } = await query(
    `UPDATE form2d
     SET document_type=$1, date=$2, dean_name=$3, department=$4,
         panel_member_statement=$5, panel_member_signature=$6, oral_exam_panel=$7,
         noted_by=$8, department_chair=$9, recommending_approval=$10,
         approved_by=$11, file_path=$12, updated_at=CURRENT_TIMESTAMP
     WHERE id=$13
     RETURNING *`,
    [
      document_type, date, dean_name, department, panel_member_statement,
      panel_member_signature, oral_exam_panel, noted_by, department_chair,
      recommending_approval, approved_by, file_path, id
    ]
  );
  return rows[0];
};

export const deleteForm2D = async (id) => {
  const { rows } = await query(`DELETE FROM form2d WHERE id=$1 RETURNING *`, [id]);
  return rows[0];
};

export const updateForm2DStatus = async (id, status) => {
  const { rows } = await query(`UPDATE form2d SET status=$1, updated_at=CURRENT_TIMESTAMP WHERE id=$2 RETURNING *`, [status, id]);
  return rows[0];
};
