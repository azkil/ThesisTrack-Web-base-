import { query } from "../db.js";

export const getAllForm2I = async () => {
  const { rows } = await query(`SELECT * FROM form2i ORDER BY id DESC`);
  return rows;
};

export const getForm2IById = async (id) => {
  const { rows } = await query(`SELECT * FROM form2i WHERE id=$1`, [id]);
  return rows[0];
};

export const getForm2IByStudent = async (student_id) => {
  const { rows } = await query(`SELECT * FROM form2i WHERE student_id=$1 ORDER BY created_at DESC`, [student_id]);
  return rows;
};

export const createForm2I = async (data) => {
  const {
    student_id, faculty_id, thesis_id, exam_type, name_of_student, capstone_thesis_title,
    date_of_examination, mean_rating, passed_without_modification, passed_with_suggestions,
    failed, failure_reasons, remarks, panel_member_1, signature_1,
    panel_member_2, signature_2, chairperson, signature_3, noted_by, department, file_path
  } = data;

  const { rows } = await query(
    `INSERT INTO form2i (
      student_id, faculty_id, thesis_id, exam_type, name_of_student, capstone_thesis_title,
      date_of_examination, mean_rating, passed_without_modification, passed_with_suggestions,
      failed, failure_reasons, remarks, panel_member_1, signature_1,
      panel_member_2, signature_2, chairperson, signature_3, noted_by, department, file_path
    ) VALUES (
      $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22
    ) RETURNING *`,
    [
      student_id, faculty_id, thesis_id, exam_type, name_of_student, capstone_thesis_title,
      date_of_examination, mean_rating, passed_without_modification, passed_with_suggestions,
      failed, failure_reasons, remarks, panel_member_1, signature_1,
      panel_member_2, signature_2, chairperson, signature_3, noted_by, department, file_path
    ]
  );
  return rows[0];
};

export const updateForm2I = async (id, data) => {
  const {
    exam_type, name_of_student, capstone_thesis_title, date_of_examination, mean_rating,
    passed_without_modification, passed_with_suggestions, failed, failure_reasons, remarks,
    panel_member_1, signature_1, panel_member_2, signature_2, chairperson, signature_3,
    noted_by, department, file_path
  } = data;

  const { rows } = await query(
    `UPDATE form2i
     SET exam_type=$1, name_of_student=$2, capstone_thesis_title=$3, date_of_examination=$4,
         mean_rating=$5, passed_without_modification=$6, passed_with_suggestions=$7, failed=$8,
         failure_reasons=$9, remarks=$10, panel_member_1=$11, signature_1=$12,
         panel_member_2=$13, signature_2=$14, chairperson=$15, signature_3=$16,
         noted_by=$17, department=$18, file_path=$19, updated_at=CURRENT_TIMESTAMP
     WHERE id=$20 RETURNING *`,
    [
      exam_type, name_of_student, capstone_thesis_title, date_of_examination, mean_rating,
      passed_without_modification, passed_with_suggestions, failed, failure_reasons, remarks,
      panel_member_1, signature_1, panel_member_2, signature_2, chairperson, signature_3,
      noted_by, department, file_path, id
    ]
  );
  return rows[0];
};

export const deleteForm2I = async (id) => {
  const { rows } = await query(`DELETE FROM form2i WHERE id=$1 RETURNING *`, [id]);
  return rows[0];
};
