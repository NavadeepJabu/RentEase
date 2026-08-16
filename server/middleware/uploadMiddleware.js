import multer from "multer";
import path from "path";

// Storage Configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/profiles");
  },

  filename: function (req, file, cb) {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

// Allow only image files
const fileFilter = (req, file, cb) => {

  const allowedTypes = /jpeg|jpg|png/;

  const isValidExtension = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );

  const isValidMime = allowedTypes.test(file.mimetype);

  if (isValidExtension && isValidMime) {
    cb(null, true);
  } else {
    cb(new Error("Only JPG, JPEG and PNG images are allowed"));
  }
};

const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5 MB
    },
    fileFilter: (req, file, cb) => {

        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/jpg",
            "image/webp",
        ];

        if (!allowedTypes.includes(file.mimetype)) {
            return cb(new Error("Only image files are allowed"));
        }

        cb(null, true);
    },
});


export default upload;