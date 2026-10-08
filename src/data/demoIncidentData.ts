import { 
  VictimCase, 
  RescueTeam, 
  MedicalTeam, 
  HospitalFacility, 
  ShelterFacility, 
  HazardZone, 
  CommunicationNode,
  CaseRescueChain,
  ChainBreakAlert,
  MissingPersonRecord,
  DisasterType
} from '../types/vyro';

export const INCIDENT_CENTER: [number, number] = [76.2755, 9.9800]; // [lng, lat] Kochi Waterfront / Marine Drive Basin

export const INITIAL_VICTIMS: VictimCase[] = [
  {
    id: 'VY-2026-0002047',
    name: 'Rajan Menon & Family (3 Pax)',
    age: 64,
    peopleCount: 3,
    disasterType: 'FLOOD',
    priority: 'CRITICAL',
    status: 'REPORTED',
    coordinates: [76.2690, 9.9890],
    locationName: 'Old Bridge East Approach',
    reportedAt: '18:15 IST',
    lastVerifiedAt: '18:41 IST',
    accuracyMeters: 11,
    verificationStatus: 'VERIFIED',
    source: 'Citizen SOS + NDRF Recon Drone',
    medicalNeeds: 'Diabetic emergency, rising water level (1.3m), elderly mobility impaired',
    risk: 'CRITICAL',
    hazardProximityNote: 'Flood hazard detected within 40m of east bridge embankment',
    notes: 'Trapped on lower residential roof. Fast water current below structure.',
    isSimulated: true,
    locationTelemetryType: 'LIVE',
    voiceTranscript: 'Water entered the house. 3 of us trapped on the terrace. My grandfather needs insulin.'
  },
  {
    id: 'VY-2026-0002048',
    name: 'Anjali Nair & Infant',
    age: 28,
    peopleCount: 2,
    disasterType: 'FLOOD',
    priority: 'HIGH',
    status: 'ASSIGNED',
    assignedTeamId: 'TEAM-ALPHA-04',
    coordinates: [76.2810, 9.9830],
    locationName: 'Broadway Lane 4, Market Basin',
    reportedAt: '18:22 IST',
    lastVerifiedAt: '18:38 IST',
    accuracyMeters: 8,
    verificationStatus: 'CONFIRMED_BY_TEAM',
    source: 'Citizen SOS (Mobile Geolocation)',
    medicalNeeds: 'Dehydration, mild infant fever (38.8C)',
    risk: 'HIGH',
    notes: 'Second-floor terrace. Ground floor completely submerged. Access via boat required.',
    isSimulated: true,
    locationTelemetryType: 'LIVE',
    voiceTranscript: 'தண்ணி வீட்டுக்குள்ள வந்துருச்சு. நாலு பேர் மேல மாடியில் இருக்காங்க. குழந்தைக்கு உடம்பு சரியில்லை.'
  },
  {
    id: 'VY-2026-0002049',
    name: 'Vehicle Stranded (2 Adults)',
    age: 42,
    peopleCount: 2,
    disasterType: 'ACCIDENT',
    priority: 'ACTIVE',
    status: 'EN_ROUTE',
    assignedTeamId: 'NDRF-UNIT-01',
    coordinates: [76.2740, 9.9760],
    locationName: 'Shanmugham Road Waterfront',
    reportedAt: '18:30 IST',
    lastVerifiedAt: '18:39 IST',
    accuracyMeters: 14,
    verificationStatus: 'VERIFIED',
    source: 'Traffic Police Field Relay',
    medicalNeeds: 'None reported, vehicle stalled in 70cm flood water',
    risk: 'MEDIUM',
    notes: 'SUV stalled near marine walkway. Team NDRF-01 approaching with high-clearance rig.',
    isSimulated: true,
    locationTelemetryType: 'LAST_VERIFIED'
  },
  {
    id: 'VY-2026-0002050',
    name: 'K. Sreedharan (Substation Guard)',
    age: 57,
    peopleCount: 1,
    disasterType: 'MEDICAL',
    priority: 'CHAIN_BREAK',
    status: 'MEDICAL_HANDOFF',
    assignedTeamId: 'TEAM-BRAVO-02',
    coordinates: [76.2895, 9.9705],
    locationName: 'South Railway Overpass Substation',
    reportedAt: '17:50 IST',
    lastVerifiedAt: '18:12 IST',
    accuracyMeters: 25,
    verificationStatus: 'CHAIN_BREAK',
    source: 'EMS Field Radio (Med-Alpha-01)',
    medicalNeeds: 'Potential electrical burns, severe hypothermia, chest pain',
    risk: 'CRITICAL',
    hazardProximityNote: 'Chain Break: Patient handed over to Hospital ER 28 mins ago. No admission log created!',
    notes: 'Rescuer handed patient to General Hospital Emergency Bay, but Hospital intake confirmation is missing.',
    isSimulated: true,
    locationTelemetryType: 'LAST_KNOWN'
  },
  {
    id: 'VY-2026-0002051',
    name: 'Basement Staff (3 Commercial Workers)',
    age: 35,
    peopleCount: 3,
    disasterType: 'TRAPPED',
    priority: 'CRITICAL',
    status: 'REPORTED',
    coordinates: [76.2855, 9.9925],
    locationName: 'Kacheripady Junction Basement',
    reportedAt: '18:35 IST',
    lastVerifiedAt: '18:42 IST',
    accuracyMeters: 12,
    verificationStatus: 'VERIFIED',
    source: 'Citizen Emergency Call',
    medicalNeeds: 'Oxygen depletion risk, rapid basement ingress',
    risk: 'CRITICAL',
    notes: 'Underground parking drainage backflow. Exit ramp partially blocked by debris.',
    isSimulated: true,
    locationTelemetryType: 'LIVE'
  }
];

