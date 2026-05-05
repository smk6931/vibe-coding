import { useEffect, useRef, useState } from 'react';

/**
 * 카카오맵 SDK 단일 진입점.
 *
 * - 키: VITE_KAKAO_MAP_KEY (.env, 프로젝트 루트). vite.config.js의 envDir로 끌어옴.
 * - SDK는 CDN 동적 로드. autoload=false + libraries=services (좌표↔주소 변환 등 향후 활용).
 * - LeafletMap 의 인터페이스(KakaoMultiMap / KakaoSingleMap props)와 동일하게 유지 — import 경로만 교체로 갈아탈 수 있음.
 */

const KAKAO_KEY = import.meta.env.VITE_KAKAO_MAP_KEY;

let sdkPromise = null;

function loadKakaoSdk() {
  if (typeof window === 'undefined') return Promise.reject(new Error('window 없음'));
  if (sdkPromise) return sdkPromise;

  sdkPromise = new Promise((resolve, reject) => {
    if (window.kakao && window.kakao.maps) {
      window.kakao.maps.load(() => resolve(window.kakao));
      return;
    }
    if (!KAKAO_KEY) {
      reject(new Error('VITE_KAKAO_MAP_KEY 미설정 (.env 확인)'));
      return;
    }
    const script = document.createElement('script');
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_KEY}&autoload=false&libraries=services`;
    script.async = true;
    script.onload = () => window.kakao.maps.load(() => resolve(window.kakao));
    script.onerror = () => reject(new Error('카카오 SDK 로드 실패 (도메인 등록 / 네트워크 확인)'));
    document.head.appendChild(script);
  });

  return sdkPromise;
}

/* ======================================================================== */
/* SVG 마커 — 자체(브랜드 ★) / 외부(슬레이트) / 선택(앰버 링) 시각 구분 유지 */
/* ======================================================================== */
function makeMarkerImage(kakao, isInternal, isSelected = false) {
  const size = isSelected ? 36 : isInternal ? 28 : 22;
  const bg = isInternal ? '#1f3fef' : '#64748b';
  const ring = isSelected ? '#fbbf24' : '#ffffff';
  const ringW = isSelected ? 4 : 2;
  const star = isInternal ? '★' : '';

  const svg = `
<svg xmlns='http://www.w3.org/2000/svg' width='${size}' height='${size}' viewBox='0 0 ${size} ${size}'>
  <circle cx='${size / 2}' cy='${size / 2}' r='${size / 2 - ringW}' fill='${bg}' stroke='${ring}' stroke-width='${ringW}'/>
  <text x='50%' y='55%' text-anchor='middle' dominant-baseline='middle' font-size='13' font-weight='700' fill='#ffffff' font-family='sans-serif'>${star}</text>
</svg>`.trim();

  const url = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  return new kakao.maps.MarkerImage(
    url,
    new kakao.maps.Size(size, size),
    { offset: new kakao.maps.Point(size / 2, size / 2) }
  );
}

/* ======================================================================== */
/* InfoWindow content — Link 는 a href (SPA 새로고침 감수, 단순화)            */
/* ======================================================================== */
function infoHtml(e) {
  const isInternal = e.source === 'internal';
  const badgeBg = isInternal ? '#1f3fef' : '#e2e8f0';
  const badgeFg = isInternal ? '#ffffff' : '#334155';
  const badgeText = isInternal ? '★ 자체' : `외부 · ${e.externalSource ?? ''}`;
  const date = new Date(e.startAt).toLocaleString('ko-KR', {
    month: 'numeric', day: 'numeric', weekday: 'short', hour: 'numeric', minute: '2-digit',
  });
  const price = e.price === 0 ? '무료' : `${(e.price / 10000).toFixed(e.price % 10000 === 0 ? 0 : 1)}만원`;

  return `
<div style="font-family:system-ui,-apple-system,sans-serif;padding:6px 8px;min-width:200px;max-width:240px;font-size:12px;line-height:1.5;color:#334155;">
  <div style="margin-bottom:6px;">
    <span style="display:inline-block;padding:2px 6px;border-radius:9999px;background:${badgeBg};color:${badgeFg};font-size:10px;font-weight:700;">${badgeText}</span>
  </div>
  <div style="font-weight:700;color:#0f172a;margin-bottom:4px;line-height:1.35;">${escapeHtml(e.title)}</div>
  <div style="color:#475569;margin-bottom:2px;">📍 <strong>${escapeHtml(e.venue?.name ?? '')}</strong></div>
  <div style="color:#94a3b8;font-size:11px;">${escapeHtml(e.venue?.address ?? '')}</div>
  <div style="color:#94a3b8;font-size:11px;margin-top:2px;">${escapeHtml(date)}</div>
  <div style="color:#1f3fef;font-weight:700;font-size:11px;margin-top:4px;">${price}</div>
  <a href="/events/${encodeURIComponent(e.id)}" style="display:inline-block;margin-top:6px;color:#1f3fef;font-weight:700;font-size:11px;text-decoration:none;">상세 보기 →</a>
</div>`.trim();
}

function escapeHtml(s) {
  return String(s ?? '').replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]));
}

/* ======================================================================== */
/* 다중 마커 (홈 대시보드용)                                                  */
/* ======================================================================== */
export function KakaoMultiMap({ events = [], selectedId, onSelect, fillHeight = false }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const infoWindowRef = useRef(null);
  const [error, setError] = useState(null);

  // 1) SDK 로드 + 맵 1회 초기화
  useEffect(() => {
    let cancelled = false;
    loadKakaoSdk()
      .then((kakao) => {
        if (cancelled || !containerRef.current) return;
        const map = new kakao.maps.Map(containerRef.current, {
          center: new kakao.maps.LatLng(37.4, 127.0),
          level: 9,
        });
        mapRef.current = map;
        infoWindowRef.current = new kakao.maps.InfoWindow({ removable: true });
        renderMarkers(); // 첫 렌더
      })
      .catch((e) => setError(e.message));

    return () => {
      cancelled = true;
      // 마커·인포윈도우 정리
      markersRef.current.forEach((m) => m.setMap(null));
      markersRef.current = [];
      if (infoWindowRef.current) infoWindowRef.current.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 2) events / selectedId 변경 시 마커 다시 그리기
  useEffect(() => {
    renderMarkers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [events, selectedId]);

  function renderMarkers() {
    const kakao = window.kakao;
    const map = mapRef.current;
    if (!kakao || !map) return;

    // 기존 마커 제거
    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];

    if (!events.length) return;

    const bounds = new kakao.maps.LatLngBounds();

    events.forEach((e) => {
      if (!e.venue?.lat || !e.venue?.lng) return;
      const pos = new kakao.maps.LatLng(e.venue.lat, e.venue.lng);
      bounds.extend(pos);

      const isInternal = e.source === 'internal';
      const isSelected = selectedId === e.id;
      const marker = new kakao.maps.Marker({
        position: pos,
        image: makeMarkerImage(kakao, isInternal, isSelected),
        title: e.title,
      });
      marker.setMap(map);
      markersRef.current.push(marker);

      kakao.maps.event.addListener(marker, 'click', () => {
        if (infoWindowRef.current) {
          infoWindowRef.current.setContent(infoHtml(e));
          infoWindowRef.current.open(map, marker);
        }
        if (onSelect) onSelect(isSelected ? null : e.id);
      });
    });

    // bounds fit
    if (events.length === 1) {
      map.setCenter(new kakao.maps.LatLng(events[0].venue.lat, events[0].venue.lng));
      map.setLevel(5);
    } else {
      map.setBounds(bounds);
    }
  }

  const sizeCls = fillHeight
    ? 'h-full min-h-[360px]'
    : 'aspect-[4/3] sm:aspect-[16/10]';

  if (error) {
    return (
      <div className={`relative z-0 ${sizeCls} rounded-xl border border-rose-200 bg-rose-50 grid place-items-center text-sm text-rose-600 p-4 text-center`}>
        지도 로드 실패<br />
        <span className="text-xs text-rose-400 mt-1">{error}</span>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`relative z-0 ${sizeCls} rounded-xl overflow-hidden border border-slate-200`}
    />
  );
}

/* ======================================================================== */
/* 단일 마커 (이벤트 상세용 — 향후 EventLocationMap 에서 사용)                 */
/* ======================================================================== */
export function KakaoSingleMap({ lat, lng, venueName, address }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    loadKakaoSdk()
      .then((kakao) => {
        if (cancelled || !containerRef.current || lat == null || lng == null) return;
        const center = new kakao.maps.LatLng(lat, lng);
        const map = new kakao.maps.Map(containerRef.current, { center, level: 4 });
        mapRef.current = map;

        const marker = new kakao.maps.Marker({
          position: center,
          image: makeMarkerImage(kakao, true),
          title: venueName,
        });
        marker.setMap(map);

        if (venueName) {
          const iw = new kakao.maps.InfoWindow({
            content: `<div style="padding:6px 8px;font-size:12px;color:#0f172a;font-family:system-ui,sans-serif;"><strong>${escapeHtml(venueName)}</strong>${address ? `<div style="color:#94a3b8;font-size:11px;margin-top:2px;">${escapeHtml(address)}</div>` : ''}</div>`,
          });
          iw.open(map, marker);
        }
      })
      .catch((e) => setError(e.message));

    return () => { cancelled = true; };
  }, [lat, lng, venueName, address]);

  if (error) {
    return (
      <div className="aspect-[4/3] rounded-xl border border-rose-200 bg-rose-50 grid place-items-center text-sm text-rose-600 p-4 text-center">
        지도 로드 실패<br />
        <span className="text-xs text-rose-400 mt-1">{error}</span>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative z-0 aspect-[4/3] rounded-xl overflow-hidden border border-slate-200"
    />
  );
}
