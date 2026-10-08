export type Role = 'COMMANDER' | 'RESCUER' | 'MEDICAL' | 'HOSPITAL' | 'SHELTER' | 'CITIZEN';

export type SupportedLanguage = 'en' | 'ta' | 'hi' | 'te' | 'kn' | 'ml';

export type DisasterType = 
  | 'FLOOD' 
  | 'FIRE' 
  | 'EARTHQUAKE' 
  | 'TSUNAMI' 
  | 'CYCLONE' 
  | 'LANDSLIDE' 
  | 'ACCIDENT' 
  | 'MEDICAL' 
  | 'TRAPPED' 
  | 'OTHER';

export type CasePriority = 'CRITICAL' | 'HIGH' | 'ACTIVE' | 'CHAIN_BREAK';

export type CaseStatus = 
  | 'REPORTED' 
  | 'ASSIGNED' 
  | 'EN_ROUTE' 
  | 'ON_SCENE' 
  | 'RESCUED' 
  | 'MEDICAL_HANDOFF' 
  | 'HOSPITALIZED' 
  | 'SHELTERED'
  | 'REUNITED'
  | 'CLOSED';

export interface LocationTelemetry {
  coordinates: [number, number]; // [lng, lat]
  accuracyMeters: number;
  timestamp: string;
  source: 'DEVICE_GPS' | 'ESTIMATED_BASIN' | 'LANDMARK_INPUT' | 'FIELD_RECON' | 'LAST_KNOWN';
  isLive: boolean;
}

export interface VictimCase {
  id: string; // e.g. VY-2026-0002047
  name: string;
  age?: number;
  peopleCount: number;
  disasterType: DisasterType;
  priority: CasePriority;
  status: CaseStatus;
  coordinates: [number, number]; // [lng, lat]
  locationName: string;
  reportedAt: string;
  lastVerifiedAt: string;
  accuracyMeters: number;
  verificationStatus: 'VERIFIED' | 'REPORTED' | 'CONFIRMED_BY_TEAM' | 'CHAIN_BREAK';
  source: string;
  medicalNeeds: string;
  assignedTeamId?: string;
  assignedHospitalId?: string;
  assignedShelterId?: string;
  risk: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  hazardProximityNote?: string;
  notes: string;
  isSimulated: boolean;
  voiceTranscript?: string;
  locationTelemetryType: 'LIVE' | 'LAST_VERIFIED' | 'LAST_KNOWN';
}

export type RescueChainStageId =
  | 'SOS_RECEIVED'
  | 'AI_TRIAGED'
  | 'COMMANDER_DISPATCH'
  | 'RESCUER_ASSIGNED'
  | 'RESCUER_EN_ROUTE'
  | 'VICTIM_LOCATED'
  | 'RESCUE_COMPLETED'
  | 'MEDICAL_HANDOFF'
  | 'HOSPITAL_ADMITTED'
  | 'SHELTER_TRANSFERRED'
  | 'FAMILY_REUNITED'
  | 'CASE_CLOSED';

export type StageVerificationStatus = 
  | 'VERIFIED' 
  | 'PENDING' 
  | 'IN_PROGRESS' 
  | 'UNVERIFIED' 
  | 'FAILED' 
  | 'CHAIN_BREAK';

export interface RescueChainStage {
  stageId: RescueChainStageId;
  label: string;
  status: StageVerificationStatus;
  timestamp?: string;
  actor?: string;
  role?: Role;
  locationName?: string;
  coordinates?: [number, number];
  evidence?: string;
  notes?: string;
}

export interface CaseRescueChain {
  caseId: string;
  stages: RescueChainStage[];
}

export interface ChainBreakAlert {
  id: string;
  caseId: string;
  lastVerifiedStage: string;
  lastVerifiedLocation: string;
  lastVerifiedTime: string;
  responsibleTeam: string;
  expectedNextStage: string;
  missingConfirmation: string;
  risk: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  recommendedAction: string;
  isResolved: boolean;
  resolvedAt?: string;
  resolvedBy?: string;
}

