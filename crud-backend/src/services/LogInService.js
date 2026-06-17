import { query } from "../db.js";

/* =========================================================
   🔐 AUTH / LOGIN
   ========================================================= */

export const loginUser = async (username, password) => {
  // Admin
  let { rows } = await query(
    `SELECT * FROM faculty WHERE username = $1 AND role = 'admin'`,
    [username]
  );
  if (rows.length && rows[0].password === password) {
    return { ...rows[0], role: "admin" };
  }

  // Faculty
  ({ rows } = await query(
    `SELECT * FROM faculty WHERE username = $1 AND role = 'faculty'`,
    [username]
  ));
  if (rows.length && rows[0].password === password) {
    return { ...rows[0], role: "faculty" };
  }

  // Student
  ({ rows } = await query(
    `SELECT * FROM students WHERE username = $1`,
    [username]
  ));
  if (rows.length && rows[0].password === password) {
    return { ...rows[0], role: "student" };
  }

  return null;
};
