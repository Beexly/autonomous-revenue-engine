from __future__ import annotations

import argparse

import numpy as np

from .core import MODES, make
from .meter import emit


def main() -> None:
    p = argparse.ArgumentParser(description="conformal-lite free core")
    p.add_argument("--mode", default="aci", choices=MODES)
    p.add_argument("--alpha", type=float, default=0.1)
    p.add_argument("--steps", type=int, default=200)
    args = p.parse_args()
    model = make(args.mode, alpha=args.alpha)
    rng = np.random.default_rng(0)
    hits = 0
    for t in range(args.steps):
        y_true = float(np.sin(t / 10) + rng.normal(0, 0.3))
        y_pred = float(np.sin(t / 10))
        lo, hi = model.predict_interval(y_pred)
        covered = lo <= y_true <= hi
        hits += int(covered)
        model.update(y_true, y_pred)
        emit("cp_predict", mode=args.mode, covered=bool(covered))
        if t % 50 == 0:
            alpha_t = getattr(model, "alpha_t", args.alpha)
            print(
                f"t={t:3d} mode={args.mode} alpha={alpha_t:.3f} "
                f"interval=[{lo:.2f},{hi:.2f}] covered={covered}"
            )
    print(f"empirical_coverage={hits / args.steps:.3f} n={args.steps} mode={args.mode}")


if __name__ == "__main__":
    main()
