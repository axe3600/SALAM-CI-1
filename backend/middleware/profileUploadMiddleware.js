import multer from "multer";
import fs from "fs";
import path from "path";

// =====================================================
// DOSSIER UPLOADS
// =====================================================

const uploadDir = "uploads";

if (!fs.existsSync(uploadDir)) {

  fs.mkdirSync(uploadDir, {
    recursive: true
  });

}

// =====================================================
// STOCKAGE
// =====================================================

const storage = multer.diskStorage({

  destination: (req, file, cb) => {

    cb(null, uploadDir);

  },

  filename: (req, file, cb) => {

    const extension =
      path.extname(file.originalname);

    const uniqueName =
      `profile-${Date.now()}-${Math.round(Math.random() * 1E9)}${extension}`;

    cb(null, uniqueName);

  }

});

// =====================================================
// FILTRE IMAGE UNIQUEMENT
// =====================================================

const fileFilter = (req, file, cb) => {

  if (!file.mimetype.startsWith("image/")) {

    return cb(
      new Error("Seules les images sont autorisées."),
      false
    );

  }

  cb(null, true);

};

// =====================================================
// MULTER
// =====================================================

const profileUpload = multer({

  storage,

  fileFilter,

  limits: {

    fileSize: 5 * 1024 * 1024

  }

});

export default profileUpload;