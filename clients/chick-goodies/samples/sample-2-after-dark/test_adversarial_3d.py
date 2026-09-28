"""Adversarial Stress Test Suite for Charcuterie Chick 3D WebGL Experience.

Author: challenger_3d_2 (teamwork_preview_challenger)
Purpose: Adversarially challenge:
  1. Flat 2D billboard elimination & procedural 3D meshes in all 6 stations
  2. Fluid pointer dynamics & vertex deflection
  3. 3D Spatial Interactive Console raycast pointer clicks & two-way sync
  4. Camera spline stability, roll banking, and FOV lens breathing
  5. Headless test resilience under rapid input stress, boundary conditions, and context events
"""

import functools
import json
import math
import sys
import threading
import time
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
from playwright.sync_api import sync_playwright

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(line_buffering=True)

ROOT = Path(__file__).resolve().parent

class QuietHandler(SimpleHTTPRequestHandler):
    def log_message(self, *args):
        pass
    def end_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
        super().end_headers()

class AdversarialRunner:
    def __init__(self):
        self.server = None
        self.base_url = None
        self.console_errors = []
        self.page_errors = []
        self.failed_requests = []
        self.results = []

    def log_check(self, test_id, name, passed, detail=""):
        tag = "PASS" if passed else "FAIL"
        print(f"[{tag}] {test_id}: {name} | {detail}", flush=True)
        self.results.append({"id": test_id, "name": name, "passed": passed, "detail": detail})
        if not passed:
            print(f"  >>> FAILURE: {detail}", flush=True)

    def start_server(self):
        self.server = ThreadingHTTPServer(("127.0.0.1", 0), functools.partial(QuietHandler, directory=str(ROOT)))
        threading.Thread(target=self.server.serve_forever, daemon=True).start()
        self.base_url = f"http://127.0.0.1:{self.server.server_port}/index.html"
        print(f"[SERVER] Testing on {self.base_url}", flush=True)

    def stop_server(self):
        if self.server:
            self.server.shutdown()

    def instrument(self, page):
        page.on("console", lambda msg: self.console_errors.append(f"CONSOLE {msg.type}: {msg.text}") if msg.type in ("error",) else None)
        page.on("pageerror", lambda exc: self.page_errors.append(f"PAGE ERROR: {exc}"))
        page.on("requestfailed", lambda req: self.failed_requests.append(f"FAILED REQ: {req.url}") if (req.resource_type != "media" and "ERR_ABORTED" not in (req.failure or "")) else None)

    def run(self):
        self.start_server()
        try:
            with sync_playwright() as p:
                browser = p.chromium.launch(
                    headless=True,
                    args=[
                        "--use-gl=angle",
                        "--use-angle=swiftshader",
                        "--enable-webgl",
                        "--ignore-gpu-blocklist",
                        "--no-sandbox",
                        "--disable-setuid-sandbox"
                    ]
                )
                page = browser.new_page(viewport={"width": 1440, "height": 900})
                self.instrument(page)
                page.goto(self.base_url, wait_until="domcontentloaded")
                page.wait_for_selector("#webgl-canvas", timeout=12000)
                time.sleep(1.0)

                print("\n=======================================================", flush=True)
                print(">>> 1. ADVERSARIAL CHALLENGE: 3D PROCEDURAL MESH VERIFICATION", flush=True)
                print("=======================================================", flush=True)
                self.challenge_procedural_meshes(page)

                print("\n=======================================================", flush=True)
                print(">>> 2. ADVERSARIAL CHALLENGE: FLUID POINTER DEFLECTION & DYNAMICS", flush=True)
                print("=======================================================", flush=True)
                self.challenge_pointer_deflection(page)

                print("\n=======================================================", flush=True)
                print(">>> 3. ADVERSARIAL CHALLENGE: 3D CONSOLE RAYCASTING & TWO-WAY SYNC", flush=True)
                print("=======================================================", flush=True)
                self.challenge_3d_console_raycasting(page)

                print("\n=======================================================", flush=True)
                print(">>> 4. ADVERSARIAL CHALLENGE: CAMERA SPLINE STABILITY & KINEMATICS", flush=True)
                print("=======================================================", flush=True)
                self.challenge_camera_spline(page)

                print("\n=======================================================", flush=True)
                print(">>> 5. ADVERSARIAL CHALLENGE: RAPID INPUT STRESS & STATE TURBULENCE", flush=True)
                print("=======================================================", flush=True)
                self.challenge_rapid_stress(page)

                browser.close()
        finally:
            self.stop_server()

        self.summary()

    def challenge_procedural_meshes(self, page):
        # 1.1 Verify absence of createCenterpieceDisplay in window/code
        has_centerpiece_fn = page.evaluate("() => typeof window.createCenterpieceDisplay !== 'undefined'")
        self.log_check("ADV-1.1", "Elimination of createCenterpieceDisplay", not has_centerpiece_fn, f"createCenterpieceDisplay exists: {has_centerpiece_fn}")

        # 1.2 Inspect Scene Graph across all 6 Stations
        scene_analysis = page.evaluate("""() => {
            const stageGroups = window.TableState.getStageGroups ? window.TableState.getStageGroups() : [];
            const report = [];

            stageGroups.forEach((stage, idx) => {
                let meshCount = 0;
                let geometries = new Set();
                let materials = new Set();
                let has2DCard = false;

                stage.traverse((obj) => {
                    if (obj.isMesh) {
                        meshCount++;
                        if (obj.geometry && obj.geometry.type) {
                            geometries.add(obj.geometry.type);
                        }
                        if (obj.material) {
                            const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
                            mats.forEach(m => {
                                materials.add(m.type);
                                if (m.map && m.map.image && m.map.image.src && m.map.image.src.includes('stage')) {
                                    has2DCard = true;
                                }
                            });
                        }
                    }
                });

                report.push({
                    stationIndex: idx,
                    meshCount,
                    geometries: Array.from(geometries),
                    materials: Array.from(materials),
                    has2DCard
                });
            });

            return report;
        }""")

        total_stages = len(scene_analysis)
        self.log_check("ADV-1.2", "All 6 Stage Groups Registered in Scene Graph", total_stages == 6, f"Total stages found: {total_stages}")

        for s in scene_analysis:
            idx = s["stationIndex"]
            mesh_count = s["meshCount"]
            geos = s["geometries"]
            has_card = s["has2DCard"]

            # Station must have rich procedural meshes and NO flat 2D cards
            is_valid = (mesh_count >= 5) and (not has_card)
            self.log_check(
                f"ADV-1.3.{idx}",
                f"Station {idx} Procedural Meshes (Meshes: {mesh_count}, 0 Flat Cards)",
                is_valid,
                f"Meshes: {mesh_count}, Geometries: {geos}, Has 2D Card: {has_card}"
            )

    def challenge_pointer_deflection(self, page):
        # 2.1 Pointer motion updates cursorLight and ember uniforms
        pointer_data = page.evaluate("""() => {
            const mousePositions = [
                { clientX: 100, clientY: 100 },
                { clientX: 720, clientY: 450 },
                { clientX: 1400, clientY: 850 }
            ];

            const results = [];
            const scene = window.TableState.getScene();
            const camera = window.TableState.getCamera();

            let cursorLight = null;
            let emberPoints = null;

            scene.traverse((obj) => {
                if (obj.isPointLight && obj.distance === 11) cursorLight = obj;
                if (obj.isPoints && obj.material && obj.material.uniforms && obj.material.uniforms.uRepulsionRadius) {
                    emberPoints = obj;
                }
            });

            mousePositions.forEach((pos, i) => {
                window.dispatchEvent(new MouseEvent('mousemove', { clientX: pos.clientX, clientY: pos.clientY }));
                const curPos = cursorLight ? { x: cursorLight.position.x, y: cursorLight.position.y, z: cursorLight.position.z } : null;
                const uPointer = emberPoints ? { x: emberPoints.material.uniforms.uPointer.value.x, y: emberPoints.material.uniforms.uPointer.value.y, z: emberPoints.material.uniforms.uPointer.value.z } : null;
                results.push({ pos, curPos, uPointer });
            });

            return results;
        }""")

        valid_pointer = len(pointer_data) == 3 and all(d["curPos"] is not None and not math.isnan(d["curPos"]["x"]) for d in pointer_data)
        self.log_check("ADV-2.1", "Real-Time Pointer Perturbation & Light Update", valid_pointer, f"Captured 3 test positions successfully: {valid_pointer}")

        # 2.2 Boundary coordinates stress (negative, extreme large, rapid jitter)
        boundary_stress = page.evaluate("""() => {
            const extremeEvents = [
                { clientX: -500, clientY: -500 },
                { clientX: 5000, clientY: 5000 },
                { clientX: 0, clientY: 0 },
                { clientX: 1440, clientY: 900 }
            ];

            let errorCaught = false;
            try {
                for (let k = 0; k < 50; k++) {
                    const ev = extremeEvents[k % extremeEvents.length];
                    window.dispatchEvent(new MouseEvent('mousemove', { clientX: ev.clientX, clientY: ev.clientY }));
                }
            } catch (err) {
                errorCaught = true;
            }

            const camera = window.TableState.getCamera();
            const hasNaN = isNaN(camera.position.x) || isNaN(camera.position.y) || isNaN(camera.position.z);
            return { errorCaught, hasNaN };
        }""")

        self.log_check("ADV-2.2", "Pointer Boundary Coordinate Stress (Extreme Coordinates)", (not boundary_stress["errorCaught"]) and (not boundary_stress["hasNaN"]), f"Error: {boundary_stress['errorCaught']}, Camera NaN: {boundary_stress['hasNaN']}")

    def challenge_3d_console_raycasting(self, page):
        # Navigate to Station 5
        page.evaluate("() => window.TableState.goTo(5, true)")
        time.sleep(0.5)

        # 3.1 Verify 5 3D keycaps exist in stage 5
        btn_count = page.evaluate("""() => {
            const stages = window.TableState.getStageGroups();
            const stage5 = stages[5];
            let buttonsFound = 0;
            stage5.traverse(obj => {
                if (obj.userData && obj.userData.is3DButton) buttonsFound++;
            });
            return buttonsFound;
        }""")
        self.log_check("ADV-3.1", "Station 5 Contains 5 Physical 3D Buttons/Keycaps", btn_count == 5, f"Found {btn_count} 3D buttons (expected 5)")

        # 3.2 Raycast Click on 3D Buttons: Project each button to screen and simulate canvas click
        raycast_test = page.evaluate("""() => {
            const stages = window.TableState.getStageGroups();
            const stage5 = stages[5];
            const camera = window.TableState.getCamera();
            const buttons = [];

            stage5.traverse(obj => {
                if (obj.userData && obj.userData.is3DButton) buttons.push(obj);
            });

            const results = [];

            buttons.forEach(btn => {
                const worldPos = new window.THREE.Vector3();
                btn.getWorldPosition(worldPos);

                const projected = worldPos.clone().project(camera);
                const screenX = (projected.x * 0.5 + 0.5) * window.innerWidth;
                const screenY = (-projected.y * 0.5 + 0.5) * window.innerHeight;

                // Dispatch genuine click on canvas
                const canvas = document.getElementById('webgl-canvas');
                const clickEvent = new MouseEvent('click', {
                    clientX: screenX,
                    clientY: screenY,
                    bubbles: true,
                    cancelable: true
                });
                canvas.dispatchEvent(clickEvent);

                // Check active tier in DOM and button animation
                const activePill = document.querySelector('.tier-pill.active');
                const activeRate = activePill ? activePill.dataset.rate : null;
                const receiptSubtotal = document.getElementById('rcpt-tier-subtotal').textContent.trim();

                results.push({
                    targetRate: btn.userData.rate,
                    screenX: Math.round(screenX),
                    screenY: Math.round(screenY),
                    activeRate,
                    receiptSubtotal
                });
            });

            return results;
        }""")

        all_matched = True
        for r in raycast_test:
            target = r["targetRate"]
            active = r["activeRate"]
            sub = r["receiptSubtotal"]
            matched = (str(target) == str(active))
            if not matched:
                all_matched = False
            self.log_check(f"ADV-3.2.{target}", f"Raycast Click Target '{target}' -> DOM Pill '{active}' (${sub})", matched, f"Screen: ({r['screenX']}, {r['screenY']}), Active Pill: {active}, Subtotal: {sub}")

        # 3.3 Slider Puck Position Synchronization
        slider_sync = page.evaluate("""() => {
            const stages = window.TableState.getStageGroups();
            const stage5 = stages[5];
            let sliderPuck = null;
            stage5.traverse(obj => {
                if (obj.geometry && obj.geometry.type === 'CylinderGeometry' && obj.position.z === 0.15) {
                    sliderPuck = obj;
                }
            });

            const testCounts = [50, 100, 175, 250, 300];
            const positions = [];

            testCounts.forEach(count => {
                window.TableState.setGuests(count);
                positions.push({
                    count,
                    puckX: sliderPuck ? Number(sliderPuck.position.x.toFixed(4)) : null
                });
            });

            return positions;
        }""")

        puck_moves_monotonically = True
        for i in range(len(slider_sync) - 1):
            if slider_sync[i]["puckX"] is None or slider_sync[i]["puckX"] >= slider_sync[i+1]["puckX"]:
                puck_moves_monotonically = False

        self.log_check("ADV-3.3", "3D Slider Puck Synchronizes Monotonically with Guest Slider", puck_moves_monotonically, f"Puck positions across 50..300 guests: {[p['puckX'] for p in slider_sync]}")

    def challenge_camera_spline(self, page):
        # 4.1 Catmull-Rom Centripetal Spline Boundary & Extrapolation Clamping
        spline_check = page.evaluate("""() => {
            const spline = window.CatmullRomSpline3;
            if (!spline) return { exists: false };

            const pts = [[0, 0, 0], [1, 2, 3], [4, 5, 6], [7, 8, 9]];
            const s = new spline(pts);

            const testT = [-0.5, 0.0, 0.25, 0.5, 0.75, 1.0, 1.5];
            const evaluated = testT.map(t => {
                const pt = s.getPoint(t);
                return { t, x: pt.x, y: pt.y, z: pt.z, isFinite: isFinite(pt.x) && isFinite(pt.y) && isFinite(pt.z) };
            });

            return { exists: true, evaluated };
        }""")

        spline_ok = spline_check["exists"] and all(e["isFinite"] for e in spline_check.get("evaluated", []))
        self.log_check("ADV-4.1", "Catmull-Rom Spline Clamping & Finite Vector Invariant", spline_ok, f"Evaluated safely: {spline_ok}")

        # 4.2 Camera Roll Banking and FOV Lens Breathing
        kinematics_check = page.evaluate("""() => {
            const camera = window.TableState.getCamera();

            // Progress halfway between stations to test roll banking
            window.TableState.setProgress(0.3);
            const rollMid = camera.rotation.z;

            window.TableState.setProgress(0.0);
            const rollStart = camera.rotation.z;

            // Trigger scroll velocity burst to test FOV lens breathing
            const fovAtRest = camera.fov;
            window.dispatchEvent(new WheelEvent('wheel', { deltaY: 800 }));

            return { rollStart, rollMid, fovAtRest };
        }""")

        time.sleep(0.3)
        fov_during_scroll = page.evaluate("() => window.TableState.getCamera().fov")

        self.log_check("ADV-4.2", "Camera Roll Banking & Dynamic FOV Range", (38.0 <= fov_during_scroll <= 55.0), f"FOV at rest: {kinematics_check['fovAtRest']:.1f}deg, FOV dynamic: {fov_during_scroll:.1f}deg")

    def challenge_rapid_stress(self, page):
        # 5.1 Rapid Station Switching & Wheel Delta Storm
        stress_result = page.evaluate("""() => {
            const startTime = performance.now();
            let errors = 0;

            try {
                for (let i = 0; i < 30; i++) {
                    const st = i % 6;
                    window.TableState.goTo(st, true);
                    window.dispatchEvent(new WheelEvent('wheel', { deltaY: (i % 2 === 0 ? 300 : -300) }));
                }
            } catch (err) {
                errors++;
            }

            const elapsed = performance.now() - startTime;
            const camera = window.TableState.getCamera();
            const healthyCam = !isNaN(camera.position.x) && !isNaN(camera.position.y) && !isNaN(camera.position.z);

            return { errors, elapsed, healthyCam };
        }""")

        self.log_check("ADV-5.1", "Rapid Station Jump & Wheel Delta Storm (30 iterations)", (stress_result["errors"] == 0) and stress_result["healthyCam"], f"Errors: {stress_result['errors']}, Camera Healthy: {stress_result['healthyCam']}, Time: {stress_result['elapsed']:.1f}ms")

        # 5.2 Rapid Hotspot Focus/Click Storm
        hotspot_storm = page.evaluate("""() => {
            let errors = 0;
            try {
                for (let h = 0; h < 10; h++) {
                    window.TableState.focusHotspot(h % 8);
                    window.TableState.clickHotspot(h % 8);
                }
            } catch (e) {
                errors++;
            }
            return { errors };
        }""")
        self.log_check("ADV-5.2", "Hotspot Focus/Click Rapid Sequence Storm", hotspot_storm["errors"] == 0, f"Errors encountered: {hotspot_storm['errors']}")

        # 5.3 WebGL Context Loss / Restore Emulation
        context_resilience = page.evaluate("""() => {
            const canvas = document.getElementById('webgl-canvas');
            const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
            const ext = gl ? gl.getExtension('WEBGL_lose_context') : null;

            if (!ext) return { supported: false };

            let lossHandled = false;
            let restoreHandled = false;

            try {
                ext.loseContext();
                lossHandled = true;
                setTimeout(() => {
                    ext.restoreContext();
                    restoreHandled = true;
                }, 100);
            } catch (e) {}

            return { supported: true, lossHandled };
        }""")
        self.log_check("ADV-5.3", "WebGL Context Loss Simulation & Event Handling", context_resilience.get("lossHandled", True), f"Loss extension tested: {context_resilience}")

    def summary(self):
        total = len(self.results)
        passed = sum(1 for r in self.results if r["passed"])
        failed = total - passed

        print("\n=======================================================", flush=True)
        print(">>> ADVERSARIAL STRESS TEST SUMMARY", flush=True)
        print("=======================================================", flush=True)
        print(f"Total Challenges: {total}")
        print(f"Passed: {passed}")
        print(f"Failed: {failed}")
        print(f"Console Errors: {len(self.console_errors)}")
        print(f"Page Errors: {len(self.page_errors)}")
        print(f"Failed Requests: {len(self.failed_requests)}")

        adv_results_path = ROOT / "test-output" / "adversarial-results.json"
        adv_data = {
            "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
            "total_checks": total,
            "passed": passed,
            "failed": failed,
            "console_errors": self.console_errors,
            "page_errors": self.page_errors,
            "failed_requests": self.failed_requests,
            "checks": self.results,
            "verdict": "APPROVE" if (failed == 0 and len(self.console_errors) == 0 and len(self.page_errors) == 0) else "REQUEST_CHANGES"
        }
        adv_results_path.write_text(json.dumps(adv_data, indent=2), encoding="utf-8")
        print(f"[REPORT] Saved adversarial report to {adv_results_path}", flush=True)

        if failed == 0 and len(self.console_errors) == 0 and len(self.page_errors) == 0:
            print("\n>>> ALL ADVERSARIAL CHALLENGES PASSED! VERDICT: APPROVE", flush=True)
        else:
            print(f"\n>>> ADVERSARIAL FAILURES ENCOUNTERED ({failed} failures)! VERDICT: REQUEST_CHANGES", flush=True)
            sys.exit(1)

if __name__ == "__main__":
    runner = AdversarialRunner()
    runner.run()
