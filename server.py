#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
바이브 세션 — 오라클 클라우드 정적 배포 스크립트 (Python, cross-platform)

사용법:
  1) .env.example 을 .env 로 복사 후 본인 값(IP/SSH 키/도메인)을 채움
  2) 프로젝트 루트(vibe_coding/)에서 실행:
       python server.py                       # 빌드 + 배포 + 응답 확인
       python server.py --skip-build          # front/dist 가 이미 있으면 빌드 건너뛰기
       python server.py --dry-run             # 명령만 출력, 실제 전송 안 함
       python server.py --bootstrap-nginx     # nginx/{DOMAIN}.conf 를 서버에 적용 (도메인 변경/SSL 적용 시)
"""

import sys

if sys.stdout.encoding and sys.stdout.encoding.lower() != "utf-8":
    sys.stdout.reconfigure(encoding="utf-8")

import argparse
import os
import shutil
import subprocess
import time
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent
FRONT_DIR = ROOT / "front"
OUT_DIR = FRONT_DIR / "dist"
ENV_PATH = ROOT / ".env"
NGINX_DIR = ROOT / "nginx"

CYAN = "\033[36m"; GRAY = "\033[90m"; RED = "\033[31m"; YELLOW = "\033[33m"; GREEN = "\033[32m"; RESET = "\033[0m"

def step(msg: str) -> None: print(f"\n{CYAN}=== {msg} ==={RESET}")
def info(msg: str) -> None: print(f"{GRAY}{msg}{RESET}")
def warn(msg: str) -> None: print(f"{YELLOW}{msg}{RESET}")
def fail(msg: str) -> None: print(f"{RED}{msg}{RESET}"); sys.exit(1)


def load_env() -> dict:
    if not ENV_PATH.exists():
        fail(
            f".env 파일이 없습니다.\n"
            f"  → .env.example 을 .env 로 복사 후 본인 값(IP/SSH 키)을 채우세요."
        )
    env: dict[str, str] = {}
    for line in ENV_PATH.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        k, _, v = line.partition("=")
        env[k.strip()] = v.strip()

    for k in ("DEPLOY_USER", "DEPLOY_HOST", "DEPLOY_PATH", "DEPLOY_SSH_KEY"):
        if not env.get(k):
            fail(f".env 에 '{k}' 가 비어 있습니다.")
    if not Path(env["DEPLOY_SSH_KEY"]).expanduser().exists():
        fail(f"SSH 키 파일이 없습니다: {env['DEPLOY_SSH_KEY']}")
    return env


def run(cmd: list[str], *, dry: bool = False, cwd: Path | None = None, check: bool = True) -> None:
    info(" ".join(str(c) for c in cmd))
    if dry:
        return
    completed = subprocess.run(cmd, cwd=cwd or ROOT)
    if check and completed.returncode != 0:
        fail(f"명령 실패 (exit {completed.returncode}): {' '.join(str(c) for c in cmd)}")


def ssh_args(env: dict) -> list[str]:
    return ["-i", str(Path(env["DEPLOY_SSH_KEY"]).expanduser()), "-o", "StrictHostKeyChecking=accept-new"]


def remote_target(env: dict) -> str:
    return f"{env['DEPLOY_USER']}@{env['DEPLOY_HOST']}"


def run_ssh(env: dict, remote_cmd: str, *, dry: bool = False, check: bool = True) -> None:
    run(["ssh", *ssh_args(env), remote_target(env), remote_cmd], dry=dry, check=check)


def have(name: str) -> bool:
    return shutil.which(name) is not None


def bootstrap_nginx(env: dict, *, dry: bool = False) -> None:
    """로컬 nginx/{DEPLOY_DOMAIN}.conf 를 서버 sites-available/sites-enabled 에 적용 + nginx -t + reload."""
    domain = env.get("DEPLOY_DOMAIN")
    if not domain:
        fail(".env 에 DEPLOY_DOMAIN 이 비어 있습니다. nginx 부트스트랩에는 도메인이 필요합니다.")
    local_conf = NGINX_DIR / f"{domain}.conf"
    if not local_conf.exists():
        fail(f"로컬 nginx 설정 파일이 없습니다: {local_conf}")

    step(f"0/4 nginx 설정 부트스트랩 — {domain}")
    tmp_path = f"/tmp/{domain}.conf"
    run(["scp", *ssh_args(env), str(local_conf), f"{remote_target(env)}:{tmp_path}"], dry=dry)
    remote_cmd = (
        f"sudo mv {tmp_path} /etc/nginx/sites-available/{domain} && "
        f"sudo ln -sf /etc/nginx/sites-available/{domain} /etc/nginx/sites-enabled/{domain} && "
        f"sudo nginx -t && sudo systemctl reload nginx"
    )
    run_ssh(env, remote_cmd, dry=dry)


def main() -> None:
    parser = argparse.ArgumentParser(description="Vibe Session — Oracle Cloud static deploy")
    parser.add_argument("--skip-build", action="store_true", help="front/dist 가 이미 있으면 빌드 건너뛰기")
    parser.add_argument("--dry-run", action="store_true", help="명령만 출력, 실제 전송 안 함")
    parser.add_argument("--bootstrap-nginx", action="store_true", help="nginx/{DEPLOY_DOMAIN}.conf 를 서버에 적용하고 reload")
    args = parser.parse_args()

    env = load_env()
    info(f"Remote : {remote_target(env)}:{env['DEPLOY_PATH']}")
    info(f"SSH key: {env['DEPLOY_SSH_KEY']}")
    if env.get("DEPLOY_DOMAIN"):
        info(f"Domain : {env['DEPLOY_DOMAIN']}")

    # 0) (선택) nginx config 부트스트랩
    if args.bootstrap_nginx:
        bootstrap_nginx(env, dry=args.dry_run)

    # 1) 빌드
    if not args.skip_build:
        step("1/4 의존성 설치 + Vite 빌드")
        npm = "npm.cmd" if os.name == "nt" and have("npm.cmd") else "npm"
        run([npm, "install"], dry=args.dry_run, cwd=FRONT_DIR)
        run([npm, "run", "build"], dry=args.dry_run, cwd=FRONT_DIR)
    if not OUT_DIR.exists():
        fail("빌드 산출물 front/dist 가 없습니다. --skip-build 빼고 다시 실행하세요.")

    # 2) 원격 디렉토리 보장
    step("2/4 원격 디렉토리 보장")
    user = env["DEPLOY_USER"]; path = env["DEPLOY_PATH"]
    run_ssh(env, f"sudo mkdir -p {path} && sudo chown -R {user}:{user} {path}", dry=args.dry_run)

    # 3) 동기화 (rsync 우선, 없으면 scp 폴백)
    step(f"3/4 front/dist → {remote_target(env)}:{env['DEPLOY_PATH']}")
    if have("rsync"):
        rsh = "ssh " + " ".join(ssh_args(env))
        run(
            ["rsync", "-avz", "--delete", "-e", rsh, "front/dist/", f"{remote_target(env)}:{env['DEPLOY_PATH']}/"],
            dry=args.dry_run,
        )
    else:
        warn("rsync 미설치 → scp 폴백 (느릴 수 있음)")
        run_ssh(env, f"rm -rf {env['DEPLOY_PATH']}/*", dry=args.dry_run)
        run(
            ["scp", *ssh_args(env), "-r", "front/dist/.", f"{remote_target(env)}:{env['DEPLOY_PATH']}/"],
            dry=args.dry_run,
        )

    # 4) Nginx reload
    step("4/4 Nginx 설정 검증 + reload")
    run_ssh(env, "sudo nginx -t && sudo systemctl reload nginx", dry=args.dry_run)

    # 5) 응답 확인
    site_url = env.get("DEPLOY_SITE_URL") or f"http://{env['DEPLOY_HOST']}/"
    step(f"응답 확인: {site_url}")
    if not args.dry_run:
        time.sleep(1)
        try:
            req = urllib.request.Request(site_url, headers={"User-Agent": "vibe-deploy"})
            with urllib.request.urlopen(req, timeout=10) as resp:
                ctype = resp.headers.get("Content-Type", "")
                print(f"HTTP {resp.status} · {ctype}")
                if resp.status != 200:
                    raise RuntimeError(f"비정상 응답: {resp.status}")
        except Exception as e:
            warn(f"응답 확인 실패: {e}")
            warn("방화벽(ufw + 오라클 Security List 80/tcp)과 Nginx 상태를 확인하세요.")

    step(f"{GREEN}✅ 배포 완료 — {site_url}{RESET}")


if __name__ == "__main__":
    main()
