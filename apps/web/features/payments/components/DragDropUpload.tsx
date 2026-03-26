'use client';

import React, { useState, useRef } from 'react';
import { Upload, File, X, CheckCircle } from 'lucide-react';

interface DragDropUploadProps {
  onFileSelect: (files: File[]) => void;
  acceptedFormats?: string[];
}

const ACCEPTED_FORMATS = ['application/pdf', 'image/jpeg', 'image/png'];
const FORMAT_EXTENSIONS = ['.PDF', '.JPG', '.PNG'];

export function DragDropUpload({ onFileSelect, acceptedFormats = ACCEPTED_FORMATS }: DragDropUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const validateFiles = (files: FileList | null): File[] => {
    if (!files) return [];
    return Array.from(files).filter(file => acceptedFormats.includes(file.type));
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const validFiles = validateFiles(e.dataTransfer.files);
    if (validFiles.length > 0) {
      const newFiles = [...uploadedFiles, ...validFiles];
      setUploadedFiles(newFiles);
      onFileSelect(validFiles); // Only send the new ones
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const validFiles = validateFiles(e.target.files);
    if (validFiles.length > 0) {
      const newFiles = [...uploadedFiles, ...validFiles];
      setUploadedFiles(newFiles);
      onFileSelect(validFiles); // Only send the new ones
    }
  };

  const removeFile = (index: number) => {
    const newFiles = uploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(newFiles);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      {/* Drop Area */}
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-200 ${
          isDragging
            ? 'border-indigo-400 bg-indigo-50'
            : 'border-slate-300 bg-slate-50 hover:border-slate-400'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={handleFileInput}
          className="hidden"
        />

        <div className="space-y-3">
          <div className="flex justify-center">
            <div className={`p-3 rounded-lg ${isDragging ? 'bg-indigo-100' : 'bg-slate-100'}`}>
              <Upload
                size={24}
                className={isDragging ? 'text-indigo-600' : 'text-slate-600'}
              />
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-900">
              {isDragging ? 'Drop your files here' : 'Drag and drop your receipts here'}
            </p>
            <p className="text-xs text-slate-500 mt-1">or</p>
          </div>

          <button
            type="button"
            onClick={triggerFileInput}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium text-sm"
          >
            Browse Files
          </button>

          <div className="pt-2 border-t border-slate-200">
            <p className="text-xs text-slate-500">
              Accepted formats: <span className="font-semibold text-slate-600">{FORMAT_EXTENSIONS.join(', ')}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Uploaded Files List */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
            Uploaded Files ({uploadedFiles.length})
          </p>
          <div className="space-y-2">
            {uploadedFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 bg-emerald-50 border border-emerald-200 rounded-lg"
              >
                <CheckCircle size={16} className="text-emerald-600 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">{file.name}</p>
                  <p className="text-xs text-slate-500">
                    {(file.size / 1024).toFixed(2)} KB
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="p-1 hover:bg-red-100 rounded transition-colors"
                >
                  <X size={16} className="text-red-600" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
