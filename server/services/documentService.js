const Document = require('../models/Document');

class DocumentService {
  // Create a new document
  async createDocument(documentData, createdBy) {
    try {
      const document = new Document({
        ...documentData,
        createdBy,
        lastModifiedBy: createdBy
      });

      await document.save();
      return await this.getDocumentById(document._id);
    } catch (error) {
      if (error.name === 'ValidationError') {
        const errors = Object.values(error.errors).map(err => err.message);
        const validationError = new Error('Validation failed');
        validationError.name = 'ValidationError';
        validationError.errors = errors;
        throw validationError;
      }
      throw error;
    }
  }

  // Get document by ID
  async getDocumentById(documentId) {
    const document = await Document.findById(documentId)
      .populate('createdBy', 'firstName lastName email')
      .populate('lastModifiedBy', 'firstName lastName email')
      .populate('videoId', 'title videoUrl');

    if (!document) {
      throw new Error('Document not found');
    }

    return document;
  }

  // Get all documents with filtering and pagination
  async getAllDocuments(filters = {}) {
    try {
      const {
        page = 1,
        limit = 20,
        category,
        search,
        sortBy = 'createdAt',
        sortOrder = 'desc'
      } = filters;

      // Build query
      const query = {};

      if (category && category !== 'all') {
        query.category = category;
      }

      if (search) {
        query.$or = [
          { filename: { $regex: search, $options: 'i' } }
        ];
      }

      // Calculate pagination
      const skip = (page - 1) * limit;

      // Execute query
      const documents = await Document.find(query)
        .populate('createdBy', 'firstName lastName email')
        .populate('lastModifiedBy', 'firstName lastName email')
        .populate('videoId', 'title videoUrl')
        .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
        .skip(skip)
        .limit(parseInt(limit));

      // Get total count for pagination
      const total = await Document.countDocuments(query);
      const pages = Math.ceil(total / limit);

      return {
        data: documents,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages
        }
      };
    } catch (error) {
      throw error;
    }
  }

  // Update document
  async updateDocument(documentId, updateData, modifiedBy) {
    try {
      const document = await Document.findByIdAndUpdate(
        documentId,
        {
          ...updateData,
          lastModifiedBy: modifiedBy
        },
        { new: true, runValidators: true }
      )
        .populate('createdBy', 'firstName lastName email')
        .populate('lastModifiedBy', 'firstName lastName email')
        .populate('videoId', 'title videoUrl');

      if (!document) {
        throw new Error('Document not found');
      }

      return document;
    } catch (error) {
      if (error.name === 'ValidationError') {
        const errors = Object.values(error.errors).map(err => err.message);
        const validationError = new Error('Validation failed');
        validationError.name = 'ValidationError';
        validationError.errors = errors;
        throw validationError;
      }
      throw error;
    }
  }

  // Delete document
  async deleteDocument(documentId) {
    try {
      const document = await Document.findByIdAndDelete(documentId);
      
      if (!document) {
        throw new Error('Document not found');
      }

      return document;
    } catch (error) {
      throw error;
    }
  }

  // Get documents by category
  async getDocumentsByCategory(category) {
    try {
      const documents = await Document.find({ category })
        .populate('createdBy', 'firstName lastName email')
        .populate('videoId', 'title videoUrl')
        .sort({ createdAt: -1 });

      return documents;
    } catch (error) {
      throw error;
    }
  }

  // Get documents by video ID (for auto-sync)
  async getDocumentsByVideoId(videoId) {
    try {
      const documents = await Document.find({ videoId })
        .populate('createdBy', 'firstName lastName email')
        .sort({ createdAt: -1 });

      return documents;
    } catch (error) {
      throw error;
    }
  }

  // Create document from video attachment (auto-sync)
  async createDocumentFromVideoAttachment(videoId, attachmentData, videoCategory, createdBy) {
    try {
      const documentData = {
        filename: attachmentData.filename,
        url: attachmentData.url,
        type: attachmentData.type,
        size: attachmentData.size,
        category: videoCategory || 'Documents Library', // Use video's category or default
        videoId: videoId
      };

      return await this.createDocument(documentData, createdBy);
    } catch (error) {
      throw error;
    }
  }

  // Get document categories
  async getDocumentCategories() {
    try {
      const categories = await Document.distinct('category');
      return categories;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new DocumentService();
