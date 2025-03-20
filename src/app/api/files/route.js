import { promises as fs } from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    const { searchParams } = req.nextUrl;
    console.log(searchParams, 'searchParams');
    const fileName = searchParams.get('p1'); // Get fileName from query string

    console.log(fileName, 'fileName');

    if (!fileName) {
      console.log('file name not found');
      const publicDirectory = path.join(process.cwd(), '/public/uploads');
      const Files = await fs.readdir(publicDirectory);
      const files = Files.map(key => key.endsWith('pdf') ? `./uploads/${key}` : '').filter(Boolean);
      return NextResponse.json({ success: true, files }, { status: 200 });
    } else {
      console.log('file name', fileName);
      const publicDirectory = path.join(process.cwd(), '/public/uploads');
      const filePath = path.join(publicDirectory, fileName);
      try {
        await fs.access(filePath);
        return NextResponse.json({ success: true, file: `./uploads/${fileName}` }, { status: 200 });
      } catch (err) {
        return NextResponse.json({ success: false, error: 'File not found' }, { status: 404 });
      }
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const publicDirectory = path.join(process.cwd(), '/public/uploads');
    const Files = await fs.readdir(publicDirectory);
    const files = Files.map(key => key.endsWith('pdf') ? { fileName: key } : '').filter(Boolean);
    return NextResponse.json({ success: true, files }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const { fileName } = await req.json(); // Parse JSON body in DELETE request
    if (!fileName) {
      return NextResponse.json({ success: false, error: 'File name is required' }, { status: 400 });
    }

    const publicDirectory = path.join(process.cwd(), 'public/uploads');
    const filePath = path.join(publicDirectory, fileName);

    try {
      await fs.access(filePath); 
      await fs.unlink(filePath); 
      return NextResponse.json({ success: true, message: 'File deleted successfully' }, { status: 200 });
    } catch (err) {
      return NextResponse.json({ success: false, error: 'File not found or already deleted' }, { status: 404 });
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
