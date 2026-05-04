import { Link } from 'react-router-dom';
import siteData from '../../public/data/site.json';

/**
 * Footer — 사이트 전역 푸터.
 *
 * 모든 페이지 하단에 박혀 운영자 정체성·라이선스를 노출 → 도용 방지 시그니처 분산.
 * site.json operator 단일 소스.
 */
export default function Footer() {
  const op = siteData.operator;
  const year = new Date().getFullYear();

  return (
    <footer className="mt-16 border-t border-slate-200 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <div className="grid gap-6 sm:grid-cols-3 sm:gap-8">
          <div>
            <div className="text-[14px] font-semibold text-slate-800">{siteData.brand}</div>
            <div className="text-[12px] text-slate-500 mt-1">{op.tagline}</div>
            <Link
              to="/about"
              className="inline-block mt-2 text-[12px] text-brand-600 hover:underline"
            >
              운영자 소개 →
            </Link>
          </div>

          <div className="text-[12px] text-slate-600 space-y-1">
            {op.contacts?.instagram && (
              <a
                href={op.contacts.instagram}
                target="_blank"
                rel="noreferrer"
                className="block hover:text-brand-600"
              >
                인스타그램
              </a>
            )}
            {op.contacts?.kakao && (
              <a
                href={op.contacts.kakao}
                target="_blank"
                rel="noreferrer"
                className="block hover:text-brand-600"
              >
                카카오 오픈채팅
              </a>
            )}
            {op.contacts?.email && (
              <a
                href={`mailto:${op.contacts.email}`}
                className="block hover:text-brand-600"
              >
                {op.contacts.email}
              </a>
            )}
          </div>

          <div className="text-[11px] text-slate-400 leading-relaxed">
            © {year} {siteData.brand} · 운영자 {op.name}
            <br />
            교안·코드·디자인은 출처 표기 시 자유 사용 (CC BY 4.0)
          </div>
        </div>
      </div>
    </footer>
  );
}
