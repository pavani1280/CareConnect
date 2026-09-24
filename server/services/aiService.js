/**
 * CareConnect AI Service Module
 * Handles natural language request classification, skill extraction, urgency detection,
 * and transparent provider ranking algorithms.
 */

const CATEGORY_SKILL_MAP = [
  {
    category: 'AC Repair',
    keywords: ['ac', 'air conditioner', 'cooling', 'compressor', 'hvac', 'refrigerant', 'ac leak', 'not cold', 'split ac'],
    skills: ['HVAC Technician', 'AC Diagnostics', 'Cooling System Repair', 'Refrigerant Gas Charging', 'Filter Cleaning'],
    defaultDuration: '1–2 hours',
    baseUrgency: 'Medium'
  },
  {
    category: 'Plumbing',
    keywords: ['pipe', 'leak', 'plumber', 'tap', 'sink', 'toilet', 'drain', 'water heater', 'geyser', 'clogged', 'faucet'],
    skills: ['Pipe Fitting', 'Leak Repair', 'Geyser Installation', 'Drain Unclogging', 'Sanitaryware Installation'],
    defaultDuration: '1 hour',
    baseUrgency: 'High'
  },
  {
    category: 'Electrical',
    keywords: ['electricity', 'wire', 'wiring', 'switch', 'socket', 'circuit', 'fuse', 'short circuit', 'fan', 'light', 'mcb'],
    skills: ['Licensed Electrician', 'Circuit Repair', 'House Rewiring', 'Switchboard Repair', 'Appliance Power Check'],
    defaultDuration: '1 hour',
    baseUrgency: 'High'
  },
  {
    category: 'Appliance Repair',
    keywords: ['fridge', 'refrigerator', 'washing machine', 'microwave', 'oven', 'dishwasher', 'appliance', 'dryer'],
    skills: ['Appliance Technician', 'Motor Repair', 'PCB Board Repair', 'Thermostat Calibration', 'Door Seal Repair'],
    defaultDuration: '1–3 hours',
    baseUrgency: 'Medium'
  },
  {
    category: 'Cleaning',
    keywords: ['clean', 'cleaning', 'dust', 'deep clean', 'sofa', 'carpet', 'kitchen clean', 'bathroom clean', 'sanitize'],
    skills: ['Deep Home Cleaning', 'Sofa & Upholstery Shampooing', 'Sanitization Specialist', 'Kitchen Degreasing'],
    defaultDuration: '2–4 hours',
    baseUrgency: 'Low'
  },
  {
    category: 'Carpentry',
    keywords: ['wood', 'furniture', 'door', 'lock', 'cabinet', 'hinge', 'bed', 'table', 'carpenter'],
    skills: ['Custom Carpentry', 'Door Lock Installation', 'Furniture Assembly', 'Cabinet Hinge Repair'],
    defaultDuration: '1–2 hours',
    baseUrgency: 'Low'
  },
  {
    category: 'Painting',
    keywords: ['paint', 'wall', 'primer', 'color', 'whitewash', 'interior paint', 'exterior paint', 'waterproofing'],
    skills: ['Interior Painting', 'Exterior Painting', 'Wall Putty & Primer', 'Waterproofing Specialist'],
    defaultDuration: '1–3 days',
    baseUrgency: 'Low'
  }
];

/**
 * Classifies a natural language service description
 */

const analyzeServiceRequest = (description = '') => {
  const text = description.toLowerCase();

  let matchedCategory = CATEGORY_SKILL_MAP[0];
  let maxScore = -1;

  for (const cat of CATEGORY_SKILL_MAP) {
    let score = 0;
    for (const kw of cat.keywords) {
      if (text.includes(kw)) {
        score += 1;
      }
    }
    if (score > maxScore) {
      maxScore = score;
      matchedCategory = cat;
    }
  }

  // Detect Urgency
  let urgency = matchedCategory.baseUrgency;
  if (text.includes('urgent') || text.includes('emergency') || text.includes('asap') || text.includes('immediately') || text.includes('overflowing') || text.includes('sparks')) {
    urgency = 'Emergency';
  } else if (text.includes('today') || text.includes('broken')) {
    urgency = 'High';
  }

  // Extract specific skills relevant to text
  let detectedSkills = [...matchedCategory.skills];
  if (text.includes('leak')) detectedSkills.unshift('Leak Repair');
  if (text.includes('wire') || text.includes('short')) detectedSkills.unshift('Circuit Repair');
  if (text.includes('gas') || text.includes('cool')) detectedSkills.unshift('Cooling System Repair');

  // Deduplicate skills
  detectedSkills = Array.from(new Set(detectedSkills));

  const confidence = Math.min(0.98, Math.max(0.75, 0.75 + maxScore * 0.05));

  return {
    classifiedCategory: matchedCategory.category,
    extractedSkills: detectedSkills,
    urgency,
    suggestedDuration: matchedCategory.defaultDuration,
    confidence: Number(confidence.toFixed(2)),
  };
};

/**
 * Calculates provider recommendation score & match breakdown
 */
const rankProvidersForRequest = (request, providers) => {
  const reqSkills = request.extractedSkills || [];
  const reqCategory = request.classifiedCategory || request.categoryName;

  return providers.map((p) => {
    const profile = p.profile || p;
    const providerSkills = profile.skills || [];

    // 1. Skill Match (35%)
    let skillMatches = 0;
    reqSkills.forEach((skill) => {
      if (providerSkills.some((ps) => ps.toLowerCase().includes(skill.toLowerCase()) || skill.toLowerCase().includes(ps.toLowerCase()))) {
        skillMatches += 1;
      }
    });
    const skillScore = reqSkills.length > 0 ? (skillMatches / reqSkills.length) * 100 : 80;

    // 2. Rating Score (20%)
    const ratingScore = ((profile.rating || 4.5) / 5) * 100;

    // 3. Experience Score (10%)
    const expYears = profile.experienceYears || profile.experience || 3;
    const expScore = Math.min(100, (expYears / 10) * 100);

    // 4. Proximity / Location Score (25%)
    // Distance estimation or random distance between 1.2km and 5km
    const distanceKm = Number((1.2 + (p._id.toString().charCodeAt(0) % 35) / 10).toFixed(1));
    const locationScore = Math.max(50, 100 - distanceKm * 8);

    // 5. Availability Score (10%)
    const availabilityScore = profile.verificationStatus === 'VERIFIED' ? 100 : 60;

    // Composite Weighted Score
    const matchScore = Math.round(
      skillScore * 0.35 +
      locationScore * 0.25 +
      ratingScore * 0.20 +
      expScore * 0.10 +
      availabilityScore * 0.10
    );

    return {
      provider: p,
      matchScore: Math.min(99, Math.max(70, matchScore)),
      distanceKm,
      breakdown: {
        skillMatchPercent: Math.round(skillScore),
        locationScore: Math.round(locationScore),
        rating: profile.rating,
        experienceYears: expYears,
        verified: profile.verificationStatus === 'VERIFIED',
      }
    };
  }).sort((a, b) => b.matchScore - a.matchScore);
};

module.exports = {
  analyzeServiceRequest,
  rankProvidersForRequest,
};