export interface AITriageResult {
  disasterType: DisasterType;
  priority: CasePriority;
  severityScore: number; // 1 - 10
  urgency: 'IMMEDIATE' | 'HIGH' | 'MODERATE';
  victimCount: number;
  trappedStatus: boolean;
  extractedHazards: string[];
  extractedLocationClues: string[];
  detectedLanguage: string;
  duplicateProbability: number;
  recommendedUnitType: string;
  aiSummary: string;
}

export interface MissingPersonRecord {
  id: string;
  fullName: string;
  age: number;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  lastSeenLocation: string;
  lastSeenCoordinates: [number, number];
  lastSeenTime: string;
  contactPerson: string;
  contactPhone: string;
  description: string;
  photoDescription?: string;
  status: 'SEARCHING' | 'AI_MATCH_FOUND' | 'VERIFIED_REUNITED';
  matchedEvacueeId?: string;
  matchedHospitalPatientId?: string;
  matchFacilityName?: string;
  matchConfidence?: number; // e.g. 94
}

export interface RescueTeam {
  id: string; // e.g. TEAM-ALPHA-04
  name: string;
  callsign: string;
  status: 'IDLE' | 'EN_ROUTE' | 'ON_SCENE' | 'EXTRICATING' | 'RETURNING';
  coordinates: [number, number];
  accuracyMeters: number;
  lastLocationUpdate: string;
  assignedMissionId?: string;
  personnelCount: number;
  vehicleType: 'AMPHIBIOUS' | 'INFLATABLE_BOAT' | 'ALL_TERRAIN_4X4';
  trackingActive: boolean;
  isSimulated: boolean;
  batteryLevel?: number;
}

export interface MedicalTeam {
  id: string;
  name: string;
  status: 'AVAILABLE' | 'EN_ROUTE' | 'TRIAGING' | 'TRANSPORTING';
  coordinates: [number, number];
  ambulanceType: 'ADVANCED_LIFE_SUPPORT' | 'BASIC_LIFE_SUPPORT';
  capacityCasualties: number;
  currentCasualties: number;
  destinationHospitalId?: string;
  lastUpdate: string;
  isSimulated: boolean;
}

export interface HospitalFacility {
  id: string;
  name: string;
  coordinates: [number, number];
  totalBeds: number;
  availableBeds: number;
  icuTotal: number;
  icuAvailable: number;
  traumaLevel: 'LEVEL 1' | 'LEVEL 2' | 'LEVEL 3';
  activeIncomingCasualties: number;
  contactNumber: string;
  buildingHeight: number;
  address: string;
  operationalStatus: 'NORMAL' | 'NEAR_CAPACITY' | 'CRITICAL_SURGE';
}

export interface ShelterFacility {
  id: string;
  name: string;
  coordinates: [number, number];
  capacity: number;
  currentOccupancy: number;
  medicalSupport: boolean;
  activeCases: number;
  missingPersonCases: number;
  contactNumber: string;
  lastUpdate: string;
  buildingHeight: number;
  address: string;
  suppliesStatus: 'OPTIMAL' | 'ADEQUATE' | 'LOW';
  operationalStatus: 'ACTIVE' | 'FULL' | 'EVACUATING';
}

export interface HazardZone {
  id: string;
  name: string;
  type: DisasterType;
  severity: 'EXTREME' | 'HIGH' | 'MODERATE';
  coordinates: [number, number][]; // Ring of [lng, lat]
  waterLevelCm?: number;
  flowVelocityMs?: number;
  windSpeedKmh?: number;
  thermalRadiusM?: number;
  lastSurveyed: string;
  description: string;
}

export interface CommunicationNode {
  id: string;
  name: string;
  coordinates: [number, number];
  status: 'OPERATIONAL' | 'DEGRADED' | 'OFFLINE';
  batteryPercent: number;
  rangeRadiusMeters: number;
  type: 'MESH_RELAY' | 'SATELLITE_LINK' | 'TOWER';
}

