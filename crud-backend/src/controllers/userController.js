import * as userService from "../services/userServices.js";

/* ==========================================================
   🧑‍🎓 STUDENT CONTROLLERS
   ========================================================== */

// Get all students
export const getStudents = async (req, res) => {
  try {
    const students = await userService.getStudents();
    res.json(students);
  } catch (err) {
    console.error("❌ Error fetching students:", err);
    res.status(500).json({ error: "Failed to fetch students" });
  }
};

// Get student by ID
export const getStudentById = async (req, res) => {
  try {
    const student = await userService.getStudentById(req.params.id);
    if (!student) return res.status(404).json({ error: "Student not found" });
    res.json(student);
  } catch (err) {
    console.error("❌ Error fetching student:", err);
    res.status(500).json({ error: "Failed to fetch student" });
  }
};

// Create student
export const createStudent = async (req, res) => {
  try {
    const newStudent = await userService.createStudent(req.body);
    res.status(201).json(newStudent);
  } catch (err) {
    console.error("❌ Error creating student:", err);
    res.status(500).json({ error: "Failed to create student" });
  }
};

// Update student
export const updateStudent = async (req, res) => {
  try {
    const updatedStudent = await userService.updateStudent(req.params.id, req.body);
    if (!updatedStudent) return res.status(404).json({ error: "Student not found" });
    res.json(updatedStudent);
  } catch (err) {
    console.error("❌ Error updating student:", err);
    res.status(500).json({ error: "Failed to update student" });
  }
};

// Delete student
export const deleteStudent = async (req, res) => {
  try {
    const success = await userService.deleteStudent(req.params.id);
    if (!success) return res.status(404).json({ error: "Student not found" });
    res.json({ message: "Student deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting student:", err);
    res.status(500).json({ error: "Failed to delete student" });
  }
};

// Search students
export const searchStudents = async (req, res) => {
  try {
    const results = await userService.searchStudents(req.params.term);
    res.json(results);
  } catch (err) {
    console.error("❌ Error searching students:", err);
    res.status(500).json({ error: "Failed to search students" });
  }
};


/* ==========================================================
   👨‍🏫 FACULTY CONTROLLERS (Includes Admin)
   ========================================================== */

// Get all faculty
export const getFaculty = async (req, res) => {
  try {
    const faculty = await userService.getFaculty();
    res.json(faculty);
  } catch (err) {
    console.error("❌ Error fetching faculty:", err);
    res.status(500).json({ error: "Failed to fetch faculty" });
  }
};

// Get faculty by ID
export const getFacultyById = async (req, res) => {
  try {
    const faculty = await userService.getFacultyById(req.params.id);
    if (!faculty) return res.status(404).json({ error: "Faculty not found" });
    res.json(faculty);
  } catch (err) {
    console.error("❌ Error fetching faculty by ID:", err);
    res.status(500).json({ error: "Failed to fetch faculty" });
  }
};

// Get all advisers
export const getAllAdvisers = async (req, res) => {
  try {
    const advisers = await userService.getAllAdvisers();
    res.json(advisers);
  } catch (err) {
    console.error("❌ Error fetching advisers:", err);
    res.status(500).json({ error: "Failed to fetch advisers" });
  }
};

// Create faculty
export const createFaculty = async (req, res) => {
  try {
    const newFaculty = await userService.createFaculty(req.body);
    res.status(201).json(newFaculty);
  } catch (err) {
    console.error("❌ Error creating faculty:", err);
    res.status(500).json({ error: "Failed to create faculty" });
  }
};

// Update faculty
export const updateFaculty = async (req, res) => {
  try {
    const updated = await userService.updateFaculty(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: "Faculty not found" });
    res.json(updated);
  } catch (err) {
    console.error("❌ Error updating faculty:", err);
    res.status(500).json({ error: "Failed to update faculty" });
  }
};

// Delete faculty
export const deleteFaculty = async (req, res) => {
  try {
    const success = await userService.deleteFaculty(req.params.id);
    if (!success) return res.status(404).json({ error: "Faculty not found" });
    res.json({ message: "Faculty deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting faculty:", err);
    res.status(500).json({ error: "Failed to delete faculty" });
  }
};

// Search faculty
export const searchFaculty = async (req, res) => {
  try {
    const results = await userService.searchFaculty(req.params.term);
    res.json(results);
  } catch (err) {
    console.error("❌ Error searching faculty:", err);
    res.status(500).json({ error: "Failed to search faculty" });
  }
};

export const getAdviseeTheses = async (req, res) => {
  try {
    const { id } = req.params;
    const theses = await userService.getAdviseeTheses(id);

    if (theses.length === 0) {
      return res.status(404).json({ message: "No theses found for this faculty." });
    }

    res.json(theses);
  } catch (err) {
    console.error("❌ Error fetching advisee theses:", err);
    res.status(500).json({ error: "Failed to fetch advisee theses" });
  }
};

/* ==========================================================
   🔐 LOGIN CONTROLLER
   ========================================================== */
export const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Call your service
    const user = await userService.loginUser(username, password);

    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // Add consistency for frontend
    const full_name = `${user.first_name || ""} ${user.last_name || ""}`.trim();

    res.json({
      message: "Login successful",
      user: {
        ...user,
        full_name,
      },
    });
  } catch (err) {
    console.error("❌ Error logging in:", err);
    res.status(500).json({ message: "Server error during login" });
  }
}