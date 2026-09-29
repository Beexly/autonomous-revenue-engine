"""
Pricing invariant tests — stdlib only.

These must never be deleted or weakened. They encode the reason `lead-engine`
exists: **a client cannot supply a price.** They deliberately use `unittest`
rather than `pytest` so the critical invariants run on a bare Python 3.12
interpreter with no installed dependencies.

Run:
    python -m unittest discover -s tests -v
"""

from __future__ import annotations

import inspect
import unittest

from app.config import (
    CATALOG,
    DEPOSIT_RATE,
    MAX_GUESTS,
    MIN_GUESTS,
    PRODUCT_KEYS,
    UNPRICED_PRODUCTS,
    catalog_fingerprint,
)
from app.pricing import PricingError, QuoteLine, format_deposit, format_usd, quote


class TestClientCannotSetPrice(unittest.TestCase):
    """The defect this suite exists to prevent."""

    def test_quote_is_deterministic(self):
        a = quote(80, "super-graze")
        b = quote(80, "super-graze")
        self.assertEqual(a.total_cents, b.total_cents)
        self.assertEqual(a.deposit_cents, b.deposit_cents)

    def test_quote_signature_has_no_amount_parameter(self):
        params = inspect.signature(quote).parameters
        for banned in ("amount", "total", "price", "deposit", "amount_due"):
            self.assertNotIn(banned, params)

    def test_total_derived_from_catalog(self):
        self.assertEqual(CATALOG["super-graze"].price_per_person_cents, 3000)
        self.assertEqual(quote(80, "super-graze").total_cents, 80 * 3000)


class TestPublishedCatalog(unittest.TestCase):
    def test_four_per_person_tiers(self):
        self.assertEqual(CATALOG["graze-me"].price_per_person_cents, 2400)
        self.assertEqual(CATALOG["standard"].price_per_person_cents, 2600)
        self.assertEqual(CATALOG["super-graze"].price_per_person_cents, 3000)
        self.assertEqual(CATALOG["grand-graze"].price_per_person_cents, 3800)

    def test_holy_grail_is_a_fifth_table_not_an_addon(self):
        grail = CATALOG["holy-grail"]
        self.assertFalse(grail.is_per_person)
        self.assertEqual(grail.fixed_prices_cents, {75: 200_000, 150: 350_000})
        self.assertEqual(grail.included_guests, (75, 150))

    def test_exactly_five_published_tables(self):
        self.assertEqual(len(CATALOG), 5)
        self.assertEqual(len(PRODUCT_KEYS), 5)

    def test_money_is_never_a_float(self):
        for product in CATALOG.values():
            if product.price_per_person_cents is not None:
                self.assertIsInstance(product.price_per_person_cents, int)
            for cents in product.fixed_prices_cents.values():
                self.assertIsInstance(cents, int)

    def test_compositions_match_published_copy(self):
        self.assertIn("Two sliders, meat and cheese", CATALOG["graze-me"].composition)
        self.assertIn("pasta salad and chips", CATALOG["standard"].composition)
        self.assertIn("full vegetable spread", CATALOG["super-graze"].composition)
        self.assertIn("mini pudding cups", CATALOG["grand-graze"].composition)
        self.assertIn("Five cheeses, five meats", CATALOG["holy-grail"].composition)

    def test_fingerprint_is_stable(self):
        self.assertEqual(catalog_fingerprint(), catalog_fingerprint())
        self.assertEqual(len(catalog_fingerprint()), 12)


class TestPerPersonQuotes(unittest.TestCase):
    def test_totals(self):
        cases = [
            (50, "graze-me", 50 * 2400),
            (80, "standard", 80 * 2600),
            (100, "super-graze", 100 * 3000),
            (150, "grand-graze", 150 * 3800),
            (MIN_GUESTS, "graze-me", MIN_GUESTS * 2400),
            (MAX_GUESTS, "grand-graze", MAX_GUESTS * 3800),
        ]
        for guests, key, expected in cases:
            with self.subTest(guests=guests, key=key):
                self.assertEqual(quote(guests, key).total_cents, expected)

    def test_deposit_is_half(self):
        q = quote(80, "super-graze")
        self.assertEqual(q.deposit_cents, int(round(q.total_cents * DEPOSIT_RATE)))
        self.assertEqual(q.deposit_cents, 120_000)

    def test_deposit_never_exceeds_total(self):
        for key in ("graze-me", "standard", "super-graze", "grand-graze"):
            for guests in (50, 75, 100, 150):
                with self.subTest(key=key, guests=guests):
                    q = quote(guests, key)
                    self.assertGreater(q.deposit_cents, 0)
                    self.assertLessEqual(q.deposit_cents, q.total_cents)


