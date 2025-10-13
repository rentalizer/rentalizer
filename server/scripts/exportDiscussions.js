#!/usr/bin/env node

/**
 * Export active discussions to a JSON file for seeding new environments.
 *
 * Usage:
 *   cd server
 *   node scripts/exportDiscussions.js
 *
 * The script expects a valid Mongo connection string in MONGODB_URI
 * (or will fall back to mongodb://localhost:27017/rentalizer).
 */

const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });

const Discussion = require('../models/Discussion');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/rentalizer';
const OUTPUT_DIR = path.resolve(__dirname, '..', 'seed');

async function exportDiscussions() {
  console.log('➡️  Connecting to MongoDB:', MONGODB_URI);
  await mongoose.connect(MONGODB_URI, {
    maxPoolSize: 5,
    serverSelectionTimeoutMS: 5000,
  });

  console.log('✅ Connected. Fetching active discussions…');
  const discussions = await Discussion.find({ is_active: true })
    .sort({ createdAt: 1 })
    .lean({ virtuals: true });

  if (discussions.length === 0) {
    console.log('ℹ️  No active discussions found. Nothing to export.');
    return;
  }

  // Only keep fields that make sense for seeding.
  const sanitized = discussions.map(discussion => ({
    title: discussion.title,
    content: discussion.content,
    category: discussion.category,
    author_name: discussion.author_name,
    author_avatar: discussion.author_avatar || null,
    user_id: discussion.user_id,
    is_pinned: discussion.is_pinned || false,
    is_admin_post: discussion.is_admin_post || false,
    likes: discussion.likes || 0,
    comments_count: discussion.comments_count || 0,
    views_count: discussion.views_count || 0,
    liked_by: (discussion.liked_by || []).map(id => id.toString()),
    tags: discussion.tags || [],
    attachments: discussion.attachments || [],
    createdAt: discussion.createdAt,
    updatedAt: discussion.updatedAt,
    last_activity: discussion.last_activity || discussion.updatedAt,
  }));

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `discussions-export-${timestamp}.json`;
  const filepath = path.join(OUTPUT_DIR, filename);

  fs.writeFileSync(filepath, JSON.stringify(sanitized, null, 2), 'utf-8');

  console.log(`📄 Exported ${sanitized.length} discussions to ${filepath}`);
  console.log('🚀 Use this file with a seed script to populate your new cluster.');
}

exportDiscussions()
  .catch(err => {
    console.error('❌ Failed to export discussions:', err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect().catch(() => {});
  });
