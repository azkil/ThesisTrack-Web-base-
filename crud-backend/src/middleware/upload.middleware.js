import multer from "multer";

const storage = multer.memoryStorage(); // ⭐ REQUIRED for buffer
const upload = multer({ storage });

export default upload;
