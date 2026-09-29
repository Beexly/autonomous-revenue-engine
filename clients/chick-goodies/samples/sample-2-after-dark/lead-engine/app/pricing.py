"""
Server-side price authority.

This module exists because of a critical defect in the original handler: the
client posted `total_amount` and the deposit was computed from it. Anyone could
POST a total of $100 and generate a $50 checkout link.

The rule now: **a client sends guests, product and date. Nothing else.** Every
figure below is derived here, in integer cents, from `config.CATALOG`.

Money is never a float anywhere in this package.
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import Any

from .config import (
    CATALOG,
    DEPOSIT_RATE,
    MAX_GUESTS,
    MIN_GUESTS,
    Product,
    catalog_fingerprint,
)


class PricingError(ValueError):
    """Raised when a quote cannot be produced from the published catalog."""


@dataclass(frozen=True)
class QuoteLine:
    description: str
    quantity: int
    unit_amount_cents: int

    @property
    def total_cents(self) -> int:
        return self.quantity * self.unit_amount_cents


@dataclass(frozen=True)
class Quote:
    """A fully server-computed quote. The only source of truth for money."""

    guests: int
    product_key: str
    product_name: str
    composition: str
    lines: tuple[QuoteLine, ...]
    total_cents: int
    deposit_cents: int
    currency: str = "usd"
    catalog_version: str = ""

    def to_public_dict(self) -> dict[str, Any]:
        return {
            "guests": self.guests,
            "product": self.product_key,
            "product_name": self.product_name,
            "composition": self.composition,
            "lines": [
                {
                    "description": line.description,
                    "quantity": line.quantity,
                    "unit_amount_cents": line.unit_amount_cents,
                    "total_cents": line.total_cents,
                }
                for line in self.lines
            ],
            "total_cents": self.total_cents,
            "deposit_cents": self.deposit_cents,
            "currency": self.currency,
            "catalog_version": self.catalog_version,
        }


def _deposit(total_cents: int) -> int:
    """50% deposit, rounded to the nearest cent, as an int."""
    return int(round(total_cents * DEPOSIT_RATE))


def _resolve_guests(product: Product, guests: int) -> int:
    """Per-person products honour the requested headcount.

    Fixed products (the Holy Grail) are published at specific headcounts. If the
    guest asks for a count the product does not cover, we quote the smallest
    published band that seats them rather than silently under-feeding the room.
    """
    if product.included_guests:
        if guests in product.included_guests:
            return guests
        for band in sorted(product.included_guests):
            if guests <= band:
                return band
        # Above the largest published band: the kitchen confirms capacity
        # directly. Do not invent a price.
        raise PricingError(
            f"{product.name} is published for "
            f"{', '.join(str(b) for b in sorted(product.included_guests))} guests. "
            "Contact Tricia directly for larger parties."
        )

    if not (MIN_GUESTS <= guests <= MAX_GUESTS):
        raise PricingError(
            f"Grazing tables are published for {MIN_GUESTS} to {MAX_GUESTS} guests. "
            f"Received {guests}."
        )
    return guests


def quote(guests: int, product_key: str) -> Quote:
    """Build a quote. The only function permitted to produce a price.

    Args:
        guests: headcount the host entered.
        product_key: a key from `config.CATALOG`.

    Raises:
        PricingError: unknown product, or headcount outside published bands.
    """
    product = CATALOG.get(product_key)
    if product is None:
        raise PricingError(f"Unknown product '{product_key}'.")

    seated = _resolve_guests(product, guests)

    if product.is_per_person:
        assert product.price_per_person_cents is not None
        line = QuoteLine(
            description=f"{product.name} — per person",
            quantity=seated,
            unit_amount_cents=product.price_per_person_cents,
        )
    else:
        # Fixed-band product: price is published per headcount band.
        band = min(product.fixed_prices_cents, key=lambda b: abs(b - seated))
        unit = product.fixed_prices_cents[band]
        line = QuoteLine(
            description=f"{product.name} — {band} guests",
            quantity=1,
            unit_amount_cents=unit,
        )

    total = line.total_cents
    if total <= 0:
        raise PricingError("Refusing to quote a non-positive total.")

    return Quote(
        guests=seated,
        product_key=product.key,
        product_name=product.name,
        composition=product.composition,
        lines=(line,),
        total_cents=total,
        deposit_cents=_deposit(total),
        catalog_version=catalog_fingerprint(),
    )


def format_usd(cents: int) -> str:
    """$1,200 — used in SMS and email bodies. Integer cents, no float drift."""
    return f"${cents / 100:,.0f}"


def format_deposit(cents: int) -> str:
    """Deposits are whole dollars in practice; round to cents if not."""
    if cents % 100 == 0:
        return f"${cents // 100:,}"
    return f"${cents / 100:,.2f}"
