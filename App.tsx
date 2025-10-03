import React, { useState, useCallback } from 'react';
import ImageUploader from './components/ImageUploader';
import PromptControls from './components/PromptControls';
import ResultViewer from './components/ResultViewer';
import { AspectRatio } from './types';
import { editImage } from './services/geminiService';

const App: React.FC = () => {
  const [sourceImageFile, setSourceImageFile] = useState<File | null>(null);
  const [sourceImagePreview, setSourceImagePreview] = useState<string | null>(null);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageSelect = useCallback((file: File) => {
    setSourceImageFile(file);
    setGeneratedImageUrl(null);
    setError(null);
    const reader = new FileReader();
    reader.onloadend = () => {
      setSourceImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  }, []);

  const fileToGenerativePart = async (file: File) => {
    const base64EncodedDataPromise = new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result.split(',')[1]);
        }
      };
      reader.readAsDataURL(file);
    });
    return {
      inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
    };
  };

  const handleGenerate = useCallback(async (prompt: string, aspectRatio: AspectRatio) => {
    if (!sourceImageFile) {
      setError("Please upload an image first.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedImageUrl(null);

    try {
      const imagePart = await fileToGenerativePart(sourceImageFile);
      const base64ImageData = await editImage(imagePart, prompt, aspectRatio);
      setGeneratedImageUrl(`data:image/png;base64,${base64ImageData}`);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  }, [sourceImageFile]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-slate-800 text-gray-100 font-sans p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto max-w-7xl">
        
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500">
            AI Xây Dựng Thương Hiệu Cá Nhân
          </h1>
          <p className="mt-4 text-lg text-slate-300 max-w-2xl mx-auto">
            Sản phẩm thử nghiệm của{" "}
            <a
              href="https://www.facebook.com/profile.php?id=100001131484456"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 underline font-semibold hover:text-emerald-300"
            >
              NGUYÊN AI
            </a>
          </p>
        </header>

        {/* Main content */}
        <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 flex flex-col gap-8">
            <div className="bg-gray-800/50 p-6 rounded-2xl shadow-lg border border-gray-700 backdrop-blur-sm">
              <h2 className="text-xl font-bold mb-4 text-emerald-300 border-b border-gray-600 pb-2">1. Upload Your Photo</h2>
              <ImageUploader onImageSelect={handleImageSelect} imagePreviewUrl={sourceImagePreview} />
            </div>
            <div className="bg-gray-800/50 p-6 rounded-2xl shadow-lg border border-gray-700 backdrop-blur-sm">
              <h2 className="text-xl font-bold mb-4 text-emerald-300 border-b border-gray-600 pb-2">2. Describe Your Vision</h2>
              <PromptControls onGenerate={handleGenerate} isLoading={isLoading} isImageUploaded={!!sourceImageFile} />
            </div>
          </div>

          <div className="lg:col-span-2 bg-gray-800/50 p-6 rounded-2xl shadow-lg border border-gray-700 backdrop-blur-sm">
            <h2 className="text-xl font-bold mb-4 text-emerald-300 border-b border-gray-600 pb-2">3. AI-Generated Result</h2>
            <ResultViewer imageUrl={generatedImageUrl} isLoading={isLoading} error={error} />
          </div>
        </main>

        {/* Footer */}
        <footer className="text-center mt-12 text-gray-500 text-sm">
          <p>
            Nếu bạn thấy thích mời mình{" "}
            <a
              href="https://drive.google.com/uc?export=view&id=1qw7P7OHDKRh6X8KV73RMVVXwdPEn1oCn"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 underline font-semibold hover:text-emerald-300"
            >
              ly cafe
            </a>{" "}
            nhé
          </p>
        </footer>
      </div>
    </div>
  );
};

export default App;
