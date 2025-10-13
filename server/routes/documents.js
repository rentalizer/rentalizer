const express = require('express');
const documentController = require('../controllers/documentController');
const { authenticateToken } = require('../middleware/auth');
const { requireAdmin } = require('../middleware/admin');
const { uploadDocument } = require('../middleware/upload');
const { 
  validateDocument, 
  validateDocumentUpdate 
} = require('../middleware/validation');

const router = express.Router();

// Public routes (no authentication required)
// GET /api/documents - Get all documents with filtering and pagination
router.get('/', documentController.getAllDocuments);

// GET /api/documents/categories - Get document categories
router.get('/categories', documentController.getDocumentCategories);

// GET /api/documents/category/:category - Get documents by category
router.get('/category/:category', documentController.getDocumentsByCategory);

// GET /api/documents/:id - Get document by ID
router.get('/:id', documentController.getDocumentById);

// Protected routes (authentication required)
// All routes below require authentication
router.use(authenticateToken);

// Admin-only routes
// POST /api/documents - Create new document (Admin only)
router.post('/', requireAdmin, uploadDocument, validateDocument, documentController.createDocument);

// PUT /api/documents/:id - Update document (Admin only)
router.put('/:id', requireAdmin, uploadDocument, validateDocumentUpdate, documentController.updateDocument);

// DELETE /api/documents/:id - Delete document (Admin only)
router.delete('/:id', requireAdmin, documentController.deleteDocument);

module.exports = router;
