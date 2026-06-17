import { query } from "../db.js";

export const getAllForm2J = async () => {
  const { rows } = await query(`SELECT * FROM form2j ORDER BY id DESC`);
  return rows;
};

export const getForm2JById = async (id) => {
  const { rows } = await query(`SELECT * FROM form2j WHERE id=$1`, [id]);
  return rows[0];
};

export const getForm2JByStudent = async (student_id) => {
  const { rows } = await query(`SELECT * FROM form2j WHERE student_id=$1 ORDER BY created_at DESC`, [student_id]);
  return rows;
};

export const createForm2J = async (data) => {
  const {
    student_id, faculty_id, thesis_id, name_of_student, capstone_thesis_title,
    date_of_final_defense, adviser, chair_of_panel, signature_chair,
    panel_member_1, signature_1, panel_member_2, signature_2,
    oral_exam_secretary, signature_secretary, recommending_approval, recommending_dept,
    approved_by, file_path
  } = data;

  const { rows } = await query(
    `INSERT INTO form2j (
      student_id, faculty_id, thesis_id, name_of_student, capstone_thesis_title,
      date_of_final_defense, adviser, chair_of_panel, signature_chair,
      panel_member_1, signature_1, panel_member_2, signature_2,
      oral_exam_secretary, signature_secretary, recommending_approval, recommending_dept,
      approved_by, file_path
    ) VALUES (
      $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19
    ) RETURNING *`,
    [
      student_id, faculty_id, thesis_id, name_of_student, capstone_thesis_title,
      date_of_final_defense, adviser, chair_of_panel, signature_chair,
      panel_member_1, signature_1, panel_member_2, signature_2,
      oral_exam_secretary, signature_secretary, recommending_approval, recommending_dept,
      approved_by, file_path
    ]
  );
  return rows[0];
};

export const updateForm2J = async (id, data) => {
  const {
    name_of_student, capstone_thesis_title,
    date_of_final_defense, adviser, chair_of_panel, signature_chair,
    panel_member_1, signature_1, panel_member_2, signature_2,
    oral_exam_secretary, signature_secretary, recommending_approval, recommending_dept,
    approved_by, file_path
  } = data;

  const { rows } = await query(
    `UPDATE form2j
     SET name_of_student=$1, capstone_thesis_title=$2,
         date_of_final_defense=$3, adviser=$4, chair_of_panel=$5, signature_chair=$6,
         panel_member_1=$7, signature_1=$8, panel_member_2=$9, signature_2=$10,
         oral_exam_secretary=$11, signature_secretary=$12, recommending_approval=$13,
         recommending_dept=$14, approved_by=$15, file_path=$16, updated_at=CURRENT_TIMESTAMP
     WHERE id=$17 RETURNING *`,
    [
      name_of_student, capstone_thesis_title,
      date_of_final_defense, adviser, chair_of_panel, signature_chair,
      panel_member_1, signature_1, panel_member_2, signature_2,
      oral_exam_secretary, signature_secretary, recommending_approval, recommending_dept,
      approved_by, file_path, id
    ]
  );
  return rows[0];
};

export const deleteForm2J = async (id) => {
  const { rows } = await query(`DELETE FROM form2j WHERE id=$1 RETURNING *`, [id]);
  return rows[0];
};