export const INITIAL_RESCUE_TEAMS: RescueTeam[] = [
  {
    id: 'TEAM-ALPHA-04',
    name: 'Team Alpha-04',
    callsign: 'Vanguard Alpha',
    status: 'EN_ROUTE',
    coordinates: [76.2835, 9.9775],
    accuracyMeters: 14,
    lastLocationUpdate: '18:42:31 IST',
    assignedMissionId: 'VY-2026-0002048',
    personnelCount: 6,
    vehicleType: 'INFLATABLE_BOAT',
    trackingActive: true,
    isSimulated: true,
    batteryLevel: 88
  },
  {
    id: 'TEAM-BRAVO-02',
    name: 'Team Bravo-02',
    callsign: 'Trident Bravo',
    status: 'IDLE',
    coordinates: [76.2720, 9.9860],
    accuracyMeters: 9,
    lastLocationUpdate: '18:41:15 IST',
    personnelCount: 5,
    vehicleType: 'AMPHIBIOUS',
    trackingActive: true,
    isSimulated: true,
    batteryLevel: 94
  },
  {
    id: 'NDRF-UNIT-01',
    name: 'NDRF Battalion 04',
    callsign: 'Garuda One',
    status: 'EN_ROUTE',
    coordinates: [76.2910, 9.9810],
    accuracyMeters: 12,
    lastLocationUpdate: '18:40:48 IST',
    assignedMissionId: 'VY-2026-0002049',
    personnelCount: 8,
    vehicleType: 'ALL_TERRAIN_4X4',
    trackingActive: true,
    isSimulated: true,
    batteryLevel: 79
  }
];

export const INITIAL_MEDICAL_TEAMS: MedicalTeam[] = [
  {
    id: 'MED-ALPHA-01',
    name: 'Rapid EMS Med-01',
    status: 'AVAILABLE',
    coordinates: [76.2840, 9.9730],
    ambulanceType: 'ADVANCED_LIFE_SUPPORT',
    capacityCasualties: 2,
    currentCasualties: 0,
    destinationHospitalId: 'HOSP-01',
    lastUpdate: '18:41:50 IST',
    isSimulated: true
  },
  {
    id: 'MED-BRAVO-03',
    name: 'Mobile Triage Unit 03',
    status: 'EN_ROUTE',
    coordinates: [76.2790, 9.9900],
    ambulanceType: 'BASIC_LIFE_SUPPORT',
    capacityCasualties: 3,
    currentCasualties: 1,
    destinationHospitalId: 'HOSP-02',
    lastUpdate: '18:42:10 IST',
    isSimulated: true
  }
];

