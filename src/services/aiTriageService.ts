import { DisasterType, CasePriority, AITriageResult } from '../types/vyro';

export class AITriageService {
  /**
   * Analyzes an emergency distress report text or voice transcript across languages
   */
  public analyzeReport(
    text: string,
    declaredDisasterType?: DisasterType,
    declaredPeopleCount?: number
  ): AITriageResult {
    const raw = text.toLowerCase();
    
    // Language detection heuristics
    let detectedLanguage = 'English';
    if (/[\u0B80-\u0BFF]/.test(text)) detectedLanguage = 'Tamil (தமிழ்)';
    else if (/[\u0900-\u097F]/.test(text)) detectedLanguage = 'Hindi (हिन्दी)';
    else if (/[\u0C00-\u0C7F]/.test(text)) detectedLanguage = 'Telugu (తెలుగు)';
    else if (/[\u0C80-\u0CFF]/.test(text)) detectedLanguage = 'Kannada (ಕನ್ನಡ)';
    else if (/[\u0D00-\u0D7F]/.test(text)) detectedLanguage = 'Malayalam (മലയാളം)';

    // 1. Disaster Type Deduction
    let disasterType: DisasterType = declaredDisasterType || 'FLOOD';
    if (
      raw.includes('water') || raw.includes('flood') || raw.includes('submerged') ||
      raw.includes('தண்ணி') || raw.includes('வெள்ளம்') || raw.includes('बाढ़') ||
      raw.includes('వరద') || raw.includes('ಪ್ರವಾಹ') || raw.includes('വെള്ളം')
    ) {
      disasterType = 'FLOOD';
    } else if (
      raw.includes('fire') || raw.includes('smoke') || raw.includes('burn') ||
      raw.includes('தீ') || raw.includes('आग') || raw.includes('మంటలు') || raw.includes('ಬೆಂಕಿ')
    ) {
      disasterType = 'FIRE';
    } else if (
      raw.includes('quake') || raw.includes('collapse') || raw.includes('rubble') ||
      raw.includes('நிலநடுக்கம்') || raw.includes('भूकंप') || raw.includes('భూకంపం')
    ) {
      disasterType = 'EARTHQUAKE';
    } else if (
      raw.includes('tsunami') || raw.includes('wave') || raw.includes('surge') ||
      raw.includes('சுனாமி') || raw.includes('सुनामी')
    ) {
      disasterType = 'TSUNAMI';
    } else if (
      raw.includes('cyclone') || raw.includes('wind') || raw.includes('storm') ||
      raw.includes('புயல்') || raw.includes('चक्रवात') || raw.includes('తుఫాను')
    ) {
      disasterType = 'CYCLONE';
    } else if (
      raw.includes('landslide') || raw.includes('mud') || raw.includes('hill') ||
      raw.includes('நிலச்சரிவு') || raw.includes('भूस्खलन') || raw.includes('ഉരുൾപൊട്ടൽ')
    ) {
      disasterType = 'LANDSLIDE';
    }

    // 2. Trapped Detection
    const isTrapped = 
      raw.includes('trapped') || raw.includes('terrace') || raw.includes('roof') ||
      raw.includes('மாடி') || raw.includes('சிக்கி') || raw.includes('छत') ||
      raw.includes('फंसे') || raw.includes('మేడపై') || raw.includes('ಮನೆಗೆ') || raw.includes('കുടുങ്ങി');

    // 3. Victim Count Extraction
    let count = declaredPeopleCount || 1;
    const matchDigits = text.match(/\b([1-9]|10|12|15|20)\b/);
    if (matchDigits) {
      count = parseInt(matchDigits[1], 10);
    } else if (
      text.includes('four') || text.includes('நாலு') || text.includes('चार') ||
      text.includes('నలుగురు') || text.includes('നാല്')
    ) {
      count = 4;
    } else if (
      text.includes('two') || text.includes('இரண்டு') || text.includes('दो') ||
      text.includes('ఇద్దరు') || text.includes('രണ്ട്')
    ) {
      count = 2;
    } else if (
      text.includes('three') || text.includes('மூன்று') || text.includes('तीन') ||
      text.includes('ముగ్గురు') || text.includes('മൂന്ന്')
    ) {
      count = 3;
    } else if (
      text.includes('family') || text.includes('குடும்பம்') || text.includes('परिवार')
    ) {
      count = Math.max(count, 4);
    }

    // 4. Hazards Extraction
    const extractedHazards: string[] = [];
    if (raw.includes('water') || raw.includes('flood') || raw.includes('தண்ணி') || raw.includes('വെള്ളം')) {
      extractedHazards.push('Rapid water level ingress (1.2m - 1.8m estimated)');
    }
    if (raw.includes('electric') || raw.includes('wire') || raw.includes('current')) {
      extractedHazards.push('High-voltage electrocution hazard');
    }
    if (raw.includes('smoke') || raw.includes('breathe') || raw.includes('oxygen')) {
      extractedHazards.push('Toxic smoke inhalation / oxygen depletion');
    }
    if (raw.includes('baby') || raw.includes('infant') || raw.includes('child') || raw.includes('குழந்தை')) {
      extractedHazards.push('Pediatric vulnerability / hypothermia risk');
    }
    if (raw.includes('elder') || raw.includes('heart') || raw.includes('diabetic') || raw.includes('வயதான')) {
      extractedHazards.push('Geriatric chronic medication dependency');
    }
    if (extractedHazards.length === 0) {
      extractedHazards.push('Structural isolation due to debris/flooding');
    }

    // 5. Location Clues
    const extractedLocationClues: string[] = [];
    if (raw.includes('roof') || raw.includes('terrace') || raw.includes('மாடி') || raw.includes('छत')) {
      extractedLocationClues.push('Upper floor / Rooftop refuge');
    }
    if (raw.includes('bridge') || raw.includes('பாலம்') || raw.includes('पुल')) {
      extractedLocationClues.push('Bridge approach / waterway proximity');
    }
    if (raw.includes('market') || raw.includes('broadway') || raw.includes('junction')) {
      extractedLocationClues.push('Dense urban commercial corridor');
    }
    if (raw.includes('basement') || raw.includes('parking')) {
      extractedLocationClues.push('Sub-surface basement inundation');
    }
    if (extractedLocationClues.length === 0) {
      extractedLocationClues.push('Residential perimeter structure');
    }

    // 6. Priority & Urgency Scoring
    let severityScore = 6;
    if (isTrapped) severityScore += 2;
    if (count >= 4) severityScore += 1;
    if (raw.includes('immediate') || raw.includes('urgent') || raw.includes('fast') || raw.includes('உடனே') || raw.includes('तुरंत')) {
      severityScore += 1;
    }
    severityScore = Math.min(10, severityScore);

    const priority: CasePriority = severityScore >= 8 ? 'CRITICAL' : severityScore >= 6 ? 'HIGH' : 'ACTIVE';
    const urgency = severityScore >= 8 ? 'IMMEDIATE' : severityScore >= 6 ? 'HIGH' : 'MODERATE';

    // 7. Recommended Resource Unit
    let recommendedUnitType = 'NDRF Inflatable Boat Rescue Unit';
    if (disasterType === 'FLOOD') {
      recommendedUnitType = count > 3 ? 'Amphibious Rigid Hull Boat + Lifebuoys' : 'Shallow Draft Watercraft';
    } else if (disasterType === 'FIRE') {
      recommendedUnitType = 'Breathing Apparatus Smoke Extrication Team';
    } else if (disasterType === 'EARTHQUAKE' || disasterType === 'LANDSLIDE') {
      recommendedUnitType = 'Heavy Shoring & Hydraulic Spreader Unit';
    } else if (disasterType === 'MEDICAL') {
      recommendedUnitType = 'Advanced Life Support (ALS) Ambulance';
    }

    // 8. Structured AI Summary
    const aiSummary = `AI Triage [${detectedLanguage}]: Classified as ${priority} (${disasterType}). Identified ${count} people in danger (${isTrapped ? 'Trapped' : 'Exposed'}). Recommended immediate dispatch of ${recommendedUnitType}. Commander confirmation required for operational execution.`;

    return {
      disasterType,
      priority,
      severityScore,
      urgency,
      victimCount: count,
      trappedStatus: isTrapped,
      extractedHazards,
      extractedLocationClues,
      detectedLanguage,
      duplicateProbability: 0.05,
      recommendedUnitType,
      aiSummary
    };
  }
}

export const aiTriageService = new AITriageService();
