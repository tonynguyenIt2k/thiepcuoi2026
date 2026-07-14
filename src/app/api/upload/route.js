import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

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
    const formData = await request.formData();
    const file = formData.get('file');
    if (!file) {
      return NextResponse.json({ error: 'Không tìm thấy tệp tin nào được tải lên.' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Chuẩn hóa tên file
    const originalName = file.name || 'file';
    const ext = path.extname(originalName).toLowerCase();
    const baseName = path.basename(originalName, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    const filename = `${Date.now()}_${baseName}${ext}`;

    const r2Client = getR2Client();
    const bucketName = process.env.CLOUDFLARE_R2_BUCKET_NAME;
    const publicUrl = process.env.CLOUDFLARE_R2_PUBLIC_URL;

    if (r2Client && bucketName && publicUrl) {
      // 1. Tải lên Cloudflare R2
      const cleanPublicUrl = publicUrl.endsWith('/') ? publicUrl.slice(0, -1) : publicUrl;
      const mimeType = file.type || 'application/octet-stream';

      await r2Client.send(
        new PutObjectCommand({
          Bucket: bucketName,
          Key: filename,
          Body: buffer,
          ContentType: mimeType,
        })
      );

      return NextResponse.json({
        success: true,
        url: `${cleanPublicUrl}/${filename}`,
      });
    } else {
      // 2. Fallback: Lưu cục bộ nếu chưa có cấu hình R2
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      const filePath = path.join(uploadsDir, filename);
      fs.writeFileSync(filePath, buffer);

      return NextResponse.json({
        success: true,
        url: `/uploads/${filename}`,
      });
    }
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
