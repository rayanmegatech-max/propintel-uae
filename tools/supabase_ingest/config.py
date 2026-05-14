from __future__ import annotations

import json
import os
import re
from dataclasses import dataclass, field
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Iterable, Iterator, TypeVar

from supabase import Client, create_client


SUPABASE_URL_ENV = "SUPABASE_URL"
SUPABASE_SERVICE_ROLE_KEY_ENV = "SUPABASE_SERVICE_ROLE_KEY"
ENV_LOCAL_FILENAME = ".env.local"
PROJECT_ROOT = Path(__file__).resolve().parents[2]
EXPORT_BASE = PROJECT_ROOT / "exports" / "frontend"
SUPPORTED_COUNTRIES = ("uae", "ksa", "all")

T = TypeVar("T")


class SupabaseConfigError(RuntimeError):
    """Raised when required Supabase ingestion configuration is missing or invalid."""


@dataclass(frozen=True)
class SupabaseConfig:
    """
    Configuration for RASAD dashboard-safe Supabase delivery.

    The local PC remains the backend factory. Supabase is only the dashboard-safe
    delivery warehouse/API layer.

    This configuration is intentionally limited to the Supabase project URL and
    service role key required for delivery ingestion. It does not configure raw
    scraper vault ingestion, SQLite internal ingestion, or Phase 6 AI/vector data.

    The service role key must never be printed or logged. It is excluded from the
    dataclass representation, and the custom string representation only reports
    whether a key is configured.
    """

    url: str
    service_role_key: str = field(repr=False)

    @classmethod
    def from_environment(cls) -> "SupabaseConfig":
        """
        Load Supabase configuration from environment variables.

        Real environment variables take priority. If a required value is not set
        there, simple KEY=VALUE lines from .env.local are used as a fallback when
        the file exists.
        """
        env_local_values = _load_env_local_values()

        url = _required_config_value(SUPABASE_URL_ENV, env_local_values)
        service_role_key = _required_config_value(
            SUPABASE_SERVICE_ROLE_KEY_ENV,
            env_local_values,
        )

        config = cls(url=url, service_role_key=service_role_key)
        config.validate()

        return config

    def __repr__(self) -> str:
        key_status = "configured" if self.service_role_key else "missing"
        return (
            f"{self.__class__.__name__}("
            f"url={self.url!r}, "
            f"service_role_key={key_status!r}"
            ")"
        )

    def __str__(self) -> str:
        return repr(self)

    def validate(self) -> None:
        """Validate required Supabase configuration values."""
        if not self.url.startswith(("https://", "http://")):
            raise SupabaseConfigError(
                f"{SUPABASE_URL_ENV} must start with https:// or http://."
            )

        if len(self.service_role_key) < 20:
            raise SupabaseConfigError(
                f"{SUPABASE_SERVICE_ROLE_KEY_ENV} appears to be invalid or incomplete."
            )

    def create_client(self) -> Client:
        """Create a Supabase client using the configured service role key."""
        return create_client(self.url, self.service_role_key)


def utc_now_iso() -> str:
    """Return the current UTC timestamp in ISO 8601 format with a trailing Z."""
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace(
        "+00:00",
        "Z",
    )


def require_country(value: str) -> str:
    """
    Normalize and validate a supported RASAD country key.

    Supabase ingestion is limited to dashboard-safe UAE, KSA, and all-country
    delivery outputs. This helper prevents accidental ingestion under unsupported
    country scopes.

    Args:
        value: Country key to validate. Accepted values are uae, ksa, and all,
            case-insensitive.

    Returns:
        The normalized lowercase country key.

    Raises:
        ValueError: If the value is empty or is not one of the supported countries.
    """
    normalized = value.strip().lower()

    if normalized in SUPPORTED_COUNTRIES:
        return normalized

    supported = ", ".join(SUPPORTED_COUNTRIES)
    raise ValueError(f"Unsupported country {value!r}. Expected one of: {supported}.")


def expand_countries(value: str) -> list[str]:
    """
    Expand a supported country argument into real country keys.

    Args:
        value: Country key to validate. Accepted values are uae, ksa, and all,
            case-insensitive.

    Returns:
        ["uae"] for uae, ["ksa"] for ksa, and ["uae", "ksa"] for all.
    """
    country = require_country(value)

    if country == "all":
        return ["uae", "ksa"]

    return [country]


def get_country_export_dir(country: str) -> Path:
    """
    Return the dashboard-safe frontend export directory for a real country.

    The returned path is scoped under EXPORT_BASE and only supports real country
    folders accepted by require_country(): uae and ksa. The aggregate country key
    all must be expanded with expand_countries() before resolving export folders.
    This keeps Supabase ingestion pointed at the approved delivery export area,
    not raw scraper vaults, SQLite internals, Phase 6 AI/vector data, or a
    non-existent exports/frontend/all folder.

    Args:
        country: Country key to validate. Accepted values are uae and ksa,
            case-insensitive.

    Returns:
        Path to the country-specific frontend export directory.

    Raises:
        ValueError: If country is all.
    """
    normalized_country = require_country(country)

    if normalized_country == "all":
        raise ValueError(
            "'all' must be expanded with expand_countries() before resolving export folders."
        )

    return EXPORT_BASE / normalized_country


