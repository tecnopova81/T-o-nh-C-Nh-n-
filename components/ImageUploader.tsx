
import React, { useRef, useCallback } from 'react';
import { UploadIcon } from './icons';

interface ImageUploaderProps {
  onImageSelect: (file: File) => void;
  imagePreviewUrl: string | null;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelect, imagePreviewUrl }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      onImageSelect(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleDragOver = useCallback((event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
  }, []);

  const handleDrop = useCallback((event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
        onImageSelect(file);
    }
  }, [onImageSelect]);


  return (
    <div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/png, image/jpeg, image/webp"
      />
      <label
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className="cursor-pointer aspect-square w-full bg-gray-700/50 rounded-lg border-2 border-dashed border-gray-500 flex flex-col items-center justify-center text-gray-400 hover:border-purple-400 hover:text-purple-300 transition-all duration-300 relative overflow-hidden"
      >
        {imagePreviewUrl ? (
          <img src={imagePreviewUrl} alt="Preview" className="w-full h-full object-cover" />
        ) : (
          <div className="text-center p-4">
            <UploadIcon className="w-10 h-10 mx-auto mb-2" />
            <p className="font-semibold">Click to upload</p>
            <p className="text-sm">or drag and drop</p>
            <p className="text-xs mt-1">PNG, JPG, WEBP</p>
          </div>
        )}
      </label>
    </div>
  );
};

export default ImageUploader;
