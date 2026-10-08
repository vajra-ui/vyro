import { create } from 'zustand';
import {
  Role,
  VictimCase,
  CasePriority,
  RescueTeam,
  MedicalTeam,
  HospitalFacility,
  ShelterFacility,
  HazardZone,
  CommunicationNode,
  ActiveRoute,
  MapCameraMode,
  LayerVisibility,
  AuditLogEntry,
  CaseRescueChain,
  ChainBreakAlert,
  MissingPersonRecord,
  SupportedLanguage,
  DisasterType,
  OfflineSOSReport,
  AITriageResult,
  RescueChainStageId,
  RescueChainStage,
  SimulatedDisasterType,
  AIRescuePlanOption,
  ThreatAssessmentData,
  MaydayAlert,
  CopilotRecommendation,
  PrimaryViewMode,
  EmergencySOS,
  EmergencyPacket,
  RescueTeamLocation,
  RescueUrgencyAssessment,
  RescueVehicleInfo,
  RescueContinuityStage,
  FamilyCaseRecord,
  ReunionQueueCounts,
  VyroReuniteStage
} from '../types/vyro';
import {
  INITIAL_VICTIMS,
  INITIAL_RESCUE_TEAMS,
  INITIAL_MEDICAL_TEAMS,
  INITIAL_HOSPITALS,
  INITIAL_SHELTERS,
  INITIAL_HAZARD_ZONES,
  INITIAL_COMMS_NODES,
  INITIAL_RESCUE_CHAINS,
  INITIAL_CHAIN_BREAKS,
  INITIAL_MISSING_PERSONS,
  INCIDENT_CENTER
} from '../data/demoIncidentData';

export interface SelectedEntityInfo {
  type: 'VICTIM' | 'TEAM' | 'MEDICAL' | 'HOSPITAL' | 'SHELTER' | 'HAZARD' | 'NODE';
  id: string;
}

export interface FlyToOptions {
  coordinates: [number, number];
  zoom?: number;
  pitch?: number;
  bearing?: number;
  duration?: number;
}

export interface OperationalState {
  // Navigation & Identity
  currentRole: Role;
  demoAccountEmail: string;
  isSplashActive: boolean;
  currentLanguage: SupportedLanguage;
  activeDisaster: DisasterType;
  networkStatus: 'ONLINE' | 'LIMITED' | 'SYNCING' | 'OFFLINE';

  // Core Incidents & Operational Resources
  cases: VictimCase[];
  rescueTeams: RescueTeam[];
  medicalTeams: MedicalTeam[];
  hospitals: HospitalFacility[];
  shelters: ShelterFacility[];
  hazardZones: HazardZone[];
  commsNodes: CommunicationNode[];
  rescueChains: Record<string, CaseRescueChain>;
  chainBreaks: ChainBreakAlert[];
  missingPersons: MissingPersonRecord[];
  offlineReports: OfflineSOSReport[];

  // Active Citizen Case (tracked locally without login)
  activeCitizenCaseId: string | null;

  // Spatial & Map State
  selectedEntity: SelectedEntityInfo | null;
  activeRoute: ActiveRoute | null;
  cameraMode: MapCameraMode;
  layerVisibility: LayerVisibility;
  flyToTarget: FlyToOptions | null;
  buildingModal: { isOpen: boolean; buildingId: string | null; type: 'SHELTER' | 'HOSPITAL' | null };

  // Modals & Guided Walkthrough
  isFamilyModalOpen: boolean;
  isChainBreakModalOpen: boolean;
  isDemoWalkthroughActive: boolean;
  demoWalkthroughStep: number;

  // Real GPS Telemetry
  isGpsTracking: boolean;
  userCoordinates: [number, number] | null;
  gpsAccuracyMeters: number | null;
  lastGpsTimestamp: string | null;

  // Operational Audit Trail
  auditLogs: AuditLogEntry[];

  // 3D Simulated City Twin & View Navigation
  primaryViewMode: PrimaryViewMode;
  active3DDisaster: SimulatedDisasterType;
  activeAiRescuePlan: 'A' | 'B' | 'C';
  threatAssessmentTab: 'PLANS' | 'THREAT';
  waveTimer: number;
  simulationRunning: boolean;
  maydayAlert: MaydayAlert;
  copilotRecommendation: CopilotRecommendation | null;
  threatData: ThreatAssessmentData;
  isCompilerModalOpen: boolean;
  isLiveTrackingModalOpen: boolean;
  liveTrackingTeamId: string | null;
  isFinalSuccessModalOpen: boolean;
  aiRescuePlans: AIRescuePlanOption[];

  // Actions
  setPrimaryViewMode: (mode: PrimaryViewMode) => void;
  setActive3DDisaster: (disaster: SimulatedDisasterType) => void;
  setActiveAiRescuePlan: (planId: 'A' | 'B' | 'C') => void;
  setThreatAssessmentTab: (tab: 'PLANS' | 'THREAT') => void;
  dismissMaydayAlert: () => void;
  dispatchMaydayBackup: () => void;
  autoAssignCopilot: () => void;
  dismissCopilot: () => void;
  openCompilerModal: () => void;
  closeCompilerModal: () => void;
  openLiveTrackingModal: (teamId?: string) => void;
  closeLiveTrackingModal: () => void;
  openFinalSuccessModal: () => void;
  closeFinalSuccessModal: () => void;
  toggleSimulation: () => void;
  resetSimulation: () => void;
  dismissSplash: () => void;
  setRole: (role: Role) => void;
  setLanguage: (lang: SupportedLanguage) => void;
  setActiveDisaster: (disaster: DisasterType) => void;
  setNetworkStatus: (status: 'ONLINE' | 'LIMITED' | 'SYNCING' | 'OFFLINE') => void;

  // Citizen SOS & AI Triage
  submitCitizenSOS: (params: {
    disasterType: DisasterType;
    location: [number, number];
    locationName: string;
    accuracy: number;
    peopleCount: number;
    rawReport: string;
    isVoice: boolean;
    triage: AITriageResult;
  }) => string;

  // Rescue Chain & Chain Break Actions
  advanceRescueChain: (caseId: string, stageId: RescueChainStageId, updateData?: Partial<RescueChainStage>) => void;
  resolveChainBreak: (alertId: string, resolutionNotes?: string) => void;

  // Family Reunification Actions
  openFamilyModal: () => void;
  closeFamilyModal: () => void;
  registerMissingPerson: (data: Omit<MissingPersonRecord, 'id' | 'status'>) => void;
  verifyFamilyReunion: (missingPersonId: string) => void;

  // Guided Walkthrough Actions
  startDemoWalkthrough: () => void;
  nextDemoWalkthroughStep: () => void;
  setDemoWalkthroughStep: (step: number) => void;
  closeDemoWalkthrough: () => void;

  // Map & Entity Selection
  selectEntity: (type: SelectedEntityInfo['type'], id: string) => void;
  clearSelection: () => void;
  setCameraMode: (mode: MapCameraMode) => void;
  toggleLayer: (layer: keyof LayerVisibility) => void;
  setActiveRoute: (route: ActiveRoute | null) => void;
  triggerFlyTo: (opts: FlyToOptions) => void;
  openBuildingModal: (buildingId: string, type: 'SHELTER' | 'HOSPITAL') => void;
  closeBuildingModal: () => void;

  // Human Emergency Continuity Core
  activeEmergencySOS: EmergencySOS | null;
  emergencyPackets: EmergencyPacket[];
  activeRescueTracking: {
    teamId: string;
    teamName: string;
    vehicleId: string;
    speedKmh: number;
    distanceKm: number;
    etaMinutes: number;
    heading: number;
    gpsAccuracyMeters: number;
    updatedSecAgo: number;
    status: 'MISSION ACCEPTED' | 'EN ROUTE' | 'ON SCENE' | 'EXTRICATING';
  };
  locationTrail: Array<{ timestamp: string; source: string; latitude: number; longitude: number; accuracy: number }>;
  deviceSurvival: {
    batteryPercent: number;
    charging: boolean;
    cellular: 'CONNECTED' | 'WEAK' | 'OFFLINE';
    internet: 'CONNECTED' | 'OFFLINE';
    mesh: 'READY' | 'CONNECTED' | 'OFFLINE';
    radio: 'AVAILABLE' | 'OFFLINE';
    gpsAvailable: boolean;
    estimatedCommsMinutes: number;
    isCriticalBattery: boolean;
  };
  rescueVehicles: RescueVehicleInfo[];
  activeRescueStage: RescueContinuityStage;
  silentModeActive: boolean;

  // Field & Operational Updates
  updateVictimStatus: (id: string, status: VictimCase['status'], notes?: string) => void;
  assignTeamToVictim: (teamId: string, victimId: string) => void;
  dispatchTeamToCase: (caseId: string, teamId?: string, isManual?: boolean) => void;
  updateRescueTeamLocation: (teamId: string, coordinates: [number, number], accuracy: number) => void;
  updateShelterOccupancy: (shelterId: string, delta: number) => void;
  updateHospitalBeds: (hospitalId: string, bedDelta: number, icuDelta: number) => void;
  updateMedicalTeamStatus: (teamId: string, status: MedicalTeam['status'], destinationHospitalId?: string) => void;
  updateCaseTriage: (caseId: string, priority: CasePriority, medicalNeeds?: string, notes?: string) => void;

  // GPS & Offline Actions
  setGpsTracking: (active: boolean) => void;
  setUserCoordinates: (coords: [number, number], accuracy: number, timestamp: string) => void;
  queueOfflineReport: (report: OfflineSOSReport) => void;
  syncOfflineQueue: () => void;

  // Emergency Continuity & Demo Center Actions
  triggerOneTapSOS: () => string;
  triggerSosDemo: () => string;
  triggerAssignDemo: () => void;
  triggerFullRescueDemo: () => void;
  resetDemo: () => void;
  setActiveRescueStage: (stage: RescueContinuityStage) => void;
  setSilentModeActive: (active: boolean) => void;
  updateBatteryLevel: (percent: number) => void;

  // VYRO REUNITE™ Two-Way Human Reunification
  familyCases: FamilyCaseRecord[];
  reunionQueue: ReunionQueueCounts;
  activeFamilyCaseId: string;
  setActiveFamilyCaseId: (id: string) => void;
  sendImSafeNotification: (caseId: string) => void;
  reportMissingPersonCase: (data: {
    missingPersonName: string;
    age: number;
    reportedBy: string;
    relationship: string;
    contactPhone: string;
    lastKnownLocation: string;
  }) => string;
  verifyReuniteStep: (caseId: string, stepNumber: number) => void;
  executeReuniteHandoff: (caseId: string, token: string) => boolean;
  sendSafeMessage: (caseId: string, text: string) => void;

  // Audit Logs & Resets
  addAuditLog: (actor: string, role: Role, action: string, details: string) => void;
  resetSimulationData: () => void;
}

