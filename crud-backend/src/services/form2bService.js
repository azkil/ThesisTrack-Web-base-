import { query } from "../db.js";



/* ==========================================================
   🟩 BASIC CRUD SERVICES
   ========================================================== */

// Get all Form 2B
export const getAllForm2B = async () => {
  const { rows } = await query(`SELECT * FROM form2b ORDER BY id DESC`);
  return rows;
};

// Get ALL Form 2B where faculty is part of panel
export const getForm2BByPanelFaculty = async (faculty_id) => {
  const { rows } = await query(
    `
    SELECT 
    -- 📘 Form2B Info
    f2b.id AS form2b_id,
    f2b.student_id,
    f2b.faculty_id,
    f2b.thesis_id,
    f2b.defense_type,
    f2b.capstone_thesis_title,
    f2b.proponent_name,
    f2b.department,
    f2b.defense_date,
    f2b.status AS form_status,
    f2b.file_path,
    f2b.created_at,
    f2b.updated_at,

    -- 📚 Thesis Info
    t.title AS thesis_title,
    t.description,
    t.problem_stmt,
    t.objectives,
    t.status AS thesis_status,
    t.school_year,
    t.semester,

    -- 👥 Thesis Members
    t.student1_name,
    t.student1_idno,
    t.student2_name,
    t.student2_idno,
    t.student3_name,
    t.student3_idno,

    -- 👩‍🏫 Adviser
    t.adviser_name,
    adv.faculty_id AS adviser_faculty_id,

    -- 🧑‍⚖️ Chairperson
    cp.faculty_id AS chairperson_faculty_id,
    f2b.chairperson_name,

    -- 👥 Panel Member 1
    m1.faculty_id AS member1_faculty_id,
    f2b.member1_name,

    -- 👥 Panel Member 2
    m2.faculty_id AS member2_faculty_id,
    f2b.member2_name,

    -- 📝 Secretary
    sec.faculty_id AS secretary_faculty_id,
    f2b.secretary_name,

    -- 🆔 Extra IDs
    f2b.adviser_id,
    f2b.chairperson_id,
    f2b.member1_id,
    f2b.member2_id,
    f2b.secretary_id,

    -- 📝 Extra Form Info
    f2b.approved_by,
    f2b.posted_by,
    f2b.chairperson_department_name

FROM form2b f2b

JOIN theses t 
    ON f2b.thesis_id = t.thesis_id

LEFT JOIN faculty adv 
    ON f2b.adviser_id = adv.faculty_id

LEFT JOIN faculty cp 
    ON f2b.chairperson_id = cp.faculty_id

LEFT JOIN faculty m1 
    ON f2b.member1_id = m1.faculty_id

LEFT JOIN faculty m2 
    ON f2b.member2_id = m2.faculty_id

LEFT JOIN faculty sec 
    ON f2b.secretary_id = sec.faculty_id

WHERE $1 IN (
    f2b.chairperson_id,
    f2b.member1_id,
    f2b.member2_id,
    f2b.secretary_id
)



    ORDER BY f2b.created_at DESC
    `,
    [faculty_id]
  );

  return rows;
};

// Get Form 2B by ID
export const getForm2BById = async (id) => {
  const { rows } = await query(`SELECT * FROM form2b WHERE id = $1`, [id]);
  return rows[0];
};

