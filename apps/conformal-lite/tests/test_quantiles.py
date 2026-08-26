import math
import unittest

import numpy as np

from conformal_lite.quantiles import conformal_quantile, scale_width


class TestConformalQuantile(unittest.TestCase):
    def test_empty_is_unbounded(self):
        self.assertEqual(conformal_quantile([], 0.1), float("inf"))

    def test_too_few_points_is_unbounded(self):
        # alpha=0.1 needs ceil((n+1)*0.9) <= n; n=3 cannot support it.
        self.assertEqual(conformal_quantile([1.0, 2.0, 3.0], 0.1), float("inf"))

    def test_picks_the_documented_order_statistic(self):
        scores = [5.0, 1.0, 4.0, 2.0, 3.0]
        alpha = 0.4
        n = len(scores)
        rank = math.ceil((n + 1) * (1 - alpha))
        expected = sorted(scores)[rank - 1]
        self.assertEqual(conformal_quantile(scores, alpha), expected)

    def test_beats_plain_empirical_quantile_on_coverage(self):
        # The regression this module exists to prevent: np.quantile(...,
        # method="higher") is one order statistic too low and always
        # returns a finite value even when n can't support the target
        # coverage. Measure both over many trials and confirm the fix wins.
        rng = np.random.default_rng(42)
        alpha = 0.1
        n = 11
        trials = 4000
        hits_fixed = hits_naive = 0
        for _ in range(trials):
            calib = rng.normal(0, 1, size=n)
            test_point = rng.normal(0, 1)
            q_fixed = conformal_quantile(list(np.abs(calib)), alpha)
            q_naive = np.quantile(np.abs(calib), 1 - alpha, method="higher")
            hits_fixed += int(abs(test_point) <= q_fixed)
            hits_naive += int(abs(test_point) <= q_naive)
        cov_fixed = hits_fixed / trials
        cov_naive = hits_naive / trials
        self.assertGreater(cov_fixed, cov_naive)
        self.assertGreater(cov_fixed, 1 - alpha - 0.03)

    def test_unsorted_input_matches_sorted_input(self):
        scores = [9.0, 1.0, 5.0, 3.0, 7.0, 2.0, 8.0]
        self.assertEqual(
            conformal_quantile(scores, 0.3),
            conformal_quantile(sorted(scores), 0.3),
        )


class TestScaleWidth(unittest.TestCase):
    def test_infinite_width_stays_infinite_at_any_scale(self):
        self.assertEqual(scale_width(float("inf"), 0.0), float("inf"))
        self.assertEqual(scale_width(float("inf"), 5.0), float("inf"))

    def test_finite_width_scales_normally(self):
        self.assertAlmostEqual(scale_width(2.0, 3.0), 6.0)


if __name__ == "__main__":
    unittest.main()
