#!/usr/bin/env node

/**
 * This script initializes the media setup for the application:
 * 1. Creates the media directory if it doesn't exist
 * 2. Creates a symlink from public/media to the media directory
 * 3. Creates a placeholder image in public directory
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to the media directory
const mediaDir = path.resolve(process.cwd(), 'media');
const publicMediaPath = path.resolve(process.cwd(), 'public/media');

console.log('=== INITIALIZING MEDIA SETUP ===');

// Check if the media directory exists
if (!fs.existsSync(mediaDir)) {
  console.log(`Creating media directory at: ${mediaDir}`);
  fs.mkdirSync(mediaDir, { recursive: true });
  console.log('✅ Media directory created successfully');
} else {
  console.log(`✅ Media directory already exists at: ${mediaDir}`);
}

// Create symlink from public/media to media directory
try {
  // Check if we're in a Vercel deployment
  const isVercel = process.env.VERCEL === '1';
  
  // If we're on Vercel, just create a directory instead of a symlink
  if (isVercel) {
    console.log('Detected Vercel environment - creating directory instead of symlink');
    
    if (fs.existsSync(publicMediaPath)) {
      const stats = fs.lstatSync(publicMediaPath);
      if (stats.isSymbolicLink()) {
        fs.unlinkSync(publicMediaPath);
        console.log('Removed existing public/media symlink');
      }
    }
    
    if (!fs.existsSync(publicMediaPath)) {
      fs.mkdirSync(publicMediaPath, { recursive: true });
      console.log(`✅ Created media directory at: ${publicMediaPath}`);
    }
  } else {
    // For local development, use symlinks
    // Remove existing symlink if it exists
    if (fs.existsSync(publicMediaPath)) {
      fs.unlinkSync(publicMediaPath);
      console.log('Removed existing public/media symlink');
    }
    
    // Create the symlink
    fs.symlinkSync(
      path.relative(path.dirname(publicMediaPath), mediaDir), 
      publicMediaPath, 
      'dir'
    );
    console.log(`✅ Created symlink from public/media to ${mediaDir}`);
  }
} catch (error) {
  console.error('❌ Error setting up media directory:', error);
  
  // Fallback: Create a regular directory
  console.log('Falling back to creating a regular directory');
  if (!fs.existsSync(publicMediaPath)) {
    fs.mkdirSync(publicMediaPath, { recursive: true });
    console.log(`✅ Created media directory at: ${publicMediaPath} (fallback)`);
  }
}

// Create a placeholder image if it doesn't exist yet
const placeholderImagePath = path.resolve(process.cwd(), 'public', 'image-placeholder.svg');

if (!fs.existsSync(placeholderImagePath)) {
  console.log(`Creating placeholder image at: ${placeholderImagePath}`);
  
  const svgContent = `<svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="400" fill="#f0f0f0"/>
  <text x="50%" y="50%" font-family="Arial" font-size="24" fill="#888" text-anchor="middle">
    Image Placeholder
  </text>
  <rect x="150" y="170" width="100" height="80" fill="#ddd"/>
  <polyline points="150,170 200,130 250,170" fill="#ddd"/>
  <circle cx="180" cy="150" r="10" fill="#bbb"/>
</svg>`;
  
  fs.writeFileSync(placeholderImagePath, svgContent);
  console.log('✅ Placeholder image created successfully');
} else {
  console.log(`✅ Placeholder image already exists at: ${placeholderImagePath}`);
}

console.log('=== MEDIA INITIALIZATION COMPLETE ===');