// Create new Form 2B
export const createForm2B = async (data) => {
  const {
    student_id,
    thesis_id,
    faculty_id,
    defense_type,
    capstone_thesis_title,
    proponent_name,
    department,
    defense_date,

    adviser_id,
    adviser_name,
    chairperson_id,
    chairperson_name,
    member1_id,
    member1_name,
    member2_id,
    member2_name,
    secretary_id,
    secretary_name,

    chairperson_department_name,
    approved_by,
    posted_by,

    status,
    file_path,
  } = data;

  if (!student_id || !thesis_id || !faculty_id) {
    throw new Error("Missing required fields: student_id, thesis_id, faculty_id");
  }

  const { rows } = await query(
    `INSERT INTO form2b (
      student_id, thesis_id, faculty_id,
      defense_type, capstone_thesis_title, proponent_name,
      department, defense_date,
      adviser_id, adviser_name,
      chairperson_id, chairperson_name,
      member1_id, member1_name,
      member2_id, member2_name,
      secretary_id, secretary_name,
      chairperson_department_name,
      approved_by, posted_by,
      status, file_path
    ) VALUES (
      $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,
      $13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23
    )
    RETURNING *`,
    [
      student_id,
      thesis_id,
      faculty_id, // ensures the assigned adviser is saved
      defense_type,
      capstone_thesis_title,
      proponent_name,
      department,
      defense_date,

      adviser_id || faculty_id, // fallback to faculty_id if adviser_id not provided
      adviser_name || null,     // ensure adviser name is saved
      chairperson_id,
      chairperson_name,
      member1_id,
      member1_name,
      member2_id,
      member2_name,
      secretary_id,
      secretary_name,

      chairperson_department_name,
      approved_by,
      posted_by,
      status || "pending",
      file_path || null,
    ]
  );

  return rows[0];
};

// Update Form 2B
export const updateForm2B = async (id, data) => {
  const {
    faculty_id,
    defense_type,
    capstone_thesis_title,
    proponent_name,
    department,
    defense_date,

    adviser_id,
    adviser_name,
    chairperson_id,
    chairperson_name,
    member1_id,
    member1_name,
    member2_id,
    member2_name,
    secretary_id,
    secretary_name,

    chairperson_department_name,
    approved_by,
    posted_by,

    status,
    file_path,
  } = data;

  const { rows } = await query(
    `UPDATE form2b SET
      faculty_id=$1,
      defense_type=$2,
      capstone_thesis_title=$3,
      proponent_name=$4,
      department=$5,
      defense_date=$6,
      adviser_id=$7,
      adviser_name=$8,
      chairperson_id=$9,
      chairperson_name=$10,
      member1_id=$11,
      member1_name=$12,
      member2_id=$13,
      member2_name=$14,
      secretary_id=$15,
      secretary_name=$16,
      chairperson_department_name=$17,
      approved_by=$18,
      posted_by=$19,
      status=$20,
      file_path=$21,
      updated_at=CURRENT_TIMESTAMP
    WHERE id=$22
    RETURNING *`,
    [
      faculty_id,              // update adviser/faculty
      defense_type,
      capstone_thesis_title,
      proponent_name,
      department,
      defense_date,
      adviser_id || faculty_id, // update adviser_id if changed
      adviser_name || null,     // update adviser_name if provided
      chairperson_id,
      chairperson_name,
      member1_id,
      member1_name,
      member2_id,
      member2_name,
      secretary_id,
      secretary_name,
      chairperson_department_name,
      approved_by,
      posted_by,
      status,
      file_path,
      id,
    ]
  );

  return rows[0];
};
// Delete Form 2B
export const deleteForm2B = async (id) => {
  const { rows } = await query(`DELETE FROM form2b WHERE id=$1 RETURNING *`, [
    id,
  ]);
  return rows[0];
};

/* ==========================================================
   🟦 FILTERED FETCH SERVICES
   ========================================================== */

// Get latest Form 2B by student_id
export const getForm2BByStudent = async (student_id) => {
  const { rows } = await query(
    `SELECT * FROM form2b WHERE student_id=$1 ORDER BY created_at DESC`,
    [student_id]
  );
  return rows;
};

// Get ALL Form 2B assigned to a faculty
export const getForm2BByFaculty = async (faculty_id) => {
  const { rows } = await query(
    `SELECT * FROM form2b WHERE faculty_id=$1 ORDER BY created_at DESC`,
    [faculty_id]
  );
  return rows;
};
