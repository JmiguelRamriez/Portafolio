#!/usr/bin/env node
/**
 * Image Optimization Script for Portfolio
 * Optimizes images in public/images/ and outputs to public/images/optimized/
 * Generates WebP + AVIF variants at multiple widths
 */

import sharp from 'sharp';
import { readdirSync, mkdirSync, existsSync, statSync, writeFileSync, readFileSync } from 'fs';
import { join, extname, basename, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = join(__dirname, '..');
const INPUT_DIR = join(PROJECT_ROOT, 'public', 'images');
const OUTPUT_DIR = join(PROJECT_ROOT, 'public', 'images', 'optimized');
const PROJECTS_DATA_FILE = join(PROJECT_ROOT, 'src', 'data', 'projects.js');

// Configuration
const WIDTHS = [400, 800, 1200, 1600];
const QUALITY = {
  webp: 82,
  avif: 55,
  jpeg: 85,
  png: 90
};
const MAX_DIMENSION = 1920;

// Files to skip (already optimized or special)
const SKIP_FILES = ['clase-notes-tui.svg', 'clase-notes-note.svg', 'Hero.png']; // Hero.png handled specially

async function optimizeImage(inputPath, outputBaseName) {
  const results = { webp: [], avif: [], original: null };
  
  try {
    const image = sharp(inputPath);
    const metadata = await image.metadata();
    
    // Track original size
    const originalStat = statSync(inputPath);
    results.original = { width: metadata.width, height: metadata.height, size: originalStat.size };
    
    // Resize if too large
    let pipeline = image;
    if (metadata.width > MAX_DIMENSION || metadata.height > MAX_DIMENSION) {
      pipeline = pipeline.resize(MAX_DIMENSION, MAX_DIMENSION, { 
        fit: 'inside', 
        withoutEnlargement: true 
      });
    }
    
    // Generate WebP variants
    let generatedAnyWebP = false;
    for (const width of WIDTHS) {
      if (metadata.width <= width) break; // Don't upscale
      
      const webpPath = join(OUTPUT_DIR, `${outputBaseName}-${width}w.webp`);
      await pipeline.clone()
        .resize(width, null, { fit: 'inside', withoutEnlargement: true })
        .webp({ quality: QUALITY.webp, effort: 6 })
        .toFile(webpPath);
      
      const stat = statSync(webpPath);
      results.webp.push({ width, path: webpPath, size: stat.size });
      generatedAnyWebP = true;
    }
    
    // If image is smaller than smallest width, generate at original size
    if (!generatedAnyWebP && metadata.width > 0) {
      const webpPath = join(OUTPUT_DIR, `${outputBaseName}-${metadata.width}w.webp`);
      await pipeline.clone()
        .webp({ quality: QUALITY.webp, effort: 6 })
        .toFile(webpPath);
      const stat = statSync(webpPath);
      results.webp.push({ width: metadata.width, path: webpPath, size: stat.size });
    }
    
    // Generate AVIF variant (best compression) - largest generated width
    const maxWebPWidth = results.webp.length > 0 
      ? Math.max(...results.webp.map(w => w.width))
      : metadata.width;
    
    if (maxWebPWidth) {
      const avifPath = join(OUTPUT_DIR, `${outputBaseName}-${maxWebPWidth}w.avif`);
      await pipeline.clone()
        .resize(maxWebPWidth, null, { fit: 'inside', withoutEnlargement: true })
        .avif({ quality: QUALITY.avif, effort: 9 })
        .toFile(avifPath);
      
      const stat = statSync(avifPath);
      results.avif.push({ width: maxWebPWidth, path: avifPath, size: stat.size });
    }
    
    // Also create optimized original format at max width
    const ext = extname(inputPath).toLowerCase();
    if (['.jpg', '.jpeg'].includes(ext)) {
      const jpegPath = join(OUTPUT_DIR, `${outputBaseName}-${maxWebPWidth}w.jpg`);
      await pipeline.clone()
        .resize(maxWebPWidth, null, { fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: QUALITY.jpeg, mozjpeg: true })
        .toFile(jpegPath);
    } else if (ext === '.png') {
      const pngPath = join(OUTPUT_DIR, `${outputBaseName}-${maxWebPWidth}w.png`);
      await pipeline.clone()
        .resize(maxWebPWidth, null, { fit: 'inside', withoutEnlargement: true })
        .png({ quality: QUALITY.png, compressionLevel: 9, adaptiveFiltering: true })
        .toFile(pngPath);
    }
    
    console.log(`  ✓ ${basename(inputPath)} → ${results.webp.length} WebP + ${results.avif.length} AVIF`);
    return results;
    
  } catch (error) {
    console.error(`  ✗ Failed to optimize ${basename(inputPath)}:`, error.message);
    return null;
  }
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function generatePictureElement(baseName, originalExt, alt, results) {
  const webpSources = results.webp
    .sort((a, b) => a.width - b.width)
    .map(w => `  <source srcset="/images/optimized/${baseName}-${w.width}w.webp" type="image/webp" media="(max-width: ${w.width}px)">`)
    .join('\n');
  
  const avifSource = results.avif.length > 0 
    ? `  <source srcset="/images/optimized/${baseName}-${results.avif[0].width}w.avif" type="image/avif" media="(max-width: ${results.avif[0].width}px)">`
    : '';
  
  const fallbackWidth = results.webp.length > 0 ? results.webp[results.webp.length - 1].width : 'auto';
  const fallbackExt = originalExt === '.png' ? 'png' : 'jpg';
  const fallbackPath = results.webp.length > 0 
    ? `/images/optimized/${baseName}-${fallbackWidth}w.${fallbackExt}`
    : `/images/${baseName}${originalExt}`;
  
  return `<picture>
${avifSource}
${webpSources}
  <img src="${fallbackPath}" alt="${alt}" loading="lazy" decoding="async" width="${results.original?.width || 'auto'}" height="${results.original?.height || 'auto'}">
</picture>`;
}

async function main() {
  console.log('🖼️  Starting image optimization...\n');
  
  // Create output directory
  if (!existsSync(OUTPUT_DIR)) {
    mkdirSync(OUTPUT_DIR, { recursive: true });
  }
  
  // Read input files
  const files = readdirSync(INPUT_DIR)
    .filter(f => !f.startsWith('.') && !SKIP_FILES.includes(f) && !f.endsWith('.svg'))
    .filter(f => ['.png', '.jpg', '.jpeg', '.webp', '.avif'].includes(extname(f).toLowerCase()));
  
  console.log(`Found ${files.length} images to optimize:\n`);
  
  const allResults = {};
  let totalOriginalSize = 0;
  let totalOptimizedSize = 0;
  
  for (const file of files) {
    const inputPath = join(INPUT_DIR, file);
    const baseName = basename(file, extname(file));
    
    process.stdout.write(`  Processing ${file}... `);
    const results = await optimizeImage(inputPath, baseName);
    
    if (results && results.webp.length > 0) {
      allResults[file] = results;
      totalOriginalSize += results.original.size;
      
      // Calculate best optimized size (smallest WebP)
      const bestWebp = results.webp.reduce((min, w) => w.size < min.size ? w : min, results.webp[0]);
      totalOptimizedSize += bestWebp.size;
    }
  }
  
  console.log('\n📊 Optimization Summary:');
  console.log(`  Original total: ${formatBytes(totalOriginalSize)}`);
  console.log(`  Optimized total: ${formatBytes(totalOptimizedSize)}`);
  console.log(`  Savings: ${formatBytes(totalOriginalSize - totalOptimizedSize)} (${((1 - totalOptimizedSize / totalOriginalSize) * 100).toFixed(1)}%)\n`);
  
  // Generate picture elements for projects.js update
  console.log('📝 Picture elements for projects.js:');
  for (const [file, results] of Object.entries(allResults)) {
    const baseName = basename(file, extname(file));
    const alt = file.replace(/[-_]/g, ' ').replace(/\.[^.]+$/, '');
    const picture = generatePictureElement(baseName, extname(file), alt, results);
    console.log(`\n${file}:`);
    console.log(picture);
  }
  
  // Save results manifest for reference
  const manifestPath = join(OUTPUT_DIR, 'manifest.json');
  writeFileSync(manifestPath, JSON.stringify(allResults, null, 2));
  console.log(`\n✅ Manifest saved to ${manifestPath}`);
}

main().catch(console.error);