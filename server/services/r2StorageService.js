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

const buildAvatarKey = (userId, originalName = '') => {
  const extension = path.extname(originalName) || '.png';
  const safeExtension = extension.split('?')[0] || '.png';
  return [
    'avatars',
    userId || 'anonymous',
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
  deleteObject,
  extractKeyFromUrl,
  buildPublicUrl
};