export const INITIAL_HOSPITALS: HospitalFacility[] = [
  {
    id: 'HOSP-01',
    name: 'Government General Hospital',
    coordinates: [76.2831, 9.9725],
    totalBeds: 480,
    availableBeds: 34,
    icuTotal: 42,
    icuAvailable: 6,
    traumaLevel: 'LEVEL 1',
    activeIncomingCasualties: 4,
    contactNumber: '+91 484 2361250',
    buildingHeight: 34,
    address: 'Hospital Road, Marine Drive Vicinity, Ernakulam',
    operationalStatus: 'NEAR_CAPACITY'
  },
  {
    id: 'HOSP-02',
    name: 'Medical Trust Multi-Specialty Hospital',
    coordinates: [76.2940, 9.9635],
    totalBeds: 750,
    availableBeds: 92,
    icuTotal: 65,
    icuAvailable: 15,
    traumaLevel: 'LEVEL 1',
    activeIncomingCasualties: 2,
    contactNumber: '+91 484 2358001',
    buildingHeight: 46,
    address: 'MG Road South Corridor, Ernakulam',
    operationalStatus: 'NORMAL'
  },
  {
    id: 'HOSP-03',
    name: 'Lisie Emergency & Trauma Center',
    coordinates: [76.2890, 9.9940],
    totalBeds: 600,
    availableBeds: 48,
    icuTotal: 50,
    icuAvailable: 8,
    traumaLevel: 'LEVEL 2',
    activeIncomingCasualties: 3,
    contactNumber: '+91 484 2400000',
    buildingHeight: 38,
    address: 'Lisie Hospital Road, Kaloor Junction',
    operationalStatus: 'NORMAL'
  }
];

export const INITIAL_SHELTERS: ShelterFacility[] = [
  {
    id: 'SHELTER-01',
    name: 'Government Higher Secondary School',
    coordinates: [76.2865, 9.9712],
    capacity: 500,
    currentOccupancy: 342,
    medicalSupport: true,
    activeCases: 12,
    missingPersonCases: 4,
    contactNumber: '+91 484 2370123',
    lastUpdate: '18:42 IST',
    buildingHeight: 22,
    address: 'SRV High School Ground, Chittoor Road',
    suppliesStatus: 'ADEQUATE',
    operationalStatus: 'ACTIVE'
  },
  {
    id: 'SHELTER-02',
    name: 'Town Hall Central Evacuation Hub',
    coordinates: [76.2890, 9.9920],
    capacity: 750,
    currentOccupancy: 410,
    medicalSupport: true,
    activeCases: 18,
    missingPersonCases: 6,
    contactNumber: '+91 484 2398450',
    lastUpdate: '18:35 IST',
    buildingHeight: 26,
    address: 'Banerji Road, North End Corridor',
    suppliesStatus: 'OPTIMAL',
    operationalStatus: 'ACTIVE'
  },
  {
    id: 'SHELTER-03',
    name: 'Regional Indoor Stadium Relief Camp',
    coordinates: [76.2970, 9.9750],
    capacity: 1200,
    currentOccupancy: 860,
    medicalSupport: true,
    activeCases: 24,
    missingPersonCases: 8,
    contactNumber: '+91 484 2315800',
    lastUpdate: '18:40 IST',
    buildingHeight: 28,
    address: 'Kadavanthra Stadium Complex',
    suppliesStatus: 'ADEQUATE',
    operationalStatus: 'ACTIVE'
  }
];

