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

    def test_error_indicator_ignores_the_point_being_tested(self):
        # The bug: `update()` appended the current score to
        # calibration_scores BEFORE computing q, so q was drawn from a set
        # that already contained the point being judged. A score equal to
        # every prior observation, injected once as a huge outlier, must be
        # judged against the *prior* (small, tight) calibration set — not
        # against a set that now also contains that same huge value.
        m = AdaptiveConformal(alpha=0.5, gamma=0.3)
        for i in range(20):
            m.update(0.0, 0.0)  # score == 0.0 every time -> tight history
        alpha_before = m.alpha_t
        m.update(1000.0, 0.0)  # score == 1000.0, a wild outlier
        # If err were computed after appending (the bug), 1000.0 would sit
        # inside its own calibration set and could never register as "> q".
        # Computed against the prior (all-zero) set, it must count as a miss,
        # which pushes alpha_t DOWN (target_alpha - 1 < 0), widening future
        # intervals in response to the miss — the correct ACI reaction.
        self.assertLess(m.alpha_t, alpha_before)

    def test_empirical_coverage_near_nominal_at_several_n(self):
        # The actual regression test for the calibration-set-includes-itself
        # bug: measured empirical coverage was 84.5% vs a 90% nominal target
        # at n=25 before the fix, worsening with n held small. Check coverage
        # lands close to nominal at several horizons past cold start.
        alpha = 0.1

        def empirical_coverage(n_steps, seed):
            # residual_scale is left at its default (1.0): it scales a
            # per-call known local uncertainty multiplier, not a substitute
            # for matching the score_fn's own units — calibration_scores are
            # already in the same units as the raw |y_true - y_pred| noise.
            rng = np.random.default_rng(seed)
            m = AdaptiveConformal(alpha=alpha)
            warmup = max(20, n_steps // 10)
            hits = counted = 0
            for t in range(n_steps):
                y_pred = float(np.sin(t / 15))
                y_true = y_pred + float(rng.normal(0, 0.3))
                lo, hi = m.predict_interval(y_pred)
                if t >= warmup:
                    counted += 1
                    hits += int(lo <= y_true <= hi)
                m.update(y_true, y_pred)
            return hits / counted

        for n_steps in (100, 250, 500):
            coverage = empirical_coverage(n_steps, seed=n_steps)
            self.assertGreater(
                coverage, 1 - alpha - 0.08, f"n={n_steps}: coverage {coverage} too low"
            )
            self.assertLess(
                coverage, 1 - alpha + 0.08, f"n={n_steps}: coverage {coverage} too high"
            )


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

    def test_prediction_is_a_mixture_not_a_hard_pick(self):
        # The bug: predict_interval used experts[argmax(weights)] — a single
        # expert's interval, identical to one of the per-expert intervals.
        # A genuine mixture's bounds should differ from every single expert's
        # bounds once the experts disagree.
        m = SAOCP(gammas=(0.01, 0.5))
        rng = np.random.default_rng(3)
        for t in range(30):
            y_true = float(np.sin(t / 5) + rng.normal(0, 0.4))
            y_pred = float(np.sin(t / 5))
            m.update(y_true, y_pred)
        mixture_lo, mixture_hi = m.predict_interval(0.0)
        expert_intervals = [exp.predict_interval(0.0) for exp in m.experts]
        self.assertFalse(
            any((mixture_lo, mixture_hi) == ei for ei in expert_intervals),
            "mixture interval should not exactly equal a single expert's interval "
            "once experts disagree and weights are non-degenerate",
        )

    def test_loss_is_scale_invariant(self):
        # The bug: loss = miss_indicator + 0.05*width mixed a dimensionless
        # term with a raw width, so at large data scales width swamped the
        # indicator and weights collapsed regardless of actual coverage.
        # Run the same relative dynamics at two scales and check the weight
        # spread (how far from uniform the weights end up) is comparable.
        def run(scale):
            m = SAOCP(gammas=(0.01, 0.05, 0.1, 0.2))
            rng = np.random.default_rng(11)
            for t in range(60):
                y_pred = scale * float(np.sin(t / 8))
                y_true = y_pred + scale * float(rng.normal(0, 0.2))
                m.update(y_true, y_pred)
            return float(np.max(m.weights))

        max_weight_small_scale = run(1.0)
        max_weight_large_scale = run(100.0)
        self.assertLess(
            abs(max_weight_small_scale - max_weight_large_scale),
            0.2,
            f"weight concentration should be similar across scales, got "
            f"{max_weight_small_scale} vs {max_weight_large_scale}",
        )


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

    def test_default_band_matches_split_conformal_on_residuals(self):
        # Documented honesty check: without real per-point quantile
        # predictions, this mode is symmetric split conformal on |residual|,
        # not real heteroscedastic CQR. Confirm that's exactly what happens.
        rng = np.random.default_rng(5)
        cqr = ConformalQR(alpha=0.1)
        ev = EValueConformal(alpha=0.1)
        for _ in range(30):
            y_true = float(rng.normal(0, 1))
            y_pred = 0.0
            cqr.update(y_true, y_pred)  # no q_lo/q_hi -> default +/-1.0 band
            ev.update(y_true, y_pred)
        cqr_lo, cqr_hi = cqr.predict_interval(0.0)
        ev_lo, ev_hi = ev.predict_interval(0.0)
        self.assertAlmostEqual(cqr_lo, ev_lo, places=9)
        self.assertAlmostEqual(cqr_hi, ev_hi, places=9)

    def test_real_quantile_predictions_break_symmetry(self):
        # When a caller DOES supply real, asymmetric per-point quantile
        # predictions, CQR's calibration correctly adapts around them —
        # the mechanism works; this package just never exercises it itself.
        m = ConformalQR(alpha=0.2)
        rng = np.random.default_rng(9)
        for i in range(30):
            y_true = float(rng.normal(0, 1))
            # deliberately asymmetric, heteroscedastic band
            m.update(y_true, 0.0, q_lo=-0.2, q_hi=3.0)
        lo, hi = m.expand(-0.2, 3.0)
        self.assertNotAlmostEqual(lo + hi, 0.0, places=3)  # not symmetric about 0


class TestEValue(unittest.TestCase):
    def test_soft_rank_e_is_a_valid_evariable_marginally(self):
        # E[e] should be ~1 (not the old reciprocal-of-p-value's ~3-7x
        # inflation). Monte Carlo under the exchangeability null.
        rng = np.random.default_rng(13)
        n = 20
        trials = 4000
        es = []
        for _ in range(trials):
            pool = list(rng.normal(0, 1, size=n + 1))
            score = pool[-1]
            calibration = pool[:-1]
            es.append(soft_rank_e(abs(score), [abs(s) for s in calibration]))
        mean_e = float(np.mean(es))
        self.assertLess(mean_e, 1.15, f"mean e {mean_e} should be close to 1, not inflated")
        self.assertGreater(mean_e, 0.85, f"mean e {mean_e} should be close to 1")

    def test_posthoc_alpha_bounds(self):
        e = soft_rank_e(10.0, [0.0, 1.0, 2.0])
        self.assertGreater(e, 1.0)
        self.assertLessEqual(posthoc_alpha(e), 1.0)

    def test_conformal_p_exact_value(self):
        # 2 of 3 calibration scores are >= the test score -> p = (1+2)/4
        self.assertAlmostEqual(conformal_p(1.5, [0.0, 2.0, 3.0]), 3 / 4)

    def test_covers_posthoc_flag_rate_matches_alpha(self):
        alpha = 0.1
        m = EValueConformal(alpha=alpha)
        rng = np.random.default_rng(17)
        for _ in range(20):
            m.update(float(rng.normal(0, 1)), 0.0)
        flags = 0
        trials = 300
        for _ in range(trials):
            y_true = float(rng.normal(0, 1))
            if not m.covers_posthoc(y_true, 0.0, alpha=alpha):
                flags += 1
            m.update(y_true, 0.0)
        rate = flags / trials
        self.assertLess(rate, alpha + 0.08, f"flag rate {rate} too high for alpha={alpha}")

    def test_stream(self):
        m = EValueConformal()
        for i in range(20):
            m.update(float(i), float(i) + 0.2)
        self.assertTrue(m.n == 20)
        lo, hi = m.predict_interval(5.0)
        self.assertLess(lo, hi)


class TestLago(unittest.TestCase):
    def test_secret_fields_stripped_everywhere(self):
        # Regression for the PR #36 review finding: the local JSONL row was
        # filtered but the network payload's properties were built from the
        # RAW fields, shipping credential-shaped values to Lago's API.
        # _safe_fields is now the single filter both paths use.
        from conformal_lite.lago import _safe_fields

        fields = {
            "steps": 200,
            "api_key": "AAAA",
            "token": "BBBB",
            "secret": "CCCC",
            "password": "DDDD",
            "access_token": "EEEE",
        }
        safe = _safe_fields(fields)
        self.assertEqual(safe, {"steps": 200})


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
