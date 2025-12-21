const multer = require('multer');
const path = require('path');

// Set storage engine (store temporarily on disk)
const storage = multer.diskStorage({
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Check file type (Allow Images only for now, expand for video later)
function checkFileType(file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Images Only!');
    }
}

const upload = multer({
    storage: storage,
    limits: { fileSize: 5000000 }, // 5MB Limit
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
});

module.exports = upload;