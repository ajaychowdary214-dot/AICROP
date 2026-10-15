import { useState, useEffect } from 'react';
import { supabase, type ScanRecord } from '@/lib/supabase';
import { Clock, Trash2, ChevronRight, Leaf, AlertTriangle, ImageOff } from 'lucide-react';

type Props = {
  onViewResult: (record: ScanRecord) => void;
};

export default function HistoryScreen({ onViewResult }: Props) {
  const [records, setRecords] = useState<ScanRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from('scan_history')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      setError('Could not load scan history');
    } else {
      setRecords(data || []);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('scan_history').delete().eq('id', id);
    if (!error) {
      setRecords(records.filter((r) => r.id !== id));
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="flex flex-col h-full">
      <div className="px-5 pt-12 pb-4">
        <h1 className="text-2xl font-bold text-gray-900">Scan History</h1>
        <p className="text-sm text-gray-500 mt-1">Your past disease detections</p>
      </div>

      <div className="flex-1 px-5 pb-4 overflow-y-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <div className="w-8 h-8 border-3 border-gray-200 border-t-emerald-500 rounded-full animate-spin mb-3" />
            <p className="text-sm">Loading history...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <p className="text-sm text-red-500">{error}</p>
            <button onClick={loadHistory} className="mt-3 text-sm text-emerald-600 font-medium">Try again</button>
          </div>
        ) : records.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <ImageOff className="w-12 h-12 text-gray-300 mb-3" />
            <p className="text-sm font-medium text-gray-500">No scans yet</p>
            <p className="text-xs text-gray-400 mt-1">Scan a leaf to see results here</p>
          </div>
        ) : (
          <div className="space-y-3">
            {records.map((record) => (
              <div
                key={record.id}
                className="flex items-center gap-3 bg-white border border-gray-200 rounded-2xl p-3 hover:shadow-sm transition-all"
              >
                <button
                  onClick={() => onViewResult(record)}
                  className="flex items-center gap-3 flex-1 min-w-0 text-left"
                >
                  <img
                    src={record.image_url}
                    alt="Scan"
                    className="w-14 h-14 rounded-xl object-cover flex-shrink-0 border border-gray-200"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      {record.is_healthy ? (
                        <Leaf className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                      ) : (
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                      )}
                      <p className="font-semibold text-sm text-gray-900 truncate">{record.disease_name}</p>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {record.crop_type} · {record.confidence}% confidence
                    </p>
                    <p className="text-[10px] text-gray-400 mt-0.5 flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5" />
                      {formatDate(record.created_at)}
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                </button>
                <button
                  onClick={() => handleDelete(record.id)}
                  className="text-gray-300 hover:text-red-500 p-1 transition-colors flex-shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
