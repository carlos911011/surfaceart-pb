"use client";

import { useRef, useState, useCallback } from "react";

export interface PhotoFile {
  id: string;
  file: File;
  preview: string;
  error?: string;
}

interface PhotoUploadProps {
  photos: PhotoFile[];
  onChange: (photos: PhotoFile[]) => void;
  maxPhotos?: number;
  maxSizeMB?: number;
}

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"];
const ACCEPT_STRING = ".jpg,.jpeg,.png,.webp,.heic,.heif";

export default function PhotoUpload({
  photos,
  onChange,
  maxPhotos = 10,
  maxSizeMB = 10,
}: PhotoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const processFiles = useCallback(
    (files: FileList | File[]) => {
      const fileArr = Array.from(files);
      const remaining = maxPhotos - photos.length;
      if (remaining <= 0) return;

      const toAdd = fileArr.slice(0, remaining).map((file): PhotoFile => {
        const id = crypto.randomUUID();

        if (!ACCEPTED_TYPES.includes(file.type) && !file.name.match(/\.(heic|heif)$/i)) {
          return {
            id,
            file,
            preview: "",
            error: `${file.name}: Invalid file type`,
          };
        }
        if (file.size > maxSizeMB * 1024 * 1024) {
          return {
            id,
            file,
            preview: "",
            error: `${file.name}: Exceeds ${maxSizeMB}MB limit`,
          };
        }

        const preview = URL.createObjectURL(file);
        return { id, file, preview };
      });

      onChange([...photos, ...toAdd]);
    },
    [photos, onChange, maxPhotos, maxSizeMB]
  );

  function removePhoto(id: string) {
    const photo = photos.find((p) => p.id === id);
    if (photo?.preview) URL.revokeObjectURL(photo.preview);
    onChange(photos.filter((p) => p.id !== id));
  }

  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      processFiles(e.target.files);
      e.target.value = "";
    }
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    processFiles(e.dataTransfer.files);
  }

  const isFull = photos.length >= maxPhotos;
  const validPhotos = photos.filter((p) => !p.error);

  return (
    <div>
      {/* Drop zone */}
      {!isFull && (
        <div
          onDrop={onDrop}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onClick={() => inputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
          aria-label="Upload photos"
          className={[
            "border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200",
            dragging
              ? "border-gold bg-gold/5 scale-[1.01]"
              : "border-carbon/20 hover:border-gold/50 hover:bg-gold/3",
          ].join(" ")}
        >
          <div className="flex flex-col items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-gold/10 flex items-center justify-center">
              <svg className="w-7 h-7 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-carbon">
                {dragging ? "Drop photos here" : "Drag & drop photos or click to browse"}
              </p>
              <p className="text-carbon/50 text-sm mt-1">
                JPG, PNG, WEBP, HEIC · Max {maxSizeMB}MB each
              </p>
            </div>
            <span className="text-xs text-carbon/40 border border-carbon/20 rounded-full px-3 py-1">
              {validPhotos.length} of {maxPhotos} photos added
            </span>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPT_STRING}
            multiple
            className="sr-only"
            onChange={onInputChange}
            aria-hidden
          />
        </div>
      )}

      {/* Thumbnails */}
      {photos.length > 0 && (
        <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
          {photos.map((photo) => (
            <div
              key={photo.id}
              className={[
                "relative group rounded-xl overflow-hidden aspect-square",
                photo.error ? "border-2 border-red-400" : "border border-carbon/10",
              ].join(" ")}
            >
              {photo.preview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={photo.preview}
                  alt={photo.file.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-red-50 flex items-center justify-center p-2">
                  <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
              )}

              {/* Error tooltip */}
              {photo.error && (
                <div className="absolute inset-0 bg-red-50/90 flex items-center justify-center p-1">
                  <p className="text-red-500 text-[10px] text-center leading-tight">{photo.error}</p>
                </div>
              )}

              {/* Remove button */}
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); removePhoto(photo.id); }}
                className="absolute top-1 right-1 w-6 h-6 rounded-full bg-carbon/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-carbon"
                aria-label={`Remove ${photo.file.name}`}
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* File type badge */}
              {!photo.error && (
                <div className="absolute bottom-1 left-1 bg-black/40 rounded px-1 py-0.5 text-[9px] text-white uppercase">
                  {photo.file.name.split(".").pop()}
                </div>
              )}
            </div>
          ))}

          {/* Add more tile */}
          {!isFull && photos.length > 0 && (
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="aspect-square rounded-xl border-2 border-dashed border-carbon/20 hover:border-gold/50 flex items-center justify-center transition-colors"
              aria-label="Add more photos"
            >
              <svg className="w-6 h-6 text-carbon/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          )}
        </div>
      )}

      {isFull && (
        <p className="text-sm text-carbon/50 mt-2 text-center">
          Maximum {maxPhotos} photos reached.{" "}
          <button type="button" onClick={() => removePhoto(photos[0].id)} className="text-gold underline">
            Remove one
          </button>{" "}
          to add more.
        </p>
      )}
    </div>
  );
}
