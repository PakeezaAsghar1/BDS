import React, { useState, useCallback } from 'react';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  InfoWindow,
  useMap
} from '@vis.gl/react-google-maps';
import {
  MapPin,
  Navigation,
  Compass,
  PhoneCall,
  ExternalLink,
  Building2,
  Clock,
  ShieldCheck
} from 'lucide-react';

const UET_NAROWAL_COORDINATES = { lat: 32.09188, lng: 74.76393 };
const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

// Internal Map Controller for Recenter & Zoom Actions
const MapController: React.FC = () => {
  const map = useMap();

  const handleRecenter = useCallback(() => {
    if (map) {
      map.panTo(UET_NAROWAL_COORDINATES);
      map.setZoom(16);
    }
  }, [map]);

  return (
    <div className="absolute bottom-4 left-4 z-10 flex items-center gap-2">
      <button
        onClick={handleRecenter}
        type="button"
        className="px-3.5 py-2 bg-white/95 hover:bg-white text-slate-800 text-xs font-semibold rounded-xl shadow-md border border-slate-200/80 backdrop-blur-xs flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95"
        title="Center map on UET Narowal Campus"
      >
        <Compass className="w-3.5 h-3.5 text-[#B4232C]" />
        <span>Recenter Campus</span>
      </button>
    </div>
  );
};

export const UETNarowalMap: React.FC = () => {
  const [showInfoWindow, setShowInfoWindow] = useState(true);

  const googleMapsDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${UET_NAROWAL_COORDINATES.lat},${UET_NAROWAL_COORDINATES.lng}`;

  if (!API_KEY) {
    return (
      <div className="w-full bg-amber-50/80 border border-amber-200 rounded-3xl p-8 text-center space-y-3">
        <MapPin className="w-10 h-10 text-amber-600 mx-auto" />
        <h4 className="text-base font-bold text-amber-900">Google Maps Key Pending Configuration</h4>
        <p className="text-xs text-amber-700 max-w-md mx-auto">
          Please ensure <code className="font-mono bg-amber-100 px-1.5 py-0.5 rounded text-amber-800">VITE_GOOGLE_MAPS_API_KEY</code> is set to display the live campus map.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden" id="uet-narowal-map-section">
      {/* Map Header Card */}
      <div className="p-6 sm:p-7 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-white via-slate-50/50 to-red-50/30">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100/80 text-[#8F1D25] text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-[#B4232C] animate-pulse" />
            <MapPin className="w-3.5 h-3.5 text-[#B4232C]" />
            <span>Interactive Campus Location</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            UET Narowal Campus
          </h3>
          <p className="text-xs sm:text-sm text-slate-600">
            University of Engineering & Technology (UET Narowal Campus) • Adda Siraj, Muridke-Narowal Road, Narowal
          </p>
        </div>

        <div className="flex items-center gap-2 sm:self-center">
          <a
            href={googleMapsDirectionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 bg-[#B4232C] hover:bg-[#8F1D25] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-xs"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>Get Driving Directions</span>
            <ExternalLink className="w-3 h-3 opacity-80" />
          </a>
        </div>
      </div>

      {/* Map Viewport Container */}
      <div className="relative w-full h-[400px] sm:h-[460px] bg-slate-100">
        <APIProvider apiKey={API_KEY} libraries={['marker']}>
          <Map
            mapId="DEMO_MAP_ID"
            defaultCenter={UET_NAROWAL_COORDINATES}
            defaultZoom={15}
            gestureHandling="greedy"
            disableDefaultUI={false}
            fullscreenControl={true}
            mapTypeControl={true}
            streetViewControl={false}
            zoomControl={true}
            style={{ width: '100%', height: '100%' }}
            internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
          >
            <AdvancedMarker
              position={UET_NAROWAL_COORDINATES}
              title="Blood Donor Society — UET Narowal Campus Desk"
              onClick={() => setShowInfoWindow((prev) => !prev)}
            >
              <Pin
                background="#B4232C"
                glyphColor="#ffffff"
                borderColor="#8F1D25"
                scale={1.2}
              />
            </AdvancedMarker>

            {showInfoWindow && (
              <InfoWindow
                position={UET_NAROWAL_COORDINATES}
                onCloseClick={() => setShowInfoWindow(false)}
                headerContent={
                  <div className="text-xs font-bold text-[#8F1D25] uppercase tracking-wider flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5" />
                    <span>BDS UET Narowal Desk</span>
                  </div>
                }
              >
                <div className="p-1 space-y-2 max-w-[240px] text-slate-800">
                  <h4 className="font-bold text-sm text-slate-900 leading-tight">
                    UET Narowal Campus
                  </h4>
                  <p className="text-xs text-slate-600 leading-normal">
                    Student Affairs & Volunteer Wing, Admin Block, Muridke-Narowal Road, Narowal.
                  </p>
                  <div className="pt-1 flex flex-col gap-1 text-[11px] text-slate-500 font-medium border-t border-slate-100">
                    <span className="flex items-center gap-1 text-emerald-700">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      Emergency Donor Coordination
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      24/7 Student Response
                    </span>
                  </div>
                  <div className="pt-2 flex items-center gap-2">
                    <a
                      href={googleMapsDirectionsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-[#B4232C] hover:underline inline-flex items-center gap-1"
                    >
                      <span>Directions</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                    <span className="text-slate-300">•</span>
                    <a
                      href="tel:+923008472910"
                      className="text-xs font-bold text-slate-700 hover:text-slate-900 inline-flex items-center gap-1"
                    >
                      <PhoneCall className="w-3 h-3 text-red-600" />
                      <span>Helpline</span>
                    </a>
                  </div>
                </div>
              </InfoWindow>
            )}

            <MapController />
          </Map>
        </APIProvider>
      </div>

      {/* Campus Info Strip Footer */}
      <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200/80 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div className="flex items-start gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-red-100 text-[#B4232C] flex items-center justify-center shrink-0 mt-0.5">
            <Building2 className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="font-bold text-slate-800">Campus Address</div>
            <div className="text-slate-500 text-[11px] mt-0.5">Muridke-Narowal Road, Adda Siraj, Narowal</div>
          </div>
        </div>

        <div className="flex items-start gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
            <ShieldCheck className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="font-bold text-slate-800">Narowal Volunteer Wing</div>
            <div className="text-slate-500 text-[11px] mt-0.5">Covers District Hospital & Regional Clinics</div>
          </div>
        </div>

        <div className="flex items-start gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
            <PhoneCall className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="font-bold text-slate-800">Narowal Coordinator</div>
            <div className="text-slate-500 text-[11px] mt-0.5">desk.narowal@bdsuet.org • +92 300 8472910</div>
          </div>
        </div>
      </div>
    </div>
  );
};
