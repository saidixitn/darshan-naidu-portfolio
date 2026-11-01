#!/usr/bin/env node

/**
 * Darshan Portfolio — Cloudflare R2 Media Sync Script
 * Automatically syncs local videos and high-res images to Cloudflare R2.
 * Usage: npm run sync:media
 */

import fs from 'node:fs';
import path from 'node:path';
import { exec } from 'node:child_process';
import { promisify } from 'node:util';

const execPromise = promisify(exec);

const BUCKET_NAME = 'darshan-media';
const R2_PUBLIC_HOST = 'pub-516aaebe3c6046399fecdd80706924bb.r2.dev';

// Directories to monitor and sync
const SYNC_DIRS = [
  'assets/videos',
  'assets/images/darshan',
  'assets/images/morph',
  'assets/images/work'
];

// Single priority files in assets/images/
const INDIVIDUAL_EXTENSIONS = ['.mp4', '.mov', '.webm', '.jpg', '.jpeg', '.png', '.webp', '.gif'];

function getAllFiles(dirPath, arrayOfFiles = []) {
  if (!fs.existsSync(dirPath)) return arrayOfFiles;
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const fullPath = path.join(dirPath, file);
    if (file.startsWith('.')) return; // Ignore hidden files like .DS_Store
    if (fs.statSync(fullPath).isDirectory()) {
      getAllFiles(fullPath, arrayOfFiles);
    } else {
      const ext = path.extname(file).toLowerCase();
      if (INDIVIDUAL_EXTENSIONS.includes(ext)) {
        arrayOfFiles.push(fullPath.replace(/\\/g, '/'));
      }
    }
  });

  return arrayOfFiles;
}

// Check if an object already exists in R2 with the same content length
async function checkRemoteExists(relPath) {
  try {
    const encodedPath = relPath.split('/').map(encodeURIComponent).join('/');
    const res = await fetch(`https://${R2_PUBLIC_HOST}/${encodedPath}`, { method: 'HEAD' });
    if (res.status === 200) {
      const remoteLen = parseInt(res.headers.get('content-length') || '0', 10);
      const localLen = fs.statSync(relPath).size;
      return remoteLen === localLen;
    }
    return false;
  } catch {
    return false;
  }
}

async function uploadFile(relPath) {
  const ext = path.extname(relPath).toLowerCase();
  let contentType = 'application/octet-stream';

  if (ext === '.mp4') contentType = 'video/mp4';
  else if (ext === '.mov') contentType = 'video/quicktime';
  else if (ext === '.webm') contentType = 'video/webm';
  else if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';
  else if (ext === '.png') contentType = 'image/png';
  else if (ext === '.webp') contentType = 'image/webp';
  else if (ext === '.gif') contentType = 'image/gif';

  const cmd = `npx wrangler r2 object put "${BUCKET_NAME}/${relPath}" --file="${relPath}" --content-type="${contentType}" --remote`;
  await execPromise(cmd);
}

// Concurrency helper
async function mapConcurrent(items, concurrency, fn) {
  const results = [];
  const executing = [];

  for (const item of items) {
    const p = Promise.resolve().then(() => fn(item));
    results.push(p);

    if (concurrency <= items.length) {
      const e = p.then(() => executing.splice(executing.indexOf(e), 1));
      executing.push(e);
      if (executing.length >= concurrency) {
        await Promise.race(executing);
      }
    }
  }

  return Promise.all(results);
}

async function main() {
  console.log('\n🚀 Cloudflare R2 Media Sync — Darshan Naidu Portfolio');
  console.log(`📦 Target Bucket: ${BUCKET_NAME}`);
  console.log(`🔗 Native CDN Path: /cdn/...\n`);

  let allFiles = [];
  for (const dir of SYNC_DIRS) {
    getAllFiles(dir, allFiles);
  }

  // Also include root assets/images priority files
  if (fs.existsSync('assets/images')) {
    const rootImgs = fs.readdirSync('assets/images')
      .filter(f => !fs.statSync(path.join('assets/images', f)).isDirectory())
      .map(f => `assets/images/${f}`)
      .filter(f => INDIVIDUAL_EXTENSIONS.includes(path.extname(f).toLowerCase()));
    allFiles = [...new Set([...allFiles, ...rootImgs])];
  }

  console.log(`Found ${allFiles.length} local media files. Checking remote status...`);

  const toUpload = [];
  await mapConcurrent(allFiles, 12, async (file) => {
    const exists = await checkRemoteExists(file);
    if (!exists) {
      toUpload.push(file);
    }
  });

  if (toUpload.length === 0) {
    console.log('\n✨ All media files are already synced and up to date on Cloudflare R2!');
    console.log('Zero uploads needed.\n');
    return;
  }

  console.log(`\nUploading ${toUpload.length} new or updated files to Cloudflare R2...`);

  let completed = 0;
  await mapConcurrent(toUpload, 4, async (file) => {
    try {
      await uploadFile(file);
      completed++;
      console.log(`[${completed}/${toUpload.length}] ✓ Synced: ${file}`);
    } catch (err) {
      console.error(`✗ Error uploading ${file}:`, err.message);
    }
  });

  console.log(`\n🎉 Successfully synced ${completed} files to Cloudflare R2!`);
  console.log('You can now reference them cleanly in your HTML as `/cdn/...`\n');
}

main().catch((err) => {
  console.error('\nSync failed:', err);
  process.exit(1);
});
