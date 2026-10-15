export type Disease = {
  id: string;
  name: string;
  crop: string;
  scientificName: string;
  severity: 'None' | 'Low' | 'Moderate' | 'High';
  symptoms: string[];
  causes: string[];
  treatment: string[];
  prevention: string[];
  description: string;
  colorSignature: {
    r: [number, number];
    g: [number, number];
    b: [number, number];
  };
  brownSpots: boolean;
  yellowing: boolean;
  whiteMold: boolean;
  darkLesions: boolean;
  leafCurl: boolean;
};

export const diseases: Disease[] = [
  {
    id: 'healthy',
    name: 'Healthy Plant',
    crop: 'General',
    scientificName: 'N/A',
    severity: 'None',
    description: 'The plant appears to be in good health with no visible signs of disease. Leaves show normal coloration and texture.',
    symptoms: ['Vibrant green leaves', 'No spots or discoloration', 'Uniform texture', 'No wilting or curling'],
    causes: [],
    treatment: ['No treatment needed', 'Continue regular watering and care', 'Monitor for early signs of disease'],
    prevention: ['Maintain proper watering schedule', 'Ensure adequate sunlight', 'Use balanced fertilizer'],
    colorSignature: { r: [40, 120], g: [100, 200], b: [30, 100] },
    brownSpots: false,
    yellowing: false,
    whiteMold: false,
    darkLesions: false,
    leafCurl: false,
  },
  {
    id: 'early_blight',
    name: 'Early Blight',
    crop: 'Tomato',
    scientificName: 'Alternaria solani',
    severity: 'Moderate',
    description: 'A common fungal disease that affects tomato and potato plants, characterized by concentric ring-like lesions on lower leaves.',
    symptoms: ['Dark brown spots with concentric rings', 'Yellowing of surrounding leaf tissue', 'Leaves may drop prematurely', 'Spots enlarge and merge over time'],
    causes: ['Fungal infection (Alternaria solani)', 'Warm, humid weather', 'Poor air circulation', 'Overhead watering'],
    treatment: ['Apply copper-based fungicide', 'Remove and destroy infected leaves', 'Improve air circulation around plants', 'Avoid overhead watering'],
    prevention: ['Mulch around plants to prevent soil splash', 'Rotate crops yearly', 'Space plants properly for airflow', 'Use drip irrigation'],
    colorSignature: { r: [80, 160], g: [60, 120], b: [20, 60] },
    brownSpots: true,
    yellowing: true,
    whiteMold: false,
    darkLesions: true,
    leafCurl: false,
  },
  {
    id: 'late_blight',
    name: 'Late Blight',
    crop: 'Tomato',
    scientificName: 'Phytophthora infestans',
    severity: 'High',
    description: 'A devastating disease that can destroy entire crops within days, causing dark lesions and rapid plant death.',
    symptoms: ['Large dark brown to black lesions', 'White fuzzy growth on leaf undersides', 'Rapid leaf collapse', 'Brown stems and fruit'],
    causes: ['Oomycete pathogen (Phytophthora infestans)', 'Cool, wet weather', 'High humidity', 'Infected plant debris'],
    treatment: ['Apply chlorothalonil or copper fungicide immediately', 'Remove all infected plant parts', 'Improve drainage', 'Consider removing severely infected plants'],
    prevention: ['Plant resistant varieties', 'Avoid working with plants when wet', 'Ensure good drainage', 'Remove volunteer plants'],
    colorSignature: { r: [50, 120], g: [40, 90], b: [30, 70] },
    brownSpots: true,
    yellowing: false,
    whiteMold: true,
    darkLesions: true,
    leafCurl: false,
  },
  {
    id: 'powdery_mildew',
    name: 'Powdery Mildew',
    crop: 'General',
    scientificName: 'Erysiphe cichoracearum',
    severity: 'Low',
    description: 'A fungal disease that appears as a white or gray powdery coating on leaf surfaces, affecting many crop types.',
    symptoms: ['White powdery spots on leaves', 'Leaves may curl or distort', 'Yellowing of infected areas', 'Stunted growth in severe cases'],
    causes: ['Fungal infection', 'High humidity with moderate temperatures', 'Poor air circulation', 'Overcrowded plants'],
    treatment: ['Apply sulfur-based fungicide', 'Spray with neem oil solution', 'Remove infected leaves', 'Improve spacing between plants'],
    prevention: ['Space plants for good airflow', 'Avoid overhead watering', 'Plant resistant varieties', 'Remove plant debris'],
    colorSignature: { r: [180, 240], g: [180, 240], b: [170, 230] },
    brownSpots: false,
    yellowing: true,
    whiteMold: true,
    darkLesions: false,
    leafCurl: true,
  },
  {
    id: 'leaf_spot',
    name: 'Bacterial Leaf Spot',
    crop: 'Pepper',
    scientificName: 'Xanthomonas campestris',
    severity: 'Moderate',
    description: 'A bacterial disease causing small water-soaked spots that turn brown with yellow halos, primarily affecting peppers and tomatoes.',
    symptoms: ['Small brown spots with yellow halos', 'Spots may merge into larger lesions', 'Leaf yellowing and drop', 'Spots on stems and fruit'],
    causes: ['Bacterial infection (Xanthomonas)', 'Warm, wet conditions', 'Splashing rain or irrigation', 'Contaminated seeds'],
    treatment: ['Apply copper bactericide', 'Remove infected plants', 'Avoid overhead irrigation', 'Sanitize tools and stakes'],
    prevention: ['Use disease-free seeds', 'Rotate crops', 'Avoid working with wet plants', 'Implement drip irrigation'],
    colorSignature: { r: [100, 180], g: [80, 140], b: [30, 70] },
    brownSpots: true,
    yellowing: true,
    whiteMold: false,
    darkLesions: false,
    leafCurl: false,
  },
  {
    id: 'leaf_curl',
    name: 'Leaf Curl Virus',
    crop: 'Tomato',
    scientificName: 'Begomovirus',
    severity: 'High',
    description: 'A viral disease transmitted by whiteflies that causes leaves to curl upward and become thick and leathery.',
    symptoms: ['Upward curling of leaves', 'Leaf thickening and leathery texture', 'Yellowing of leaf margins', 'Stunted plant growth'],
    causes: ['Viral infection (Begomovirus)', 'Whitefly transmission', 'Infected plant material', 'Warm temperatures with high whitefly populations'],
    treatment: ['No cure for infected plants - remove them', 'Control whitefly populations with insecticidal soap', 'Use reflective mulches to deter whiteflies', 'Apply neem oil'],
    prevention: ['Use virus-resistant varieties', 'Control whitefly populations', 'Use yellow sticky traps', 'Plant away from infected areas'],
    colorSignature: { r: [80, 150], g: [90, 160], b: [30, 80] },
    brownSpots: false,
    yellowing: true,
    whiteMold: false,
    darkLesions: false,
    leafCurl: true,
  },
  {
    id: 'rust',
    name: 'Leaf Rust',
    crop: 'Maize',
    scientificName: 'Puccinia sorghi',
    severity: 'Moderate',
    description: 'A fungal disease causing rust-colored pustules on leaves, common in maize and wheat crops.',
    symptoms: ['Rust-colored to orange-brown pustules', 'Pustules on both leaf surfaces', 'Yellowing around infected areas', 'Premature leaf death in severe cases'],
    causes: ['Fungal infection (Puccinia species)', 'Moderate temperatures with high humidity', 'Wind-dispersed spores', 'Susceptible crop varieties'],
    treatment: ['Apply fungicide containing triazole or strobilurin', 'Remove infected leaves', 'Improve field sanitation', 'Adjust planting dates to avoid peak spore periods'],
    prevention: ['Plant resistant varieties', 'Rotate crops', 'Remove alternate hosts', 'Monitor and spray preventatively in high-risk areas'],
    colorSignature: { r: [150, 220], g: [90, 150], b: [30, 70] },
    brownSpots: true,
    yellowing: true,
    whiteMold: false,
    darkLesions: false,
    leafCurl: false,
  },
  {
    id: 'mosaic_virus',
    name: 'Mosaic Virus',
    crop: 'General',
    scientificName: 'Potyvirus',
    severity: 'High',
    description: 'A viral disease causing mosaic-like mottling and distortion of leaves, affecting many crops including tomatoes, peppers, and cucumbers.',
    symptoms: ['Mottled light and dark green patterns on leaves', 'Leaf distortion and wrinkling', 'Stunted growth', 'Reduced fruit yield and quality'],
    causes: ['Viral infection (Potyvirus family)', 'Aphid transmission', 'Infected seeds or transplants', 'Mechanical transmission through tools'],
    treatment: ['No cure for infected plants - remove immediately', 'Control aphid populations', 'Disinfect tools between plants', 'Remove weeds that host the virus'],
    prevention: ['Use certified virus-free seeds', 'Control aphid vectors', 'Remove weed hosts', 'Use reflective mulches'],
    colorSignature: { r: [80, 160], g: [100, 180], b: [40, 90] },
    brownSpots: false,
    yellowing: true,
    whiteMold: false,
    darkLesions: false,
    leafCurl: false,
  },
];

export const crops = ['Tomato', 'Maize', 'Potato', 'Pepper', 'General'];

export function getDiseaseById(id: string): Disease | undefined {
  return diseases.find((d) => d.id === id);
}
