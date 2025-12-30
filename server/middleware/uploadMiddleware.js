const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

function checkFileType(file, cb) {
    // UPDATED: Added video extensions
    const filetypes = /jpeg|jpg|png|gif|mp4|mov|webm|ogg/; 
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Only Images and Videos are allowed!');
    }
}

const upload = multer({
    storage: storage,
    limits: { fileSize: 50 * 1024 * 1024 }, // UPDATED: Increased to 50MB for videos
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
});

module.exports = upload;