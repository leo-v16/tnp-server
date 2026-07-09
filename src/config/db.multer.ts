import path from 'path';
import multer from 'multer';

const studentImageStorage = multer.diskStorage({
    destination:    (req, file, callback) => {
        callback(null, "student_images/");
    },
    filename: (req, file, callback) => {
        callback(null, `${Date.now()}-${file.originalname}`);
    }
});
export const studentImageUpload = multer({ storage: studentImageStorage });

const studentResumeStorage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, "student_resumes/");
    },
    filename: (req, file, callback) => {
        callback(null, `${Date.now()}-${file.originalname}`);
    }
});
export const studentResumeUpload = multer({ storage: studentResumeStorage });

const bannerImageStorage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, "banner_images/");
    },
    filename: (req, file, callback) => {
        callback(null, `${Date.now()}-${file.originalname}`);
    }
});
export const bannerImageUpload = multer({ storage: bannerImageStorage });
