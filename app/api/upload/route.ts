import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPG, PNG, and GIF are allowed.' },
        { status: 400 }
      );
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 5MB.' },
        { status: 500 }
      );
    }

    // Check if Cloudinary is configured for production
    const isCloudinaryConfigured = process.env.CLOUDINARY_CLOUD_NAME && 
                                  process.env.CLOUDINARY_API_KEY && 
                                  process.env.CLOUDINARY_API_SECRET;

    if (process.env.NODE_ENV === 'production' && isCloudinaryConfigured) {
      // Use Cloudinary in production
      try {
        // Convert file to base64 for Cloudinary upload
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const base64 = buffer.toString('base64');
        const dataURI = `data:${file.type};base64,${base64}`;

        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(dataURI, {
          folder: 'fsg-slides',
          resource_type: 'auto',
          public_id: `slide_${Date.now()}`,
        });

        return NextResponse.json({ 
          success: true, 
          url: result.secure_url,
          filename: result.public_id,
          cloudinary: true
        });
      } catch (cloudinaryError) {
        console.error('Cloudinary upload error:', cloudinaryError);
        return NextResponse.json(
          { error: 'Failed to upload to Cloudinary' },
          { status: 500 }
        );
      }
    } else {
      // Fallback to local file system in development
      try {
        // Create slides directory if it doesn't exist
        const slidesDir = path.join(process.cwd(), 'public', 'slides');
        if (!fs.existsSync(slidesDir)) {
          fs.mkdirSync(slidesDir, { recursive: true });
        }

        // Generate unique filename
        const timestamp = Date.now();
        const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const filename = `${timestamp}_${originalName}`;
        const filepath = path.join(slidesDir, filename);

        // Save file locally
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        fs.writeFileSync(filepath, buffer);

        // Return the public URL
        const publicUrl = `/slides/${filename}`;
        
        return NextResponse.json({ 
          success: true, 
          url: publicUrl,
          filename: filename,
          cloudinary: false
        });
      } catch (fsError) {
        console.error('File system error:', fsError);
        return NextResponse.json(
          { error: 'Failed to save file locally' },
          { status: 500 }
        );
      }
    }
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}
