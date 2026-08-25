import math
import unittest

from conformal_lite.adaptive_cp import AdaptiveConformal
from conformal_lite.core import make
from conformal_lite.cqr import ConformalQR, quantile_residual
from conformal_lite.evalue import EValueConformal, posthoc_alpha, soft_rank_e
from conformal_lite.quantiles import conformal_quantile
from conformal_lite.saocp import SAOCP


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
        for i in range(30):
            m.update(float(i % 5), float(i % 5) + 0.2)
        self.assertAlmostEqual(float(m.weights.sum()), 1.0, places=6)


class TestCQR(unittest.TestCase):
    def test_residual_and_expand(self):
        # Standard CQR score (Romano et al. 2019): max(q_lo - y, y - q_hi).
        # Negative inside the interval so calibration can SHRINK wide bands.
        self.assertEqual(quantile_residual(0.0, -1.0, 1.0), -1.0)
        self.assertEqual(quantile_residual(2.0, -1.0, 1.0), 1.0)
        self.assertEqual(quantile_residual(-3.0, -1.0, 1.0), 2.0)
        m = ConformalQR(alpha=0.1)
        for i in range(30):
            m.update(float(i % 3), float(i % 3) + 0.1)
        lo, hi = m.predict_interval(1.0)
        self.assertLess(lo, hi)


class TestEValue(unittest.TestCase):
    def test_soft_rank_bounds(self):
        cal = [1.0, 2.0, 3.0, 4.0]
        e_small = soft_rank_e(0.5, cal)
        e_big = soft_rank_e(10.0, cal)
        self.assertLessEqual(e_small, e_big)
        self.assertAlmostEqual(posthoc_alpha(e_big), 1.0 / e_big)

    def test_stream(self):
        m = EValueConformal(alpha=0.1)
        for i in range(25):
            m.update(float(i % 4), float(i % 4) + 0.05)
        lo, hi = m.predict_interval(2.0)
        self.assertLess(lo, hi)


class TestConformalQuantile(unittest.TestCase):
    def test_order_statistic(self):
        # n=9, alpha=0.1 -> rank ceil(10*0.9)=9 -> the 9th smallest (max)
        scores = [float(i) for i in range(1, 10)]
        self.assertEqual(conformal_quantile(scores, 0.1), 9.0)
        # n=19, alpha=0.1 -> rank ceil(20*0.9)=18 -> 18th smallest
        scores = [float(i) for i in range(1, 20)]
        self.assertEqual(conformal_quantile(scores, 0.1), 18.0)

    def test_insufficient_n_is_honest(self):
        # n=10, alpha=0.05 -> rank ceil(11*0.95)=11 > 10 -> unbounded
        scores = [float(i) for i in range(10)]
        self.assertTrue(math.isinf(conformal_quantile(scores, 0.05)))
        self.assertTrue(math.isinf(conformal_quantile([], 0.1)))


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
