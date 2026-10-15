# CropGuard AI — AI Crop Disease Detection

[![Open in Bolt](https://bolt.new/static/open-in-bolt.svg)](https://bolt.new/~/sb1-qwxpsoyy)

A mobile-first web app that detects crop diseases from leaf photos using computer vision techniques. Built as a demonstration prototype for academic purposes.

## Features

- **Instant Disease Detection** — Take a photo or upload an image of a leaf and get an instant diagnosis with a confidence score
- **Disease Library** — Browse a curated database of 8 common crop diseases with detailed symptoms, causes, treatment, and prevention information
- **Scan History** — All scans are saved to the cloud, letting you revisit past diagnoses over time
- **Treatment Guidance** — Each diagnosis includes actionable treatment steps and prevention tips
- **Mobile-First Design** — Built to mimic a native mobile app with bottom tab navigation, phone-frame styling on desktop, and camera access

## How It Works

1. Take or upload a clear close-up photo of a leaf
2. The app extracts visual features from the image — average color values, brown spot ratios, yellowing, white mold, dark lesions, and greenness
3. These features are matched against a database of known disease signatures
4. The top match is displayed with a confidence score, severity level, and treatment recommendations

## Diseases Covered

| Disease | Crop | Severity |
|---|---|---|
| Early Blight | Tomato | Moderate |
| Late Blight | Tomato | High |
| Powdery Mildew | General | Low |
| Bacterial Leaf Spot | Pepper | Moderate |
| Leaf Curl Virus | Tomato | High |
| Leaf Rust | Maize | Moderate |
| Mosaic Virus | General | High |
| Healthy Plant | General | None |

## Tech Stack

- **Frontend:** React + TypeScript + Vite
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Backend/Database:** Supabase (scan history persistence)
- **Image Analysis:** Custom color-based visual feature extraction algorithm

## Getting Started

```bash
npm install
npm run dev
```

The app runs at `http://localhost:5173`.

## Project Structure

```
src/
├── App.tsx                    # Main app shell with navigation
├── components/
│   ├── ScanScreen.tsx         # Camera/upload + analysis trigger
│   ├── ResultScreen.tsx       # Diagnosis results with treatment info
│   ├── LibraryScreen.tsx      # Browseable disease database
│   ├── HistoryScreen.tsx      # Saved scan history
│   ├── AboutScreen.tsx        # App info and how-it-works
│   └── BottomNav.tsx          # Mobile tab navigation
├── lib/
│   ├── imageAnalysis.ts       # Visual feature extraction + matching
│   ├── diseaseDatabase.ts     # Disease data with color signatures
│   └── supabase.ts            # Supabase client
└── index.css
```

## Note

This is a demonstration prototype for educational purposes. The image analysis uses a color-based heuristic algorithm rather than a trained ML model. For critical agricultural decisions, consult a local agricultural extension officer or plant pathologist.
