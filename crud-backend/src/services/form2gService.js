import { query } from "../db.js";

export const getAllForm2G = async () => {
  const { rows } = await query(`SELECT * FROM form2g ORDER BY id DESC`);
  return rows;
};

export const getForm2GById = async (id) => {
  const { rows } = await query(`SELECT * FROM form2g WHERE id=$1`, [id]);
  return rows[0];
};

export const getForm2GByStudent = async (student_id) => {
  const { rows } = await query(`SELECT * FROM form2g WHERE student_id=$1 ORDER BY created_at DESC`, [student_id]);
  return rows;
};

export const createForm2G = async (data) => {
  const {
    student_id, faculty_id, thesis_id, exam_type, name_of_student, capstone_thesis_title, date,
    paper_content_rating, paper_content_weight, mastery_subject_rating, mastery_subject_weight,
    presentation_rating, presentation_weight, receptiveness_rating, receptiveness_weight,
    final_rating, description, rated_by, file_path
  } = data;

  const { rows } = await query(
    `INSERT INTO form2g (
      student_id, faculty_id, thesis_id, exam_type, name_of_student, capstone_thesis_title, date,
      paper_content_rating, paper_content_weight, mastery_subject_rating, mastery_subject_weight,
      presentation_rating, presentation_weight, receptiveness_rating, receptiveness_weight,
      final_rating, description, rated_by, file_path
    ) VALUES (
      $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19
    ) RETURNING *`,
    [
      student_id, faculty_id, thesis_id, exam_type, name_of_student, capstone_thesis_title, date,
      paper_content_rating, paper_content_weight, mastery_subject_rating, mastery_subject_weight,
      presentation_rating, presentation_weight, receptiveness_rating, receptiveness_weight,
      final_rating, description, rated_by, file_path
    ]
  );
  return rows[0];
};

export const updateForm2G = async (id, data) => {
  const {
    exam_type, name_of_student, capstone_thesis_title, date,
    paper_content_rating, paper_content_weight, mastery_subject_rating, mastery_subject_weight,
    presentation_rating, presentation_weight, receptiveness_rating, receptiveness_weight,
    final_rating, description, rated_by, file_path
  } = data;

  const { rows } = await query(
    `UPDATE form2g
     SET exam_type=$1, name_of_student=$2, capstone_thesis_title=$3, date=$4,
         paper_content_rating=$5, paper_content_weight=$6, mastery_subject_rating=$7, mastery_subject_weight=$8,
         presentation_rating=$9, presentation_weight=$10, receptiveness_rating=$11, receptiveness_weight=$12,
         final_rating=$13, description=$14, rated_by=$15, file_path=$16, updated_at=CURRENT_TIMESTAMP
     WHERE id=$17 RETURNING *`,
    [
      exam_type, name_of_student, capstone_thesis_title, date,
      paper_content_rating, paper_content_weight, mastery_subject_rating, mastery_subject_weight,
      presentation_rating, presentation_weight, receptiveness_rating, receptiveness_weight,
      final_rating, description, rated_by, file_path, id
    ]
  );
  return rows[0];
};

export const deleteForm2G = async (id) => {
  const { rows } = await query(`DELETE FROM form2g WHERE id=$1 RETURNING *`, [id]);
  return rows[0];
};
