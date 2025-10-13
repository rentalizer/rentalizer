const Document = require('../models/Document');
const r2StorageService = require('./r2StorageService');

const normalizeAttachmentType = (type = '') => {
  switch (type) {
    case 'pdf':
      return 'pdf';
    case 'excel':
    case 'spreadsheet':
      return 'spreadsheet';
    case 'presentation':
    case 'powerpoint':
      return 'presentation';
    case 'text':
      return 'text';
    default:
      return 'document';
  }
};

class DocumentService {
  // Create a new document
  async createDocument(documentData, createdBy) {
    try {
      if (documentData.size !== undefined) {
        documentData.size = Number(documentData.size);
      }
      if (documentData.storageKey === undefined) {
        documentData.storageKey = null;
      }
      if (documentData.contentType === undefined && documentData.type) {
        documentData.contentType = null;
      }

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
      const document = await Document.findById(documentId);

      if (!document) {
        throw new Error('Document not found');
      }

      const previousStorageKey = document.storageKey;

      if (updateData.filename !== undefined) document.filename = updateData.filename;
      if (updateData.url !== undefined) document.url = updateData.url;
      if (updateData.type !== undefined) document.type = updateData.type;
      if (updateData.size !== undefined) document.size = Number(updateData.size);
      if (updateData.category !== undefined) document.category = updateData.category;
      if (updateData.storageKey !== undefined) document.storageKey = updateData.storageKey;
      if (updateData.contentType !== undefined) document.contentType = updateData.contentType;
      if (updateData.videoId !== undefined) document.videoId = updateData.videoId;

      document.lastModifiedBy = modifiedBy;
      await document.save();

      if (
        updateData.storageKey &&
        previousStorageKey &&
        previousStorageKey !== updateData.storageKey
      ) {
        r2StorageService.deleteObject(previousStorageKey).catch((err) => {
          console.warn('⚠️  Failed to delete previous document from R2:', err.message);
        });
      }

      return this.getDocumentById(document._id);
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

      if (document.storageKey) {
        try {
          await r2StorageService.deleteObject(document.storageKey);
        } catch (err) {
          console.warn('⚠️  Failed to delete document from R2:', err.message);
        }
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
        type: normalizeAttachmentType(attachmentData.type),
        size: attachmentData.size,
        storageKey: attachmentData.storageKey || null,
        contentType: attachmentData.contentType || null,
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
