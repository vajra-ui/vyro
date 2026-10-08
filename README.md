# 🛰️ VYRO — Vigilant Rescue Operations

> **FROM FIRST SOS TO FINAL REUNION**  
> *When the user can do less, VYRO must do more.*

**VYRO** is a human emergency continuity platform that follows one person from the exact moment they trigger an SOS through dispatch, extrication, medical stabilization, shelter registration, identity validation, and family reunification.

---

## 🌟 Core Philosophy: Unbroken Human Emergency Continuity

In conventional disaster response dashboards, systems are fragmented:
- Citizen distress portals lose track after dispatch.
- Rescuers operate on isolated radio frequencies.
- Paramedics hand off patients to hospitals with missing triage history.
- Relief shelters re-register displaced survivors under new arbitrary IDs.
- Separated families have no secure, verified mechanism to locate loved ones.

**VYRO solves this by binding every event to ONE immutable Case ID (`VY-26-XXXX`).**
From rooftop distress beacon to hospital trauma intake, shelter bed assignment, and single-use physical handoff tokens at the family reunification pavilion, the human chain of survival remains unbroken.

---

## 🚀 Key Features

### 1. 🚨 Zero-Friction Emergency SOS Uplink
- **One-Tap Emergency Activation**: Trapped citizens need not fill out long forms or authenticate under panic.
- **Dynamic Device Telemetry & Battery Preservation**: Automatically downscales GPS poll frequency when battery drops below 30%, conserving emergency communication life.
- **Silent Voice Distress Analysis**: Evaluates ambient audio decibels, background flood sounds, and vocal stress levels without requiring verbal clarity.
- **Offline Mesh Relay (Store-and-Forward)**: Bundles emergency packets into compact byte payloads relayable peer-to-peer across mesh nodes even during complete cellular blackouts.

### 2. 🧠 AI Emergency Compiler & Smart Dispatch
- **Multi-Source Signal Fusion**: Combines GPS fix, cellular tower triangulation, barometric altitude, and ambient sound to compute true victim location and urgency score.
- **AI Rescue Action Plans**: Generates 3 parallel operational plans with real-time feasibility percentages (Plan A: Amphibious Zodiac Boat; Plan B: Coast Guard Helo Air-1; Plan C: High-Clearance Tactical 4x4).
- **Proactive Chain Break Detection**: Monitors every case in real time. If a patient is handed to an ER trauma bay without intake confirmation within 25 minutes, VYRO triggers an immediate **Chain Break Alert**.

### 3. 🌐 3D Digital Twin Simulation Engine
- **High-Visibility Architectural City Model**: Realistic, distinct multi-material skyline featuring corporate glass, residential brick/terracotta, medical facilities, and illuminated civic towers.
- **Spacious & Uncongested Layout**: 28m wide Central Grand Avenue, 20m arterial avenues, 36m river canal basin with dual arched bridges, pedestrian esplanades, and 45m x 45m open evacuation parks.
- **45+ Animated 3D Humans**: Medical doctors, paramedics, stretcher teams, tactical SAR firefighters, Zodiac boat crews, and rooftop victims with animated waving arms.
- **Simulated Disaster Scenarios**: Real-time physical visualization of Tsunamis, Floods, Earthquakes, Wildfires, Cyclones, Chemical Vapor Leaks, and Landslides.

### 4. 💖 VYRO REUNITE™ — Family Reunification Suite
- **98% Confidence Two-Way Match Engine**: Matches missing person reports (`FM-26-XXXX`) with active shelter and hospital admissions.
- **"I'M SAFE" Family Notification System**: Dispatches authorized status updates to registered next of kin without disclosing raw GPS coordinates.
- **7-Step Safe Verification Checklist**: Ensures ethical handoffs (`Candidate Found → Identity Verified → Relationship Verified → Consent Granted → Reunion Location Assigned → Handoff Verified → Case Closed`).
- **Single-Use Physical Handoff Token**: Time-limited cryptographic token (e.g., `VYRO-RN-842719`) verified on-site before custody transfer.
- **Protected Family Communication Bridge**: Two-way chat without exposing personal contact numbers.

---

## 🛠️ Tech Stack

- **Frontend Core**: React 18, TypeScript, Vite
- **3D Visualization**: Three.js, OrbitControls, WebGL ACES Filmic Tone Mapping
- **State Management & Broadcast**: Zustand with `BroadcastChannel` multi-tab synchronization
- **Styling & UI**: Tailwind CSS, Lucide React Icons
- **Offline & Storage**: LocalStorage, IndexedDB offline packet queue

---

## 📦 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or pnpm

### Installation
```bash
# Clone the repository
git clone https://github.com/vajra-ui/vyro.git

# Navigate into the project directory
cd vyro

# Install dependencies
npm install

# Start the development server
npm run dev
```

### Production Build
```bash
# Compile TypeScript and bundle with Vite
npm run build

# Preview the production build
npm run preview
```

---

## 📄 License
This project is licensed under the MIT License.
