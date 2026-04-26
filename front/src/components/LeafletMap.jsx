
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Link } from 'react-router-dom';
import { formatDateTime, formatKRW, dDay } from '@/lib/format';

/* === 자체 SVG divIcon (Leaflet 기본 아이콘 깨짐 회피) === */
function makeIcon(isInternal, isSelected = false) {
  const size = isSelected ? 36 : isInternal ? 28 : 22;
  const bg = isInternal ? '#1f3fef' : '#64748b';
  const ring = isSelected ? '4px solid #fbbf24' : '2px solid #ffffff';
  const star = isInternal ? '★' : '';
  return L.divIcon({
    className: 'leaflet-vibe-marker',
    html: `<div style="
      width:${size}px;height:${size}px;border-radius:9999px;
      background:${bg};border:${ring};
      box-shadow:0 2px 6px rgba(0,0,0,0.25);
      color:#fff;font-weight:700;font-size:13px;
      display:flex;align-items:center;justify-content:center;
    ">${star}</div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2 - 2],
  });
}

const TILE_URL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const TILE_ATTR = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

/** 현재 events 좌표에 자동으로 줌 맞춤 (1건이면 zoom=12, 다중이면 fitBounds). */
function FitToEvents({ events }) {
  const map = useMap();
  useEffect(() => {
    if (!events.length) return;
    if (events.length === 1) {
      map.setView([events[0].venue.lat, events[0].venue.lng], 12, { animate: true });
      return;
    }
    const lats = events.map((e) => e.venue.lat);
    const lngs = events.map((e) => e.venue.lng);
    const bounds = [
      [Math.min(...lats), Math.min(...lngs)],
      [Math.max(...lats), Math.max(...lngs)],
    ];
    map.fitBounds(bounds, { padding: [50, 50], maxZoom: 11, animate: true });
  }, [events, map]);
  return null;
}

/* ======================================================================== */
/* 다중 마커 (대시보드용)                                                   */
/* ======================================================================== */
export function LeafletMultiMap({ events, selectedId, onSelect, fillHeight = false }) {
  const sizeCls = fillHeight
    ? 'h-full min-h-[360px]'
    : 'aspect-[4/3] sm:aspect-[16/10]';
  return (
    <div className={`relative z-0 ${sizeCls} rounded-xl overflow-hidden border border-slate-200`}>
      <MapContainer
        center={[37.4, 127.0]}
        zoom={9}
        scrollWheelZoom
        style={{ width: '100%', height: '100%' }}
      >
        <TileLayer url={TILE_URL} attribution={TILE_ATTR} />
        <FitToEvents events={events} />
        {events.map((e) => {
          const isInternal = e.source === 'internal';
          const isSelected = selectedId === e.id;
          return (
            <Marker
              key={e.id}
              position={[e.venue.lat, e.venue.lng]}
              icon={makeIcon(isInternal, isSelected)}
              eventHandlers={{
                click: () => onSelect(isSelected ? null : e.id),
              }}
            >
              <Popup>
                <div className="text-sm space-y-1.5 min-w-[220px]">
                  <div className="flex items-center gap-1 text-[10px]">
                    <span className={`badge ${
                      isInternal ? 'bg-brand-600 text-white' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {isInternal ? '★ 자체' : `외부 · ${e.externalSource ?? ''}`}
                    </span>
                    <span className="badge bg-slate-100 text-slate-600">{dDay(e.startAt)}</span>
                  </div>
                  <div className="font-semibold leading-snug text-slate-800">{e.title}</div>
                  <div className="text-slate-700 text-[13px]">
                    📍 <strong>{e.venue.name}</strong>
                  </div>
                  <div className="text-slate-500 text-xs">{e.venue.address}</div>
                  <div className="text-slate-500 text-xs">{formatDateTime(e.startAt)}</div>
                  <div className="text-brand-700 text-xs font-semibold">{formatKRW(e.price)}</div>
                  <Link
                    to={`/events/${e.id}`}
                    className="inline-block mt-1 text-brand-700 text-xs font-semibold"
                  >
                    상세 보기 →
                  </Link>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}

/* ======================================================================== */
/* 단일 마커 (이벤트 상세용)                                                */
/* ======================================================================== */
export function LeafletSingleMap({ lat, lng, venueName, address }) {
  return (
    <div className="relative z-0 aspect-[4/3] rounded-xl overflow-hidden border border-slate-200">
      <MapContainer
        center={[lat, lng]}
        zoom={15}
        scrollWheelZoom={false}
        style={{ width: '100%', height: '100%' }}
      >
        <TileLayer url={TILE_URL} attribution={TILE_ATTR} />
        <Marker position={[lat, lng]} icon={makeIcon(true)}>
          <Popup>
            <div className="text-sm">
              <div className="font-semibold">{venueName}</div>
              {address && <div className="text-slate-500 text-xs mt-0.5">{address}</div>}
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
