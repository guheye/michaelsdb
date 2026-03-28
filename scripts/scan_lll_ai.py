#!/usr/bin/env python3
"""
Scan all 26^3 three-letter .ai domains (aaa.ai … zzz.ai) via whois.nic.ai.
Uses asyncio with a semaphore to cap concurrent WHOIS queries.
"""
from __future__ import annotations

import argparse
import asyncio
import string
import sys
import time
from collections import Counter
from pathlib import Path


def all_lll_ai() -> list[str]:
    lo = string.ascii_lowercase
    return [f"{a}{b}{c}.ai" for a in lo for b in lo for c in lo]


async def whois_status(domain: str, timeout: float) -> str:
    proc = await asyncio.create_subprocess_exec(
        "whois",
        "-h",
        "whois.nic.ai",
        domain,
        stdout=asyncio.subprocess.PIPE,
        stderr=asyncio.subprocess.PIPE,
    )
    try:
        stdout, stderr = await asyncio.wait_for(proc.communicate(), timeout=timeout)
    except asyncio.TimeoutError:
        proc.kill()
        await proc.wait()
        return "timeout"
    out = (stdout or b"") + (stderr or b"")
    text = out.decode("utf-8", errors="replace")
    if "Domain not found" in text:
        return "available"
    if "Domain Name:" in text:
        return "taken"
    return "unknown"


async def run(
    concurrency: int,
    timeout: float,
    out_path: Path | None,
    batch_size: int,
    retry_unknown: bool,
) -> tuple[list[str], dict[str, int]]:
    domains = all_lll_ai()
    sem = asyncio.Semaphore(concurrency)
    total = len(domains)
    t0 = time.perf_counter()

    async def one(d: str) -> tuple[str, str]:
        async with sem:
            status = await whois_status(d, timeout)
        return d, status

    results: list[tuple[str, str]] = []
    for i in range(0, total, batch_size):
        chunk = domains[i : i + batch_size]
        part = await asyncio.gather(*(one(d) for d in chunk))
        results.extend(part)
        done = len(results)
        elapsed = time.perf_counter() - t0
        rate = done / elapsed if elapsed > 0 else 0
        c = Counter(s for _, s in results)
        print(
            f"progress {done}/{total}  "
            f"avail={c.get('available', 0)} taken={c.get('taken', 0)} "
            f"unk={c.get('unknown', 0)} to={c.get('timeout', 0)}  ({rate:.1f}/s)",
            flush=True,
        )

    domain_status = {d: s for d, s in results}

    if retry_unknown:
        bad = [d for d, s in domain_status.items() if s in ("unknown", "timeout")]
        if bad:
            print(f"retrying {len(bad)} unknown/timeout (concurrency 24, 2x timeout)...", flush=True)
            sem2 = asyncio.Semaphore(24)

            async def retry_one(d: str) -> tuple[str, str]:
                async with sem2:
                    st = await whois_status(d, timeout * 2)
                return d, st

            retry_part = await asyncio.gather(*(retry_one(d) for d in bad))
            for d, new_s in retry_part:
                domain_status[d] = new_s

    counts = dict(Counter(domain_status.values()))
    available = sorted(d for d, s in domain_status.items() if s == "available")

    if out_path:
        out_path.write_text("\n".join(available) + ("\n" if available else ""), encoding="utf-8")
        print(f"wrote {len(available)} domains to {out_path}", flush=True)

    return available, counts


def main() -> None:
    p = argparse.ArgumentParser(description="Scan all LLL.ai domains via WHOIS")
    p.add_argument(
        "--concurrency",
        "-j",
        type=int,
        default=64,
        help="max concurrent whois queries (default: 64)",
    )
    p.add_argument(
        "--timeout",
        type=float,
        default=20.0,
        help="per-query timeout seconds (default: 20)",
    )
    p.add_argument(
        "--batch-size",
        type=int,
        default=2500,
        help="domains per asyncio.gather batch (default: 2500)",
    )
    p.add_argument(
        "--output",
        "-o",
        type=Path,
        default=Path(__file__).resolve().parent / "lll_ai_available.txt",
        help="write available domains to this file",
    )
    p.add_argument(
        "--no-retry",
        action="store_true",
        help="do not retry unknown/timeout responses",
    )
    args = p.parse_args()

    print(
        f"scanning {26**3} domains  concurrency={args.concurrency}  "
        f"timeout={args.timeout}s  batch={args.batch_size}",
        flush=True,
    )
    _available, counts = asyncio.run(
        run(
            concurrency=max(1, args.concurrency),
            timeout=args.timeout,
            out_path=args.output,
            batch_size=max(100, args.batch_size),
            retry_unknown=not args.no_retry,
        )
    )
    print("---", flush=True)
    for k in ("available", "taken", "unknown", "timeout"):
        if k in counts:
            print(f"{k}: {counts[k]}", flush=True)
    sys.exit(0)


if __name__ == "__main__":
    main()