def make_run_id(prefix: str, country: str) -> str:
    """
    Create a safe ingestion run ID.

    The run ID is intended for local-to-Supabase dashboard-safe delivery runs.
    It includes a normalized prefix, a supported country code, and a compact UTC
    timestamp.

    Example:
        recon_uae_20260114T153022Z
    """
    normalized_prefix = _normalize_run_id_part(prefix, "prefix")
    normalized_country = require_country(country)
    timestamp = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ")

    return f"{normalized_prefix}_{normalized_country}_{timestamp}"


def read_json(path: str | Path) -> Any:
    """
    Read and parse a JSON file.

    This helper is intended for dashboard-safe frontend export files under the
    local backend factory workflow. It does not print the path, file contents, or
    any parsed values.

    Args:
        path: JSON file path to read.

    Returns:
        Parsed JSON content.
    """
    json_path = Path(path)

    with json_path.open("r", encoding="utf-8") as json_file:
        return json.load(json_file)


def load_env_file(path: str | Path) -> dict[str, str]:
    """
    Load simple KEY=VALUE pairs from an env file.

    The parser is intentionally small and safe:
    - missing files return an empty dictionary
    - blank lines are ignored
    - lines beginning with # are ignored
    - KEY=VALUE lines are parsed
    - optional matching single or double quotes around VALUE are removed
    - shell expansion, interpolation, export syntax, and multiline values are not supported

    This function does not mutate os.environ and does not print any values.
    """
    env_path = Path(path)

    if not env_path.is_file():
        return {}

    values: dict[str, str] = {}

    with env_path.open("r", encoding="utf-8") as env_file:
        for raw_line in env_file:
            parsed = _parse_env_local_line(raw_line)
            if parsed is None:
                continue

            key, value = parsed
            values[key] = value

    return values


def chunked(items: Iterable[T], size: int) -> Iterator[list[T]]:
    """
    Yield items in fixed-size list chunks.

    This helper is intended for safe Supabase batch writes from dashboard-ready
    exports. It does not inspect, log, or print item contents.

    Args:
        items: Any iterable of items to split into chunks.
        size: Maximum number of items per chunk. Must be greater than zero.

    Yields:
        Lists containing up to size items.

    Raises:
        ValueError: If size is less than one.
    """
    if size < 1:
        raise ValueError("chunk size must be greater than zero")

    batch: list[T] = []

    for item in items:
        batch.append(item)

        if len(batch) >= size:
            yield batch
            batch = []

    if batch:
        yield batch


def _normalize_run_id_part(value: str, label: str) -> str:
    normalized = re.sub(r"[^a-z0-9]+", "_", value.strip().lower()).strip("_")

    if not normalized:
        raise ValueError(f"run ID {label} must contain at least one letter or number")

    return normalized


def _candidate_env_local_paths() -> list[Path]:
    """
    Return likely .env.local locations.

    This supports running ingestion commands either from the repository root or
    from inside tools/supabase_ingest.
    """
    paths = [
        Path.cwd() / ENV_LOCAL_FILENAME,
        PROJECT_ROOT / ENV_LOCAL_FILENAME,
    ]

    unique_paths: list[Path] = []
    seen: set[Path] = set()

    for path in paths:
        resolved = path.resolve()
        if resolved not in seen:
            seen.add(resolved)
            unique_paths.append(resolved)

    return unique_paths


def _load_env_local_values() -> dict[str, str]:
    """
    Load simple KEY=VALUE pairs from .env.local if present.

    Values from the first discovered .env.local path take priority over values
    from later discovered paths.
    """
    values: dict[str, str] = {}

    for path in _candidate_env_local_paths():
        env_file_values = load_env_file(path)

        for key, value in env_file_values.items():
            values.setdefault(key, value)

    return values


def _parse_env_local_line(line: str) -> tuple[str, str] | None:
    stripped = line.strip()

    if not stripped or stripped.startswith("#"):
        return None

    if "=" not in stripped:
        return None

    key, value = stripped.split("=", 1)
    key = key.strip()
    value = value.strip()

    if not key:
        return None

    if (
        len(value) >= 2
        and value[0] == value[-1]
        and value.startswith(("'", '"'))
    ):
        value = value[1:-1]

    return key, value


def _required_config_value(name: str, env_local_values: dict[str, str]) -> str:
    value = os.environ.get(name)

    if value is not None and value.strip():
        return value.strip()

    env_local_value = env_local_values.get(name)

    if env_local_value is not None and env_local_value.strip():
        return env_local_value.strip()

    raise SupabaseConfigError(
        f"Missing required environment variable: {name}."
    )


def load_config() -> SupabaseConfig:
    """Load and validate Supabase ingestion configuration."""
    return SupabaseConfig.from_environment()


def get_supabase_client() -> Client:
    """Create a configured Supabase client for dashboard-safe delivery ingestion."""
    return load_config().create_client()
