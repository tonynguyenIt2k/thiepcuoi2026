import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3';

// Khởi tạo S3 Client cho Cloudflare R2
const getR2Client = () => {
  const accountId = process.env.CLOUDFLARE_R2_ACCOUNT_ID;
  const accessKeyId = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY;

  if (!accountId || !accessKeyId || !secretAccessKey) {
    return null;
  }

  return new S3Client({
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
    region: 'auto',
  });
};

export async function POST(request) {
  try {
    const { url } = await request.json();
    if (!url) {
      return NextResponse.json({ error: 'Không nhận được đường dẫn file cần xóa.' }, { status: 400 });
    }

    const r2Client = getR2Client();
    const bucketName = process.env.CLOUDFLARE_R2_BUCKET_NAME;

    // 1. Nếu là ảnh lưu trên Cloudflare R2
    if (r2Client && bucketName && url.startsWith('http')) {
      // Lấy tên file ở cuối URL
      const parts = url.split('/');
      const filename = parts[parts.length - 1];

      await r2Client.send(
        new DeleteObjectCommand({
          Bucket: bucketName,
          Key: filename,
        })
      );

      return NextResponse.json({ success: true, message: `Đã xóa file ${filename} trên Cloudflare R2.` });
    } 
    
    // 2. Nếu là ảnh lưu cục bộ (Local uploads)
    if (url.startsWith('/uploads/')) {
      const filename = url.replace('/uploads/', '');
      const filePath = path.join(process.cwd(), 'public', 'uploads', filename);

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        return NextResponse.json({ success: true, message: `Đã xóa file cục bộ ${filename}.` });
      }
    }

    return NextResponse.json({ success: true, message: 'Đường dẫn file không cần xử lý xóa hoặc không tồn tại.' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