// Multi-Disaster Hazard Polygons
export const INITIAL_HAZARD_ZONES: HazardZone[] = [
  // FLOOD
  {
    id: 'HAZARD-FLOOD-01',
    name: 'Marine Drive Basin Waterfront Surge',
    type: 'FLOOD',
    severity: 'EXTREME',
    waterLevelCm: 145,
    flowVelocityMs: 2.1,
    lastSurveyed: '18:30 IST',
    description: 'High-tide backwater surge overlapping urban drainage outlet. Water velocity: 2.1 m/s.',
    coordinates: [
      [76.2650, 9.9850],
      [76.2730, 9.9930],
      [76.2790, 9.9870],
      [76.2770, 9.9790],
      [76.2710, 9.9740],
      [76.2650, 9.9850]
    ]
  },
  {
    id: 'HAZARD-FLOOD-02',
    name: 'Market Canal Backflow Zone',
    type: 'FLOOD',
    severity: 'HIGH',
    waterLevelCm: 85,
    flowVelocityMs: 1.2,
    lastSurveyed: '18:35 IST',
    description: 'Severe waterlogging blocking 3 arterial alleyways. Vehicle transit impassable.',
    coordinates: [
      [76.2785, 9.9840],
      [76.2835, 9.9860],
      [76.2840, 9.9810],
      [76.2790, 9.9800],
      [76.2785, 9.9840]
    ]
  },
  // CYCLONE
  {
    id: 'HAZARD-CYCLONE-01',
    name: 'Vembanad Coastal Gale Corridor',
    type: 'CYCLONE',
    severity: 'EXTREME',
    windSpeedKmh: 98,
    lastSurveyed: '18:25 IST',
    description: 'Severe gale force winds exceeding 98 km/h. High debris projectile hazard.',
    coordinates: [
      [76.2550, 9.9950],
      [76.2700, 10.0050],
      [76.2850, 9.9950],
      [76.2750, 9.9650],
      [76.2550, 9.9950]
    ]
  },
  // FIRE
  {
    id: 'HAZARD-FIRE-01',
    name: 'Industrial Fuel Wharf Thermal Perimeter',
    type: 'FIRE',
    severity: 'HIGH',
    thermalRadiusM: 350,
    lastSurveyed: '18:15 IST',
    description: 'Storage tank rupture ignited near dockside. Toxic smoke plume drifting north-east.',
    coordinates: [
      [76.2680, 9.9670],
      [76.2730, 9.9710],
      [76.2760, 9.9680],
      [76.2720, 9.9640],
      [76.2680, 9.9670]
    ]
  },
  // EARTHQUAKE
  {
    id: 'HAZARD-QUAKE-01',
    name: 'Old Masonry Structural Collapse Zone',
    type: 'EARTHQUAKE',
    severity: 'HIGH',
    lastSurveyed: '18:10 IST',
    description: 'Multiple unreinforced masonry facades cracked. Debris blocking Broadway main road.',
    coordinates: [
      [76.2800, 9.9790],
      [76.2860, 9.9820],
      [76.2870, 9.9770],
      [76.2820, 9.9750],
      [76.2800, 9.9790]
    ]
  },
  // TSUNAMI
  {
    id: 'HAZARD-TSUNAMI-01',
    name: 'Coastal Lowland Inundation Line',
    type: 'TSUNAMI',
    severity: 'EXTREME',
    lastSurveyed: '18:05 IST',
    description: 'Coastal sea wall breached. Inundation buffer 500m inland. Immediate vertical evacuation required.',
    coordinates: [
      [76.2600, 9.9700],
      [76.2660, 9.9950],
      [76.2740, 9.9920],
      [76.2690, 9.9680],
      [76.2600, 9.9700]
    ]
  },
  // LANDSLIDE
  {
    id: 'HAZARD-SLIDE-01',
    name: 'Eastern Rail Cut Slope Failure',
    type: 'LANDSLIDE',
    severity: 'HIGH',
    lastSurveyed: '18:20 IST',
    description: 'Hill embankment slippage over railway tracks. Access via road only.',
    coordinates: [
      [76.2920, 9.9690],
      [76.2980, 9.9720],
      [76.2990, 9.9670],
      [76.2940, 9.9650],
      [76.2920, 9.9690]
    ]
  }
];

export const INITIAL_COMMS_NODES: CommunicationNode[] = [
  {
    id: 'NODE-01',
    name: 'Marine Drive Tactical Mast',
    coordinates: [76.2760, 9.9815],
    status: 'OPERATIONAL',
    batteryPercent: 91,
    rangeRadiusMeters: 1800,
    type: 'MESH_RELAY'
  },
  {
    id: 'NODE-02',
    name: 'General Hospital Satellite Terminal',
    coordinates: [76.2835, 9.9720],
    status: 'OPERATIONAL',
    batteryPercent: 100,
    rangeRadiusMeters: 2500,
    type: 'SATELLITE_LINK'
  },
  {
    id: 'NODE-03',
    name: 'Old Bridge Sector Repeater',
    coordinates: [76.2705, 9.9880],
    status: 'DEGRADED',
    batteryPercent: 34,
    rangeRadiusMeters: 800,
    type: 'MESH_RELAY'
  }
];

