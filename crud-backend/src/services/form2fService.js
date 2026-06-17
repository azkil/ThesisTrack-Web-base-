import { query } from "../db.js";

export const getAllForm2F = async () => {
  const { rows } = await query(`SELECT * FROM form2f ORDER BY id DESC`);
  return rows;
};

export const getForm2FById = async (id) => {
  const { rows } = await query(`SELECT * FROM form2f WHERE id=$1`, [id]);
  return rows[0];
};

export const getForm2FByStudent = async (student_id) => {
  const { rows } = await query(`SELECT * FROM form2f WHERE student_id=$1 ORDER BY created_at DESC`, [student_id]);
  return rows;
};

export const createForm2F = async (data) => {
  const {
    student_id, faculty_id, thesis_id, exam_type, capstone_thesis_title, proponents, department,
    defense_date, adviser, panel_member_1, panel_member_2, chair_of_panel,
    comment_1, previous_draft_comment_1, revision_made_1, page_reflected_1,
    comment_2, previous_draft_comment_2, revision_made_2, page_reflected_2,
    comment_3, previous_draft_comment_3, revision_made_3, page_reflected_3,
    reviewed_by, approved_by, file_path
  } = data;

  const { rows } = await query(
    `INSERT INTO form2f (
      student_id, faculty_id, thesis_id, exam_type, capstone_thesis_title, proponents, department,
      defense_date, adviser, panel_member_1, panel_member_2, chair_of_panel,
      comment_1, previous_draft_comment_1, revision_made_1, page_reflected_1,
      comment_2, previous_draft_comment_2, revision_made_2, page_reflected_2,
      comment_3, previous_draft_comment_3, revision_made_3, page_reflected_3,
      reviewed_by, approved_by, file_path
    ) VALUES (
      $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27
    ) RETURNING *`,
    [
      student_id, faculty_id, thesis_id, exam_type, capstone_thesis_title, proponents, department,
      defense_date, adviser, panel_member_1, panel_member_2, chair_of_panel,
      comment_1, previous_draft_comment_1, revision_made_1, page_reflected_1,
      comment_2, previous_draft_comment_2, revision_made_2, page_reflected_2,
      comment_3, previous_draft_comment_3, revision_made_3, page_reflected_3,
      reviewed_by, approved_by, file_path
    ]
  );
  return rows[0];
};

export const updateForm2F = async (id, data) => {
  const {
    exam_type, capstone_thesis_title, proponents, department, defense_date, adviser,
    panel_member_1, panel_member_2, chair_of_panel,
    comment_1, previous_draft_comment_1, revision_made_1, page_reflected_1,
    comment_2, previous_draft_comment_2, revision_made_2, page_reflected_2,
    comment_3, previous_draft_comment_3, revision_made_3, page_reflected_3,
    reviewed_by, approved_by, file_path
  } = data;

  const { rows } = await query(
    `UPDATE form2f
     SET exam_type=$1, capstone_thesis_title=$2, proponents=$3, department=$4, defense_date=$5, adviser=$6,
         panel_member_1=$7, panel_member_2=$8, chair_of_panel=$9,
         comment_1=$10, previous_draft_comment_1=$11, revision_made_1=$12, page_reflected_1=$13,
         comment_2=$14, previous_draft_comment_2=$15, revision_made_2=$16, page_reflected_2=$17,
         comment_3=$18, previous_draft_comment_3=$19, revision_made_3=$20, page_reflected_3=$21,
         reviewed_by=$22, approved_by=$23, file_path=$24, updated_at=CURRENT_TIMESTAMP
     WHERE id=$25 RETURNING *`,
    [
      exam_type, capstone_thesis_title, proponents, department, defense_date, adviser,
      panel_member_1, panel_member_2, chair_of_panel,
      comment_1, previous_draft_comment_1, revision_made_1, page_reflected_1,
      comment_2, previous_draft_comment_2, revision_made_2, page_reflected_2,
      comment_3, previous_draft_comment_3, revision_made_3, page_reflected_3,
      reviewed_by, approved_by, file_path, id
    ]
  );
  return rows[0];
};

export const deleteForm2F = async (id) => {
  const { rows } = await query(`DELETE FROM form2f WHERE id=$1 RETURNING *`, [id]);
  return rows[0];
};
