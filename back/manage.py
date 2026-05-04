#!/usr/bin/env python
import os
import subprocess
import sys
from pathlib import Path


def ensure_venv():
    """venv가 켜져있지 않으면 venv의 python으로 자기 자신을 재실행."""
    base_dir = Path(__file__).resolve().parent
    if os.name == 'nt':
        venv_python = base_dir / 'venv' / 'Scripts' / 'python.exe'
    else:
        venv_python = base_dir / 'venv' / 'bin' / 'python'

    if not venv_python.exists():
        return

    current = Path(sys.executable).resolve()
    if current == venv_python.resolve():
        return

    print(f'[manage.py] venv 자동 활성화: {venv_python}', flush=True)
    result = subprocess.run([str(venv_python), *sys.argv])
    sys.exit(result.returncode)


def main():
    ensure_venv()
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.local')
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Django를 찾을 수 없습니다. requirements.txt를 설치했는지 확인하세요."
        ) from exc
    execute_from_command_line(sys.argv)


if __name__ == '__main__':
    main()