export interface ActiveRoute {
  id: string;
  fromCoordinates: [number, number];
  toCoordinates: [number, number];
  fromLabel: string;
  toLabel: string;
  geometry: [number, number][]; // GeoJSON line string coordinates
  distanceKm: number;
  estimatedMinutes: number;
  risk: 'LOW' | 'MEDIUM' | 'HIGH';
  hazardIntersection: boolean;
  riskReason?: string;
  viaRoads?: string[];
}

export type MapCameraMode = '2D' | '3D' | 'SATELLITE' | 'TERRAIN';

export interface LayerVisibility {
  victims: boolean;
  rescueTeams: boolean;
  medicalTeams: boolean;
  hospitals: boolean;
  shelters: boolean;
  hazards: boolean;
  routes: boolean;
  communication: boolean;
  buildings3d: boolean;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: string;
  role: Role;
  action: string;
  details: string;
}

export interface OfflineSOSReport {
  localId: string;
  createdAt: string;
  location: [number, number] | null;
  locationName: string;
  disasterType: DisasterType;
  peopleCount: number;
  rawReport: string;
  isVoice: boolean;
  syncStatus: 'QUEUED' | 'SYNCED' | 'FAILED';
}

export type SimulatedDisasterType = 
  | 'TSUNAMI' 
  | 'EARTHQUAKE' 
  | 'WILDFIRE' 
  | 'CYCLONE' 
  | 'CHEMICAL' 
  | 'LANDSLIDE' 
  | 'FLOOD';

export interface AIRescuePlanOption {
  id: 'A' | 'B' | 'C';
  title: string;
  teamCallsign: string;
  vehicleType: string;
  eta: string;
  etaMinutes: number;
  feasibilityPercent: number;
  routeDescription: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  assignedTeamId: string;
}

export interface ThreatAssessmentData {
  waterLevelMeters: number;
  disasterIntensity: string;
  affectedBuildings: number;
  trappedPeople: number;
  blockedRoutes: number;
  rescueRisk: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  weather: string;
  windSpeedKmh: number;
  communicationStatus: string;
}

export interface MaydayAlert {
  id: string;
  responderCallsign: string;
  message: string;
  timestamp: string;
  location: string;
  isActive: boolean;
}

export interface CopilotRecommendation {
  id: string;
  targetIncidentId: string;
  targetTeamId: string;
  title: string;
  reasoning: string;
  action: string;
  dismissed: boolean;
}

export type PrimaryViewMode = 
  | 'COMMAND_CENTER' 
  | '3D_TWIN' 
  | 'CITIZEN' 
  | 'COMPILER' 
  | 'RESCUER' 
  | 'MEDICAL' 
  | 'HOSPITAL' 
  | 'SHELTER' 
  | 'FAMILY' 
  | 'CHAIN_AUDIT';

// Section 7: Structured Emergency Snapshot
export interface EmergencySOS {
  caseId: string;
  createdAt: string;

  person: {
    name?: string;
    phone?: string;
    peopleCount: number;
    vulnerablePeople?: string[];
  };

  incident: {
    type: string;
    description?: string;
    severity: "critical" | "high" | "moderate";
  };

  location: {
    latitude?: number;
    longitude?: number;
    accuracyMeters?: number;
    timestamp: string;
    source:
      | "gps"
      | "network"
      | "manual"
      | "last-known"
      | "mesh-relay";
    confidence:
      | "high"
      | "moderate"
      | "last-known"
      | "relayed";
  };

  lastKnownLocation?: {
    latitude: number;
    longitude: number;
    accuracyMeters?: number;
    timestamp: string;
    source: string;
  };

  device: {
    batteryPercent?: number;
    charging: boolean;
    networkType?: string;
    gpsAvailable: boolean;
  };

  communication: {
    internet: boolean;
    cellular: boolean;
    mesh: boolean;
    radio: boolean;
    deviceToDevice: boolean;
  };

