#!/usr/bin/env python3
"""Refuse a money-lane job unless the dollars clear.

A job passes only when expected revenue beats hard cash cost.
If the job claims to clear the calendar-day floor, the margin
has to clear that floor too. Time is not priced as cash.
Social-post income claims are not accepted as revenue.
"""

from __future__ import annotations

import json
import sys
from dataclasses import asdict, dataclass

DAY_FLOOR_USD = 300.0


@dataclass(frozen=True)
class Decision:
    verdict: str
    margin_usd: float
    reason: str
    counter: str


def decide(
    revenue_usd: float,
    cost_usd: float,
    claims_day_floor: bool = False,
    custom_before_payment: bool = False,
) -> Decision:
    """custom_before_payment is a design built by hand before any money arrives.

    The generator preview is cheap. A custom build before a deposit spends
    the day and can still be refused. That job gets a narrower offer.
    """
    if revenue_usd < 0 or cost_usd < 0:
        return Decision("STOP", 0.0, "revenue and cost must be zero or positive", "")
    margin = round(revenue_usd - cost_usd, 2)
    if margin <= 0:
        return Decision("STOP", margin, "hard cost eats the revenue", "Narrow the job until the margin is positive")
    if custom_before_payment:
        return Decision(
            "COUNTER",
            margin,
            "custom work starts before anyone pays",
            "Send the generator preview. Custom work starts at half down.",
        )
    if claims_day_floor and margin < DAY_FLOOR_USD:
        return Decision(
            "SLEEVE",
            margin,
            f"positive margin under the ${DAY_FLOOR_USD:.0f} day floor",
            "The day clears on a $350 kit. This stake does not.",
        )
    return Decision("DO", margin, "margin clears", "")


def _self_check() -> None:
    kit = decide(350, 0, claims_day_floor=True)
    assert kit.verdict == "DO" and kit.margin_usd == 350
    site = decide(600, 0, claims_day_floor=True)
    assert site.verdict == "DO" and site.margin_usd == 600
    custom = decide(600, 0, custom_before_payment=True)
    assert custom.verdict == "COUNTER" and "half down" in custom.counter
    nickel = decide(3.47, 0, claims_day_floor=True)
    assert nickel.verdict == "SLEEVE" and nickel.margin_usd == 3.47
    burn = decide(0, 100, claims_day_floor=False)
    assert burn.verdict == "STOP"
    paid_research = decide(0, 0.12, claims_day_floor=False)
    assert paid_research.verdict == "STOP"
    print("GATE_OK")
    print(json.dumps({
        "kit_350": asdict(kit),
        "charcuterie_600": asdict(site),
        "open_sofi_if_both_sells_fill": asdict(nickel),
        "hundred_dollar_api_night": asdict(burn),
    }, indent=2))


def main(argv: list[str]) -> int:
    if len(argv) == 1:
        _self_check()
        return 0
    payload = json.loads(argv[1])
    result = decide(
        float(payload["revenue_usd"]),
        float(payload["cost_usd"]),
        bool(payload.get("claims_day_floor", False)),
    )
    print(json.dumps(asdict(result)))
    return 0 if result.verdict != "STOP" else 2


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
