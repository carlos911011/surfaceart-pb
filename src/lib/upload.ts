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

const MAX_FILE_SIZE = 10 * 1024 * 1024;
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

async function uploadToCloudinary(buffer: Buffer, filename: string, folder: string): Promise<string> {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, public_id: filename.replace(/\.[^.]+$/, ""), resource_type: "image" },
      (error, result) => {
        if (error || !result) reject(error ?? new Error("Upload failed"));
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
  const filename = `${quoteId}-${uuid}.${ext}`;

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

  const url = process.env.CLOUDINARY_CLOUD_NAME
    ? await uploadToCloudinary(finalBuffer, filename, "surfaceart/quotes")
    : await uploadToLocalDisk(finalBuffer, quoteId, filename);

  return { filename, originalName: file.name, size: finalBuffer.length, mimeType: detectedMime, url };
}

export async function uploadGalleryImage(file: File): Promise<string> {
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
  const filename = `gallery-${uuid}.${ext}`;

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

  if (process.env.CLOUDINARY_CLOUD_NAME) {
    return uploadToCloudinary(finalBuffer, filename, "surfaceart/gallery");
  }

  const uploadDir = path.join(process.cwd(), "public", "uploads", "gallery");
  await fs.mkdir(uploadDir, { recursive: true });
  await fs.writeFile(path.join(uploadDir, filename), finalBuffer);
  return `/uploads/gallery/${filename}`;
}

export async function uploadTestimonialImage(file: File): Promise<string> {
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
  const filename = `testimonial-${uuid}.${ext}`;

  const MAX_AVATAR_WIDTH = 400;
  let finalBuffer: Buffer = buffer;
  try {
    const image = sharp(buffer);
    const metadata = await image.metadata();
    if (metadata.width && metadata.width > MAX_AVATAR_WIDTH) {
      const resized = await image
        .resize({ width: MAX_AVATAR_WIDTH, withoutEnlargement: true })
        .toBuffer();
      finalBuffer = Buffer.from(resized);
    }
  } catch {
    finalBuffer = buffer;
  }

  if (process.env.CLOUDINARY_CLOUD_NAME) {
    return uploadToCloudinary(finalBuffer, filename, "surfaceart/testimonials");
  }

  const uploadDir = path.join(process.cwd(), "public", "uploads", "testimonials");
  await fs.mkdir(uploadDir, { recursive: true });
  await fs.writeFile(path.join(uploadDir, filename), finalBuffer);
  return `/uploads/testimonials/${filename}`;
}

export async function deleteQuotePhotos(quoteId: string): Promise<void> {
  if (!process.env.CLOUDINARY_CLOUD_NAME) {
    const uploadDir = path.join(process.cwd(), "public", "uploads", quoteId);
    try { await fs.rm(uploadDir, { recursive: true, force: true }); } catch { /* ok */ }
  }
}
