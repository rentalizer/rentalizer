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

// File filter for documents (PDF, Office, Text)
const documentFileFilter = (req, file, cb) => {
  const allowedMimes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
    'application/vnd.ms-excel', // .xls
    'application/msword', // .doc
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
    'application/vnd.ms-powerpoint', // .ppt
    'application/vnd.openxmlformats-officedocument.presentationml.presentation', // .pptx
    'application/vnd.openxmlformats-officedocument.presentationml.slideshow', // .ppsx
    'application/vnd.ms-powerpoint.presentation.macroenabled.12', // .pptm
    'application/vnd.ms-excel.sheet.macroenabled.12', // .xlsm
    'text/plain', // .txt
    'text/markdown', // .md
    'text/csv',
    'application/vnd.oasis.opendocument.text', // .odt
    'application/vnd.oasis.opendocument.spreadsheet', // .ods
    'application/vnd.oasis.opendocument.presentation' // .odp
  ];
  
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Unsupported document file type'), false);
  }
};

const attachmentFileFilter = (req, file, cb) => {
  const allowedMimes = new Set([
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/vnd.openxmlformats-officedocument.presentationml.slideshow',
    'application/vnd.ms-powerpoint.presentation.macroenabled.12',
    'application/vnd.ms-excel.sheet.macroenabled.12',
    'text/plain',
    'text/markdown',
    'text/csv',
    'application/vnd.oasis.opendocument.text',
    'application/vnd.oasis.opendocument.spreadsheet',
    'application/vnd.oasis.opendocument.presentation',
    'application/zip',
    'application/x-zip-compressed'
  ]);

  if (file.mimetype.startsWith('image/')) {
    return cb(null, true);
  }

  if (allowedMimes.has(file.mimetype)) {
    return cb(null, true);
  }

  cb(new Error('Unsupported attachment file type'), false);
};

const memoryStorage = multer.memoryStorage();

// Configure multer for images
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  }
});

const avatarUpload = multer({
  storage: memoryStorage,
  fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024 // 2MB limit for avatars
  }
});

const thumbnailUpload = multer({
  storage: memoryStorage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit for thumbnails
  }
});

// Configure multer for documents
const documentUpload = multer({
  storage: memoryStorage,
  fileFilter: documentFileFilter,
  limits: {
    fileSize: 20 * 1024 * 1024, // 20MB limit for documents
  }
});

const discussionAttachmentUpload = multer({
  storage: memoryStorage,
  fileFilter: attachmentFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit for attachments
  }
});

// Middleware for single image upload
const uploadThumbnail = (req, res, next) => {
  thumbnailUpload.single('thumbnail')(req, res, (err) => {
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

// Middleware for avatar upload (in-memory)
const uploadAvatar = (req, res, next) => {
  avatarUpload.single('avatar')(req, res, (err) => {
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

const uploadDiscussionAttachment = (req, res, next) => {
  discussionAttachmentUpload.single('attachment')(req, res, (err) => {
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
        message: 'File too large. Maximum size is 5MB for images, 2MB for avatars, and 20MB for documents.'
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
  
  if (error.message === 'Unsupported document file type') {
    return res.status(400).json({
      success: false,
      message: 'Unsupported document file type. Please upload PDF, Office, text, or CSV files.'
    });
  }

  if (error.message === 'Unsupported attachment file type') {
    return res.status(400).json({
      success: false,
      message: 'Unsupported attachment file type. Please upload images, PDF, Office, text, CSV, or ZIP files.'
    });
  }
  
  next(error);
};

module.exports = {
  uploadThumbnail,
  uploadPhoto,
  uploadAvatar,
  uploadDocument,
  uploadDiscussionAttachment,
  handleUploadError
};
