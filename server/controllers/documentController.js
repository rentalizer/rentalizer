const documentService = require('../services/documentService');

class DocumentController {
  // GET /api/documents - Get all documents with filtering and pagination
  async getAllDocuments(req, res) {
    try {
      const filters = {
        page: req.query.page,
        limit: req.query.limit,
        category: req.query.category,
        search: req.query.search,
        sortBy: req.query.sortBy,
        sortOrder: req.query.sortOrder
      };

      const result = await documentService.getAllDocuments(filters);

      res.json({
        success: true,
        data: result.data,
        pagination: result.pagination
      });

    } catch (error) {
      console.error('Get documents error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error while fetching documents'
      });
    }
  }

  // GET /api/documents/:id - Get document by ID
  async getDocumentById(req, res) {
    try {
      const { id } = req.params;
      const document = await documentService.getDocumentById(id);

      res.json({
        success: true,
        data: document
      });

    } catch (error) {
      console.error('Get document error:', error);

      if (error.message === 'Document not found') {
        return res.status(404).json({
          success: false,
          message: 'Document not found'
        });
      }

      res.status(500).json({
        success: false,
        message: 'Internal server error while fetching document'
      });
    }
  }

  // POST /api/documents - Create new document (Admin only)
  async createDocument(req, res) {
    try {
      const createdBy = req.user._id;
      const documentData = req.body;

      // Handle file upload if present
      if (req.file) {
        documentData.url = `/uploads/${req.file.filename}`;
        documentData.filename = req.file.originalname;
        documentData.size = req.file.size;
        documentData.type = req.file.mimetype.includes('pdf') ? 'pdf' : 'excel';
      }

      const document = await documentService.createDocument(documentData, createdBy);

      res.status(201).json({
        success: true,
        message: 'Document created successfully',
        data: document
      });

    } catch (error) {
      console.error('Create document error:', error);

      if (error.name === 'ValidationError') {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: error.errors
        });
      }

      res.status(500).json({
        success: false,
        message: 'Internal server error while creating document'
      });
    }
  }

  // PUT /api/documents/:id - Update document (Admin only)
  async updateDocument(req, res) {
    try {
      const { id } = req.params;
      const modifiedBy = req.user._id;
      const updateData = req.body;

      // Handle file upload if present
      if (req.file) {
        updateData.url = `/uploads/${req.file.filename}`;
        updateData.filename = req.file.originalname;
        updateData.size = req.file.size;
        updateData.type = req.file.mimetype.includes('pdf') ? 'pdf' : 'excel';
      }

      const document = await documentService.updateDocument(id, updateData, modifiedBy);

      res.json({
        success: true,
        message: 'Document updated successfully',
        data: document
      });

    } catch (error) {
      console.error('Update document error:', error);

      if (error.message === 'Document not found') {
        return res.status(404).json({
          success: false,
          message: 'Document not found'
        });
      }

      if (error.name === 'ValidationError') {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: error.errors
        });
      }

      res.status(500).json({
        success: false,
        message: 'Internal server error while updating document'
      });
    }
  }

  // DELETE /api/documents/:id - Delete document (Admin only)
  async deleteDocument(req, res) {
    try {
      const { id } = req.params;
      await documentService.deleteDocument(id);

      res.json({
        success: true,
        message: 'Document deleted successfully'
      });

    } catch (error) {
      console.error('Delete document error:', error);

      if (error.message === 'Document not found') {
        return res.status(404).json({
          success: false,
          message: 'Document not found'
        });
      }

      res.status(500).json({
        success: false,
        message: 'Internal server error while deleting document'
      });
    }
  }

  // GET /api/documents/categories - Get document categories
  async getDocumentCategories(req, res) {
    try {
      const categories = await documentService.getDocumentCategories();

      res.json({
        success: true,
        data: categories
      });

    } catch (error) {
      console.error('Get document categories error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error while fetching categories'
      });
    }
  }

  // GET /api/documents/category/:category - Get documents by category
  async getDocumentsByCategory(req, res) {
    try {
      const { category } = req.params;
      const documents = await documentService.getDocumentsByCategory(category);

      res.json({
        success: true,
        data: documents
      });

    } catch (error) {
      console.error('Get documents by category error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error while fetching documents by category'
      });
    }
  }
}

module.exports = new DocumentController();
