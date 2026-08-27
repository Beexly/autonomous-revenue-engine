"""Tests for the finite-sample conformal quantile.

The point of these tests is to check the *guarantee*, not just the code. A
conformal library whose selling point is honest coverage has to fail loudly
when its intervals stop covering, or it is selling nothing.
"""
import math
import unittest

import numpy as np

from conformal_lite import conformal_quantile, scale_width


class TestConformalQuantile(unittest.TestCase):
    def test_empty_is_unbounded(self):
        self.assertEqual(conformal_quantile([], 0.1), float("inf"))

    def test_too_few_points_is_unbounded(self):
        # ceil((n+1)(1-alpha)) > n  =>  cannot certify coverage at any threshold.
        for n, alpha in [(1, 0.1), (3, 0.1), (5, 0.1), (9, 0.05)]:
            scores = list(range(1, n + 1))
            self.assertEqual(
                conformal_quantile(scores, alpha),
                float("inf"),
                msg=f"n={n} alpha={alpha} must be unbounded",
            )

    def test_picks_the_documented_order_statistic(self):
        scores = [10.0, 1.0, 5.0, 3.0, 7.0, 9.0, 2.0, 8.0, 4.0, 6.0]  # n=10, unsorted
        # ceil(11 * 0.9) = 10  -> the 10th smallest = max = 10.0
        self.assertEqual(conformal_quantile(scores, 0.1), 10.0)
        # ceil(11 * 0.7) = 8   -> the 8th smallest = 8.0
        self.assertEqual(conformal_quantile(scores, 0.3), 8.0)
        # ceil(11 * 0.5) = 6   -> the 6th smallest = 6.0
        self.assertEqual(conformal_quantile(scores, 0.5), 6.0)

    def test_unsorted_input_matches_sorted_input(self):
        rng = np.random.default_rng(3)
        raw = rng.normal(size=25).tolist()
        self.assertEqual(
            conformal_quantile(raw, 0.1), conformal_quantile(sorted(raw), 0.1)
        )

    def test_beats_plain_empirical_quantile_on_coverage(self):
        """The regression this module exists to prevent.

        np.quantile(scores, 1-alpha, method="higher") under-covers at small n.
        Assert the correct rule holds its target and record that the naive one
        does not, so nobody 'simplifies' this back.
        """
        rng = np.random.default_rng(7)
        trials = 8000
        for n, alpha in [(11, 0.1), (7, 0.2)]:
            hit_conformal = 0
            hit_naive = 0
            for _ in range(trials):
                cal = np.abs(rng.normal(size=n))
                test = abs(float(rng.normal()))
                hit_conformal += test <= conformal_quantile(cal, alpha)
                hit_naive += test <= float(
                    np.quantile(cal, 1 - alpha, method="higher")
                )
            target = 1 - alpha
            cov_conformal = hit_conformal / trials
            cov_naive = hit_naive / trials
            self.assertGreaterEqual(
                cov_conformal,
                target - 0.02,
                msg=f"conformal rule under-covered at n={n} alpha={alpha}: {cov_conformal:.3f}",
            )
            self.assertLess(
                cov_naive,
                cov_conformal,
                msg=(
                    f"naive quantile no longer under-covers at n={n} alpha={alpha}; "
                    "if numpy changed semantics, revisit this module"
                ),
            )

    def test_scale_width_keeps_unbounded_unbounded(self):
        # inf * 0.0 is nan, which would silently turn "no guarantee" into a
        # degenerate zero-width interval. It must stay unbounded.
        self.assertEqual(scale_width(float("inf"), 0.0), float("inf"))
        self.assertEqual(scale_width(float("inf"), 2.0), float("inf"))
        self.assertEqual(scale_width(3.0, 2.0), 6.0)


class TestHonestUnboundedIntervals(unittest.TestCase):
    def test_cold_models_report_unbounded_not_invented_width(self):
        from conformal_lite import AdaptiveConformal, EValueConformal

        m = AdaptiveConformal()
        lo, hi = m.predict_interval(0.0)
        self.assertTrue(math.isinf(lo) and math.isinf(hi))
        self.assertLess(lo, hi)

        e = EValueConformal()
        lo, hi = e.predict_interval(0.0)
        self.assertTrue(math.isinf(lo) and math.isinf(hi))

    def test_interval_becomes_finite_once_calibration_supports_alpha(self):
        from conformal_lite import AdaptiveConformal

        m = AdaptiveConformal(alpha=0.1)
        for i in range(40):
            m.update(float(i), float(i) + 0.1)
        lo, hi = m.predict_interval(10.0)
        self.assertTrue(math.isfinite(lo) and math.isfinite(hi))
        self.assertLess(lo, hi)


if __name__ == "__main__":
    unittest.main()
