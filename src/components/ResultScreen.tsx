import type { AnalysisResult } from '@/lib/imageAnalysis';
import type { ScanRecord } from '@/lib/supabase';
import { CheckCircle2, AlertTriangle, Leaf, Shield, ShieldCheck, ArrowLeft, Save, Check, X, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

type Props = {
  imageDataUrl: string;
  result: AnalysisResult;
  onBack: () => void;
  onSave: (imageDataUrl: string, result: AnalysisResult) => Promise<void>;
  existingRecord?: ScanRecord | null;
};

export default function ResultScreen({ imageDataUrl, result, onBack, onSave, existingRecord }: Props) {
  const [saved, setSaved] = useState(!!existingRecord);
  const [saving, setSaving] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    symptoms: true,
    causes: !result.isHealthy,
    treatment: true,
    prevention: true,
  });

  const { disease, confidence, severity, isHealthy } = result;

  const handleSave = async () => {
    setSaving(true);
    await onSave(imageDataUrl, result);
    setSaving(false);
    setSaved(true);
  };

  const toggleSection = (key: string) => {
    setExpandedSections({ ...expandedSections, [key]: !expandedSections[key] });
  };

  const headerColor = isHealthy ? 'from-emerald-500 to-emerald-600' : severity === 'High' ? 'from-red-500 to-red-600' : severity === 'Moderate' ? 'from-amber-500 to-amber-600' : 'from-yellow-500 to-yellow-600';

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className={`bg-gradient-to-br ${headerColor} px-5 pt-12 pb-6`}>
        <div className="flex items-center justify-between mb-4">
          <button onClick={onBack} className="flex items-center gap-1 text-white/90 text-sm hover:text-white">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          {saved ? (
            <span className="flex items-center gap-1 text-white text-xs font-medium bg-white/20 backdrop-blur px-3 py-1 rounded-full">
              <Check className="w-3 h-3" /> Saved
            </span>
          ) : (
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-1.5 text-white text-xs font-semibold bg-white/20 backdrop-blur px-3 py-1.5 rounded-full hover:bg-white/30 transition-all disabled:opacity-50"
            >
              {saving ? (
                <>
                  <div className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" /> Save
                </>
              )}
            </button>
          )}
        </div>

        <div className="flex items-center gap-3">
          <img src={imageDataUrl} alt="Scanned leaf" className="w-20 h-20 rounded-2xl object-cover border-2 border-white/30 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              {isHealthy ? (
                <CheckCircle2 className="w-5 h-5 text-white" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-white" />
              )}
              <h2 className="text-lg font-bold text-white truncate">{disease.name}</h2>
            </div>
            <p className="text-white/80 text-xs italic">{disease.scientificName}</p>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex-1 bg-white/20 rounded-full h-2 overflow-hidden">
                <div className="bg-white h-full rounded-full transition-all duration-500" style={{ width: `${confidence}%` }} />
              </div>
              <span className="text-white text-xs font-bold">{confidence}%</span>
            </div>
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <Tag label={disease.crop} />
          {!isHealthy && <Tag label={`${severity} severity`} />}
          <Tag label={isHealthy ? 'No action needed' : 'Action required'} />
        </div>
      </div>

      <div className="flex-1 px-5 py-5 space-y-4">
        <div className="bg-gray-50 rounded-2xl p-4">
          <p className="text-sm text-gray-600 leading-relaxed">{disease.description}</p>
        </div>

        {!isHealthy && result.topMatches.length > 1 && (
          <div className="bg-white border border-gray-200 rounded-2xl p-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Other Possible Matches</h3>
            <div className="space-y-2">
              {result.topMatches.slice(1).map((match, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{match.name}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-16 bg-gray-200 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-gray-400 h-full rounded-full" style={{ width: `${match.confidence}%` }} />
                    </div>
                    <span className="text-xs text-gray-500 font-medium w-8">{match.confidence}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <CollapsibleSection
          title="Symptoms"
          icon={<AlertTriangle className="w-4 h-4 text-amber-500" />}
          expanded={expandedSections.symptoms}
          onToggle={() => toggleSection('symptoms')}
        >
          <ul className="space-y-2">
            {disease.symptoms.map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
                {s}
              </li>
            ))}
          </ul>
        </CollapsibleSection>

        {!isHealthy && disease.causes.length > 0 && (
          <CollapsibleSection
            title="Causes"
            icon={<AlertTriangle className="w-4 h-4 text-red-500" />}
            expanded={expandedSections.causes ?? false}
            onToggle={() => toggleSection('causes')}
          >
            <ul className="space-y-2">
              {disease.causes.map((c, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 flex-shrink-0" />
                  {c}
                </li>
              ))}
            </ul>
          </CollapsibleSection>
        )}

        <CollapsibleSection
          title="Treatment"
          icon={isHealthy ? <ShieldCheck className="w-4 h-4 text-emerald-500" /> : <Shield className="w-4 h-4 text-emerald-500" />}
          expanded={expandedSections.treatment}
          onToggle={() => toggleSection('treatment')}
        >
          <ul className="space-y-2">
            {disease.treatment.map((t, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                {t}
              </li>
            ))}
          </ul>
        </CollapsibleSection>

        <CollapsibleSection
          title="Prevention"
          icon={<Leaf className="w-4 h-4 text-blue-500" />}
          expanded={expandedSections.prevention}
          onToggle={() => toggleSection('prevention')}
        >
          <ul className="space-y-2">
            {disease.prevention.map((p, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 flex-shrink-0" />
                {p}
              </li>
            ))}
          </ul>
        </CollapsibleSection>

        <div className="h-4" />
      </div>
    </div>
  );
}

function Tag({ label }: { label: string }) {
  return (
    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-white/20 backdrop-blur text-white">
      {label}
    </span>
  );
}

function CollapsibleSection({
  title,
  icon,
  expanded,
  onToggle,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  expanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
      >
        <h3 className="flex items-center gap-2 text-sm font-bold text-gray-900">
          {icon}
          {title}
        </h3>
        {expanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
      </button>
      {expanded && <div className="px-4 pb-4">{children}</div>}
    </div>
  );
}
