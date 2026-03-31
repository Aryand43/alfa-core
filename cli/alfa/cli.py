"""ALFA DELFA CLI — wrap any shell command and track it as a run."""

from __future__ import annotations

import json
import os
import subprocess
import time
from datetime import datetime, timezone
from pathlib import Path

import click

from . import __version__
from .client import create_run, login, update_run


def _git_commit() -> str:
    try:
        return subprocess.check_output(
            ["git", "rev-parse", "HEAD"], stderr=subprocess.DEVNULL
        ).decode().strip()
    except Exception:
        return ""


@click.group()
@click.version_option(__version__, prog_name="alfa")
def cli():
    """ALFA DELFA — experiment tracking CLI."""


@cli.command()
@click.option("--email", prompt=True)
@click.option("--password", prompt=True, hide_input=True)
def auth(email: str, password: str):
    """Authenticate and print a bearer token."""
    token = login(email, password)
    click.echo(f"\nToken (export as ALFA_TOKEN):\n{token}")


@cli.command()
@click.option("--project", "project_id", required=True, envvar="ALFA_PROJECT_ID",
              help="Project ID (or set ALFA_PROJECT_ID).")
@click.option("--metrics-file", default=None, type=click.Path(),
              help="Optional path to a JSON metrics file produced by the command.")
@click.argument("command", nargs=-1, required=True)
def run(project_id: str, metrics_file: str | None, command: tuple[str, ...]):
    """Run a command and track it as an experiment run.

    Usage: alfa run --project <id> -- <command ...>
    """
    cmd_str = " ".join(command)
    commit = _git_commit()

    click.echo(f"Creating run for project {project_id} ...")
    run_data = create_run(project_id, cmd_str, commit)
    run_id = run_data["id"]
    click.echo(f"Run {run_id} created (status: pending)")

    started = datetime.now(timezone.utc).isoformat()
    update_run(run_id, {"status": "running", "started_at": started})
    click.echo(f"Executing: {cmd_str}")

    t0 = time.time()
    result = subprocess.run(cmd_str, shell=True)
    elapsed = time.time() - t0
    finished = datetime.now(timezone.utc).isoformat()

    status = "completed" if result.returncode == 0 else "failed"

    metrics: str | None = None
    if metrics_file and Path(metrics_file).exists():
        metrics = Path(metrics_file).read_text()

    update_run(run_id, {
        "status": status,
        "finished_at": finished,
        **({"metrics": metrics} if metrics else {}),
    })
    click.echo(f"Run {run_id} {status} in {elapsed:.1f}s (exit code {result.returncode})")


def main():
    cli()


if __name__ == "__main__":
    main()
