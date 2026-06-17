import { query } from "../db.js";

export const getAllForm2H = async () => {
  const { rows } = await query(`SELECT * FROM form2h ORDER BY id DESC`);
  return rows;
};

export const getForm2HById = async (id) => {
  const { rows } = await query(`SELECT * FROM form2h WHERE id=$1`, [id]);
  return rows[0];
};

export const getForm2HByStudent = async (student_id) => {
  const { rows } = await query(`SELECT * FROM form2h WHERE student_id=$1 ORDER BY created_at DESC`, [student_id]);
  return rows;
};

export const createForm2H = async (data) => {
  const {
    student_id, faculty_id, thesis_id, exam_type, name_of_student, capstone_thesis_title,
    date, panel_member_1, final_rating_1, signature_1,
    panel_member_2, final_rating_2, signature_2,
    panel_member_3, final_rating_3, signature_3,
    average_rating, description, prepared_by, concurred_by, file_path
  } = data;

  const { rows } = await query(
    `INSERT INTO form2h (
      student_id, faculty_id, thesis_id, exam_type, name_of_student, capstone_thesis_title,
      date, panel_member_1, final_rating_1, signature_1,
      panel_member_2, final_rating_2, signature_2,
      panel_member_3, final_rating_3, signature_3,
      average_rating, description, prepared_by, concurred_by, file_path
    ) VALUES (
      $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21
    ) RETURNING *`,
    [
      student_id, faculty_id, thesis_id, exam_type, name_of_student, capstone_thesis_title,
      date, panel_member_1, final_rating_1, signature_1,
      panel_member_2, final_rating_2, signature_2,
      panel_member_3, final_rating_3, signature_3,
      average_rating, description, prepared_by, concurred_by, file_path
    ]
  );
  return rows[0];
};

export const updateForm2H = async (id, data) => {
  const {
    exam_type, name_of_student, capstone_thesis_title,
    date, panel_member_1, final_rating_1, signature_1,
    panel_member_2, final_rating_2, signature_2,
    panel_member_3, final_rating_3, signature_3,
    average_rating, description, prepared_by, concurred_by, file_path
  } = data;

  const { rows } = await query(
    `UPDATE form2h
     SET exam_type=$1, name_of_student=$2, capstone_thesis_title=$3,
         date=$4, panel_member_1=$5, final_rating_1=$6, signature_1=$7,
         panel_member_2=$8, final_rating_2=$9, signature_2=$10,
         panel_member_3=$11, final_rating_3=$12, signature_3=$13,
         average_rating=$14, description=$15, prepared_by=$16, concurred_by=$17,
         file_path=$18, updated_at=CURRENT_TIMESTAMP
     WHERE id=$19 RETURNING *`,
    [
      exam_type, name_of_student, capstone_thesis_title,
      date, panel_member_1, final_rating_1, signature_1,
      panel_member_2, final_rating_2, signature_2,
      panel_member_3, final_rating_3, signature_3,
      average_rating, description, prepared_by, concurred_by,
      file_path, id
    ]
  );
  return rows[0];
};

export const deleteForm2H = async (id) => {
  const { rows } = await query(`DELETE FROM form2h WHERE id=$1 RETURNING *`, [id]);
  return rows[0];
};
