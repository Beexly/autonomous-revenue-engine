import unittest

import numpy as np

from conformal_lite import (
    AdaptiveConformal,
    ConformalQR,
    EValueConformal,
    SAOCP,
    conformal_p,
    make,
    posthoc_alpha,
    quantile_residual,
    soft_rank_e,
)


class TestACI(unittest.TestCase):
    def test_cold_start_interval(self):
        m = AdaptiveConformal()
        lo, hi = m.predict_interval(0.0)
        self.assertLess(lo, hi)

    def test_update_moves_n(self):
        m = AdaptiveConformal()
        for i in range(15):
            m.update(float(i), float(i) + 0.1)
        self.assertGreaterEqual(m.n, 15)
        lo, hi = m.predict_interval(10.0)
        self.assertLess(lo, hi)


class TestSAOCP(unittest.TestCase):
    def test_weights_sum_to_one(self):
        m = SAOCP()
        rng = np.random.default_rng(1)
        for t in range(40):
            y = float(np.sin(t / 8) + rng.normal(0, 0.2))
            m.update(y, float(np.sin(t / 8)))
        self.assertAlmostEqual(float(m.weights.sum()), 1.0, places=6)
        lo, hi = m.predict_interval(0.0)
        self.assertLess(lo, hi)


class TestCQR(unittest.TestCase):
    def test_residual_and_expand(self):
        self.assertEqual(quantile_residual(1.0, -1.0, 1.0), 0.0)
        self.assertEqual(quantile_residual(3.0, -1.0, 1.0), 2.0)
        m = ConformalQR()
        for i in range(20):
            m.update(float(i), float(i), q_lo=float(i) - 0.5, q_hi=float(i) + 0.5)
        # Every point falls exactly 0.5 inside its quantile band, so the
        # calibrated residual is -0.5: CQR correctly SHRINKS an overly wide
        # prior band, it does not only ever widen it.
        lo, hi = m.expand(-1.0, 1.0)
        self.assertAlmostEqual(lo, -0.5)
        self.assertAlmostEqual(hi, 0.5)
        self.assertGreater(lo, -1.0)
        self.assertLess(hi, 1.0)


class TestEValue(unittest.TestCase):
    def test_soft_rank_bounds(self):
        e = soft_rank_e(10.0, [0.0, 1.0, 2.0])
        self.assertGreater(e, 1.0)
        self.assertLessEqual(posthoc_alpha(e), 1.0)

    def test_conformal_p_exact_value(self):
        # 1 (for score itself) + 0 calibration points >= 10.0, over n+1=4.
        self.assertAlmostEqual(conformal_p(10.0, [0.0, 1.0, 2.0]), 0.25)
        # All 3 calibration points >= 0.0 (score), so ge = 1 + 3 = 4, over 4.
        self.assertAlmostEqual(conformal_p(0.0, [0.0, 1.0, 2.0]), 1.0)

    def test_covers_posthoc_uses_conformal_p_not_soft_rank_e(self):
        # Regression: covers_posthoc/posthoc_p must be calibrated against
        # conformal_p. Before this fix they were wired to the mean-ratio
        # soft_rank_e, which needs score >= ~10x the pool mean to ever flag
        # "not covered" at alpha=0.1 -- effectively never firing. An outlier
        # that is merely the largest of 20 calibration points (a genuinely
        # unusual score, not a 10x one) must still be flagged.
        m = EValueConformal(alpha=0.1)
        for i in range(20):
            m.update(float(i) * 0.01, 0.0)  # scores 0.00 .. 0.19
        outlier_score = 5.0  # far larger than any calibration score, not 10x the pool mean
        p = m.posthoc_p(outlier_score, 0.0)
        self.assertLessEqual(p, 0.1)
        self.assertFalse(m.covers_posthoc(outlier_score, 0.0))
        # A score consistent with calibration should not be flagged.
        typical_score = 0.1
        self.assertTrue(m.covers_posthoc(typical_score, 0.0))

    def test_covers_posthoc_flag_rate_matches_alpha(self):
        # The calibrated version should flag close to alpha of the time under
        # the exchangeability null, unlike the old e-based check (measured
        # ~0.0000 instead of ~0.1 -- see the conformal-lite fix commit).
        rng = np.random.default_rng(11)
        alpha = 0.1
        trials = 3000
        flagged = 0
        for _ in range(trials):
            m = EValueConformal(alpha=alpha)
            for s in np.abs(rng.normal(size=20)):
                m.update(float(s), 0.0)
            test_score = abs(float(rng.normal()))
            if not m.covers_posthoc(test_score, 0.0):
                flagged += 1
        rate = flagged / trials
        self.assertGreater(rate, 0.03)  # old wiring measured ~0.0000
        self.assertLess(rate, 0.20)

    def test_stream(self):
        m = EValueConformal()
        for i in range(20):
            m.update(float(i), float(i) + 0.2)
        self.assertTrue(m.n == 20)
        lo, hi = m.predict_interval(5.0)
        self.assertLess(lo, hi)


class TestFactory(unittest.TestCase):
    def test_modes(self):
        for mode in ("aci", "saocp", "cqr", "evalue"):
            m = make(mode)
            lo, hi = m.predict_interval(0.0)
            self.assertLess(lo, hi)

    def test_bad_mode(self):
        with self.assertRaises(ValueError):
            make("nope")


if __name__ == "__main__":
    unittest.main()