// Initial Rescue Chains for demo cases tracking the complete 11-stage journey
export const INITIAL_RESCUE_CHAINS: Record<string, CaseRescueChain> = {
  'VY-2026-0002047': {
    caseId: 'VY-2026-0002047',
    stages: [
      { stageId: 'SOS_RECEIVED', label: 'SOS Received', status: 'VERIFIED', timestamp: '18:15 IST', actor: 'Citizen Rajan', role: 'CITIZEN', locationName: 'Old Bridge East Approach', coordinates: [76.2690, 9.9890], evidence: 'Mobile GPS Beacon' },
      { stageId: 'AI_TRIAGED', label: 'AI Triaged', status: 'VERIFIED', timestamp: '18:16 IST', actor: 'VYRO AI Engine', locationName: 'Old Bridge Sector', evidence: 'Urgency: Critical | 3 Pax | Amphibious required' },
      { stageId: 'COMMANDER_DISPATCH', label: 'Commander Approved', status: 'PENDING', actor: 'HQ Controller', role: 'COMMANDER', locationName: 'Command Post' },
      { stageId: 'RESCUER_ASSIGNED', label: 'Team Assigned', status: 'PENDING' },
      { stageId: 'RESCUER_EN_ROUTE', label: 'En Route', status: 'PENDING' },
      { stageId: 'VICTIM_LOCATED', label: 'Victim Located', status: 'PENDING' },
      { stageId: 'RESCUE_COMPLETED', label: 'Rescue Secured', status: 'PENDING' },
      { stageId: 'MEDICAL_HANDOFF', label: 'Medical Handoff', status: 'PENDING' },
      { stageId: 'HOSPITAL_ADMITTED', label: 'Hospital Admitted', status: 'PENDING' },
      { stageId: 'SHELTER_TRANSFERRED', label: 'Shelter Transfer', status: 'PENDING' },
      { stageId: 'FAMILY_REUNITED', label: 'Family Reunited', status: 'PENDING' },
      { stageId: 'CASE_CLOSED', label: 'Case Closed', status: 'PENDING' }
    ]
  },
  'VY-2026-0002048': {
    caseId: 'VY-2026-0002048',
    stages: [
      { stageId: 'SOS_RECEIVED', label: 'SOS Received', status: 'VERIFIED', timestamp: '18:22 IST', actor: 'Citizen Anjali', role: 'CITIZEN', locationName: 'Broadway Lane 4', coordinates: [76.2810, 9.9830], evidence: 'Citizen Geolocation' },
      { stageId: 'AI_TRIAGED', label: 'AI Triaged', status: 'VERIFIED', timestamp: '18:23 IST', actor: 'VYRO AI Engine', locationName: 'Broadway Sector', evidence: 'Priority: High | 2 Pax (Infant)' },
      { stageId: 'COMMANDER_DISPATCH', label: 'Commander Approved', status: 'VERIFIED', timestamp: '18:25 IST', actor: 'Commander Varma', role: 'COMMANDER', notes: 'Dispatched Team Alpha-04 with shallow boat' },
      { stageId: 'RESCUER_ASSIGNED', label: 'Team Assigned', status: 'VERIFIED', timestamp: '18:26 IST', actor: 'Team Alpha-04', role: 'RESCUER' },
      { stageId: 'RESCUER_EN_ROUTE', label: 'En Route', status: 'IN_PROGRESS', timestamp: '18:30 IST', actor: 'Team Alpha-04', role: 'RESCUER', locationName: 'Transit via Shanmugham Corridor' },
      { stageId: 'VICTIM_LOCATED', label: 'Victim Located', status: 'PENDING' },
      { stageId: 'RESCUE_COMPLETED', label: 'Rescue Secured', status: 'PENDING' },
      { stageId: 'MEDICAL_HANDOFF', label: 'Medical Handoff', status: 'PENDING' },
      { stageId: 'HOSPITAL_ADMITTED', label: 'Hospital Admitted', status: 'PENDING' },
      { stageId: 'SHELTER_TRANSFERRED', label: 'Shelter Transfer', status: 'PENDING' },
      { stageId: 'FAMILY_REUNITED', label: 'Family Reunited', status: 'PENDING' },
      { stageId: 'CASE_CLOSED', label: 'Case Closed', status: 'PENDING' }
    ]
  },
  'VY-2026-0002050': {
    caseId: 'VY-2026-0002050',
    stages: [
      { stageId: 'SOS_RECEIVED', label: 'SOS Received', status: 'VERIFIED', timestamp: '17:50 IST', actor: 'Automated SCADA', locationName: 'South Railway Overpass Substation', coordinates: [76.2895, 9.9705] },
      { stageId: 'AI_TRIAGED', label: 'AI Triaged', status: 'VERIFIED', timestamp: '17:52 IST', actor: 'VYRO AI Engine' },
      { stageId: 'COMMANDER_DISPATCH', label: 'Commander Approved', status: 'VERIFIED', timestamp: '17:55 IST', actor: 'Commander Varma' },
      { stageId: 'RESCUER_ASSIGNED', label: 'Team Assigned', status: 'VERIFIED', timestamp: '17:56 IST', actor: 'Team Bravo-02' },
      { stageId: 'RESCUER_EN_ROUTE', label: 'En Route', status: 'VERIFIED', timestamp: '18:00 IST', actor: 'Team Bravo-02' },
      { stageId: 'VICTIM_LOCATED', label: 'Victim Located', status: 'VERIFIED', timestamp: '18:05 IST', actor: 'Team Bravo-02' },
      { stageId: 'RESCUE_COMPLETED', label: 'Rescue Secured', status: 'VERIFIED', timestamp: '18:10 IST', actor: 'Team Bravo-02' },
      { stageId: 'MEDICAL_HANDOFF', label: 'Medical Handoff', status: 'VERIFIED', timestamp: '18:12 IST', actor: 'EMS Med-Alpha-01', locationName: 'Hospital Emergency Bay', notes: 'Patient transferred from boat to EMS ambulance' },
      { stageId: 'HOSPITAL_ADMITTED', label: 'Hospital Admitted', status: 'CHAIN_BREAK', timestamp: '18:40 IST (TIMEOUT)', notes: 'CRITICAL MISMATCH: Ambulance arrived at General Hospital 28m ago, but NO admission has been logged by ER Staff!' },
      { stageId: 'SHELTER_TRANSFERRED', label: 'Shelter Transfer', status: 'PENDING' },
      { stageId: 'FAMILY_REUNITED', label: 'Family Reunited', status: 'PENDING' },
      { stageId: 'CASE_CLOSED', label: 'Case Closed', status: 'PENDING' }
    ]
  }
};

