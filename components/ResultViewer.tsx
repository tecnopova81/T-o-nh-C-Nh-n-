
import React from 'react';
import { DownloadIcon, ImageIcon } from './icons';

interface ResultViewerProps {
  imageUrl: string | null;
  isLoading: boolean;
  error: string | null;
}

const LoadingState: React.FC = () => (
  <div className="flex flex-col items-center justify-center h-full text-center text-gray-400">
    <div className="relative w-24 h-24 mb-4">
      <div className="absolute inset-0 bg-purple-500 rounded-full animate-ping opacity-60"></div>
      <div className="absolute inset-2 bg-pink-500 rounded-full animate-ping opacity-60 delay-150"></div>
      <ImageIcon className="relative w-24 h-24 text-gray-300" />
    </div>
    <p className="text-lg font-semibold text-gray-200">AI is crafting your masterpiece...</p>
    <p className="mt-1">This may take a moment. Please wait.</p>
  </div>
);

const PlaceholderState: React.FC = () => (
  <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
    <ImageIcon className="w-24 h-24 mb-4" />
    <p className="text-lg font-semibold text-gray-300">Your generated image will appear here</p>
    <p className="mt-1">Upload an image and provide a prompt to start.</p>
  </div>
);

const ResultViewer: React.FC<ResultViewerProps> = ({ imageUrl, isLoading, error }) => {
  return (
    <div className="aspect-square w-full bg-gray-900/50 rounded-lg flex items-center justify-center relative p-2">
      {isLoading && <LoadingState />}
      {error && !isLoading && (
        <div className="text-center text-red-400 p-4">
          <p className="font-bold text-lg">An Error Occurred</p>
          <p className="mt-2 text-sm break-words">{error}</p>
        </div>
      )}
      {!isLoading && !error && imageUrl && (
        <div className="w-full h-full relative group">
          <img src={imageUrl} alt="Generated result" className="w-full h-full object-contain rounded-md" />
          <a
            href={imageUrl}
            download="generated-image.png"
            className="absolute bottom-4 right-4 bg-black bg-opacity-60 text-white p-3 rounded-full hover:bg-opacity-80 hover:bg-purple-600 transition-all duration-300 transform translate-y-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0"
            title="Download Image"
          >
            <DownloadIcon className="w-6 h-6" />
          </a>
        </div>
      )}
      {!isLoading && !error && !imageUrl && <PlaceholderState />}
    </div>
  );
};

export default ResultViewer;