// Multi-tab sync channel
const syncChannel = typeof window !== 'undefined' ? new BroadcastChannel('vyro_sync_channel') : null;

export const useOperationalStore = create<OperationalState>((set, get) => {
  // Listen for sync messages from peer tabs
  if (syncChannel) {
    syncChannel.onmessage = (event) => {
      const { type, payload } = event.data;
      if (type === 'SYNC_STATE') {
        set((state) => ({ ...state, ...payload }));
      }
    };
  }

  const broadcastChange = (partial: Partial<OperationalState>) => {
    if (syncChannel) {
      try {
        syncChannel.postMessage({ type: 'SYNC_STATE', payload: partial });
      } catch (e) {
        console.warn('BroadcastChannel error', e);
      }
    }
  };

  return {
    // START DIRECTLY AS CITIZEN (Zero login) with Splash Screen
    currentRole: 'CITIZEN',
    demoAccountEmail: 'citizen.emergency@vyro.org',
    isSplashActive: true,
    currentLanguage: 'en',
    activeDisaster: 'FLOOD',
    networkStatus: 'ONLINE',

    cases: INITIAL_VICTIMS,
    rescueTeams: INITIAL_RESCUE_TEAMS,
    medicalTeams: INITIAL_MEDICAL_TEAMS,
    hospitals: INITIAL_HOSPITALS,
    shelters: INITIAL_SHELTERS,
    hazardZones: INITIAL_HAZARD_ZONES,
    commsNodes: INITIAL_COMMS_NODES,
    rescueChains: INITIAL_RESCUE_CHAINS,
    chainBreaks: INITIAL_CHAIN_BREAKS,
    missingPersons: INITIAL_MISSING_PERSONS,
    offlineReports: [],

    activeCitizenCaseId: 'VY-2026-0002047',

    selectedEntity: null,
    activeRoute: null,
    cameraMode: '3D',
    layerVisibility: {
      victims: true,
      rescueTeams: true,
      medicalTeams: true,
      hospitals: true,
      shelters: true,
      hazards: true,
      routes: true,
      communication: true,
      buildings3d: true
    },
    flyToTarget: null,
    buildingModal: { isOpen: false, buildingId: null, type: null },

    // Human Emergency Continuity Core Initial State
    activeEmergencySOS: {
      caseId: 'VY-26-1042',
      createdAt: '22:14:09 IST',
      person: {
        name: 'Citizen In Need',
        phone: '+91 98470 11200',
        peopleCount: 1,
        vulnerablePeople: []
      },
      incident: {
        type: 'FLOOD',
        description: 'Rising water level, trapped on roof approach',
        severity: 'critical'
      },
      location: {
        latitude: 11.342790,
        longitude: 77.728462,
        accuracyMeters: 6.8,
        timestamp: '22:14:09 IST',
        source: 'gps',
        confidence: 'high'
      },
      lastKnownLocation: {
        latitude: 11.342790,
        longitude: 77.728462,
        accuracyMeters: 6.8,
        timestamp: '22:13:51 IST',
        source: 'gps'
      },
      device: {
        batteryPercent: 78,
        charging: false,
        networkType: '4G LTE',
        gpsAvailable: true
      },
      communication: {
        internet: true,
        cellular: true,
        mesh: true,
        radio: true,
        deviceToDevice: true
      },
      movement: {
        state: 'stationary',
        lastMovementAt: '22:13:00 IST'
      },
      status: 'REPORTED'
    },
    emergencyPackets: [
      {
        packetId: 'PKT-1042-01',
        caseId: 'VY-26-1042',
        createdAt: '22:14:09 IST',
        hops: 1,
        ttl: 64,
        sourceDevice: 'DEV-USER-MOB-99',
        destination: 'VYRO-COMMAND-GATEWAY',
        payload: {
          caseId: 'VY-26-1042',
          createdAt: '22:14:09 IST',
          person: { name: 'Citizen In Need', peopleCount: 1 },
          incident: { type: 'FLOOD', severity: 'critical' },
          location: { latitude: 11.342790, longitude: 77.728462, accuracyMeters: 6.8, timestamp: '22:14:09 IST', source: 'gps', confidence: 'high' },
          device: { batteryPercent: 78, charging: false, gpsAvailable: true },
          communication: { internet: true, cellular: true, mesh: true, radio: true, deviceToDevice: true },
          movement: { state: 'stationary' },
          status: 'REPORTED'
        },
        status: 'delivered'
      }
    ],
    activeRescueTracking: {
      teamId: 'TEAM-ALPHA-04',
      teamName: 'RESCUE ALPHA',
      vehicleId: 'R-07',
      speedKmh: 42,
      distanceKm: 2.8,
      etaMinutes: 4,
      heading: 126,
      gpsAccuracyMeters: 5,
      updatedSecAgo: 3,
      status: 'MISSION ACCEPTED'
    },
    locationTrail: [
      { timestamp: '22:14:09', source: 'GPS', latitude: 11.342812, longitude: 77.728491, accuracy: 4.2 },
      { timestamp: '22:13:41', source: 'GPS', latitude: 11.342790, longitude: 77.728462, accuracy: 6.8 },
      { timestamp: '22:12:55', source: 'GPS', latitude: 11.342744, longitude: 77.728401, accuracy: 8.5 },
      { timestamp: '22:12:08', source: 'NETWORK', latitude: 11.342690, longitude: 77.728350, accuracy: 22.0 }
    ],
    deviceSurvival: {
      batteryPercent: 78,
      charging: false,
      cellular: 'CONNECTED',
      internet: 'CONNECTED',
      mesh: 'READY',
      radio: 'AVAILABLE',
      gpsAvailable: true,
      estimatedCommsMinutes: 160,
      isCriticalBattery: false
    },
    rescueVehicles: [
      {
        vehicleId: 'R-07',
        callsign: 'Rescue Truck R-07',
        type: 'RESCUE_TRUCK',
        team: 'RESCUE ALPHA',
        speedKmh: 42,
        batteryOrFuelPercent: 88,
        status: 'EN_ROUTE',
        route: 'River Road Bypass → Old Bridge',
        eta: '4m',
        distanceKm: 2.8,
        heading: 126,
        gps: [11.3440, 77.7295]
      },
      {
        vehicleId: 'Z-02',
        callsign: 'Zodiac Raft Z-02',
        type: 'RESCUE_BOAT',
        team: 'RESCUE BRAVO',
        speedKmh: 18,
        batteryOrFuelPercent: 92,
        status: 'EN_ROUTE',
        route: 'River Channel Basin',
        eta: '8m',
        distanceKm: 1.4,
        heading: 95,
        gps: [11.3435, 77.7270]
      },
      {
        vehicleId: 'AMB-04',
        callsign: 'ALS Ambulance 04',
        type: 'AMBULANCE',
        team: 'MEDIC BRAVO',
        speedKmh: 55,
        batteryOrFuelPercent: 74,
        status: 'STATIONED',
        route: 'General Hospital Bay',
        eta: '12m',
        distanceKm: 5.1,
        heading: 180,
        gps: [11.3390, 77.7320]
      },
      {
        vehicleId: 'AIR-01',
        callsign: 'Coast Guard Helo Air-1',
        type: 'HELICOPTER',
        team: 'AERIAL SQUAD',
        speedKmh: 140,
        batteryOrFuelPercent: 81,
        status: 'STATIONED',
        route: 'Aerial Vector East',
        eta: '3m',
        distanceKm: 6.2,
        heading: 45,
        gps: [11.3500, 77.7350]
      },
      {
        vehicleId: 'SUV-03',
        callsign: 'Tactical Recon SUV 03',
        type: 'RESPONSE_SUV',
        team: 'FIELD RECON',
        speedKmh: 35,
        batteryOrFuelPercent: 65,
        status: 'ON_SCENE',
        route: 'North Ridge Perimeter',
        eta: '6m',
        distanceKm: 3.4,
        heading: 210,
        gps: [11.3460, 77.7240]
      }
    ],
    activeRescueStage: 'LOCATION',
    silentModeActive: false,

    // VYRO REUNITE™ Initial State
    reunionQueue: {
      readyForMatch: 7,
      matchFound: 12,
      awaitingVerification: 4,
      reunionReady: 5,
      completed: 28
    },
    activeFamilyCaseId: 'FM-26-0091',
    familyCases: [
      {
        id: 'FM-26-0091',
        victimCaseId: 'VY-26-1042',
        missingPersonName: 'Ananya Sharma',
        age: 8,
        reportedBy: 'Ramesh Sharma',
        relationship: 'Father / Legal Guardian',
        contactPhone: '+91 98470 11200',
        lastKnownLocation: 'Old Bridge Sector (North Embankment)',
        currentFacility: 'VYRO Safe Shelter 01 (Pediatric Care Bay 3)',
        reunionCenter: 'Family Reunification Center RC-02 (Reunion Zone A)',
        matchConfidence: 98,
        matchCriteria: [
          'Emergency Contact phone number match (+91 98470 11200)',
          'Shelter registration record matched at VYRO Safe Shelter 01',
          'Biometric reference validated with authorized parental consent'
        ],
        priority: 'CRITICAL_VULNERABLE',
        priorityReason: 'Child separated from guardian (Guardian located 3.2 km away)',
        reunionToken: 'VYRO-RN-842719',
        tokenExpiry: '42m remaining',
        status: 'REUNION_READY',
        currentStage: 'REUNITE',
        imSafeSent: true,
        imSafeSentTime: '18:42:16 IST',
        safeMessageLog: [
          {
            id: 'MSG-01',
            sender: 'VYRO System',
            text: '🟢 YOUR FAMILY MEMBER HAS BEEN LOCATED\\nCase: VY-26-1042\\nStatus: SAFE\\nCurrent location: Authorized shelter\\nLast verified: 18:42 IST',
            time: '18:42 IST',
            isProtected: true
          },
          {
            id: 'MSG-02',
            sender: 'Ramesh Sharma (Guardian)',
            text: 'Thank God! I am at Reunification Center RC-02 waiting at Verification Desk.',
            time: '18:45 IST',
            isProtected: true
          }
        ],
        verificationSteps: [
          { stepNumber: 1, title: 'Candidate found', description: 'Automatic two-way match: FM-26-0091 ↔ VY-26-1042', verified: true, timestamp: '18:30 IST', authorizedOfficer: 'AI Identity Engine' },
          { stepNumber: 2, title: 'Identity verification', description: 'Biometric reference & Shelter Intake #2047 confirmed', verified: true, timestamp: '18:35 IST', authorizedOfficer: 'Officer S. Pillai (ID #409)' },
          { stepNumber: 3, title: 'Relationship verification', description: 'Guardian parentage document and emergency contact cross-validated', verified: true, timestamp: '18:38 IST', authorizedOfficer: 'Registry Controller' },
          { stepNumber: 4, title: 'Consent / authorization', description: 'Authorized guardian consent signed and recorded', verified: true, timestamp: '18:40 IST', authorizedOfficer: 'Legal Intake Officer' },
          { stepNumber: 5, title: 'Reunion location assigned', description: 'Assigned to Family Reunification Center RC-02, Booth 3', verified: true, timestamp: '18:41 IST', authorizedOfficer: 'Dispatch Coordinator' },
          { stepNumber: 6, title: 'Handoff verified', description: 'Physical handoff confirmed via single-use token VYRO-RN-842719', verified: false },
          { stepNumber: 7, title: 'Case closed', description: 'Final reunion verified, evidence archived, case sealed', verified: false }
        ],
        auditTrail: [
          { time: '18:15 IST', action: 'Distress SOS received for VY-26-1042', officer: 'Citizen SOS Gateway' },
          { time: '18:25 IST', action: 'Missing Person Report FM-26-0091 filed by Ramesh Sharma', officer: 'Family Intake Desk' },
          { time: '18:30 IST', action: 'Automatic 98% two-way match generated by Identity Engine', officer: 'VYRO AI Engine' },
          { time: '18:42 IST', action: 'Authorized I AM SAFE notification dispatched to family contact', officer: 'Automated Relay' },
          { time: '18:45 IST', action: 'Reunion Token VYRO-RN-842719 issued for RC-02', officer: 'Security Controller' }
        ]
      },
      {
        id: 'FM-26-0104',
        victimCaseId: 'VY-26-1088',
        missingPersonName: 'Kavita Menon',
        age: 72,
        reportedBy: 'Deepak Menon',
        relationship: 'Son',
        contactPhone: '+91 94471 22300',
        lastKnownLocation: 'Old Bridge Residential Enclave',
        currentFacility: 'Government General Hospital (Geriatric Observation)',
        reunionCenter: 'Family Reunification Center RC-02 (Booth 1)',
        matchConfidence: 94,
        matchCriteria: [
          'Hospital ER intake record match',
          'Medical tag allergy & name cross-reference'
        ],
        priority: 'CRITICAL_VULNERABLE',
        priorityReason: 'Elderly non-communicative individual needing medical escort',
        reunionToken: 'VYRO-RN-519204',
        tokenExpiry: '1h 15m remaining',
        status: 'AWAITING_VERIFICATION',
        currentStage: 'VERIFY',
        imSafeSent: true,
        imSafeSentTime: '19:10:00 IST',
        safeMessageLog: [
          {
            id: 'MSG-101',
            sender: 'VYRO System',
            text: '🟢 YOUR FAMILY MEMBER HAS BEEN LOCATED\\nCase: VY-26-1088\\nStatus: STABLE IN MEDICAL CARE\\nCurrent location: Government General Hospital\\nLast verified: 19:10 IST',
            time: '19:10 IST',
            isProtected: true
          }
        ],
        verificationSteps: [
          { stepNumber: 1, title: 'Candidate found', description: 'Matched via Hospital ER admission register', verified: true, timestamp: '19:05 IST', authorizedOfficer: 'Hospital Gateway' },
          { stepNumber: 2, title: 'Identity verification', description: 'Medical tag cross-referenced with family description', verified: true, timestamp: '19:08 IST', authorizedOfficer: 'Nurse Supervisor' },
          { stepNumber: 3, title: 'Relationship verification', description: 'Next of kin verification in progress', verified: false },
          { stepNumber: 4, title: 'Consent / authorization', description: 'Medical discharge clearance pending', verified: false },
          { stepNumber: 5, title: 'Reunion location assigned', description: 'Reunion center dispatch queued', verified: false },
          { stepNumber: 6, title: 'Handoff verified', description: 'Token validation pending', verified: false },
          { stepNumber: 7, title: 'Case closed', description: 'Case open', verified: false }
        ],
        auditTrail: [
          { time: '18:50 IST', action: 'Patient admitted to Government General Hospital', officer: 'ER Triage' },
          { time: '19:05 IST', action: 'Match identified with FM-26-0104 (94% confidence)', officer: 'VYRO AI Engine' }
        ]
      },
      {
        id: 'FM-26-0088',
        victimCaseId: 'VY-26-1012',
        missingPersonName: 'Devraj Patel',
        age: 34,
        reportedBy: 'Sunita Patel',
        relationship: 'Spouse',
        contactPhone: '+91 98250 88100',
        lastKnownLocation: 'River Walk Embankment',
        currentFacility: 'VYRO Safe Shelter 01',
        reunionCenter: 'Family Reunification Center RC-02',
        matchConfidence: 91,
        matchCriteria: ['Shelter biometric registration match'],
        priority: 'STANDARD',
        reunionToken: 'VYRO-RN-992147',
        tokenExpiry: '2h remaining',
        status: 'MATCH_FOUND',
        currentStage: 'MATCH',
        imSafeSent: false,
        safeMessageLog: [],
        verificationSteps: [
          { stepNumber: 1, title: 'Candidate found', description: 'Shelter roster match detected', verified: true, timestamp: '17:40 IST', authorizedOfficer: 'Shelter Gateway' },
          { stepNumber: 2, title: 'Identity verification', description: 'Identity check pending', verified: false },
          { stepNumber: 3, title: 'Relationship verification', description: 'Pending', verified: false },
          { stepNumber: 4, title: 'Consent / authorization', description: 'Pending', verified: false },
          { stepNumber: 5, title: 'Reunion location assigned', description: 'Pending', verified: false },
          { stepNumber: 6, title: 'Handoff verified', description: 'Pending', verified: false },
          { stepNumber: 7, title: 'Case closed', description: 'Pending', verified: false }
        ],
        auditTrail: [
          { time: '17:40 IST', action: 'Candidate identified in Safe Shelter 01', officer: 'Shelter Scanner' }
        ]
      }
    ],

    isFamilyModalOpen: false,
    isChainBreakModalOpen: false,
    isDemoWalkthroughActive: false,
    demoWalkthroughStep: 0,

    isGpsTracking: false,
    userCoordinates: null,
    gpsAccuracyMeters: null,
    lastGpsTimestamp: null,

    auditLogs: [
      {
        id: 'LOG-001',
        timestamp: '18:15:00 IST',
        actor: 'Citizen SOS Uplink',
        role: 'CITIZEN',
        action: 'DISTRESS_TRANSMITTED',
        details: 'Case VY-2026-0002047 generated from Old Bridge East Approach via mobile GPS.'
      },
      {
        id: 'LOG-002',
        timestamp: '18:16:00 IST',
        actor: 'VYRO AI Copilot',
        role: 'COMMANDER',
        action: 'AI_TRIAGE_COMPLETED',
        details: 'Urgency scored CRITICAL. 3 victims trapped on rooftop. Amphibious boat recommended.'
      },
      {
        id: 'LOG-003',
        timestamp: '18:40:00 IST',
        actor: 'Chain Break Detector',
        role: 'COMMANDER',
        action: 'CHAIN_BREAK_ALERT',
        details: 'Case VY-2026-0002050: Patient handed to Hospital ER 28m ago with no intake record.'
      }
    ],

    // 3D Simulated City Twin & View Navigation
    primaryViewMode: 'COMMAND_CENTER',
    active3DDisaster: 'TSUNAMI',
    activeAiRescuePlan: 'A',
    threatAssessmentTab: 'PLANS',
    waveTimer: 5,
    simulationRunning: true,
    maydayAlert: {
      id: 'MAYDAY-1042',
      responderCallsign: 'RSC-1042',
      message: 'RSC-1042 reported "NEED BACKUP"',
      timestamp: 'Just now',
      location: 'Old Bridge Sector Pier 4',
      isActive: true
    },
    copilotRecommendation: {
      id: 'COPILOT-01',
      targetIncidentId: 'VY-2026-0002047',
      targetTeamId: 'TEAM-BRAVO-02',
      title: 'Assign Team Bravo → Incident #VY-2026-0002047',
      reasoning: 'Optimal river approach; 94% feasibility; avoids flooded sector 3 ring road.',
      action: 'DISPATCH_ZODIAC_TEAM',
      dismissed: false
    },
    threatData: {
      waterLevelMeters: 3.2,
      disasterIntensity: 'SURGE PEAK (+18m Cresting)',
      affectedBuildings: 48,
      trappedPeople: 14,
      blockedRoutes: 7,
      rescueRisk: 'HIGH',
      weather: '18m Surge Wave / Monsoon Gale',
      windSpeedKmh: 68,
      communicationStatus: '4/5 Mesh Relays Active (1 Degraded)'
    },
    isCompilerModalOpen: false,
    isLiveTrackingModalOpen: false,
    liveTrackingTeamId: 'TEAM-BRAVO-02',
    isFinalSuccessModalOpen: false,
    aiRescuePlans: [
      {
        id: 'A',
        title: 'OPTION A',
        teamCallsign: 'Team Bravo Zodiac Raft',
        vehicleType: 'Zodiac Raft',
        eta: '8m',
        etaMinutes: 8,
        feasibilityPercent: 94,
        routeDescription: 'Cruising River Channel → Winch Extraction',
        riskLevel: 'LOW',
        assignedTeamId: 'TEAM-BRAVO-02'
      },
      {
        id: 'B',
        title: 'OPTION B',
        teamCallsign: 'Coast Guard Helo Air-1',
        vehicleType: 'Helo Air-1',
        eta: '4m',
        etaMinutes: 4,
        feasibilityPercent: 78,
        routeDescription: 'Aerial Transit → Roof Winch Basket',
        riskLevel: 'MEDIUM',
        assignedTeamId: 'TEAM-AIR-01'
      },
      {
        id: 'C',
        title: 'OPTION C',
        teamCallsign: 'Rescue Alpha Tactical 4x4',
        vehicleType: 'Tactical 4x4',
        eta: '22m',
        etaMinutes: 22,
        feasibilityPercent: 42,
        routeDescription: 'Elevated Ring Bypass → Amphibious Wade',
        riskLevel: 'HIGH',
        assignedTeamId: 'TEAM-ALPHA-04'
      }
    ],

    setPrimaryViewMode: (mode) => set({ primaryViewMode: mode }),
    setActive3DDisaster: (disaster) => {
      set((state) => {
        const threat = { ...state.threatData };
        if (disaster === 'TSUNAMI') {
          threat.waterLevelMeters = 3.8;
          threat.disasterIntensity = '18m Wave Surge Sweeping Over Streets';
          threat.rescueRisk = 'CRITICAL';
        } else if (disaster === 'FLOOD') {
          threat.waterLevelMeters = 2.4;
          threat.disasterIntensity = 'Rising Basin Waters +2.4m';
          threat.rescueRisk = 'HIGH';
        } else if (disaster === 'WILDFIRE') {
          threat.waterLevelMeters = 0.0;
          threat.disasterIntensity = 'Perimeter Smoke + High Thermal Zone';
          threat.rescueRisk = 'HIGH';
        } else if (disaster === 'EARTHQUAKE') {
          threat.waterLevelMeters = 0.0;
          threat.disasterIntensity = 'Magnitude 6.8 Aftershocks / Structural Damage';
          threat.rescueRisk = 'CRITICAL';
        } else if (disaster === 'CYCLONE') {
          threat.waterLevelMeters = 1.8;
          threat.disasterIntensity = 'Category 4 Storm Gale 130 km/h';
          threat.rescueRisk = 'HIGH';
        } else if (disaster === 'CHEMICAL') {
          threat.waterLevelMeters = 0.0;
          threat.disasterIntensity = 'Toxic Chlorine Vapor Diffusion Plume';
          threat.rescueRisk = 'CRITICAL';
        } else if (disaster === 'LANDSLIDE') {
          threat.waterLevelMeters = 0.5;
          threat.disasterIntensity = 'Slope Mud Debris Influx 45,000 m³';
          threat.rescueRisk = 'HIGH';
        }
        return { active3DDisaster: disaster, activeDisaster: disaster === 'WILDFIRE' ? 'FIRE' : disaster === 'CHEMICAL' ? 'OTHER' : disaster, threatData: threat };
      });
    },
    setActiveAiRescuePlan: (planId) => {
      set({ activeAiRescuePlan: planId });
      const plan = get().aiRescuePlans.find((p) => p.id === planId);
      if (plan) {
        get().selectEntity('TEAM', plan.assignedTeamId);
      }
    },
    setThreatAssessmentTab: (tab) => set({ threatAssessmentTab: tab }),
    dismissMaydayAlert: () => set((state) => ({ maydayAlert: { ...state.maydayAlert, isActive: false } })),
    dispatchMaydayBackup: () => {
      set((state) => ({
        maydayAlert: { ...state.maydayAlert, isActive: false },
        auditLogs: [
          {
            id: `LOG-${Date.now()}`,
            timestamp: `${new Date().toLocaleTimeString()} IST`,
            actor: 'Commander Desk',
            role: 'COMMANDER',
            action: 'DISPATCH_MAYDAY_BACKUP',
            details: 'Tactical backup dispatched to RSC-1042 at Bridge Sector Pier 4.'
          },
          ...state.auditLogs
        ]
      }));
    },
    autoAssignCopilot: () => {
      const rec = get().copilotRecommendation;
      if (rec && !rec.dismissed) {
        get().assignTeamToVictim(rec.targetTeamId, rec.targetIncidentId);
        set((state) => ({
          copilotRecommendation: state.copilotRecommendation ? { ...state.copilotRecommendation, dismissed: true } : null
        }));
      }
    },
    dismissCopilot: () => set((state) => ({
      copilotRecommendation: state.copilotRecommendation ? { ...state.copilotRecommendation, dismissed: true } : null
    })),
    openCompilerModal: () => set({ isCompilerModalOpen: true }),
    closeCompilerModal: () => set({ isCompilerModalOpen: false }),
    openLiveTrackingModal: (teamId) => set({ isLiveTrackingModalOpen: true, liveTrackingTeamId: teamId || 'TEAM-BRAVO-02' }),
    closeLiveTrackingModal: () => set({ isLiveTrackingModalOpen: false }),
    openFinalSuccessModal: () => set({ isFinalSuccessModalOpen: true }),
    closeFinalSuccessModal: () => set({ isFinalSuccessModalOpen: false }),
    toggleSimulation: () => set((state) => ({ simulationRunning: !state.simulationRunning })),
    resetSimulation: () => get().resetSimulationData(),

    dismissSplash: () => set({ isSplashActive: false }),

    setRole: (role) => {
      const emailMap: Record<Role, string> = {
        COMMANDER: 'commander@vyro.demo',
        RESCUER: 'rescuer@vyro.demo',
        MEDICAL: 'medical@vyro.demo',
        HOSPITAL: 'hospital@vyro.demo',
        SHELTER: 'shelter@vyro.demo',
        CITIZEN: 'citizen.emergency@vyro.org'
      };
      set({ currentRole: role, demoAccountEmail: emailMap[role] });
    },

    setLanguage: (lang) => set({ currentLanguage: lang }),

    setActiveDisaster: (disaster) => set({ activeDisaster: disaster }),

    setNetworkStatus: (status) => set({ networkStatus: status }),

    submitCitizenSOS: ({
      disasterType,
      location,
      locationName,
      accuracy,
      peopleCount,
      rawReport,
      isVoice,
      triage
    }) => {
      const state = get();
      const caseNumber = Math.floor(1000 + Math.random() * 9000);
      const newCaseId = `VY-2026-${caseNumber}`;
      const timeStr = `${new Date().getHours().toString().padStart(2, '0')}:${new Date().getMinutes().toString().padStart(2, '0')} IST`;

      const newCase: VictimCase = {
        id: newCaseId,
        name: `Citizen SOS (${peopleCount} Pax)`,
        peopleCount,
        disasterType,
        priority: triage.priority,
        status: 'REPORTED',
        coordinates: location,
        locationName,
        reportedAt: timeStr,
        lastVerifiedAt: timeStr,
        accuracyMeters: accuracy,
        verificationStatus: 'REPORTED',
        source: isVoice ? 'Citizen Voice SOS' : 'Citizen Text Distress',
        medicalNeeds: triage.extractedHazards.join(', ') || 'Immediate rescue needed',
        risk: triage.priority === 'CRITICAL' ? 'CRITICAL' : 'HIGH',
        notes: rawReport,
        voiceTranscript: isVoice ? rawReport : undefined,
        isSimulated: true,
        locationTelemetryType: accuracy <= 20 ? 'LIVE' : 'LAST_VERIFIED'
      };

      const newChain: CaseRescueChain = {
        caseId: newCaseId,
        stages: [
          {
            stageId: 'SOS_RECEIVED',
            label: 'SOS Received',
            status: 'VERIFIED',
            timestamp: timeStr,
            actor: 'Citizen SOS Beacon',
            role: 'CITIZEN',
            locationName,
            coordinates: location,
            evidence: `GPS Accuracy ±${accuracy}m`
          },
          {
            stageId: 'AI_TRIAGED',
            label: 'AI Triaged',
            status: 'VERIFIED',
            timestamp: timeStr,
            actor: 'VYRO AI Engine',
            evidence: triage.aiSummary,
            notes: `Recommended Unit: ${triage.recommendedUnitType}`
          },
          { stageId: 'COMMANDER_DISPATCH', label: 'Commander Dispatch', status: 'PENDING' },
          { stageId: 'RESCUER_ASSIGNED', label: 'Unit Assigned', status: 'PENDING' },
          { stageId: 'RESCUER_EN_ROUTE', label: 'En Route', status: 'PENDING' },
          { stageId: 'VICTIM_LOCATED', label: 'Victim Located', status: 'PENDING' },
          { stageId: 'RESCUE_COMPLETED', label: 'Rescue Completed', status: 'PENDING' },
          { stageId: 'MEDICAL_HANDOFF', label: 'Medical Handoff', status: 'PENDING' },
          { stageId: 'HOSPITAL_ADMITTED', label: 'Hospital Admitted', status: 'PENDING' },
          { stageId: 'SHELTER_TRANSFERRED', label: 'Shelter Transferred', status: 'PENDING' },
          { stageId: 'FAMILY_REUNITED', label: 'Family Reunited', status: 'PENDING' },
          { stageId: 'CASE_CLOSED', label: 'Case Closed', status: 'PENDING' }
        ]
      };

      const newLog: AuditLogEntry = {
        id: `LOG-${Date.now()}`,
        timestamp: `${new Date().toLocaleTimeString()} IST`,
        actor: 'Citizen Distress Gateway',
        role: 'CITIZEN',
        action: 'SOS_TRANSMITTED',
        details: `Case ${newCaseId} registered. Urgency: ${triage.priority}. Location: ${locationName}.`
      };

      const partial: Partial<OperationalState> = {
        cases: [newCase, ...state.cases],
        rescueChains: { ...state.rescueChains, [newCaseId]: newChain },
        activeCitizenCaseId: newCaseId,
        auditLogs: [newLog, ...state.auditLogs]
      };

      set(partial);
      broadcastChange(partial);
      return newCaseId;
    },

    advanceRescueChain: (caseId, stageId, updateData) => {
      set((state) => {
        const existingChain = state.rescueChains[caseId];
        if (!existingChain) return state;

        const timeStr = `${new Date().getHours().toString().padStart(2, '0')}:${new Date().getMinutes().toString().padStart(2, '0')} IST`;
        const updatedStages = existingChain.stages.map((st) => {
          if (st.stageId === stageId) {
            return {
              ...st,
              status: 'VERIFIED' as const,
              timestamp: st.timestamp || timeStr,
              ...updateData
            };
          }
          return st;
        });

        const partial = {
          rescueChains: {
            ...state.rescueChains,
            [caseId]: { ...existingChain, stages: updatedStages }
          }
        };
        broadcastChange(partial);
        return partial;
      });
    },

    resolveChainBreak: (alertId, resolutionNotes) => {
      set((state) => {
        const alert = state.chainBreaks.find((a) => a.id === alertId);
        if (!alert) return state;

        const timeStr = `${new Date().toLocaleTimeString()} IST`;
        const updatedAlerts = state.chainBreaks.map((a) =>
          a.id === alertId
            ? { ...a, isResolved: true, resolvedAt: timeStr, resolvedBy: state.demoAccountEmail }
            : a
        );

        // Update case priority and rescue chain
        const updatedCases = state.cases.map((c) =>
          c.id === alert.caseId
            ? {
                ...c,
                priority: 'ACTIVE' as const,
                verificationStatus: 'VERIFIED' as const,
                hazardProximityNote: `Chain Break Resolved: Hospital admission verified by ER Controller`
              }
            : c
        );

        // Update chain stage
        const existingChain = state.rescueChains[alert.caseId];
        let updatedChains = state.rescueChains;
        if (existingChain) {
          const updatedStages = existingChain.stages.map((st) =>
            st.stageId === 'HOSPITAL_ADMITTED'
              ? {
                  ...st,
                  status: 'VERIFIED' as const,
                  timestamp: timeStr,
                  actor: 'General Hospital ER',
                  role: 'HOSPITAL' as const,
                  notes: resolutionNotes || 'Bed 14A Allocated. Vitals stabilized.'
                }
              : st
          );
          updatedChains = {
            ...state.rescueChains,
            [alert.caseId]: { ...existingChain, stages: updatedStages }
          };
        }

        const newLog: AuditLogEntry = {
          id: `LOG-${Date.now()}`,
          timestamp: timeStr,
          actor: state.demoAccountEmail,
          role: state.currentRole,
          action: 'CHAIN_BREAK_RESOLVED',
          details: `Case ${alert.caseId} chain break resolved. Admission confirmed at General Hospital.`
        };

        const partial: Partial<OperationalState> = {
          chainBreaks: updatedAlerts,
          cases: updatedCases,
          rescueChains: updatedChains,
          auditLogs: [newLog, ...state.auditLogs]
        };

        broadcastChange(partial);
        return partial;
      });
    },

    openFamilyModal: () => set({ isFamilyModalOpen: true }),
    closeFamilyModal: () => set({ isFamilyModalOpen: false }),

    registerMissingPerson: (data) => {
      set((state) => {
        const newRecord: MissingPersonRecord = {
          id: `MP-2026-${Math.floor(10 + Math.random() * 90)}`,
          ...data,
          status: 'SEARCHING'
        };

        // Check if there is a match in evacuee or hospital roster
        const match = state.shelters.flatMap((s) => [s]).length > 0;
        if (data.fullName.toLowerCase().includes('leela')) {
          newRecord.status = 'AI_MATCH_FOUND';
          newRecord.matchedEvacueeId = 'EV-102';
          newRecord.matchFacilityName = 'Government Higher Secondary School Shelter';
          newRecord.matchConfidence = 96;
        }

        const partial = {
          missingPersons: [newRecord, ...state.missingPersons]
        };
        broadcastChange(partial);
        return partial;
      });
    },

    verifyFamilyReunion: (missingPersonId) => {
      set((state) => {
        const updated = state.missingPersons.map((mp) =>
          mp.id === missingPersonId ? { ...mp, status: 'VERIFIED_REUNITED' as const } : mp
        );

        const newLog: AuditLogEntry = {
          id: `LOG-${Date.now()}`,
          timestamp: `${new Date().toLocaleTimeString()} IST`,
          actor: state.demoAccountEmail,
          role: state.currentRole,
          action: 'FAMILY_REUNION_VERIFIED',
          details: `Family verification confirmed for ${missingPersonId}. Case closed.`
        };

        const partial = {
          missingPersons: updated,
          auditLogs: [newLog, ...state.auditLogs]
        };
        broadcastChange(partial);
        return partial;
      });
    },

    startDemoWalkthrough: () => set({ isDemoWalkthroughActive: true, demoWalkthroughStep: 0 }),
    nextDemoWalkthroughStep: () =>
      set((state) => ({ demoWalkthroughStep: Math.min(14, state.demoWalkthroughStep + 1) })),
    setDemoWalkthroughStep: (step) => set({ demoWalkthroughStep: step }),
    closeDemoWalkthrough: () => set({ isDemoWalkthroughActive: false }),

    selectEntity: (type, id) => {
      set({ selectedEntity: { type, id } });
      const state = get();
      let coords: [number, number] | undefined;

      if (type === 'VICTIM') coords = state.cases.find((c) => c.id === id)?.coordinates;
      else if (type === 'TEAM') coords = state.rescueTeams.find((t) => t.id === id)?.coordinates;
      else if (type === 'MEDICAL') coords = state.medicalTeams.find((m) => m.id === id)?.coordinates;
      else if (type === 'HOSPITAL') coords = state.hospitals.find((h) => h.id === id)?.coordinates;
      else if (type === 'SHELTER') coords = state.shelters.find((s) => s.id === id)?.coordinates;
      else if (type === 'NODE') coords = state.commsNodes.find((n) => n.id === id)?.coordinates;

      if (coords) {
        set({
          flyToTarget: {
            coordinates: coords,
            zoom: 16.8,
            pitch: 62,
            bearing: -25,
            duration: 1600
          }
        });
      }
    },

    clearSelection: () => set({ selectedEntity: null }),

    updateVictimStatus: (id, status, notes) => {
      set((state) => {
        const timeStr = `${new Date().getHours()}:${new Date().getMinutes().toString().padStart(2, '0')} IST`;
        const updatedCases = state.cases.map((c) =>
          c.id === id
            ? {
                ...c,
                status,
                lastVerifiedAt: timeStr,
                notes: notes ? `${c.notes} | ${notes}` : c.notes
              }
            : c
        );

        const newLog: AuditLogEntry = {
          id: `LOG-${Date.now()}`,
          timestamp: `${new Date().toLocaleTimeString()} IST`,
          actor: state.demoAccountEmail,
          role: state.currentRole,
          action: 'STATUS_UPDATE',
          details: `Case ${id} transitioned to ${status}`
        };

        const partial = { cases: updatedCases, auditLogs: [newLog, ...state.auditLogs] };
        broadcastChange(partial);
        return partial;
      });
    },

    assignTeamToVictim: (teamId, victimId) => {
      set((state) => {
        const updatedTeams = state.rescueTeams.map((t) =>
          t.id === teamId ? { ...t, status: 'EN_ROUTE' as const, assignedMissionId: victimId } : t
        );
        const updatedCases = state.cases.map((c) =>
          c.id === victimId ? { ...c, status: 'ASSIGNED' as const, assignedTeamId: teamId } : c
        );

        const partial = { rescueTeams: updatedTeams, cases: updatedCases };
        broadcastChange(partial);
        return partial;
      });
    },

    updateRescueTeamLocation: (teamId, coordinates, accuracy) => {
      set((state) => {
        const now = new Date();
        const timeStr = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')} IST`;
        const updatedTeams = state.rescueTeams.map((t) =>
          t.id === teamId
            ? {
                ...t,
                coordinates,
                accuracyMeters: accuracy,
                lastLocationUpdate: timeStr
              }
            : t
        );
        const partial = { rescueTeams: updatedTeams };
        broadcastChange(partial);
        return partial;
      });
    },

    updateShelterOccupancy: (shelterId, delta) => {
      set((state) => {
        const updated = state.shelters.map((s) =>
          s.id === shelterId
            ? {
                ...s,
                currentOccupancy: Math.max(0, Math.min(s.capacity, s.currentOccupancy + delta)),
                lastUpdate: `${new Date().getHours()}:${new Date().getMinutes().toString().padStart(2, '0')} IST`
              }
            : s
        );
        const partial = { shelters: updated };
        broadcastChange(partial);
        return partial;
      });
    },

    updateHospitalBeds: (hospitalId, bedDelta, icuDelta) => {
      set((state) => {
        const updated = state.hospitals.map((h) =>
          h.id === hospitalId
            ? {
                ...h,
                availableBeds: Math.max(0, Math.min(h.totalBeds, h.availableBeds + bedDelta)),
                icuAvailable: Math.max(0, Math.min(h.icuTotal, h.icuAvailable + icuDelta))
              }
            : h
        );
        const partial = { hospitals: updated };
        broadcastChange(partial);
        return partial;
      });
    },

    updateMedicalTeamStatus: (teamId, status, destinationHospitalId) => {
      set((state) => {
        const now = new Date();
        const timeStr = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')} IST`;
        const updated = state.medicalTeams.map((m) =>
          m.id === teamId
            ? {
                ...m,
                status,
                destinationHospitalId: destinationHospitalId || m.destinationHospitalId,
                lastUpdate: timeStr
              }
            : m
        );
        const partial = { medicalTeams: updated };
        broadcastChange(partial);
        return partial;
      });
    },

    updateCaseTriage: (caseId, priority, medicalNeeds, notes) => {
      set((state) => {
        const updatedCases = state.cases.map((c) =>
          c.id === caseId
            ? {
                ...c,
                priority,
                medicalNeeds: medicalNeeds || c.medicalNeeds,
                notes: notes ? `${c.notes} | ${notes}` : c.notes,
                lastVerifiedAt: `${new Date().toLocaleTimeString()} IST`
              }
            : c
        );
        const newLog: AuditLogEntry = {
          id: `LOG-${Date.now()}`,
          timestamp: `${new Date().toLocaleTimeString()} IST`,
          actor: 'Rapid EMS Paramedic MED-01',
          role: 'MEDICAL',
          action: 'TRIAGE_UPDATED',
          details: `Case ${caseId} triage updated to ${priority}.`
        };
        const partial = { cases: updatedCases, auditLogs: [newLog, ...state.auditLogs] };
        broadcastChange(partial);
        return partial;
      });
    },

    setCameraMode: (mode) => set({ cameraMode: mode }),

    toggleLayer: (layer) =>
      set((state) => ({
        layerVisibility: {
          ...state.layerVisibility,
          [layer]: !state.layerVisibility[layer]
        }
      })),

    setActiveRoute: (route) => set({ activeRoute: route }),
    triggerFlyTo: (opts) => set({ flyToTarget: opts }),

    openBuildingModal: (buildingId, type) =>
      set({ buildingModal: { isOpen: true, buildingId, type } }),
    closeBuildingModal: () =>
      set({ buildingModal: { isOpen: false, buildingId: null, type: null } }),

    setGpsTracking: (active) => set({ isGpsTracking: active }),
    setUserCoordinates: (coords, accuracy, timestamp) => {
      set({
        userCoordinates: coords,
        gpsAccuracyMeters: accuracy,
        lastGpsTimestamp: timestamp
      });
    },

    queueOfflineReport: (report) => {
      set((state) => ({
        offlineReports: [report, ...state.offlineReports]
      }));
    },

    syncOfflineQueue: () => {
      set((state) => {
        const synced = state.offlineReports.map((r) => ({ ...r, syncStatus: 'SYNCED' as const }));
        return { offlineReports: synced, networkStatus: 'ONLINE' };
      });
    },

    addAuditLog: (actor, role, action, details) =>
      set((state) => ({
        auditLogs: [
          {
            id: `LOG-${Date.now()}`,
            timestamp: `${new Date().toLocaleTimeString()} IST`,
            actor,
            role,
            action,
            details
          },
          ...state.auditLogs
        ]
      })),

    setActiveRescueStage: (stage) => set({ activeRescueStage: stage }),
    setSilentModeActive: (active) => set({ silentModeActive: active }),

    updateBatteryLevel: (percent) => {
      set((state) => {
        const isCrit = percent <= 10;
        const surv = { ...state.deviceSurvival, batteryPercent: percent, isCriticalBattery: isCrit };
        const logs = isCrit
          ? [
              {
                id: `LOG-${Date.now()}`,
                timestamp: `${new Date().toLocaleTimeString()} IST`,
                actor: 'Device Power Telemetry',
                role: 'CITIZEN' as const,
                action: 'BATTERY_CRITICAL_PRESERVATION',
                details: `⚠ Battery dropped to ${percent}%. Preserved last trusted coordinates. Response urgency elevated.`
              },
              ...state.auditLogs
            ]
          : state.auditLogs;
        const partial = { deviceSurvival: surv, auditLogs: logs };
        broadcastChange(partial);
        return partial;
      });
    },

    triggerOneTapSOS: () => {
      const state = get();
      const caseNumber = Math.floor(1000 + Math.random() * 9000);
      const caseId = `VY-26-${caseNumber}`;
      const timeStr = `${new Date().getHours().toString().padStart(2, '0')}:${new Date().getMinutes().toString().padStart(2, '0')} IST`;

      const newSos: EmergencySOS = {
        caseId,
        createdAt: timeStr,
        person: {
          name: 'Citizen In Need',
          phone: '+91 98470 11200',
          peopleCount: 1,
          vulnerablePeople: []
        },
        incident: {
          type: state.activeDisaster,
          description: 'Distress beacon activated via One-Tap SOS',
          severity: 'critical'
        },
        location: {
          latitude: 11.342790,
          longitude: 77.728462,
          accuracyMeters: 6.8,
          timestamp: timeStr,
          source: 'gps',
          confidence: 'high'
        },
        lastKnownLocation: {
          latitude: 11.342790,
          longitude: 77.728462,
          accuracyMeters: 6.8,
          timestamp: timeStr,
          source: 'gps'
        },
        device: {
          batteryPercent: state.deviceSurvival.batteryPercent,
          charging: state.deviceSurvival.charging,
          networkType: '4G LTE',
          gpsAvailable: true
        },
        communication: {
          internet: state.deviceSurvival.internet === 'CONNECTED',
          cellular: state.deviceSurvival.cellular !== 'OFFLINE',
          mesh: true,
          radio: true,
          deviceToDevice: true
        },
        movement: {
          state: 'stationary',
          lastMovementAt: timeStr
        },
        status: 'REPORTED'
      };

      const newPacket: EmergencyPacket = {
        packetId: `PKT-${caseNumber}-01`,
        caseId,
        createdAt: timeStr,
        hops: 1,
        ttl: 64,
        sourceDevice: `DEV-MOB-${caseNumber}`,
        destination: 'VYRO-COMMAND-GATEWAY',
        payload: newSos,
        status: 'delivered'
      };

      const newCase: VictimCase = {
        id: caseId,
        name: `Citizen SOS (${caseId})`,
        peopleCount: 1,
        disasterType: state.activeDisaster,
        priority: 'CRITICAL',
        status: 'REPORTED',
        coordinates: [77.728462, 11.342790],
        locationName: 'Active Citizen Beacon Zone',
        reportedAt: timeStr,
        lastVerifiedAt: timeStr,
        accuracyMeters: 6.8,
        verificationStatus: 'VERIFIED',
        source: 'One-Tap SOS Device Telemetry',
        medicalNeeds: 'Emergency triage pending',
        risk: 'CRITICAL',
        notes: 'One-Tap SOS initiated. Telemetry captured.',
        isSimulated: true,
        locationTelemetryType: 'LIVE'
      };

      const newChain: CaseRescueChain = {
        caseId,
        stages: [
          { stageId: 'SOS_RECEIVED', label: 'SOS Sent', status: 'VERIFIED', timestamp: timeStr, actor: 'Mobile GPS Beacon', evidence: 'Accuracy ±6.8m' },
          { stageId: 'AI_TRIAGED', label: 'Command Received & Triaged', status: 'VERIFIED', timestamp: timeStr, actor: 'VYRO AI Engine', notes: 'Scored 94/100 Urgency' },
          { stageId: 'COMMANDER_DISPATCH', label: 'Rescue Assignment', status: 'PENDING' },
          { stageId: 'RESCUER_ASSIGNED', label: 'Rescue Assignment', status: 'PENDING' },
          { stageId: 'RESCUER_EN_ROUTE', label: 'Rescue Team En Route', status: 'PENDING' },
          { stageId: 'VICTIM_LOCATED', label: 'Victim Found', status: 'PENDING' },
          { stageId: 'MEDICAL_HANDOFF', label: 'Medical Handoff', status: 'PENDING' },
          { stageId: 'HOSPITAL_ADMITTED', label: 'Hospital', status: 'PENDING' },
          { stageId: 'SHELTER_TRANSFERRED', label: 'Shelter', status: 'PENDING' },
          { stageId: 'FAMILY_REUNITED', label: 'Family Reunion', status: 'PENDING' },
          { stageId: 'CASE_CLOSED', label: 'Case Closed', status: 'PENDING' }
        ]
      };

      const partial: Partial<OperationalState> = {
        activeEmergencySOS: newSos,
        emergencyPackets: [newPacket, ...state.emergencyPackets],
        activeCitizenCaseId: caseId,
        silentModeActive: true,
        activeRescueStage: 'SIGNAL',
        cases: [newCase, ...state.cases],
        rescueChains: { ...state.rescueChains, [caseId]: newChain },
        auditLogs: [
          {
            id: `LOG-${Date.now()}`,
            timestamp: timeStr,
            actor: 'Citizen Mobile Client',
            role: 'CITIZEN',
            action: 'ONE_TAP_SOS_TRIGGERED',
            details: `Case ${caseId} created without login. Telemetry gathered and transmitted.`
          },
          ...state.auditLogs
        ]
      };

      set(partial);
      broadcastChange(partial);
      return caseId;
    },

    triggerSosDemo: () => {
      const state = get();
      const caseId = 'VY-26-DEMO-01';
      const timeStr = '22:15:30 IST';

      const demoSos: EmergencySOS = {
        caseId,
        createdAt: timeStr,
        person: {
          name: 'Old Bridge Stranded Group',
          phone: '+91 98470 55410',
          peopleCount: 6,
          vulnerablePeople: ['2 Children (Age 4, 7)', '1 Elderly']
        },
        incident: {
          type: 'FLOOD',
          description: 'Old Bridge East Approach submerged, rising current, roof stranded',
          severity: 'critical'
        },
        location: {
          latitude: 11.342812,
          longitude: 77.728491,
          accuracyMeters: 4.2,
          timestamp: timeStr,
          source: 'gps',
          confidence: 'high'
        },
        lastKnownLocation: {
          latitude: 11.342790,
          longitude: 77.728462,
          accuracyMeters: 6.8,
          timestamp: '22:13:41 IST',
          source: 'gps'
        },
        device: {
          batteryPercent: 37,
          charging: false,
          networkType: '4G LTE',
          gpsAvailable: true
        },
        communication: {
          internet: false,
          cellular: true,
          mesh: true,
          radio: true,
          deviceToDevice: true
        },
        movement: {
          state: 'stationary',
          lastMovementAt: timeStr
        },
        status: 'REPORTED'
      };

      const demoCase: VictimCase = {
        id: caseId,
        name: 'Flood Stranded Group (6 Pax, 2 Children)',
        peopleCount: 6,
        disasterType: 'FLOOD',
        priority: 'CRITICAL',
        status: 'REPORTED',
        coordinates: [77.728491, 11.342812],
        locationName: 'Old Bridge East Embankment Pier 4',
        reportedAt: timeStr,
        lastVerifiedAt: timeStr,
        accuracyMeters: 4.2,
        verificationStatus: 'VERIFIED',
        source: 'Citizen SOS + Mesh Relay Node 04',
        medicalNeeds: 'Pediatric exposure, rising basin water (2.4m)',
        risk: 'CRITICAL',
        hazardProximityNote: 'Flood water depth +2.4m at Old Bridge pier',
        notes: '6 people stranded on lower roof. 2 children reported. Battery at 37%.',
        isSimulated: true,
        locationTelemetryType: 'LIVE'
      };

      const demoChain: CaseRescueChain = {
        caseId,
        stages: [
          { stageId: 'SOS_RECEIVED', label: 'SOS Sent', status: 'VERIFIED', timestamp: timeStr, actor: 'Mobile GPS Beacon', evidence: '±4.2m GPS' },
          { stageId: 'AI_TRIAGED', label: 'Command Received & Triaged', status: 'VERIFIED', timestamp: timeStr, actor: 'VYRO AI Engine', evidence: 'Scored 94/100 Urgency (Children + Flooding)' },
          { stageId: 'COMMANDER_DISPATCH', label: 'Rescue Assignment', status: 'IN_PROGRESS' },
          { stageId: 'RESCUER_ASSIGNED', label: 'Rescue Assignment', status: 'PENDING' },
          { stageId: 'RESCUER_EN_ROUTE', label: 'Rescue Team En Route', status: 'PENDING' },
          { stageId: 'VICTIM_LOCATED', label: 'Victim Found', status: 'PENDING' },
          { stageId: 'MEDICAL_HANDOFF', label: 'Medical Handoff', status: 'PENDING' },
          { stageId: 'HOSPITAL_ADMITTED', label: 'Hospital', status: 'PENDING' },
          { stageId: 'SHELTER_TRANSFERRED', label: 'Shelter', status: 'PENDING' },
          { stageId: 'FAMILY_REUNITED', label: 'Family Reunion', status: 'PENDING' },
          { stageId: 'CASE_CLOSED', label: 'Case Closed', status: 'PENDING' }
        ]
      };

      const partial: Partial<OperationalState> = {
        activeCitizenCaseId: caseId,
        activeEmergencySOS: demoSos,
        activeRescueStage: 'SIGNAL',
        silentModeActive: true,
        deviceSurvival: { ...state.deviceSurvival, batteryPercent: 37, cellular: 'WEAK', internet: 'OFFLINE', mesh: 'CONNECTED' },
        cases: [demoCase, ...state.cases.filter((c) => c.id !== caseId)],
        rescueChains: { ...state.rescueChains, [caseId]: demoChain },
        auditLogs: [
          {
            id: `LOG-${Date.now()}`,
            timestamp: timeStr,
            actor: 'Demo Center',
            role: 'COMMANDER',
            action: 'DEMO_SOS_SENT',
            details: `Demo case ${caseId} created. 6 people at Old Bridge, P1 Critical, battery 37%.`
          },
          ...state.auditLogs
        ]
      };

      set(partial);
      broadcastChange(partial);
      return caseId;
    },

    dispatchTeamToCase: (caseId: string, teamId?: string, isManual = false) => {
      const state = get();
      const timeStr = `${new Date().getHours().toString().padStart(2, '0')}:${new Date().getMinutes().toString().padStart(2, '0')} IST`;
      const targetCase = state.cases.find((c) => c.id === caseId) || state.cases[0];
      if (!targetCase) return;

      // 1. Determine team
      let chosenTeamId = teamId;
      let chosenTeamName = 'RESCUE ALPHA';
      let chosenVehicle = 'R-07 (Amphibious Rig)';
      let chosenEta = 4;

      if (!chosenTeamId) {
        // AI Auto-selection based on incident needs
        const desc = (targetCase.medicalNeeds + ' ' + targetCase.notes + ' ' + targetCase.locationName).toLowerCase();
        if (targetCase.disasterType === 'MEDICAL' || desc.includes('burn') || desc.includes('cardiac') || desc.includes('hypothermia')) {
          chosenTeamId = 'MED-ALPHA-01';
          chosenTeamName = 'Rapid EMS Med-01';
          chosenVehicle = 'AMB-04 (ALS Ambulance)';
          chosenEta = 6;
        } else if (desc.includes('roof') || desc.includes('aerial') || desc.includes('winch')) {
          chosenTeamId = 'AIR-01';
          chosenTeamName = 'Coast Guard Helo Air-1';
          chosenVehicle = 'AIR-01 (Helicopter)';
          chosenEta = 4;
        } else if (desc.includes('debris') || desc.includes('blocked') || desc.includes('rubble')) {
          chosenTeamId = 'NDRF-UNIT-01';
          chosenTeamName = 'NDRF Battalion 04';
          chosenVehicle = 'TAC-04 (All-Terrain 4x4)';
          chosenEta = 12;
        } else {
          chosenTeamId = 'TEAM-ALPHA-04';
          chosenTeamName = 'Rescue Alpha';
          chosenVehicle = 'R-07 (Amphibious Rig)';
          chosenEta = 4;
        }
      } else {
        const teamObj = state.rescueTeams.find((t) => t.id === chosenTeamId);
        if (teamObj) {
          chosenTeamName = teamObj.name || teamObj.callsign;
          chosenVehicle = teamObj.vehicleType || 'Rescue Unit';
        } else if (chosenTeamId === 'AIR-01') {
          chosenTeamName = 'Coast Guard Helo Air-1';
          chosenVehicle = 'AIR-01 (Helicopter)';
          chosenEta = 4;
        } else if (chosenTeamId === 'TEAM-BRAVO-02') {
          chosenTeamName = 'Team Bravo-02';
          chosenVehicle = 'Z-02 (Zodiac Raft)';
          chosenEta = 8;
        } else if (chosenTeamId === 'NDRF-UNIT-01') {
          chosenTeamName = 'NDRF Battalion 04';
          chosenVehicle = 'TAC-04 (All-Terrain 4x4)';
          chosenEta = 12;
        } else if (chosenTeamId === 'MED-ALPHA-01') {
          chosenTeamName = 'Rapid EMS Med-01';
          chosenVehicle = 'AMB-04 (ALS Ambulance)';
          chosenEta = 10;
        } else if (chosenTeamId === 'TEAM-ALPHA-04') {
          chosenTeamName = 'Rescue Alpha';
          chosenVehicle = 'R-07 (Amphibious Rig)';
          chosenEta = 4;
        }
      }

      // 2. Update Cases: set assignedTeamId and status to ASSIGNED
      const updatedCases = state.cases.map((c) =>
        c.id === caseId
          ? {
              ...c,
              status: 'ASSIGNED' as const,
              assignedTeamId: chosenTeamId,
              lastVerifiedAt: timeStr
            }
          : c
      );

      // 3. Update Rescue Teams
      let teamFound = false;
      let updatedTeams = state.rescueTeams.map((t) => {
        if (t.id === chosenTeamId) {
          teamFound = true;
          return {
            ...t,
            status: 'EN_ROUTE' as const,
            assignedMissionId: caseId,
            lastLocationUpdate: timeStr
          };
        }
        return t;
      });

      if (!teamFound && chosenTeamId) {
        updatedTeams = [
          ...updatedTeams,
          {
            id: chosenTeamId,
            name: chosenTeamName,
            callsign: chosenTeamName,
            status: 'EN_ROUTE' as const,
            coordinates: targetCase.coordinates,
            accuracyMeters: 10,
            lastLocationUpdate: timeStr,
            assignedMissionId: caseId,
            personnelCount: 5,
            vehicleType: 'AMPHIBIOUS' as const,
            trackingActive: true,
            isSimulated: true,
            batteryLevel: 92
          }
        ];
      }

      // 4. Update Rescue Chains: advance RESCUER_ASSIGNED stage
      const existingChain = state.rescueChains[caseId] || {
        caseId,
        stages: [
          { stageId: 'SOS_RECEIVED', label: 'SOS Sent', status: 'VERIFIED' as const, timestamp: timeStr },
          { stageId: 'AI_TRIAGED', label: 'Command Received & Triaged', status: 'VERIFIED' as const, timestamp: timeStr },
          { stageId: 'COMMANDER_DISPATCH', label: 'Rescue Assignment', status: 'PENDING' as const },
          { stageId: 'RESCUER_ASSIGNED', label: 'Rescue Assignment', status: 'PENDING' as const },
          { stageId: 'RESCUER_EN_ROUTE', label: 'Rescue Team En Route', status: 'PENDING' as const },
          { stageId: 'VICTIM_LOCATED', label: 'Victim Found', status: 'PENDING' as const },
          { stageId: 'MEDICAL_HANDOFF', label: 'Medical Handoff', status: 'PENDING' as const },
          { stageId: 'HOSPITAL_ADMITTED', label: 'Hospital', status: 'PENDING' as const },
          { stageId: 'SHELTER_TRANSFERRED', label: 'Shelter', status: 'PENDING' as const },
          { stageId: 'FAMILY_REUNITED', label: 'Family Reunion', status: 'PENDING' as const },
          { stageId: 'CASE_CLOSED', label: 'Case Closed', status: 'PENDING' as const }
        ]
      };

      const updatedStages = existingChain.stages.map((st) => {
        if (st.stageId === 'COMMANDER_DISPATCH' || st.stageId === 'RESCUER_ASSIGNED') {
          return {
            ...st,
            status: 'VERIFIED' as const,
            timestamp: timeStr,
            actor: isManual ? 'Commander Manual Dispatch' : 'VYRO AI Dispatcher',
            notes: `Assigned ${chosenTeamName} (${chosenVehicle}, ETA ${chosenEta}m)`
          };
        }
        if (st.stageId === 'RESCUER_EN_ROUTE') {
          return {
            ...st,
            status: 'IN_PROGRESS' as const,
            timestamp: timeStr,
            actor: chosenTeamName,
            notes: `En route via optimal route (ETA ${chosenEta}m)`
          };
        }
        return st;
      });

      const updatedChains = {
        ...state.rescueChains,
        [caseId]: { ...existingChain, stages: updatedStages }
      };

      // 5. Update Active Rescue Tracking
      const tracking = {
        teamId: chosenTeamId,
        teamName: chosenTeamName,
        vehicleId: chosenVehicle,
        speedKmh: 42,
        distanceKm: 2.8,
        etaMinutes: chosenEta,
        heading: 126,
        gpsAccuracyMeters: 5,
        updatedSecAgo: 1,
        status: 'EN ROUTE' as const
      };

      // 6. Audit Log
      const auditLog = {
        id: `LOG-${Date.now()}`,
        timestamp: timeStr,
        actor: isManual ? 'Commander Console' : 'AI Dispatch Engine',
        role: 'COMMANDER' as const,
        action: isManual ? 'MANUAL_DISPATCH_CONFIRMED' : 'AI_AUTO_DISPATCH_EXECUTED',
        details: `${chosenTeamName} (${chosenVehicle}) assigned to Case ${caseId}. Method: ${isManual ? 'Manual Selection' : 'AI Auto-Dispatch'}. ETA: ${chosenEta} min.`
      };

      const partial: Partial<OperationalState> = {
        cases: updatedCases,
        rescueTeams: updatedTeams,
        rescueChains: updatedChains,
        activeRescueTracking: tracking,
        activeRescueStage: 'RESPONDER',
        auditLogs: [auditLog, ...state.auditLogs]
      };

      set(partial);
      broadcastChange(partial);
    },

    triggerAssignDemo: () => {
      const state = get();
      const caseId = state.activeCitizenCaseId || 'VY-26-DEMO-01';
      const timeStr = `${new Date().getHours().toString().padStart(2, '0')}:${new Date().getMinutes().toString().padStart(2, '0')} IST`;

      const updatedTeams = state.rescueTeams.map((t) =>
        t.id === 'TEAM-ALPHA-04'
          ? { ...t, name: 'RESCUE ALPHA', status: 'EN_ROUTE' as const, assignedMissionId: caseId }
          : t
      );

      const updatedCases = state.cases.map((c) =>
        c.id === caseId
          ? { ...c, status: 'ASSIGNED' as const, assignedTeamId: 'TEAM-ALPHA-04' }
          : c
      );

      const tracking = {
        teamId: 'TEAM-ALPHA-04',
        teamName: 'RESCUE ALPHA',
        vehicleId: 'R-07',
        speedKmh: 42,
        distanceKm: 2.8,
        etaMinutes: 4,
        heading: 126,
        gpsAccuracyMeters: 5,
        updatedSecAgo: 3,
        status: 'EN ROUTE' as const
      };

      get().advanceRescueChain(caseId, 'RESCUER_ASSIGNED', {
        status: 'VERIFIED',
        timestamp: timeStr,
        actor: 'VYRO AI Dispatcher',
        notes: 'Assigned RESCUE ALPHA (94% Match, ETA 4 min)'
      });

      get().advanceRescueChain(caseId, 'RESCUER_EN_ROUTE', {
        status: 'IN_PROGRESS',
        timestamp: timeStr,
        actor: 'RESCUE ALPHA (R-07)',
        notes: 'Speed 42 km/h, Heading 126°'
      });

      const partial: Partial<OperationalState> = {
        rescueTeams: updatedTeams,
        cases: updatedCases,
        activeRescueTracking: tracking,
        activeRescueStage: 'RESPONDER',
        auditLogs: [
          {
            id: `LOG-${Date.now()}`,
            timestamp: timeStr,
            actor: 'AI Dispatch Engine',
            role: 'COMMANDER',
            action: 'TEAM_ASSIGNED_DEMO',
            details: `RESCUE ALPHA (Vehicle R-07) assigned to ${caseId}. 94% match, ETA 4 min.`
          },
          ...state.auditLogs
        ]
      };

      set(partial);
      broadcastChange(partial);
    },

    triggerFullRescueDemo: () => {
      const caseId = get().triggerSosDemo();

      // Stage 1 & 2: SOS & Triage (Immediate)
      get().setActiveRescueStage('AI');

      // Stage 3: Assign Team (1.8s)
      setTimeout(() => {
        get().triggerAssignDemo();
        get().setActiveRescueStage('RESPONDER');
      }, 1800);

      // Stage 4: En Route (3.6s)
      setTimeout(() => {
        get().advanceRescueChain(caseId, 'RESCUER_EN_ROUTE', { status: 'VERIFIED' });
        get().setActiveRescueStage('RESCUE');
      }, 3600);

      // Stage 5: Victim Found (5.4s)
      setTimeout(() => {
        get().advanceRescueChain(caseId, 'VICTIM_LOCATED', {
          status: 'VERIFIED',
          actor: 'Rescue Alpha Team',
          notes: '6 victims located on Old Bridge terrace. Winch extraction active.'
        });
        get().updateVictimStatus(caseId, 'ON_SCENE', 'Victim found safe');
        get().setActiveRescueStage('RESCUE');
      }, 5400);

      // Stage 6: Medical Handoff (7.2s)
      setTimeout(() => {
        get().advanceRescueChain(caseId, 'MEDICAL_HANDOFF', {
          status: 'VERIFIED',
          actor: 'Paramedic ALS 04',
          notes: 'Stabilized in ambulance. Transmitting pre-arrival telemetry to General Hospital ER.'
        });
        get().updateVictimStatus(caseId, 'MEDICAL_HANDOFF');
        get().setActiveRescueStage('MEDICAL');
      }, 7200);

      // Stage 7: Hospital Admitted (9.0s)
      setTimeout(() => {
        get().advanceRescueChain(caseId, 'HOSPITAL_ADMITTED', {
          status: 'VERIFIED',
          actor: 'Government General Hospital ER',
          notes: 'Bed 14A Allocated. Vitals stabilized. Pre-arrival handoff complete.'
        });
        get().updateHospitalBeds('HOSP-01', -1, 0);
        get().updateVictimStatus(caseId, 'HOSPITALIZED');
        get().setActiveRescueStage('HOSPITAL');
      }, 9000);

      // Stage 8: Safe Shelter Transfer (10.8s)
      setTimeout(() => {
        get().advanceRescueChain(caseId, 'SHELTER_TRANSFERRED', {
          status: 'VERIFIED',
          actor: 'VYRO Safe Shelter 01',
          notes: 'Safe shelter intake complete. Capacity: 250 (157 occupied, 93 available). Same case ID.'
        });
        get().updateShelterOccupancy('SHELTER-01', 6);
        get().updateVictimStatus(caseId, 'SHELTERED');
        get().setActiveRescueStage('SHELTER');
      }, 10800);

      // Stage 9: Family Reunion Match (12.6s)
      setTimeout(() => {
        get().advanceRescueChain(caseId, 'FAMILY_REUNITED', {
          status: 'VERIFIED',
          actor: 'Reunification Center RC-02',
          notes: '98% Biometric / Family Match found. Immediate relative verified at RC-02.'
        });
        get().updateVictimStatus(caseId, 'REUNITED');
        get().setActiveRescueStage('FAMILY');
      }, 12600);

      // Stage 10: Case Closed (14.2s)
      setTimeout(() => {
        get().advanceRescueChain(caseId, 'CASE_CLOSED', {
          status: 'VERIFIED',
          actor: 'VYRO Continuity Engine',
          notes: 'Continuous rescue chain complete from First SOS to Final Reunion. Case VY-26-DEMO-01 closed.'
        });
        get().updateVictimStatus(caseId, 'CLOSED');
        get().addAuditLog(
          'Continuity Engine',
          'COMMANDER',
          'FULL_LIFECYCLE_COMPLETED',
          `Case ${caseId} successfully reunited and completed.`
        );
      }, 14200);
    },

    resetDemo: () => {
      get().resetSimulationData();
      set({
        activeCitizenCaseId: 'VY-26-1042',
        silentModeActive: false,
        activeRescueStage: 'LOCATION',
        deviceSurvival: {
          batteryPercent: 78,
          charging: false,
          cellular: 'CONNECTED',
          internet: 'CONNECTED',
          mesh: 'READY',
          radio: 'AVAILABLE',
          gpsAvailable: true,
          estimatedCommsMinutes: 160,
          isCriticalBattery: false
        }
      });
    },

    setActiveFamilyCaseId: (id: string) => {
      set({ activeFamilyCaseId: id });
    },

    sendImSafeNotification: (caseId: string) => {
      set((state) => {
        const time = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST';
        const updated = state.familyCases.map((fc) => {
          if (fc.id === caseId || fc.victimCaseId === caseId) {
            const newMsg = {
              id: `MSG-${Date.now()}`,
              sender: 'VYRO System',
              text: `🟢 YOUR FAMILY MEMBER HAS BEEN LOCATED\nCase: ${fc.victimCaseId}\nStatus: SAFE\nCurrent location: Authorized shelter\nLast verified: ${time}`,
              time,
              isProtected: true
            };
            return {
              ...fc,
              imSafeSent: true,
              imSafeSentTime: time,
              safeMessageLog: [...fc.safeMessageLog, newMsg],
              auditTrail: [
                ...fc.auditTrail,
                { time, action: 'Authorized I AM SAFE notification dispatched', officer: 'Emergency Relay' }
              ]
            };
          }
          return fc;
        });
        return { familyCases: updated };
      });
    },

    reportMissingPersonCase: (data) => {
      const newId = `FM-26-${(Math.floor(Math.random() * 900) + 100).toString()}`;
      const time = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST';
      const token = `VYRO-RN-${Math.floor(100000 + Math.random() * 900000)}`;
      const isChildOrElder = data.age < 12 || data.age > 65;

      const newCase: FamilyCaseRecord = {
        id: newId,
        victimCaseId: 'VY-26-PENDING',
        missingPersonName: data.missingPersonName,
        age: data.age,
        reportedBy: data.reportedBy,
        relationship: data.relationship,
        contactPhone: data.contactPhone,
        lastKnownLocation: data.lastKnownLocation,
        currentFacility: 'Scanning authorized hospital & shelter registers...',
        reunionCenter: 'Family Reunification Center RC-02',
        matchConfidence: 89,
        matchCriteria: ['Family intake report logged', 'Continuous bi-directional scanning active'],
        priority: isChildOrElder ? 'CRITICAL_VULNERABLE' : 'STANDARD',
        priorityReason: isChildOrElder ? `${data.age < 12 ? 'Child' : 'Elderly individual'} reported separated from family` : undefined,
        reunionToken: token,
        tokenExpiry: '2h remaining',
        status: 'MATCH_FOUND',
        currentStage: 'MATCH',
        imSafeSent: false,
        safeMessageLog: [],
        verificationSteps: [
          { stepNumber: 1, title: 'Candidate found', description: 'Candidate identified in shelter register', verified: true, timestamp: time, authorizedOfficer: 'Registry Scanner' },
          { stepNumber: 2, title: 'Identity verification', description: 'Pending officer check', verified: false },
          { stepNumber: 3, title: 'Relationship verification', description: 'Pending document check', verified: false },
          { stepNumber: 4, title: 'Consent / authorization', description: 'Pending authorization', verified: false },
          { stepNumber: 5, title: 'Reunion location assigned', description: 'Pending assignment', verified: false },
          { stepNumber: 6, title: 'Handoff verified', description: 'Pending token validation', verified: false },
          { stepNumber: 7, title: 'Case closed', description: 'Pending closure', verified: false }
        ],
        auditTrail: [
          { time, action: `Missing person case ${newId} registered`, officer: 'Family Intake Portal' }
        ]
      };

      set((state) => ({
        familyCases: [newCase, ...state.familyCases],
        activeFamilyCaseId: newId,
        reunionQueue: {
          ...state.reunionQueue,
          readyForMatch: state.reunionQueue.readyForMatch + 1
        }
      }));

      return newId;
    },

    verifyReuniteStep: (caseId: string, stepNumber: number) => {
      set((state) => {
        const time = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST';
        const updated = state.familyCases.map((fc) => {
          if (fc.id === caseId) {
            const nextSteps = fc.verificationSteps.map((s) => {
              if (s.stepNumber === stepNumber) {
                return {
                  ...s,
                  verified: true,
                  timestamp: time,
                  authorizedOfficer: 'Officer Verified (Security ID #409)'
                };
              }
              return s;
            });

            let nextStage: VyroReuniteStage = fc.currentStage;
            let nextStatus = fc.status;

            if (stepNumber === 2) nextStage = 'IDENTIFY';
            if (stepNumber === 3) nextStage = 'VERIFY';
            if (stepNumber === 4) nextStage = 'CONNECT';
            if (stepNumber === 5) {
              nextStage = 'REUNITE';
              nextStatus = 'REUNION_READY';
            }
            if (stepNumber === 6) {
              nextStage = 'CLOSE';
            }
            if (stepNumber === 7) {
              nextStage = 'CLOSE';
              nextStatus = 'COMPLETED';
            }

            return {
              ...fc,
              verificationSteps: nextSteps,
              currentStage: nextStage,
              status: nextStatus,
              auditTrail: [
                ...fc.auditTrail,
                { time, action: `Verification Step ${stepNumber} completed`, officer: 'Officer S. Pillai' }
              ]
            };
          }
          return fc;
        });

        return { familyCases: updated };
      });
    },

    executeReuniteHandoff: (caseId: string, token: string) => {
      let success = false;
      set((state) => {
        const time = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST';
        const updated = state.familyCases.map((fc) => {
          if (fc.id === caseId && fc.reunionToken === token) {
            success = true;
            const finalSteps = fc.verificationSteps.map((s) => ({
              ...s,
              verified: true,
              timestamp: s.timestamp || time,
              authorizedOfficer: s.authorizedOfficer || 'Handoff Officer'
            }));
            return {
              ...fc,
              status: 'COMPLETED' as const,
              currentStage: 'CLOSE' as const,
              verificationSteps: finalSteps,
              auditTrail: [
                ...fc.auditTrail,
                { time, action: `Reunion Handoff verified with token ${token}. Case sealed.`, officer: 'Reunion Controller' }
              ]
            };
          }
          return fc;
        });

        return {
          familyCases: updated,
          activeRescueStage: 'FAMILY',
          reunionQueue: {
            ...state.reunionQueue,
            reunionReady: Math.max(0, state.reunionQueue.reunionReady - 1),
            completed: state.reunionQueue.completed + 1
          }
        };
      });
      return success;
    },

    sendSafeMessage: (caseId: string, text: string) => {
      set((state) => {
        const time = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST';
        const updated = state.familyCases.map((fc) => {
          if (fc.id === caseId) {
            return {
              ...fc,
              safeMessageLog: [
                ...fc.safeMessageLog,
                {
                  id: `MSG-${Date.now()}`,
                  sender: 'Authorized Family Contact',
                  text,
                  time,
                  isProtected: true
                }
              ]
            };
          }
          return fc;
        });
        return { familyCases: updated };
      });
    },

    resetSimulationData: () => {
      set({
        cases: INITIAL_VICTIMS,
        rescueTeams: INITIAL_RESCUE_TEAMS,
        medicalTeams: INITIAL_MEDICAL_TEAMS,
        hospitals: INITIAL_HOSPITALS,
        shelters: INITIAL_SHELTERS,
        hazardZones: INITIAL_HAZARD_ZONES,
        rescueChains: INITIAL_RESCUE_CHAINS,
        chainBreaks: INITIAL_CHAIN_BREAKS,
        missingPersons: INITIAL_MISSING_PERSONS,
        selectedEntity: null,
        activeRoute: null
      });
    }
  };
});

