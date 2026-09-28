## 2026-09-26T18:57:11Z

You are the Milestone 1 Implementation Worker for the Charcuterie Chick WebGL scrollytelling project.

Identity:
- Archetype: teamwork_preview_worker
- Working Directory: C:\Users\Garrett\autonomous-revenue-engine\clients\chick-goodies\samples\sample-2-after-dark\.agents\teamwork\worker_m1_1
- Parent Conversation ID: 057057ff-b7fd-4423-8c4e-8512f5ef961b

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Authoritative Documents (MUST READ):
- ORIGINAL_REQUEST: C:\Users\Garrett\autonomous-revenue-engine\clients\chick-goodies\samples\sample-2-after-dark\.agents\teamwork\ORIGINAL_REQUEST.md
- PROJECT.md: C:\Users\Garrett\autonomous-revenue-engine\clients\chick-goodies\samples\sample-2-after-dark\PROJECT.md
- Shader Architecture Analysis: C:\Users\Garrett\autonomous-revenue-engine\clients\chick-goodies\samples\sample-2-after-dark\.agents\teamwork\explorer_m1_1\analysis.md
- Bloom & Lighting Analysis: C:\Users\Garrett\autonomous-revenue-engine\clients\chick-goodies\samples\sample-2-after-dark\.agents\teamwork\explorer_m1_2\analysis.md
- Mobile & Performance Analysis: C:\Users\Garrett\autonomous-revenue-engine\clients\chick-goodies\samples\sample-2-after-dark\.agents\teamwork\explorer_m1_3\analysis.md

Task:
Implement Milestone 1 Core WebGL Engine & Shaders:
1. Create `vendor/DualKawaseBloom.js`: Self-contained 5-pass half-res Dual-Kawase selective bloom module importing from `./three.module.js`, with soft-knee luminance threshold ($T=0.88, k=0.13$), bloom intensity 0.75, and ACESFilmic tone mapping with exposure 1.35 (per `explorer_m1_2/analysis.md`).
2. Upgrade `experience.js`:
   - Replace DOM `<video>` swaps with off-DOM `HTMLVideoElement` instances feeding Three.js `VideoTexture` and in-shader transitions (`VideoBlendMaterial`).
   - Replace flat 2D image cards with kinetic deformed meshes: `HoneyViscosityMaterial` (subsurface scattering + Beer-Lambert absorption), `ProsciuttoRibbonMaterial` (undulating wave folds + anisotropic sheen), and `ReliefPortalMaterial` (cursor parallax + normal relief).
   - Convert CPU particle streaming to a GPU vertex-shader Curl-Noise advection field for the 320 ambient embers.
   - Integrate `DualKawaseBloom` into the render loop with adaptive fallback if FPS drops below 45.
   - Enforce DPR clamping via `getClampedDPR()` (`1.5` on desktop, `1.15` on mobile).
   - Implement multi-station shader compilation warmup across all 6 stations.
   - Ensure backward compatibility: Expose both `window.ScrollytellingEngine` and `window.TableState` with all existing methods (`goTo`, `setGuests`, `focusHotspot`, `clickHotspot`) so existing tests pass seamlessly.
3. Update `experience.css`:
   - Ensure `.addons-grid` stacks 1-column on mobile (`@media (max-width: 900px)`), with 44px tap targets and zero horizontal overflow on 393px viewport.
4. Run automated verification:
   - Run the headless test suite with python:
     `& 'C:\Users\Garrett\AppData\Local\Programs\Python\Python311\python.exe' test_3d_experience.py`
   - Ensure zero console errors, zero failed network requests, and all tests pass.

Write Boundaries:
- You exclusively own: `vendor/DualKawaseBloom.js`, `experience.js`, `experience.css`, `index.html`.
- You MUST NOT modify `test_3d_experience.py` (owned by E2E track) or `generate_*.py`.

Deliverables:
- Write `changes.md` in your working directory documenting code changes.
- Write `handoff.md` in your working directory with the 5 required sections (Observation, Logic Chain, Caveats, Conclusion, Verification Method).
- Send a completion message back to parent (`057057ff-b7fd-4423-8c4e-8512f5ef961b`).
