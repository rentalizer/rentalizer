const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const prefix = file.fieldname === 'thumbnail' ? 'thumbnail' : 'photo';
    cb(null, `${prefix}-${uniqueSuffix}${ext}`);
  }
});

// File filter for images only
const fileFilter = (req, file, cb) => {
  // Check if file is an image
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

// File filter for documents (PDF and Excel)
const documentFileFilter = (req, file, cb) => {
  // Check if file is PDF or Excel
  const allowedMimes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
    'application/vnd.ms-excel' // .xls
  ];
  
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF and Excel files are allowed!'), false);
  }
};

// Configure multer for images
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  }
});

// Configure multer for documents
const documentUpload = multer({
  storage: storage,
  fileFilter: documentFileFilter,
  limits: {
    fileSize: 3 * 1024 * 1024, // 3MB limit for documents
  }
});

// Middleware for single image upload
const uploadThumbnail = (req, res, next) => {
  upload.single('thumbnail')(req, res, (err) => {
    if (err) {
      return next(err);
    }
    next();
  });
};

// Middleware for general photo upload
const uploadPhoto = (req, res, next) => {
  upload.single('photo')(req, res, (err) => {
    if (err) {
      return next(err);
    }
    next();
  });
};

// Middleware for document upload
const uploadDocument = (req, res, next) => {
  documentUpload.single('document')(req, res, (err) => {
    if (err) {
      return next(err);
    }
    next();
  });
};

// Error handling middleware
const handleUploadError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File too large. Maximum size is 5MB.'
      });
    }
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        success: false,
        message: 'Unexpected field name for file upload.'
      });
    }
  }
  
  if (error.message === 'Only image files are allowed!') {
    return res.status(400).json({
      success: false,
      message: 'Only image files are allowed!'
    });
  }
  
  if (error.message === 'Only PDF and Excel files are allowed!') {
    return res.status(400).json({
      success: false,
      message: 'Only PDF and Excel files are allowed!'
    });
  }
  
  next(error);
};

module.exports = {
  uploadThumbnail,
  uploadPhoto,
  uploadDocument,
  handleUploadError
};
