"""ALFA DELFA CLI - wrap any shell command and track it as a run."""

from __future__ import annotations

import json
import os
import subprocess
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
    """ALFA DELFA - experiment tracking CLI."""


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
              help="Path to a JSON metrics file produced by the command.")
@click.argument("command", nargs=-1, required=True)
def run(project_id: str, metrics_file: str | None, command: tuple[str, ...]):
    """Run a command and track it as an experiment run.

    Usage: alfa run --project <id> -- <command ...>
    """
    cmd_str = " ".join(command)
    commit = _git_commit()
    cwd = os.getcwd()
    started_at = datetime.now(timezone.utc).isoformat()

    # ── Pre-run: single POST creates the run in "running" status ──
    click.echo(f"Creating run for project {project_id} ...")
    run_id = create_run(
        project_id=project_id,
        command=cmd_str,
        git_commit=commit,
        started_at=started_at,
        working_dir=cwd,
    )
    click.echo(f"Run {run_id} created (status: running)")

    # ── Execution: stream stdout/stderr as normal ──
    click.echo(f"Executing: {cmd_str}")
    result = subprocess.run(cmd_str, shell=True)

    # ── Post-run: report final status, exit code, optional metrics ──
    finished_at = datetime.now(timezone.utc).isoformat()
    status = "success" if result.returncode == 0 else "failure"

    metrics_json: dict | None = None
    if metrics_file:
        path = Path(metrics_file)
        if path.exists():
            metrics_json = json.loads(path.read_text())

    update_run(
        run_id,
        finished_at=finished_at,
        status=status,
        exit_code=result.returncode,
        metrics_json=metrics_json,
    )
    click.echo(f"Run {run_id} {status} (exit code {result.returncode})")


def main():
    cli()


if __name__ == "__main__":
    main()
