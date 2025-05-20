const multer = require('multer');
const path = require('path');

const storage = multer.memoryStorage(); // usamos memoria, no disco

const fileFilter = (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const allowed = /jpg|jpeg|png|webp|gif/;
    allowed.test(ext) ? cb(null, true) : cb(new Error('Formato no permitido'));
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