  movement: {
    state:
      | "moving"
      | "stationary"
      | "unknown";
    lastMovementAt?: string;
  };

  status: string;
}

// Section 12: Multi-channel Communication Packet
export interface EmergencyPacket {
  packetId: string;
  caseId: string;
  createdAt: string;
  hops: number;
  ttl: number;
  sourceDevice: string;
  destination?: string;
  payload: EmergencySOS;
  status: "queued" | "relaying" | "delivered";
}

// Section 16: Live Rescuer Tracking
export interface RescueTeamLocation {
  teamId: string;
  latitude: number;
  longitude: number;
  heading: number;
  speedKmh: number;
  accuracyMeters?: number;
  timestamp: string;
}

// Section 18: Rescue Urgency Engine
export interface RescueUrgencyAssessment {
  score: number; // 0 - 100
  urgencyLevel: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW';
  reasons: string[];
}

// Section 26: Moving Rescue Vehicles in Digital Twin & Ops
export interface RescueVehicleInfo {
  vehicleId: string;
  callsign: string;
  type: 'AMBULANCE' | 'RESCUE_TRUCK' | 'RESCUE_BOAT' | 'RESPONSE_SUV' | 'HELICOPTER';
  team: string;
  speedKmh: number;
  batteryOrFuelPercent: number;
  status: 'EN_ROUTE' | 'ON_SCENE' | 'EXTRICATING' | 'RETURNING' | 'STATIONED';
  route: string;
  eta: string;
  distanceKm: number;
  heading: number;
  gps: [number, number]; // [lat, lng]
}

// Section 40: Signature Rescue Continuity
export type RescueContinuityStage =
  | 'PERSON'
  | 'SIGNAL'
  | 'LOCATION'
  | 'AI'
  | 'RESPONDER'
  | 'RESCUE'
  | 'MEDICAL'
  | 'HOSPITAL'
  | 'SHELTER'
  | 'FAMILY';

// ==========================================
// VYRO REUNITE™ — Two-Way Human Reunification Network
// Chain: FIND -> IDENTIFY -> MATCH -> VERIFY -> CONNECT -> REUNITE -> CLOSE
// ==========================================
export type VyroReuniteStage = 
  | 'FIND' 
  | 'IDENTIFY' 
  | 'MATCH' 
  | 'VERIFY' 
  | 'CONNECT' 
  | 'REUNITE' 
  | 'CLOSE';

export interface ReuniteVerificationStep {
  stepNumber: number;
  title: string;
  description: string;
  verified: boolean;
  timestamp?: string;
  authorizedOfficer?: string;
}

export interface FamilyCaseRecord {
  id: string; // e.g. FM-26-0091
  victimCaseId: string; // e.g. VY-26-1042
  missingPersonName: string;
  age: number;
  reportedBy: string;
  relationship: string;
  contactPhone: string;
  lastKnownLocation: string;
  currentFacility: string;
  reunionCenter: string;
  matchConfidence: number; // e.g. 98
  matchCriteria: string[];
  priority: 'CRITICAL_VULNERABLE' | 'HIGH_PRIORITY' | 'STANDARD';
  priorityReason?: string;
  reunionToken: string; // e.g. VYRO-RN-842719
  tokenExpiry: string;
  status: 'MATCH_FOUND' | 'AWAITING_VERIFICATION' | 'REUNION_READY' | 'COMPLETED';
  currentStage: VyroReuniteStage;
  imSafeSent: boolean;
  imSafeSentTime?: string;
  safeMessageLog: Array<{ id: string; sender: string; text: string; time: string; isProtected: boolean }>;
  verificationSteps: ReuniteVerificationStep[];
  auditTrail: Array<{ time: string; action: string; officer: string }>;
}

export interface ReunionQueueCounts {
  readyForMatch: number;
  matchFound: number;
  awaitingVerification: number;
  reunionReady: number;
  completed: number;
}


