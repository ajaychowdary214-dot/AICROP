import { Leaf, Scan, Database, Smartphone, Shield, Zap } from 'lucide-react';

export default function AboutScreen() {
  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="bg-gradient-to-br from-emerald-600 to-teal-600 px-5 pt-12 pb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
            <Leaf className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">CropGuard AI</h1>
            <p className="text-white/80 text-xs">AI Crop Disease Detection</p>
          </div>
        </div>
        <p className="text-white/90 text-sm leading-relaxed">
          Empowering farmers with instant, AI-powered crop disease detection — right from their phone.
        </p>
      </div>

      <div className="flex-1 px-5 py-5 space-y-4">
        <FeatureCard
          icon={<Scan className="w-5 h-5" />}
          title="Instant Detection"
          desc="Analyze leaf photos in seconds using computer vision algorithms that examine color, texture, and lesion patterns."
        />
        <FeatureCard
          icon={<Database className="w-5 h-5" />}
          title="Disease Database"
          desc="Access a curated library of common crop diseases with detailed information on symptoms, causes, and treatments."
        />
        <FeatureCard
          icon={<Smartphone className="w-5 h-5" />}
          title="Mobile-First Design"
          desc="Built for the field — works on any phone with a camera. Take photos directly or upload from your gallery."
        />
        <FeatureCard
          icon={<Shield className="w-5 h-5" />}
          title="Treatment Guidance"
          desc="Get actionable treatment and prevention recommendations tailored to each detected disease."
        />
        <FeatureCard
          icon={<Zap className="w-5 h-5" />}
          title="Scan History"
          desc="Every scan is saved so you can track your crop health over time and revisit past diagnoses."
        />

        <div className="bg-gray-50 rounded-2xl p-4 mt-2">
          <h3 className="text-sm font-bold text-gray-900 mb-2">How It Works</h3>
          <ol className="space-y-3">
            <StepItem num={1} text="Take or upload a clear photo of the affected leaf" />
            <StepItem num={2} text="The app analyzes the image using visual feature extraction" />
            <StepItem num={3} text="Get an instant diagnosis with confidence score" />
            <StepItem num={4} text="Follow the recommended treatment plan" />
          </ol>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
          <p className="text-xs text-amber-800 leading-relaxed">
            <strong>Note:</strong> This is a demonstration prototype for educational purposes. For critical agricultural decisions, consult with a local agricultural extension officer or plant pathologist.
          </p>
        </div>

        <p className="text-center text-xs text-gray-400 py-2">
          CropGuard AI v1.0 · Built with React + Supabase
        </p>

        <div className="h-2" />
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="flex gap-3 bg-white border border-gray-200 rounded-2xl p-4">
      <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <div>
        <h3 className="text-sm font-bold text-gray-900">{title}</h3>
        <p className="text-xs text-gray-500 mt-1 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

function StepItem({ num, text }: { num: number; text: string }) {
  return (
    <li className="flex items-start gap-3">
      <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
        {num}
      </span>
      <span className="text-sm text-gray-600 leading-relaxed">{text}</span>
    </li>
  );
}
