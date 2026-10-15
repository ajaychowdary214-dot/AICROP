import { useState } from 'react';
import { diseases, crops } from '@/lib/diseaseDatabase';
import type { Disease } from '@/lib/diseaseDatabase';
import { Search, ChevronRight, AlertTriangle, Shield, Leaf, X } from 'lucide-react';

export default function LibraryScreen() {
  const [search, setSearch] = useState('');
  const [cropFilter, setCropFilter] = useState('All');
  const [selected, setSelected] = useState<Disease | null>(null);

  const filtered = diseases.filter((d) => {
    const matchesSearch =
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.scientificName.toLowerCase().includes(search.toLowerCase());
    const matchesCrop = cropFilter === 'All' || d.crop === cropFilter || d.crop === 'General';
    return matchesSearch && matchesCrop;
  });

  if (selected) {
    return <DiseaseDetail disease={selected} onBack={() => setSelected(null)} />;
  }

  return (
    <div className="flex flex-col h-full">
      <div className="px-5 pt-12 pb-4">
        <h1 className="text-2xl font-bold text-gray-900">Disease Library</h1>
        <p className="text-sm text-gray-500 mt-1">Browse common crop diseases and treatments</p>

        <div className="mt-4 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search diseases..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
          />
        </div>

        <div className="flex gap-2 mt-3 overflow-x-auto pb-1 no-scrollbar">
          {['All', ...crops].map((crop) => (
            <button
              key={crop}
              onClick={() => setCropFilter(crop)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                cropFilter === crop
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {crop}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 px-5 pb-4 overflow-y-auto space-y-3">
        {filtered.map((disease) => (
          <button
            key={disease.id}
            onClick={() => setSelected(disease)}
            className="w-full flex items-center gap-3 bg-white border border-gray-200 rounded-2xl p-3.5 text-left hover:border-emerald-300 hover:shadow-sm active:scale-[0.99] transition-all"
          >
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                disease.id === 'healthy' ? 'bg-emerald-100' : severityColor(disease.severity)
              }`}
            >
              {disease.id === 'healthy' ? (
                <Leaf className="w-6 h-6 text-emerald-600" />
              ) : (
                <AlertTriangle className="w-6 h-6 text-white" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm text-gray-900 truncate">{disease.name}</p>
              <p className="text-xs text-gray-500 truncate">{disease.crop} · {disease.scientificName}</p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${severityBadge(disease.severity)}`}>
                {disease.severity}
              </span>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </div>
          </button>
        ))}
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400">
            <Search className="w-10 h-10 mb-2 text-gray-300" />
            <p className="text-sm">No diseases found</p>
          </div>
        )}
      </div>
    </div>
  );
}

function DiseaseDetail({ disease, onBack }: { disease: Disease; onBack: () => void }) {
  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className={`px-5 pt-12 pb-6 ${disease.id === 'healthy' ? 'bg-emerald-600' : 'bg-amber-600'}`}>
        <button onClick={onBack} className="flex items-center gap-1 text-white/90 text-sm mb-4 hover:text-white">
          <X className="w-4 h-4" /> Close
        </button>
        <div className="flex items-start gap-3">
          <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center flex-shrink-0">
            {disease.id === 'healthy' ? <Leaf className="w-8 h-8 text-white" /> : <AlertTriangle className="w-8 h-8 text-white" />}
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{disease.name}</h2>
            <p className="text-white/80 text-sm italic">{disease.scientificName}</p>
            <div className="flex gap-2 mt-2">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/20 text-white">{disease.crop}</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/20 text-white">{disease.severity} severity</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 px-5 py-5 space-y-5">
        <Section title="Description">
          <p className="text-sm text-gray-600 leading-relaxed">{disease.description}</p>
        </Section>

        <Section title="Symptoms" icon={<AlertTriangle className="w-4 h-4 text-amber-500" />}>
          <ul className="space-y-2">
            {disease.symptoms.map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
                {s}
              </li>
            ))}
          </ul>
        </Section>

        {disease.causes.length > 0 && (
          <Section title="Causes" icon={<AlertTriangle className="w-4 h-4 text-red-500" />}>
            <ul className="space-y-2">
              {disease.causes.map((c, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 flex-shrink-0" />
                  {c}
                </li>
              ))}
            </ul>
          </Section>
        )}

        <Section title="Treatment" icon={<Shield className="w-4 h-4 text-emerald-500" />}>
          <ul className="space-y-2">
            {disease.treatment.map((t, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                {t}
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Prevention" icon={<Shield className="w-4 h-4 text-blue-500" />}>
          <ul className="space-y-2">
            {disease.prevention.map((p, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 flex-shrink-0" />
                {p}
              </li>
            ))}
          </ul>
        </Section>

        <div className="h-2" />
      </div>
    </div>
  );
}

function Section({ title, icon, children }: { title: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-3">
        {icon}
        {title}
      </h3>
      {children}
    </div>
  );
}

function severityColor(severity: string): string {
  switch (severity) {
    case 'High': return 'bg-red-500';
    case 'Moderate': return 'bg-amber-500';
    case 'Low': return 'bg-yellow-500';
    default: return 'bg-gray-400';
  }
}

function severityBadge(severity: string): string {
  switch (severity) {
    case 'High': return 'bg-red-100 text-red-700';
    case 'Moderate': return 'bg-amber-100 text-amber-700';
    case 'Low': return 'bg-yellow-100 text-yellow-700';
    default: return 'bg-emerald-100 text-emerald-700';
  }
}
