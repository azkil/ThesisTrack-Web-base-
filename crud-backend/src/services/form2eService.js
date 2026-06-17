import { query } from "../db.js";

export const getAllForm2E = async () => {
  const { rows } = await query(`SELECT * FROM form2e ORDER BY id DESC`);
  return rows;
};

export const getForm2EById = async (id) => {
  const { rows } = await query(`SELECT * FROM form2e WHERE id=$1`, [id]);
  return rows[0];
};

export const getForm2EByStudent = async (student_id) => {
  const { rows } = await query(`SELECT * FROM form2e WHERE student_id=$1 ORDER BY created_at DESC`, [student_id]);
  return rows;
};

export const createForm2E = async (data) => {
  const {
    student_id, faculty_id, thesis_id, exam_type, capstone_thesis_title, proponents,
    department, defense_date, adviser, comment_1, page_reflected_1, comment_2,
    page_reflected_2, comment_3, page_reflected_3, prepared_by, conformed_by, file_path
  } = data;

  const { rows } = await query(
    `INSERT INTO form2e (
      student_id, faculty_id, thesis_id, exam_type, capstone_thesis_title, proponents,
      department, defense_date, adviser, comment_1, page_reflected_1, comment_2,
      page_reflected_2, comment_3, page_reflected_3, prepared_by, conformed_by, file_path
    ) VALUES (
      $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18
    ) RETURNING *`,
    [
      student_id, faculty_id, thesis_id, exam_type, capstone_thesis_title, proponents,
      department, defense_date, adviser, comment_1, page_reflected_1, comment_2,
      page_reflected_2, comment_3, page_reflected_3, prepared_by, conformed_by, file_path
    ]
  );
  return rows[0];
};

export const updateForm2E = async (id, data) => {
  const {
    exam_type, capstone_thesis_title, proponents, department, defense_date, adviser,
    comment_1, page_reflected_1, comment_2, page_reflected_2, comment_3, page_reflected_3,
    prepared_by, conformed_by, file_path
  } = data;

  const { rows } = await query(
    `UPDATE form2e
     SET exam_type=$1, capstone_thesis_title=$2, proponents=$3, department=$4, defense_date=$5,
         adviser=$6, comment_1=$7, page_reflected_1=$8, comment_2=$9, page_reflected_2=$10,
         comment_3=$11, page_reflected_3=$12, prepared_by=$13, conformed_by=$14, file_path=$15,
         updated_at=CURRENT_TIMESTAMP
     WHERE id=$16 RETURNING *`,
    [
      exam_type, capstone_thesis_title, proponents, department, defense_date,
      adviser, comment_1, page_reflected_1, comment_2, page_reflected_2,
      comment_3, page_reflected_3, prepared_by, conformed_by, file_path, id
    ]
  );
  return rows[0];
};

export const deleteForm2E = async (id) => {
  const { rows } = await query(`DELETE FROM form2e WHERE id=$1 RETURNING *`, [id]);
  return rows[0];
};
