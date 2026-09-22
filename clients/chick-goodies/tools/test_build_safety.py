"""Fail-closed regression: never execute an unguarded historical writer.

Run from the repository root:
    python -B clients/chick-goodies/tools/test_build_safety.py -v

Only stdlib is required. Each guarded source is exercised in an isolated copy;
no actual sample files, assets, facts or showcase files are written by this test.
"""
from __future__ import annotations

import ast
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest


ROOT = Path(__file__).resolve().parents[1]
LEGACY_WRITERS = (
    "tools/build-gathering.py",
    "tools/build-studio.py",
    "samples/sample-1-editorial/build_garden.py",
    "samples/sample-2-after-dark/build_midnight.py",
    "samples/sample-3-studio/apply_content.py",
    "samples/sample-3-studio/content_blocks.py",
    "tools/prepare-gathering.py",
    "tools/prepare-three.py",
    "tools/prep_assets.py",
    "tools/enhance-hero.py",
)
MESSAGE = (
    "LEGACY BUILD DISABLED: canonical sample HTML/CSS/JS are direct-edited. "
    "Do not regenerate or replay preparation/migration scripts. "
    "See clients/chick-goodies/tools/BUILD-SAFETY.md."
)
IMPORT_SCRIPT = """
import importlib.util
import sys
spec = importlib.util.spec_from_file_location('legacy_writer', sys.argv[1])
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)
"""


def snapshot(root: Path) -> dict:
    """Record contents, mtimes and directory inventory, including new files."""
    return {
        p.relative_to(root).as_posix(): (
            p.is_dir(), p.stat().st_mtime_ns,
            None if p.is_dir() else p.read_bytes(),
        )
        for p in root.rglob("*")
    }


class BuildSafetyTests(unittest.TestCase):
    def require_safe_prefix(self, source: bytes, name: str) -> None:
        """Static preflight is mandatory, not an optional test before execution.

        Missing/regressed guards fail here without running the legacy body,
        which can include absolute paths, network requests and top-level writes.
        A docstring and future imports are the only permitted guard predecessors.
        """
        tree = ast.parse(source, filename=name)
        compile(tree, name, "exec")  # Also verify legal future-import placement.
        body = list(tree.body)
        if body and isinstance(body[0], ast.Expr) and isinstance(
            body[0].value, ast.Constant
        ) and isinstance(body[0].value.value, str):
            body.pop(0)
        while body and isinstance(body[0], ast.ImportFrom) and body[0].module == "__future__":
            body.pop(0)
        expected = ast.parse(f"raise SystemExit({MESSAGE!r})").body[0]
        self.assertTrue(body, f"{name}: no fail-closed guard; REFUSING execution")
        self.assertEqual(
            ast.dump(body[0]), ast.dump(expected),
            f"{name}: missing unconditional early guard; REFUSING execution",
        )

    def test_legacy_writers_fail_closed_without_side_effects(self) -> None:
        for relative in LEGACY_WRITERS:
            with self.subTest(script=relative):
                source = (ROOT / relative).read_bytes()
                # In RED, execution never gets past this safety check.
                self.require_safe_prefix(source, relative)
                with tempfile.TemporaryDirectory(prefix="chick-build-safety-") as directory:
                    sandbox = Path(directory)
                    client = sandbox / "clients/chick-goodies"
                    script = client / relative
                    script.parent.mkdir(parents=True)
                    script.write_bytes(source)
                    # Canary destinations cover all three samples and the old
                    # studio mirror. No dependencies or real assets are needed.
                    for destination in (
                        "samples/sample-1-editorial", "samples/sample-2-after-dark",
                        "samples/sample-3-studio", "samples/shared", "site",
                    ):
                        for asset in (
                            "index.html", "menu.html", "gallery.html", "story.html",
                            "enquire.html", "garden.css", "garden.js", "midnight.css",
                            "midnight.js", "gathering.css", "gathering.js", "studio.css",
                            "studio.js", "engine.js", "studio-data.json", "facts.json",
                            "img/brand.webp", "img/knot-hero.jpg", "img/knot-hero-v2.jpg",
                            "img/chick-original.jpg", "img/chick-logo.webp", "img/plate.svg",
                            "vendor/three.module.js", "vendor/THREE-LICENSE.txt",
                        ):
                            canary = client / destination / asset
                            canary.parent.mkdir(parents=True, exist_ok=True)
                            canary.write_bytes(b"CANONICAL DIRECT EDIT - DO NOT OVERWRITE\n")
                    for cwd in (client, script.parent):
                        for mode in ("execute", "import"):
                            with self.subTest(cwd=str(cwd.relative_to(sandbox)), mode=mode):
                                before = snapshot(sandbox)
                                command = [sys.executable, "-B", "-S"]
                                if mode == "import":
                                    command += ["-c", IMPORT_SCRIPT]
                                command.append(str(script))
                                result = subprocess.run(
                                    command, cwd=cwd, capture_output=True,
                                    text=True, timeout=10, check=False,
                                )
                                self.assertEqual(snapshot(sandbox), before, "Filesystem side effect")
                                self.assertEqual(result.returncode, 1, result.stderr)
                                self.assertEqual(result.stdout, "")
                                self.assertEqual(result.stderr.strip(), MESSAGE)


if __name__ == "__main__":
    unittest.main()
