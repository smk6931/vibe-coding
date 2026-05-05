from .base import *

DEBUG = True
ALLOWED_HOSTS = ['localhost', '127.0.0.1', '0.0.0.0']

# 우리 프런트 포트 = 3200 (vite.config.js). 5173/3000 은 Vite/Next.js 기본 — 우리 안 씀.
CORS_ALLOWED_ORIGINS = [
    'http://localhost:3200',
    'http://127.0.0.1:3200',
]
CORS_ALLOW_CREDENTIALS = True