class TestHolyGrailBands(unittest.TestCase):
    def test_exact_band(self):
        self.assertEqual(quote(75, "holy-grail").total_cents, 200_000)
        self.assertEqual(quote(150, "holy-grail").total_cents, 350_000)

    def test_underband_seats_up_to_published_band(self):
        q = quote(60, "holy-grail")
        self.assertEqual(q.guests, 75)
        self.assertEqual(q.total_cents, 200_000)

    def test_midband_seats_up(self):
        q = quote(100, "holy-grail")
        self.assertEqual(q.guests, 150)
        self.assertEqual(q.total_cents, 350_000)

    def test_above_largest_band_refused_not_invented(self):
        with self.assertRaises(PricingError) as ctx:
            quote(200, "holy-grail")
        self.assertIn("Contact Tricia", str(ctx.exception))

    def test_grail_deposit(self):
        self.assertEqual(quote(75, "holy-grail").deposit_cents, 100_000)
        self.assertEqual(quote(150, "holy-grail").deposit_cents, 175_000)


class TestGuestValidation(unittest.TestCase):
    def test_below_published_minimum_refused(self):
        for guests in (0, 1, 24, 49):
            with self.subTest(guests=guests):
                with self.assertRaises(PricingError):
                    quote(guests, "graze-me")

    def test_above_published_maximum_refused(self):
        for guests in (151, 500, 10_000):
            with self.subTest(guests=guests):
                with self.assertRaises(PricingError):
                    quote(guests, "graze-me")

    def test_unknown_product_refused(self):
        with self.assertRaises(PricingError):
            quote(80, "not-a-real-table")

    def test_unpriced_products_cannot_be_quoted(self):
        """The cart and champagne cascade are named but not priced. Hide, never invent."""
        self.assertTrue(UNPRICED_PRODUCTS)
        for key in UNPRICED_PRODUCTS:
            with self.subTest(key=key):
                with self.assertRaises(PricingError):
                    quote(80, key)


class TestMoneyFormatting(unittest.TestCase):
    def test_usd(self):
        self.assertEqual(format_usd(240_000), "$2,400")
        self.assertEqual(format_usd(2400), "$24")

    def test_deposit(self):
        self.assertEqual(format_deposit(120_000), "$1,200")
        self.assertEqual(format_deposit(12_050), "$120.50")

    def test_line_math_is_int(self):
        line = QuoteLine("test", 80, 3000)
        self.assertEqual(line.total_cents, 240_000)
        self.assertIsInstance(line.total_cents, int)


class TestSecurityRegression(unittest.TestCase):
    """A forged price cannot be expressed in the request model at all."""

    def test_inquire_schema_has_no_money_fields(self):
        try:
            from app.main import InquireRequest
        except ImportError:
            self.skipTest("fastapi/pydantic not installed — covered by test_request_model.py")
        forbidden = {"amount", "total", "total_amount", "price", "deposit", "amount_due"}
        self.assertFalse(set(InquireRequest.model_fields) & forbidden)

    def test_inquire_rejects_extra_fields(self):
        try:
            from app.main import InquireRequest
            from pydantic import ValidationError
        except ImportError:
            self.skipTest("fastapi/pydantic not installed — covered by test_request_model.py")

        with self.assertRaises(ValidationError):
            InquireRequest(
                name="Test",
                phone="8324588180",
                event_date="2026-09-12",
                guests=80,
                product="super-graze",
                total_amount=100,
            )

    def test_honeypot_field_present(self):
        try:
            from app.main import InquireRequest
        except ImportError:
            self.skipTest("fastapi/pydantic not installed — covered by test_request_model.py")
        self.assertIn("website", InquireRequest.model_fields)


if __name__ == "__main__":
    unittest.main()
