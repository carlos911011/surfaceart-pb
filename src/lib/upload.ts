import path from "path";
import fs from "fs/promises";
import crypto from "crypto";
import sharp from "sharp";
import { v2 as cloudinary } from "cloudinary";

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
]);

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const MAX_IMAGE_WIDTH = 2000;

function detectMimeFromBuffer(buffer: Buffer): string | null {
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) return "image/jpeg";
  if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47) return "image/png";
  if (
    buffer[0] === 0x52 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x46 &&
    buffer[8] === 0x57 && buffer[9] === 0x45 && buffer[10] === 0x42 && buffer[11] === 0x50
  ) return "image/webp";
  if (buffer[4] === 0x66 && buffer[5] === 0x74 && buffer[6] === 0x79 && buffer[7] === 0x70) return "image/heic";
  return null;
}

function isCloudinaryConfigured(): boolean {
  return !!(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  );
}

async function uploadToCloudinary(buffer: Buffer, quoteId: string, filename: string): Promise<string> {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  return new Promise((resolve, reject) => {
    const publicId = `surfaceart/quotes/${quoteId}/${filename.replace(/\.[^.]+$/, "")}`;
    const stream = cloudinary.uploader.upload_stream(
      { public_id: publicId, resource_type: "image", overwrite: true },
      (error, result) => {
        if (error || !result) reject(error ?? new Error("Cloudinary upload failed"));
        else resolve(result.secure_url);
      }
    );
    stream.end(buffer);
  });
}

async function uploadToLocalDisk(buffer: Buffer, quoteId: string, filename: string): Promise<string> {
  const uploadDir = path.join(process.cwd(), "public", "uploads", quoteId);
  await fs.mkdir(uploadDir, { recursive: true });
  await fs.writeFile(path.join(uploadDir, filename), buffer);
  return `/uploads/${quoteId}/${filename}`;
}

export interface UploadResult {
  filename: string;
  originalName: string;
  size: number;
  mimeType: string;
  url: string;
}

export interface UploadError {
  originalName: string;
  error: string;
}

export async function uploadPhoto(file: File, quoteId: string): Promise<UploadResult> {
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`File "${file.name}" exceeds the 10 MB limit`);
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const detectedMime = detectMimeFromBuffer(buffer);
  if (!detectedMime || !ALLOWED_MIME_TYPES.has(detectedMime)) {
    throw new Error(`File "${file.name}" is not a valid image`);
  }

  const ext = detectedMime === "image/jpeg" ? "jpg"
    : detectedMime === "image/png" ? "png"
    : detectedMime === "image/webp" ? "webp"
    : "heic";
  const uuid = crypto.randomUUID();
  const filename = `${uuid}.${ext}`;

  // Resize if needed
  let finalBuffer: Buffer = buffer;
  try {
    const image = sharp(buffer);
    const metadata = await image.metadata();
    if (metadata.width && metadata.width > MAX_IMAGE_WIDTH) {
      const resized = await image
        .resize({ width: MAX_IMAGE_WIDTH, withoutEnlargement: true })
        .toBuffer();
      finalBuffer = Buffer.from(resized);
    }
  } catch {
    finalBuffer = buffer;
  }

  const url = isCloudinaryConfigured()
    ? await uploadToCloudinary(finalBuffer, quoteId, filename)
    : await uploadToLocalDisk(finalBuffer, quoteId, filename);

  return {
    filename,
    originalName: file.name,
    size: finalBuffer.length,
    mimeType: detectedMime,
    url,
  };
}

export async function deleteQuotePhotos(quoteId: string): Promise<void> {
  // Local disk cleanup (only applies in dev)
  if (!isCloudinaryConfigured()) {
    const uploadDir = path.join(process.cwd(), "public", "uploads", quoteId);
    try {
      await fs.rm(uploadDir, { recursive: true, force: true });
    } catch {
      // Directory may not exist
    }
  }
  // Cloudinary: files accumulate — can be cleaned up via Cloudinary dashboard
  // or add a bulk delete call here if needed in production
}
