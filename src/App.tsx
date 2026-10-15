import { useState } from 'react';
import { Leaf } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import ScanScreen from '@/components/ScanScreen';
import LibraryScreen from '@/components/LibraryScreen';
import HistoryScreen from '@/components/HistoryScreen';
import AboutScreen from '@/components/AboutScreen';
import ResultScreen from '@/components/ResultScreen';
import type { AnalysisResult } from '@/lib/imageAnalysis';
import { supabase, type ScanRecord } from '@/lib/supabase';

type View = 'scan' | 'library' | 'history' | 'about' | 'result';

export default function App() {
  const [activeTab, setActiveTab] = useState<View>('scan');
  const [resultData, setResultData] = useState<{
    imageDataUrl: string;
    result: AnalysisResult;
    existingRecord?: ScanRecord | null;
  } | null>(null);

  const handleResult = (imageDataUrl: string, result: AnalysisResult) => {
    setResultData({ imageDataUrl, result, existingRecord: null });
    setActiveTab('result');
  };

  const handleViewResult = (record: ScanRecord) => {
    const result: AnalysisResult = {
      disease: {
        id: record.disease_name.toLowerCase().replace(/\s+/g, '_'),
        name: record.disease_name,
        crop: record.crop_type,
        scientificName: '',
        severity: record.severity as 'None' | 'Low' | 'Moderate' | 'High',
        symptoms: [],
        causes: [],
        treatment: record.treatment ? [record.treatment] : [],
        prevention: [],
        description: '',
        colorSignature: { r: [0, 255], g: [0, 255], b: [0, 255] },
        brownSpots: false,
        yellowing: false,
        whiteMold: false,
        darkLesions: false,
        leafCurl: false,
      },
      confidence: record.confidence,
      severity: record.severity,
      isHealthy: record.is_healthy,
      treatment: record.treatment,
      topMatches: [],
    };
    setResultData({ imageDataUrl: record.image_url, result, existingRecord: record });
    setActiveTab('result');
  };

  const handleSave = async (imageDataUrl: string, result: AnalysisResult) => {
    const { error } = await supabase.from('scan_history').insert({
      image_url: imageDataUrl,
      crop_type: result.disease.crop,
      disease_name: result.disease.name,
      confidence: result.confidence,
      severity: result.severity,
      is_healthy: result.isHealthy,
      treatment: result.treatment,
    });
    if (error) {
      console.error('Failed to save scan:', error);
    }
  };

  const handleBack = () => {
    setActiveTab('scan');
    setResultData(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      {/* Mobile phone frame */}
      <div className="relative w-full max-w-[430px] h-[100vh] sm:h-[900px] sm:max-h-[95vh] bg-white sm:rounded-[2.5rem] sm:shadow-2xl sm:border-[8px] sm:border-gray-900 overflow-hidden flex flex-col">
        {/* Status bar */}
        <div className="absolute top-0 left-0 right-0 h-8 bg-transparent z-50 pointer-events-none flex items-center justify-between px-6">
          <span className="text-[11px] font-semibold text-gray-900 mt-1">{currentTime()}</span>
          <div className="flex items-center gap-1 mt-1">
            <SignalIcon />
            <WifiIcon />
            <BatteryIcon />
          </div>
        </div>

        {/* Content area */}
        <div className="flex-1 overflow-hidden relative">
          {activeTab === 'scan' && <ScanScreen onResult={handleResult} />}
          {activeTab === 'library' && <LibraryScreen />}
          {activeTab === 'history' && <HistoryScreen onViewResult={handleViewResult} />}
          {activeTab === 'about' && <AboutScreen />}
          {activeTab === 'result' && resultData && (
            <ResultScreen
              imageDataUrl={resultData.imageDataUrl}
              result={resultData.result}
              onBack={handleBack}
              onSave={handleSave}
              existingRecord={resultData.existingRecord}
            />
          )}
        </div>

        {/* Bottom navigation (hidden on result screen) */}
        {activeTab !== 'result' && <BottomNav active={activeTab} onChange={(t) => setActiveTab(t as View)} />}

        {/* Notch */}
        <div className="hidden sm:block absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-900 rounded-b-2xl z-50" />
      </div>
    </div>
  );
}

function currentTime(): string {
  const now = new Date();
  return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function SignalIcon() {
  return (
    <svg width="14" height="10" viewBox="0 0 14 10" fill="none" className="text-gray-900">
      <rect x="0" y="7" width="2" height="3" rx="0.5" fill="currentColor" />
      <rect x="4" y="5" width="2" height="5" rx="0.5" fill="currentColor" />
      <rect x="8" y="3" width="2" height="7" rx="0.5" fill="currentColor" />
      <rect x="12" y="1" width="2" height="9" rx="0.5" fill="currentColor" />
    </svg>
  );
}

function WifiIcon() {
  return (
    <svg width="14" height="10" viewBox="0 0 14 10" fill="none" className="text-gray-900">
      <path d="M7 9.5a1 1 0 100-2 1 1 0 000 2zM3.5 6.5a5 5 0 017 0M1 4a8.5 8.5 0 0112 0" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function BatteryIcon() {
  return (
    <svg width="22" height="10" viewBox="0 0 22 10" fill="none" className="text-gray-900">
      <rect x="0.5" y="0.5" width="18" height="9" rx="2" stroke="currentColor" strokeWidth="0.8" />
      <rect x="2" y="2" width="14" height="6" rx="1" fill="currentColor" />
      <rect x="19.5" y="3" width="2" height="4" rx="1" fill="currentColor" />
    </svg>
  );
}