// Initial Active Chain Break Alert
export const INITIAL_CHAIN_BREAKS: ChainBreakAlert[] = [
  {
    id: 'CB-ALERT-001',
    caseId: 'VY-2026-0002050',
    lastVerifiedStage: 'MEDICAL_HANDOFF (18:12 IST)',
    lastVerifiedLocation: 'General Hospital ER Ambulatory Bay (76.2831° E, 9.9725° N)',
    lastVerifiedTime: '18:12 IST',
    responsibleTeam: 'Rapid EMS Med-01',
    expectedNextStage: 'HOSPITAL_ADMITTED',
    missingConfirmation: 'Government General Hospital ER Admission Receipt',
    risk: 'CRITICAL',
    recommendedAction: 'Contact General Hospital Triage Desk (+91 484 2361250) or request EMS driver physical verification.',
    isResolved: false
  }
];

// Initial Missing Persons for Family Reunification
export const INITIAL_MISSING_PERSONS: MissingPersonRecord[] = [
  {
    id: 'MP-2026-01',
    fullName: 'Leela Menon',
    age: 60,
    gender: 'FEMALE',
    lastSeenLocation: 'Old Bridge Residential Colony, East Embankment',
    lastSeenCoordinates: [76.2690, 9.9890],
    lastSeenTime: '17:30 IST',
    contactPerson: 'Rajan Menon (Husband)',
    contactPhone: '+91 98471 23456',
    description: 'Wearing green traditional cotton saree, silver spectacles, diabetic.',
    photoDescription: 'Elderly lady with silver rimmed spectacles',
    status: 'AI_MATCH_FOUND',
    matchedEvacueeId: 'EV-102',
    matchFacilityName: 'Government Higher Secondary School Shelter',
    matchConfidence: 96
  },
  {
    id: 'MP-2026-02',
    fullName: 'Arjun Das',
    age: 14,
    gender: 'MALE',
    lastSeenLocation: 'Broadway Lane 2, near Market Canal',
    lastSeenCoordinates: [76.2805, 9.9820],
    lastSeenTime: '17:45 IST',
    contactPerson: 'Sunitha Das (Mother)',
    contactPhone: '+91 94470 98765',
    description: '14-year-old boy in blue school polo and black backpack.',
    status: 'SEARCHING'
  },
  {
    id: 'MP-2026-03',
    fullName: 'K. Sreedharan',
    age: 57,
    gender: 'MALE',
    lastSeenLocation: 'South Railway Substation Gate',
    lastSeenCoordinates: [76.2895, 9.9705],
    lastSeenTime: '17:50 IST',
    contactPerson: 'Suresh K. (Brother)',
    contactPhone: '+91 97455 11223',
    description: 'Uniformed security officer, khaki shirt, badge #312.',
    status: 'AI_MATCH_FOUND',
    matchedHospitalPatientId: 'PT-ER-89',
    matchFacilityName: 'Government General Hospital ICU / Trauma',
    matchConfidence: 92
  }
];

