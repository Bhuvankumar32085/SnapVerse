import multer from "multer";

// Use memoryStorage to store uploaded files in memory as Buffer
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
});

export default upload;
