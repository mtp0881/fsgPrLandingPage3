import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const contentFilePath = path.join(process.cwd(), 'data', 'content.json');

export async function GET() {
  try {
    const fileContents = fs.readFileSync(contentFilePath, 'utf8');
    const content = JSON.parse(fileContents);
    return NextResponse.json(content);
  } catch (error) {
    console.error('Error reading content file:', error);
    return NextResponse.json(
      { error: 'Failed to read content' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const content = await request.json();
    
    // Validate content structure
    if (!content.jp || !content.vn) {
      return NextResponse.json(
        { error: 'Invalid content structure' },
        { status: 400 }
      );
    }

    // Write to file
    fs.writeFileSync(contentFilePath, JSON.stringify(content, null, 2), 'utf8');
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error writing content file:', error);
    return NextResponse.json(
      { error: 'Failed to save content' },
      { status: 500 }
    );
  }
}
