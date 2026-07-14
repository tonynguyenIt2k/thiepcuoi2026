import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'src', 'app', 'configs', 'ui.json');

export async function GET() {
  try {
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: 'Config file not found' }, { status: 404 });
    }
    const data = fs.readFileSync(filePath, 'utf-8');
    return NextResponse.json(JSON.parse(data));
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    fs.writeFileSync(filePath, JSON.stringify(body, null, 2), 'utf-8');
    return NextResponse.json({ success: true, message: 'Cấu hình đã được lưu thành công!' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
