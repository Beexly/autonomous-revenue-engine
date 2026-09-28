# Orchestrator Execution Plan: Charcuterie Chick WebGL Scrollytelling

## Phase 0: Survey & Scope Mapping
1. Spawn 3 Survey Explorers / Spec Miners in parallel:
   - Explorer 1 (Spec Miner): Deconstruct ORIGINAL_REQUEST.md requirements, acceptance criteria, pricing formulas, and narrative phases.
   - Explorer 2 (Codebase & Tech Stack): Inspect current repository structure, package.json, build tools, existing components/assets, and environment configuration.
   - Explorer 3 (Graphics & Shaders Architecture): Evaluate Three.js / WebGL / GLSL shaders, lighting models (warm amber, copper, champagne, ACESFilmic tone mapping, bloom), camera choreography, and asset pipeline (Higgsfield SDK integration).
2. Synthesize survey results into `PROJECT.md` at root:
   - Global Architecture & Code Layout
   - Complete Feature Inventory cross-checked against requirements
   - Milestone Decomposition (Target 3-6 milestones + E2E track)
   - Interface Contracts between modules

## Phase 1: Dual Track Dispatch
- **Track 1: E2E Testing Orchestrator**
  - Implement opaque-box testing framework (Playwright, headless desktop 1440x900 & mobile 393x852).
  - Author Tier 1-4 test suites derived strictly from user requirements.
  - Publish `TEST_READY.md`.
- **Track 2: Implementation Sub-Orchestrators**
  - Milestone 1: Core Engine & Visual Environment (WebGL canvas, post-processing bloom, tone-mapping, lighting, particle/mesh foundation, 60fps loop).
  - Milestone 2: Progressive Scale Scrollytelling Narrative (Phases 0-4: Micro seed, Artisan board, Banquet tables, Cart/Holy Grail, Heritage).
  - Milestone 3: Mathematical Quote Engine & Lead Capture (Interactive configurator, exact pricing math, SMS/email triggers).
  - Milestone 4: Higgsfield Asset Pipeline & Polish (Generative macro textures, high-fidelity materials, fluid dynamics/particle flows).

## Phase 2: Integration & Verification
- Run full E2E test suite across desktop and mobile.
- Adversarial hardening (Tier 5 challenger loop).
- Forensic integrity audit (zero dummy facades, zero mocked outputs).

## Phase 3: Deployment & Delivery
- Deploy to Vercel production edge network (`charcuterie-chick-sample-2.vercel.app`).
- Live verification via automated checks.
- Victory audit and report to Sentinel/User.