// Roster of Evacuees Sheltered
export const INITIAL_EVACUEE_ROSTER = [
  { id: 'EV-101', name: 'Rajan Menon', age: 64, sector: 'Old Bridge', shelterId: 'SHELTER-01', status: 'MED_CARE' },
  { id: 'EV-102', name: 'Leela Menon', age: 60, sector: 'Old Bridge', shelterId: 'SHELTER-01', status: 'SHELTERED' },
  { id: 'EV-103', name: 'Anjali Nair & Infant', age: 28, sector: 'Broadway Lane 4', shelterId: 'SHELTER-02', status: 'SHELTERED' },
  { id: 'EV-104', name: 'S. George', age: 45, sector: 'Marine Drive Waterfront', shelterId: 'SHELTER-01', status: 'SHELTERED' },
  { id: 'EV-105', name: 'Praveen K.', age: 34, sector: 'Kacheripady Basin', shelterId: 'SHELTER-03', status: 'SHELTERED' }
];

// High-fidelity GeoJSON Building Footprints for 3D extrusion of operational facilities
export const OPERATIONAL_BUILDINGS_GEOJSON = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {
        id: 'BLD-SHELTER-01',
        name: 'Government Higher Secondary School',
        type: 'SHELTER',
        height: 24,
        min_height: 0,
        color: '#8b5cf6',
        occupancy: 342,
        capacity: 500
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [76.2861, 9.9709],
          [76.2869, 9.9709],
          [76.2869, 9.9715],
          [76.2861, 9.9715],
          [76.2861, 9.9709]
        ]]
      }
    },
    {
      type: 'Feature',
      properties: {
        id: 'BLD-HOSP-01',
        name: 'Government General Hospital',
        type: 'HOSPITAL',
        height: 38,
        min_height: 0,
        color: '#10b981',
        occupancy: 446,
        capacity: 480
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [76.2827, 9.9721],
          [76.2836, 9.9721],
          [76.2836, 9.9729],
          [76.2827, 9.9729],
          [76.2827, 9.9721]
        ]]
      }
    },
    {
      type: 'Feature',
      properties: {
        id: 'BLD-SHELTER-02',
        name: 'Town Hall Central Evacuation Hub',
        type: 'SHELTER',
        height: 28,
        min_height: 0,
        color: '#8b5cf6',
        occupancy: 410,
        capacity: 750
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [76.2886, 9.9916],
          [76.2894, 9.9916],
          [76.2894, 9.9924],
          [76.2886, 9.9924],
          [76.2886, 9.9916]
        ]]
      }
    },
    {
      type: 'Feature',
      properties: {
        id: 'BLD-OLD-BRIDGE',
        name: 'Old Bridge Pylon & Control Tower',
        type: 'INFRASTRUCTURE',
        height: 20,
        min_height: 0,
        color: '#ef4444',
        status: 'CRITICAL_WATER_LEVEL'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [76.2687, 9.9887],
          [76.2693, 9.9887],
          [76.2693, 9.9893],
          [76.2687, 9.9893],
          [76.2687, 9.9887]
        ]]
      }
    }
  ]
};
