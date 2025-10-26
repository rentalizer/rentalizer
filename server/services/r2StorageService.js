const { S3Client, PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const crypto = require('crypto');
const path = require('path');

const accessKeyId = process.env.R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
const endpoint = process.env.R2_S3_ENDPOINT;
const bucketName = process.env.R2_BUCKET_NAME;
const publicBaseUrl = process.env.R2_PUBLIC_BASE_URL;

if (!accessKeyId || !secretAccessKey || !endpoint || !bucketName) {
  console.warn(
    '⚠️  R2 storage environment variables are missing. ' +
    'Uploads will fail until R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, ' +
    'R2_S3_ENDPOINT, and R2_BUCKET_NAME are configured.'
  );
}

const s3Client = new S3Client({
  region: 'auto',
  endpoint,
  forcePathStyle: true,
  credentials: accessKeyId && secretAccessKey ? {
    accessKeyId,
    secretAccessKey
  } : undefined
});

const sanitizeSegment = (segment) => {
  if (!segment) return 'general';
  return segment
    .toString()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'general';
};

const buildAvatarKey = (userId, originalName = '') => {
  const extension = path.extname(originalName) || '.png';
  const safeExtension = extension.split('?')[0] || '.png';
  return [
    'avatars',
    userId || 'anonymous',
    `${Date.now()}-${crypto.randomUUID()}${safeExtension}`
  ].join('/');
};

const buildDocumentKey = (category, originalName = '') => {
  const extension = path.extname(originalName) || '.bin';
  const safeExtension = extension.split('?')[0] || '.bin';
  return [
    'documents',
    sanitizeSegment(category),
    `${Date.now()}-${crypto.randomUUID()}${safeExtension}`
  ].join('/');
};

const buildDiscussionAttachmentKey = (userId, originalName = '') => {
  const extension = path.extname(originalName) || '.bin';
  const safeExtension = extension.split('?')[0] || '.bin';
  const ownerSegment = sanitizeSegment(userId);
  return [
    'attachments',
    'discussions',
    ownerSegment,
    `${Date.now()}-${crypto.randomUUID()}${safeExtension}`
  ].join('/');
};

const buildThumbnailKey = (originalName = '') => {
  const extension = path.extname(originalName) || '.png';
  const safeExtension = extension.split('?')[0] || '.png';
  return [
    'thumbnails',
    `${Date.now()}-${crypto.randomUUID()}${safeExtension}`
  ].join('/');
};

const buildPublicUrl = (key) => {
  if (!key) return null;

  if (publicBaseUrl) {
    return `${publicBaseUrl.replace(/\/$/, '')}/${key}`;
  }

  if (endpoint) {
    const trimmedEndpoint = endpoint.replace(/^https?:\/\//, '').replace(/\/$/, '');
    return `https://${trimmedEndpoint}/${bucketName}/${key}`;
  }

  return null;
};

const extractKeyFromUrl = (url) => {
  if (!url) return null;

  if (publicBaseUrl && url.startsWith(publicBaseUrl)) {
    return url.slice(publicBaseUrl.length).replace(/^\//, '');
  }

  if (endpoint && bucketName) {
    const endpointOrigin = endpoint.replace(/\/$/, '');
    const prefix = `${endpointOrigin}/${bucketName}/`;
    if (url.startsWith(prefix)) {
      return url.slice(prefix.length);
    }
  }

  return null;
};

const uploadAvatar = async ({ buffer, mimetype, originalname }, userId) => {
  if (!buffer) {
    throw new Error('Avatar file buffer is required');
  }
  if (!bucketName) {
    throw new Error('R2 bucket name is not configured');
  }

  const key = buildAvatarKey(userId, originalname);

  await s3Client.send(new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    Body: buffer,
    ContentType: mimetype || 'image/png',
    CacheControl: 'public, max-age=31536000, immutable'
  }));

  return {
    key,
    url: buildPublicUrl(key)
  };
};

const uploadDocument = async ({ buffer, mimetype, originalname }, category) => {
  if (!buffer) {
    throw new Error('Document file buffer is required');
  }

  if (!bucketName) {
    throw new Error('R2 bucket name is not configured');
  }

  const key = buildDocumentKey(category, originalname);

  await s3Client.send(new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    Body: buffer,
    ContentType: mimetype || 'application/octet-stream',
    CacheControl: 'public, max-age=86400'
  }));

  return {
    key,
    url: buildPublicUrl(key)
  };
};

const uploadThumbnailImage = async ({ buffer, mimetype, originalname }) => {
  if (!buffer) {
    throw new Error('Thumbnail file buffer is required');
  }

  if (!bucketName) {
    throw new Error('R2 bucket name is not configured');
  }

  const key = buildThumbnailKey(originalname);

  await s3Client.send(new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    Body: buffer,
    ContentType: mimetype || 'image/png',
    CacheControl: 'public, max-age=31536000, immutable'
  }));

  return {
    key,
    url: buildPublicUrl(key)
  };
};

const uploadDiscussionAttachment = async ({ buffer, mimetype, originalname }, userId) => {
  if (!buffer) {
    throw new Error('Attachment file buffer is required');
  }

  if (!bucketName) {
    throw new Error('R2 bucket name is not configured');
  }

  const key = buildDiscussionAttachmentKey(userId, originalname);

  await s3Client.send(new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    Body: buffer,
    ContentType: mimetype || 'application/octet-stream',
    CacheControl: 'public, max-age=86400'
  }));

  return {
    key,
    url: buildPublicUrl(key)
  };
};

const deleteObject = async (key) => {
  if (!key || !bucketName) {
    return false;
  }

  try {
    await s3Client.send(new DeleteObjectCommand({
      Bucket: bucketName,
      Key: key
    }));
    return true;
  } catch (error) {
    console.warn('⚠️  Failed to delete R2 object', key, error.message);
    return false;
  }
};

module.exports = {
  uploadAvatar,
  uploadDocument,
  uploadDiscussionAttachment,
  uploadThumbnailImage,
  deleteObject,
  extractKeyFromUrl,
  buildPublicUrl
};
