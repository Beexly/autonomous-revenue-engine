import unittest

import numpy as np

from adaptive_cp import AdaptiveConformal
from core import make
from cqr import ConformalQR, quantile_residual
from evalue import EValueConformal, posthoc_alpha, soft_rank_e
from saocp import SAOCP


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
        self.assertEqual(quantile_residual(0.0, -1.0, 1.0), 0.0)
        self.assertEqual(quantile_residual(3.0, -1.0, 1.0), 2.0)
        m = ConformalQR()
        for i in range(20):
            m.update(float(i), float(i) - 0.5, float(i) + 0.5)
        lo, hi = m.expand(-1.0, 1.0)
        self.assertLessEqual(lo, -1.0)
        self.assertGreaterEqual(hi, 1.0)


class TestEValue(unittest.TestCase):
    def test_soft_rank_bounds(self):
        e = soft_rank_e(10.0, [0.0, 1.0, 2.0])
        self.assertGreater(e, 1.0)
        self.assertLessEqual(posthoc_alpha(e), 1.0)

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
