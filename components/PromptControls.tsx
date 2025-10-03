
import React, { useState } from 'react';
import { AspectRatio } from '../types';
import { SparklesIcon, LoadingSpinnerIcon } from './icons';

interface PromptControlsProps {
  onGenerate: (prompt: string, aspectRatio: AspectRatio) => void;
  isLoading: boolean;
  isImageUploaded: boolean;
}

const PromptControls: React.FC<PromptControlsProps> = ({ onGenerate, isLoading, isImageUploaded }) => {
  const [prompt, setPrompt] = useState<string>('');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>(AspectRatio.Square);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (prompt.trim() && isImageUploaded) {
      onGenerate(prompt, aspectRatio);
    }
  };

  const canGenerate = prompt.trim().length > 0 && !isLoading && isImageUploaded;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="e.g., professional headshot for LinkedIn, cinematic lighting, wearing a dark blue suit, blurred office background..."
        className="w-full h-32 p-3 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors placeholder-gray-400 resize-none"
        disabled={isLoading}
      />
      
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Aspect Ratio</label>
        <div className="grid grid-cols-3 gap-2">
          {(Object.keys(AspectRatio) as Array<keyof typeof AspectRatio>).map((key) => {
            const value = AspectRatio[key];
            return (
              <button
                key={value}
                type="button"
                onClick={() => setAspectRatio(value)}
                disabled={isLoading}
                className={`px-3 py-2 text-sm font-semibold rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-purple-500
                  ${aspectRatio === value ? 'bg-purple-600 text-white' : 'bg-gray-600 text-gray-200 hover:bg-gray-500'}
                `}
              >
                {key}
              </button>
            );
          })}
        </div>
      </div>
      
      <button
        type="submit"
        disabled={!canGenerate}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 font-bold text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-md shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:bg-gray-500"
      >
        {isLoading ? (
          <>
            <LoadingSpinnerIcon className="w-5 h-5" />
            Generating...
          </>
        ) : (
          <>
            <SparklesIcon className="w-5 h-5" />
            Generate Image
          </>
        )}
      </button>
      {!isImageUploaded && <p className="text-xs text-center text-yellow-400">Please upload an image to enable generation.</p>}
    </form>
  );
};

export default PromptControls;
