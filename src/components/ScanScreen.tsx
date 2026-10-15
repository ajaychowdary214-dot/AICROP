import { useRef, useState } from 'react';
import { Camera, Upload, ImageIcon, Loader2, Sparkles, ChevronRight } from 'lucide-react';
import { analyzeImage, type AnalysisResult } from '@/lib/imageAnalysis';

type Props = {
  onResult: (imageDataUrl: string, result: AnalysisResult) => void;
};

export default function ScanScreen({ onResult }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }
    setError(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setPreview(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyze = async () => {
    if (!preview) return;
    setAnalyzing(true);
    setError(null);
    try {
      await new Promise((r) => setTimeout(r, 1800));
      const result = await analyzeImage(preview);
      onResult(preview, result);
    } catch {
      setError('Could not analyze the image. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleReset = () => {
    setPreview(null);
    setError(null);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="px-5 pt-12 pb-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-semibold">
            <Sparkles className="w-3 h-3" /> AI-Powered
          </span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Scan Your Crop</h1>
        <p className="text-sm text-gray-500 mt-1">Take or upload a photo of a leaf to detect diseases instantly</p>
      </div>

      <div className="flex-1 px-5 pb-4 overflow-y-auto">
        {!preview ? (
          <div className="flex flex-col items-center justify-center h-full gap-4">
            <div className="w-full max-w-sm aspect-square border-2 border-dashed border-gray-300 rounded-3xl flex flex-col items-center justify-center gap-3 text-gray-400 bg-gray-50/50">
              <ImageIcon className="w-16 h-16 text-gray-300" />
              <p className="text-sm font-medium text-gray-500">No image selected</p>
              <p className="text-xs text-gray-400">Camera or upload a photo below</p>
            </div>

            <div className="flex flex-col w-full max-w-sm gap-3">
              <button
                onClick={() => cameraInputRef.current?.click()}
                className="flex items-center justify-center gap-2 bg-emerald-600 text-white font-semibold py-4 rounded-2xl shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 active:scale-[0.98] transition-all"
              >
                <Camera className="w-5 h-5" />
                Take Photo
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center justify-center gap-2 bg-white border-2 border-gray-200 text-gray-700 font-semibold py-4 rounded-2xl hover:border-emerald-400 hover:text-emerald-600 active:scale-[0.98] transition-all"
              >
                <Upload className="w-5 h-5" />
                Upload from Gallery
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <div className="relative w-full max-w-sm">
              <img src={preview} alt="Leaf preview" className="w-full aspect-square object-cover rounded-3xl shadow-lg" />
              <button
                onClick={handleReset}
                className="absolute top-3 right-3 bg-black/60 backdrop-blur text-white w-8 h-8 rounded-full flex items-center justify-center text-lg font-bold hover:bg-black/80 transition-colors"
              >
                ×
              </button>
            </div>

            <div className="w-full max-w-sm">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-3">
                  {error}
                </div>
              )}

              {analyzing ? (
                <div className="flex flex-col items-center gap-3 py-6">
                  <div className="relative">
                    <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
                  </div>
                  <p className="text-sm font-medium text-gray-600">Analyzing image...</p>
                  <div className="w-full max-w-xs flex flex-col gap-2 mt-2">
                    <ProgressLine delay={0} label="Extracting visual features" />
                    <ProgressLine delay={600} label="Comparing with disease database" />
                    <ProgressLine delay={1200} label="Calculating confidence score" />
                  </div>
                </div>
              ) : (
                <button
                  onClick={handleAnalyze}
                  className="w-full flex items-center justify-center gap-2 bg-emerald-600 text-white font-semibold py-4 rounded-2xl shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 active:scale-[0.98] transition-all"
                >
                  <Sparkles className="w-5 h-5" />
                  Detect Disease
                  <ChevronRight className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        />
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        />
      </div>
    </div>
  );
}

function ProgressLine({ delay, label }: { delay: number; label: string }) {
  const [visible, setVisible] = useState(false);
  if (!visible) {
    setTimeout(() => setVisible(true), delay);
  }
  return (
    <div className={`flex items-center gap-2 text-xs transition-all duration-300 ${visible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'}`}>
      <div className={`w-2 h-2 rounded-full ${visible ? 'bg-emerald-500' : 'bg-gray-300'}`} />
      <span className="text-gray-500">{label}</span>
    </div>
  );
}
