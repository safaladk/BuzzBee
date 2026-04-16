import React from "react";
import { Image as ImageIcon, Upload, X } from "lucide-react";
import { CreateEventPayload } from "@/lib/types";

interface EventImageUploadProps {
  formData: CreateEventPayload;
  imageMode: "url" | "file";
  imagePreview: string | null;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClearImage: () => void;
  onSetImageMode: (mode: "url" | "file") => void;
}

export function EventImageUpload({
  formData,
  imageMode,
  imagePreview,
  fileInputRef,
  onChange,
  onFileSelect,
  onClearImage,
  onSetImageMode,
}: EventImageUploadProps) {
  return (
    <div className="mt-8">
      <label className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
        <ImageIcon size={18} />
        Event Image
      </label>

      {/* Mode Toggle */}
      <div className="flex gap-2 mb-4">
        <button
          type="button"
          onClick={() => {
            onSetImageMode("url");
            onClearImage();
          }}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            imageMode === "url"
              ? "bg-amber-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          URL
        </button>
        <button
          type="button"
          onClick={() => {
            onSetImageMode("file");
            // We don't necessarily clear here if we want to keep the URL text in state, 
            // but the parent logic handle it
          }}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            imageMode === "file"
              ? "bg-indigo-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Upload
        </button>
      </div>

      {/* URL Input */}
      {imageMode === "url" && (
        <input
          type="url"
          name="image"
          value={formData.image || ""}
          onChange={onChange}
          placeholder="https://example.com/image.jpg"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-600"
        />
      )}

      {/* File Upload */}
      {imageMode === "file" && (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={onFileSelect}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full px-4 py-8 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-indigo-600 hover:bg-indigo-50 transition flex flex-col items-center gap-2"
          >
            <Upload size={24} />
            <span className="text-sm font-medium">
              Click to upload or drag and drop
            </span>
            <span className="text-xs text-gray-500">
              PNG, JPG, GIF up to 5MB
            </span>
          </button>

          {/* Image Preview */}
          {imagePreview && (
            <div className="mt-4 relative">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-48 object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={onClearImage}
                className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-lg hover:bg-red-600"
              >
                <X size={18} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
