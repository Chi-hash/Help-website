import multer from "multer";
import path from "path";


const storage = multer.diskStorage({
  destination(req, file, cb){
    cb(null, "uploads/"); // the attachments will be saved in the uploads folder
  },
  filename(req, file, cb){
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`); // Append the current timestamp and a random number to the original file name
  },
});


const upload = multer({ storage});

export default upload;
