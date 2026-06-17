import express from "express";
import cors from "cors";
import path from "path";

// Routes
import studentRoutes from "./routes/student.routes.js";
import facultyRoutes from "./routes/facultyRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import thesisRoutes from "./routes/thesisRoutes.js";

// Forms
import form2aRoutes from "./routes/form2aRoutes.js";
import form2bRoutes from "./routes/form2bRoutes.js";
import form2cRoutes from "./routes/form2cRoutes.js";
import form2dRoutes from "./routes/form2dRoutes.js";
import form2eRoutes from "./routes/form2eRoutes.js";
import form2fRoutes from "./routes/form2fRoutes.js";
import form2gRoutes from "./routes/form2gRoutes.js";
import form2hRoutes from "./routes/form2hRoutes.js";
import form2iRoutes from "./routes/form2iRoutes.js";
import form2jRoutes from "./routes/form2jRoutes.js";
import form2kRoutes from "./routes/form2kRoutes.js";

import formFilesRoutes from "./routes/formUploadFileRoutes.js";
import formsPdfRoutes from "./routes/formsPdfRoutes.js";

const app = express();

/* ================= MIDDLEWARE ================= */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ================= 🔥 SERVE FILES (VERY IMPORTANT) ================= */
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

/* ================= APIs ================= */
app.use("/api/students", studentRoutes);
app.use("/api/faculty", facultyRoutes);
app.use("/api", userRoutes);
app.use("/api/theses", thesisRoutes);

/* ================= FORM APIs ================= */
app.use("/api/form2a", form2aRoutes);
app.use("/api/form2b", form2bRoutes);
app.use("/api/form2c", form2cRoutes);
app.use("/api/form2d", form2dRoutes);
app.use("/api/form2e", form2eRoutes);
app.use("/api/form2f", form2fRoutes);
app.use("/api/form2g", form2gRoutes);
app.use("/api/form2h", form2hRoutes);
app.use("/api/form2i", form2iRoutes);
app.use("/api/form2j", form2jRoutes);
app.use("/api/form2k", form2kRoutes);

app.use("/api/forms", formFilesRoutes);
app.use("/api/forms-pdf", formsPdfRoutes);

/* ================= START ================= */
const PORT = process.env.PORT || 3001;
app.listen(PORT, "0.0.0.0",  () => {
  console.log(`🚀 Server running on port ${PORT}`);
});