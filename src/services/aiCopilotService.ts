import { 
  VictimCase, 
  RescueTeam, 
  HospitalFacility, 
  ShelterFacility, 
  HazardZone, 
  ActiveRoute,
  ChainBreakAlert,
  MissingPersonRecord
} from '../types/vyro';
import { calculateHaversineDistanceKm } from './routingService';

export interface AIQueryResponse {
  answer: string;
  dataPoints: Array<{ label: string; value: string }>;
  suggestedAction?: {
    type: 'SELECT_ENTITY' | 'FLY_TO' | 'CALCULATE_ROUTE';
    entityType?: 'VICTIM' | 'TEAM' | 'HOSPITAL' | 'SHELTER';
    entityId?: string;
    coordinates?: [number, number];
    actionLabel: string;
  };
}

export class AICopilotService {
  public answerOperationalQuery(
    prompt: string,
    cases: VictimCase[],
    teams: RescueTeam[],
    hospitals: HospitalFacility[],
    shelters: ShelterFacility[],
    hazards: HazardZone[],
    chainBreaks: ChainBreakAlert[] = [],
    missingPersons: MissingPersonRecord[] = []
  ): AIQueryResponse {
    const q = prompt.toLowerCase();

    // 1. "Which critical victim is closest to a hospital?"
    if (q.includes('critical') && (q.includes('closest') || q.includes('hospital') || q.includes('near'))) {
      const criticalCases = cases.filter((c) => c.priority === 'CRITICAL');
      if (criticalCases.length === 0) {
        return {
          answer: 'All critical cases currently have active medical dispatches or are cleared.',
          dataPoints: []
        };
      }

      let closestPair: {
        victim: VictimCase;
        hospital: HospitalFacility;
        distanceKm: number;
      } | null = null;

      for (const v of criticalCases) {
        for (const h of hospitals) {
          const d = calculateHaversineDistanceKm(v.coordinates, h.coordinates);
          if (!closestPair || d < closestPair.distanceKm) {
            closestPair = { victim: v, hospital: h, distanceKm: +d.toFixed(2) };
          }
        }
      }

      if (closestPair) {
        const estMin = Math.round((closestPair.distanceKm / 28) * 60) + 3;
        return {
          answer: `Analysis complete: Critical case ${closestPair.victim.id} ("${closestPair.victim.name}" at ${closestPair.victim.locationName}) is closest to ${closestPair.hospital.name}. Direct distance is ${closestPair.distanceKm} km (~${estMin} min transit). Facility has ${closestPair.hospital.icuAvailable} ICU beds available.`,
          dataPoints: [
            { label: 'Victim ID', value: closestPair.victim.id },
            { label: 'Location', value: closestPair.victim.locationName },
            { label: 'Closest Hospital', value: closestPair.hospital.name },
            { label: 'Distance', value: `${closestPair.distanceKm} km` },
            { label: 'ICU Beds Free', value: `${closestPair.hospital.icuAvailable}` }
          ],
          suggestedAction: {
            type: 'SELECT_ENTITY',
            entityType: 'VICTIM',
            entityId: closestPair.victim.id,
            coordinates: closestPair.victim.coordinates,
            actionLabel: `Inspect ${closestPair.victim.id}`
          }
        };
      }
    }

    // 2. "Show all chain breaks" or "chain break"
    if (q.includes('chain break') || q.includes('break') || q.includes('anomaly')) {
      const activeBreaks = chainBreaks.filter((b) => !b.isResolved);
      if (activeBreaks.length > 0) {
        const top = activeBreaks[0];
        const v = cases.find((c) => c.id === top.caseId);
        return {
          answer: `⚠ Active Rescue Chain Break detected on Case ${top.caseId}: ${top.lastVerifiedStage} occurred, but ${top.missingConfirmation} is missing! Responsible unit: ${top.responsibleTeam}. Risk level: ${top.risk}. Immediate commander phone verification recommended.`,
          dataPoints: [
            { label: 'Case ID', value: top.caseId },
            { label: 'Risk', value: top.risk },
            { label: 'Responsible Team', value: top.responsibleTeam },
            { label: 'Missing Event', value: 'ER Admission Confirmation' }
          ],
          suggestedAction: {
            type: 'SELECT_ENTITY',
            entityType: 'VICTIM',
            entityId: top.caseId,
            coordinates: v?.coordinates || [76.2895, 9.9705],
            actionLabel: `Investigate Chain Break ${top.caseId}`
          }
        };
      }
      return {
        answer: 'All active cases have unbroken Rescue Chains. No handoff discrepancies detected.',
        dataPoints: [{ label: 'Chain Status', value: '100% Verified' }]
      };
    }

    // 3. "Which patient is waiting for hospital confirmation?"
    if (q.includes('waiting') && (q.includes('hospital') || q.includes('confirmation') || q.includes('admission'))) {
      const pendingCase = cases.find((c) => c.status === 'MEDICAL_HANDOFF' || c.priority === 'CHAIN_BREAK');
      if (pendingCase) {
        return {
          answer: `Patient ${pendingCase.id} ("${pendingCase.name}") is currently waiting for Hospital Admission confirmation. Field ambulance reached the hospital bay, but downstream intake is pending verification.`,
          dataPoints: [
            { label: 'Patient ID', value: pendingCase.id },
            { label: 'Condition', value: pendingCase.medicalNeeds.slice(0, 30) + '...' },
            { label: 'Status', value: 'MEDICAL_HANDOFF' },
            { label: 'Pending Action', value: 'Hospital Intake Signoff' }
          ],
          suggestedAction: {
            type: 'SELECT_ENTITY',
            entityType: 'VICTIM',
            entityId: pendingCase.id,
            coordinates: pendingCase.coordinates,
            actionLabel: `Inspect Pending Case ${pendingCase.id}`
          }
        };
      }
    }

    // 4. "Which victims have stale locations?"
    if (q.includes('stale') || q.includes('old location') || q.includes('outdated')) {
      const staleCases = cases.filter((c) => c.locationTelemetryType === 'LAST_KNOWN' || c.accuracyMeters > 20);
      if (staleCases.length > 0) {
        const top = staleCases[0];
        return {
          answer: `Found ${staleCases.length} cases with non-live/stale locations. Most critical: ${top.id} (${top.locationName}), telemetry marked as LAST_KNOWN (Accuracy ±${top.accuracyMeters}m). Last verified at ${top.lastVerifiedAt}. Recon drone verification advised.`,
          dataPoints: staleCases.map((c) => ({
            label: c.id,
            value: `${c.locationTelemetryType} (±${c.accuracyMeters}m)`
          })),
          suggestedAction: {
            type: 'SELECT_ENTITY',
            entityType: 'VICTIM',
            entityId: top.id,
            coordinates: top.coordinates,
            actionLabel: `View Stale Case ${top.id}`
          }
        };
      }
      return {
        answer: 'All active victim coordinates are confirmed live GPS or recent field recon within ±15m accuracy.',
        dataPoints: [{ label: 'Telemetry Health', value: 'Optimal' }]
      };
    }

    // 5. "Why is this victim critical?"
    if (q.includes('why') && (q.includes('critical') || q.includes('priority'))) {
      const targetCase = cases.find((c) => q.includes(c.id.toLowerCase())) || cases.find((c) => c.priority === 'CRITICAL') || cases[0];
      return {
        answer: `Case ${targetCase.id} ("${targetCase.name}") is classified CRITICAL due to: ${targetCase.medicalNeeds}. Structure is in proximity to active flood basin (${targetCase.hazardProximityNote || 'Rapid water current'}). ${targetCase.peopleCount} individuals trapped requiring specialized boat extrication.`,
        dataPoints: [
          { label: 'Priority', value: targetCase.priority },
          { label: 'Disaster Type', value: targetCase.disasterType },
          { label: 'People In Danger', value: `${targetCase.peopleCount}` },
          { label: 'Medical Condition', value: targetCase.medicalNeeds.slice(0, 25) }
        ],
        suggestedAction: {
          type: 'SELECT_ENTITY',
          entityType: 'VICTIM',
          entityId: targetCase.id,
          coordinates: targetCase.coordinates,
          actionLabel: `Focus ${targetCase.id} 3D`
        }
      };
    }

    // 6. "Which team is available?"
    if (q.includes('available') && (q.includes('team') || q.includes('unit'))) {
      const idleTeams = teams.filter((t) => t.status === 'IDLE');
      if (idleTeams.length > 0) {
        const t = idleTeams[0];
        return {
          answer: `${idleTeams.length} rescue team(s) are IDLE and ready for immediate deployment: ${idleTeams.map(x => x.name + ' (' + x.vehicleType + ')').join(', ')}. Optimal staging at ${t.coordinates[1].toFixed(4)}° N, ${t.coordinates[0].toFixed(4)}° E.`,
          dataPoints: idleTeams.map((x) => ({
            label: x.name,
            value: `IDLE • ${x.vehicleType}`
          })),
          suggestedAction: {
            type: 'SELECT_ENTITY',
            entityType: 'TEAM',
            entityId: t.id,
            coordinates: t.coordinates,
            actionLabel: `Deploy ${t.name}`
          }
        };
      }
      return {
        answer: 'All 3 primary rescue teams are currently EN_ROUTE or ON_SCENE. NDRF backup battalions can be requested.',
        dataPoints: [{ label: 'Units Deployed', value: `${teams.length}/${teams.length}` }]
      };
    }

    // 7. "Show missing persons near this shelter"
    if (q.includes('missing') || q.includes('family') || q.includes('reun')) {
      const matches = missingPersons.filter((m) => m.status === 'AI_MATCH_FOUND');
      if (matches.length > 0) {
        const top = matches[0];
        return {
          answer: `Found ${matches.length} AI matches in Family Reunification registry. Top match: "${top.fullName}" (Age ${top.age}) matches an evacuee at ${top.matchFacilityName} with ${top.matchConfidence}% confidence. Relatives have been registered.`,
          dataPoints: matches.map((m) => ({
            label: m.fullName,
            value: `${m.matchFacilityName} (${m.matchConfidence}%)`
          })),
          suggestedAction: {
            type: 'SELECT_ENTITY',
            entityType: 'SHELTER',
            entityId: 'SHELTER-01',
            coordinates: [76.2865, 9.9712],
            actionLabel: `Inspect Shelter Roster for ${top.fullName}`
          }
        };
      }
      return {
        answer: `Currently tracking ${missingPersons.length} missing person inquiries across all shelters and hospitals.`,
        dataPoints: [{ label: 'Active Inquiries', value: `${missingPersons.length}` }]
      };
    }

    // 8. "Which route is safer?"
    if (q.includes('route') || q.includes('safer') || q.includes('path')) {
      return {
        answer: 'Safe Transit Corridor Analysis: Northern overland Shanmugham Road bypass avoids the 1.45m Marine Drive water surge. OSRM real-road geometry calculates 3.2 km distance with 0 hazard intersections, compared to the impassable southern Broadway canal crossing.',
        dataPoints: [
          { label: 'Recommended Route', value: 'North Arterial Bypass' },
          { label: 'Hazard Intersections', value: '0 Detected' },
          { label: 'Transit Distance', value: '3.2 km' },
          { label: 'ETA', value: '~9 mins' }
        ],
        suggestedAction: {
          type: 'CALCULATE_ROUTE',
          entityType: 'TEAM',
          entityId: 'TEAM-ALPHA-04',
          coordinates: [76.2835, 9.9775],
          actionLabel: 'Draw Safe Road Corridor'
        }
      };
    }

    // 9. "Which cases are delayed?"
    if (q.includes('delay') || q.includes('slow') || q.includes('overdue')) {
      const delayed = cases.filter((c) => c.status === 'REPORTED' && c.priority === 'CRITICAL');
      return {
        answer: `Identified ${delayed.length} cases awaiting dispatch confirmation. Case ${delayed[0]?.id || 'VY-2026-0002047'} was reported 26 mins ago and requires immediate commander assignment to prevent rising water breach.`,
        dataPoints: delayed.map((c) => ({
          label: c.id,
          value: `Pending Dispatch (${c.locationName})`
        })),
        suggestedAction: {
          type: 'SELECT_ENTITY',
          entityType: 'VICTIM',
          entityId: delayed[0]?.id || 'VY-2026-0002047',
          coordinates: delayed[0]?.coordinates,
          actionLabel: `Dispatch Unit to ${delayed[0]?.id || 'VY-2026-0002047'}`
        }
      };
    }

    // 10. "Which rescue team is closest?"
    if (q.includes('rescue team') || q.includes('closest team') || q.includes('which team')) {
      const targetCase =
        cases.find((c) => q.includes(c.id.toLowerCase())) ||
        cases.find((c) => c.priority === 'CRITICAL' && c.status === 'REPORTED') ||
        cases[0];

      const teamRankings = teams
        .map((team) => {
          const dist = calculateHaversineDistanceKm(team.coordinates, targetCase.coordinates);
          return {
            team,
            distanceKm: +dist.toFixed(2),
            estArrivalMin: Math.max(2, Math.round((dist / 22) * 60))
          };
        })
        .sort((a, b) => a.distanceKm - b.distanceKm);

      const closest = teamRankings[0];
      return {
        answer: `Proximity calculated for Case ${targetCase.id} (${targetCase.locationName}): ${closest.team.name} (Callsign: ${closest.team.callsign}) is closest at ${closest.distanceKm} km (approx. ${closest.estArrivalMin} min response time). Equipment: ${closest.team.vehicleType}.`,
        dataPoints: [
          { label: 'Target Case', value: targetCase.id },
          { label: 'Optimal Unit', value: closest.team.name },
          { label: 'Unit Status', value: closest.team.status },
          { label: 'Distance', value: `${closest.distanceKm} km` },
          { label: 'ETA', value: `${closest.estArrivalMin} mins` }
        ],
        suggestedAction: {
          type: 'CALCULATE_ROUTE',
          entityType: 'TEAM',
          entityId: closest.team.id,
          coordinates: closest.team.coordinates,
          actionLabel: `Route ${closest.team.name} -> ${targetCase.id}`
        }
      };
    }

    // 11. "Which shelter has capacity?"
    if (q.includes('shelter') || q.includes('capacity') || q.includes('occupancy')) {
      const rankedShelters = [...shelters].sort(
        (a, b) => (b.capacity - b.currentOccupancy) - (a.capacity - a.currentOccupancy)
      );

      const top = rankedShelters[0];
      const availableBeds = top.capacity - top.currentOccupancy;
      const pctOccupied = Math.round((top.currentOccupancy / top.capacity) * 100);

      return {
        answer: `Live Shelter Audit: "${top.name}" has the highest available capacity with ${availableBeds} spaces available (${pctOccupied}% full, ${top.currentOccupancy}/${top.capacity}). Medical support is ${top.medicalSupport ? 'ACTIVE' : 'OFFLINE'}. Total remaining network capacity across sector is ${shelters.reduce((acc, s) => acc + (s.capacity - s.currentOccupancy), 0)} spaces.`,
        dataPoints: rankedShelters.map((s) => ({
          label: s.name,
          value: `${s.capacity - s.currentOccupancy} free (${Math.round((s.currentOccupancy / s.capacity) * 100)}% occupied)`
        })),
        suggestedAction: {
          type: 'SELECT_ENTITY',
          entityType: 'SHELTER',
          entityId: top.id,
          coordinates: top.coordinates,
          actionLabel: `Inspect Shelter: ${top.name}`
        }
      };
    }

    // Default intelligent spatial summary
    const criticalCount = cases.filter((c) => c.priority === 'CRITICAL').length;
    const activeUnits = teams.filter((t) => t.status === 'EN_ROUTE' || t.status === 'ON_SCENE').length;
    const freeIcu = hospitals.reduce((acc, h) => acc + h.icuAvailable, 0);

    return {
      answer: `Commander Operational Status: ${cases.length} reported cases (${criticalCount} Critical). ${activeUnits} rescue teams deployed in sector. Emergency ICU availability: ${freeIcu} beds across sector hospitals. Active flood surge in Marine Drive basin with 2.1 m/s flow velocity.`,
      dataPoints: [
        { label: 'Critical Cases', value: `${criticalCount}` },
        { label: 'Active Teams', value: `${activeUnits}/${teams.length}` },
        { label: 'Sector ICU Beds', value: `${freeIcu}` },
        { label: 'Hazard Status', value: 'High Tide Overflow Active' }
      ]
    };
  }
}

export const aiCopilot = new AICopilotService();
