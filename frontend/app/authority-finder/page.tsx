'use client';

import { useState } from 'react';
import Link from 'next/link';
import { apiFetch } from '@/lib/api';
import { ArrowRight, Building2, ExternalLink, MapPin, Search, ShieldCheck } from 'lucide-react';

interface LocalPlace {
  id: string;
  name: string;
  address: string;
  type: string;
  mapsUrl: string;
}

interface PincodeResult {
  pincode: string;
  area: string;
  district: string;
  state: string;
  problem: string;
  department: string;
  authorityLevel: string;
  serviceCategories: string[];
  complaintGuidance: string;
  policeStations: LocalPlace[];
  serviceProviders: LocalPlace[];
}

interface OSMPlace {
  osm_id: number;
  osm_type: string;
  name?: string;
  display_name: string;
  type?: string;
  lat?: string;
  lon?: string;
}

export default function AuthorityFinderPage() {
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [problem, setProblem] = useState('');
  const [pincodeResult, setPincodeResult] = useState<PincodeResult | null>(null);
  const [pincodeLoading, setPincodeLoading] = useState(false);
  const [pincodeError, setPincodeError] = useState('');

  const findByPincode = async () => {
    const normalizedPincode = pincode.trim();
    if (!state.trim()) {
      setPincodeError('Enter your state or union territory.');
      return;
    }
    if (!problem.trim()) {
      setPincodeError('Describe the problem so we can suggest the right department.');
      return;
    }
    if (!/^\d{6}$/.test(normalizedPincode)) {
      setPincodeError('Enter a valid 6-digit Indian PIN code.');
      setPincodeResult(null);
      return;
    }

    setPincodeLoading(true);
    setPincodeError('');
    try {
      const fetchWithTimeout = async (url: string, options?: RequestInit) => {
        const controller = new AbortController();
        const timeout = window.setTimeout(() => controller.abort(), 6000);
        try {
          return await fetch(url, { ...options, signal: controller.signal });
        } finally {
          window.clearTimeout(timeout);
        }
      };
      const response = await fetchWithTimeout(`https://api.postalpincode.in/pincode/${normalizedPincode}`);
      if (!response.ok) throw new Error('PIN lookup failed');
      const postalData = await response.json();
      const offices = postalData?.[0]?.PostOffice;
      if (!Array.isArray(offices) || offices.length === 0) {
        throw new Error('No area was found for that PIN code.');
      }

      const firstOffice = offices[0];
      const area = firstOffice.Block || firstOffice.District || firstOffice.Name;
      const district = firstOffice.District;
      const verifiedState = firstOffice.State;
      if (!verifiedState.toLowerCase().includes(state.trim().toLowerCase()) && !state.trim().toLowerCase().includes(verifiedState.toLowerCase())) {
        throw new Error(`This PIN code belongs to ${verifiedState}, not ${state.trim()}.`);
      }
      const recommendation = await apiFetch<{
        department: string;
        authority_level: string;
        service_categories: string[];
        complaint_guidance: string;
      }>('/platform/authority-recommendation', {
        method: 'POST',
        body: { state: verifiedState, pincode: normalizedPincode, problem: problem.trim() },
      });
      const searchTerms = recommendation.service_categories.join(' OR ');
      const searchArea = encodeURIComponent(`${searchTerms}, ${area}, ${district}, ${verifiedState}, India`);
      let places: OSMPlace[] = [];
      try {
        const geocodeResponse = await fetchWithTimeout(
          `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=25&addressdetails=1&q=${searchArea}`
        );
        const geocodedPlaces: OSMPlace[] = geocodeResponse.ok ? await geocodeResponse.json() : [];
        const location = geocodedPlaces.find((place) => place.lat && place.lon);
        if (location) {
          const serviceRegex = recommendation.service_categories
            .map((category) => category.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
            .join('|');
          const overpassQuery = `[out:json];(nwr(around:10000,${location.lat},${location.lon})[name~"${serviceRegex}",i];nwr(around:10000,${location.lat},${location.lon})[amenity~"police|hospital|clinic|fire_station|school|post_office",i];nwr(around:10000,${location.lat},${location.lon})[office~"government|municipal|electricity",i];);out center tags;`;
          const nearbyResponse = await fetchWithTimeout('https://overpass-api.de/api/interpreter', {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain' },
            body: overpassQuery,
          });
          const nearbyData = nearbyResponse.ok ? await nearbyResponse.json() : { elements: [] };
          places = (nearbyData.elements || []).map((place: { id: number; type: string; tags?: { name?: string; [key: string]: string | undefined }; lat?: number; lon?: number; center?: { lat: number; lon: number } }) => ({
            osm_id: place.id,
            osm_type: place.type,
            name: place.tags?.name,
            display_name: [place.tags?.name, place.tags?.['addr:street'], place.tags?.['addr:city']].filter(Boolean).join(', ') || 'Mapped local service',
            type: place.tags?.amenity || place.tags?.office,
            lat: String(place.lat || place.center?.lat || ''),
            lon: String(place.lon || place.center?.lon || ''),
          }));
        }
      } catch {
        // Provider data is optional; keep the department recommendation available.
      }
      const toPlace = (place: OSMPlace, type: string): LocalPlace => ({
        id: String(place.osm_id),
        name: place.name || place.display_name.split(',')[0],
        address: place.display_name,
        type,
        mapsUrl: `https://www.openstreetmap.org/${place.osm_type}/${place.osm_id}`,
      });
      const policeStations = places
        .filter((place) => place.type === 'police' || /police station/i.test(place.display_name))
        .slice(0, 6)
        .map((place) => toPlace(place, 'Police station'));
      const serviceProviders = places
        .filter((place) => recommendation.service_categories.some((category) => place.display_name.toLowerCase().includes(category.toLowerCase())) || /hospital|clinic|fire_station|post_office|school|municipal|government|electricity/i.test(place.display_name))
        .slice(0, 8)
        .map((place) => toPlace(place, 'Local service'));

      setPincodeResult({
        pincode: normalizedPincode,
        area,
        district,
        state: verifiedState,
        problem: problem.trim(),
        department: recommendation.department,
        authorityLevel: recommendation.authority_level,
        serviceCategories: recommendation.service_categories,
        complaintGuidance: recommendation.complaint_guidance,
        policeStations,
        serviceProviders,
      });
    } catch (error) {
      setPincodeResult(null);
      setPincodeError(error instanceof Error ? error.message : 'Unable to find this PIN code.');
    } finally {
      setPincodeLoading(false);
    }
  };

  const mapsSearchUrl = (query: string) => `https://www.google.com/maps/search/${encodeURIComponent(`${query}, ${pincodeResult?.area || ''}, ${pincodeResult?.district || ''}, India`)}`;

  return (
    <div className="min-h-screen bg-[#fbfcf9] dark:bg-[#121111] text-gray-900 dark:text-gray-100 transition-colors duration-200">
      {/* Top Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0b2b31] via-[#0e6670] to-[#124b55] text-white py-16 px-4 sm:px-6 lg:px-8 shadow-xl">
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#e7b85b_1px,transparent_1px)] [background-size:24px_24px]"></div>
        <div className="relative max-w-5xl mx-auto text-center z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#e7b85b] text-xs font-extrabold shadow-sm">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
            <span>Government Officer & PIO Directory</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white">
            Authority & Ward Officer Directory
          </h1>
          <p className="text-sm sm:text-base text-[#d4eae6] max-w-2xl mx-auto font-medium">
            Tell us where you are and what happened. We will identify the right local department and help you report it.
          </p>
        </div>
      </section>

      {/* Main Search Area */}
      <div className="max-w-5xl mx-auto py-12 px-4 sm:px-6 lg:px-8 space-y-10">
        <section className="bg-[#eaf4f1] dark:bg-[#1b2928] p-6 sm:p-8 rounded-3xl border border-[#b9d9d1] dark:border-[#31514d] shadow-sm">
          <div className="flex items-start gap-3 mb-6">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#0e6670] text-white shadow-sm"><Search size={18} /></div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Find help for your problem</h2>
              <p className="mt-1 text-xs text-gray-600 dark:text-gray-300">We verify your PIN, ask Gemini for the correct department, then show only relevant local services.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="state" className="block text-xs font-extrabold text-gray-700 dark:text-gray-300 mb-2">State / Union Territory</label>
              <input id="state" value={state} onChange={(event) => setState(event.target.value)} placeholder="e.g. Maharashtra" className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-[#333] bg-gray-50 dark:bg-[#252323] text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-[#0e6670] font-medium" />
            </div>
            <div>
              <label htmlFor="pincode" className="block text-xs font-extrabold text-gray-700 dark:text-gray-300 mb-2">6-Digit PIN Code</label>
              <input
                id="pincode"
                inputMode="numeric"
                maxLength={6}
                value={pincode}
                onChange={(event) => setPincode(event.target.value.replace(/\D/g, ''))}
                onKeyDown={(event) => event.key === 'Enter' && findByPincode()}
                placeholder="e.g. 400001"
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-[#333] bg-gray-50 dark:bg-[#252323] text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-[#0e6670] font-medium"
              />
            </div>
            <div>
              <label htmlFor="problem" className="block text-xs font-extrabold text-gray-700 dark:text-gray-300 mb-2">Problem Description</label>
              <input id="problem" value={problem} onChange={(event) => setProblem(event.target.value)} onKeyDown={(event) => event.key === 'Enter' && findByPincode()} placeholder="e.g. broken road, water contamination" className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-[#333] bg-gray-50 dark:bg-[#252323] text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-[#0e6670] font-medium" />
            </div>
          </div>
          <div className="mt-5 flex justify-end">
            <button type="button" onClick={findByPincode} disabled={pincodeLoading} className="inline-flex items-center gap-2 bg-[#0e6670] hover:bg-[#094d54] disabled:opacity-60 text-white text-sm font-bold px-5 py-3 rounded-xl transition-all shadow-sm">
              {!pincodeLoading && <Search size={16} />}
              {pincodeLoading ? 'Searching...' : 'Find the right department'}
              {!pincodeLoading && <ArrowRight size={16} />}
            </button>
          </div>
          {pincodeError && <p role="alert" className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-300">{pincodeError}</p>}
          {pincodeResult && (
            <div className="mt-6 space-y-5">
              <div className="flex flex-col gap-4 border-y border-[#b9d9d1] py-5 dark:border-[#31514d] sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-[#0e6670] dark:text-[#e7b85b]"><MapPin size={14} /> {pincodeResult.pincode}</div>
                  <h2 className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">{pincodeResult.area}</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{pincodeResult.district}, {pincodeResult.state}</p>
                  <p className="mt-2 text-xs text-gray-600 dark:text-gray-300"><strong>Your issue:</strong> {pincodeResult.problem}</p>
                </div>
                <Link href={`/application-generator?issue=${encodeURIComponent(pincodeResult.problem)}`} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#e7b85b] px-4 py-2.5 text-xs font-bold text-[#302719] shadow-sm transition hover:bg-[#d9a945]"><Building2 size={15} /> File a complaint <ArrowRight size={14} /></Link>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-[#201e1e] p-5 rounded-2xl border border-gray-200 dark:border-[#333] shadow-sm">
                  <div className="flex items-center gap-2 mb-3"><ShieldCheck size={17} className="text-[#0e6670] dark:text-[#e7b85b]" /><h3 className="font-bold text-gray-900 dark:text-white">Recommended authority</h3></div>
                  <p className="text-sm font-semibold text-[#0e6670] dark:text-[#e7b85b]">{pincodeResult.department}</p>
                  <p className="mt-2 text-xs text-gray-600 dark:text-gray-300">{pincodeResult.authorityLevel}</p>
                  <p className="mt-3 text-xs text-gray-600 dark:text-gray-300">{pincodeResult.complaintGuidance}</p>
                </div>
                <div className="bg-white dark:bg-[#201e1e] p-5 rounded-2xl border border-gray-200 dark:border-[#333] shadow-sm">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-3">Police stations</h3>
                  {pincodeResult.policeStations.length ? pincodeResult.policeStations.map((place) => (
                    <a key={place.id} href={place.mapsUrl} target="_blank" rel="noreferrer" className="block py-2 border-b last:border-0 border-gray-200/60 dark:border-[#333] hover:text-[#0e6670] dark:hover:text-[#e7b85b]">
                      <p className="text-xs font-extrabold">{place.name}</p>
                      <p className="text-[11px] text-gray-500 font-medium">{place.address}</p>
                    </a>
                  )) : <><p className="text-xs text-gray-500 dark:text-gray-400">No mapped stations found nearby.</p><a href={mapsSearchUrl('police station')} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-[#0e6670] dark:text-[#e7b85b] hover:underline">Search on Maps <ExternalLink size={12} /></a></>}
                </div>
                <div className="bg-white dark:bg-[#201e1e] p-5 rounded-2xl border border-gray-200 dark:border-[#333] shadow-sm">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-3">Required local services</h3>
                  <p className="mb-2 text-[11px] text-gray-500 dark:text-gray-400">{pincodeResult.serviceCategories.join(' • ')}</p>
                  {pincodeResult.serviceProviders.length ? pincodeResult.serviceProviders.map((place) => (
                    <a key={place.id} href={place.mapsUrl} target="_blank" rel="noreferrer" className="block py-2 border-b last:border-0 border-gray-200/60 dark:border-[#333] hover:text-[#0e6670] dark:hover:text-[#e7b85b]">
                      <p className="text-xs font-extrabold">{place.name}</p>
                      <p className="text-[11px] text-gray-500 font-medium">{place.address}</p>
                    </a>
                  )) : <><p className="text-xs text-gray-500 dark:text-gray-400">No mapped providers found nearby.</p><a href={mapsSearchUrl(pincodeResult.serviceCategories[0] || 'local service')} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-[#0e6670] dark:text-[#e7b85b] hover:underline">Search required service <ExternalLink size={12} /></a></>}
                </div>
                <div className="bg-white dark:bg-[#201e1e] p-5 rounded-2xl border border-gray-200 dark:border-[#333] shadow-sm">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-3">MLA / constituency</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">The PIN identifies {pincodeResult.district} district. Constituency boundaries and sitting MLAs can change, so verify the current representative through the official election directory.</p>
                  <a href={`https://www.google.com/search?q=${encodeURIComponent(`current MLA ${pincodeResult.area} ${pincodeResult.district} ${pincodeResult.state}`)}`} target="_blank" rel="noreferrer" className="inline-block mt-3 text-xs font-bold text-[#0e6670] dark:text-[#e7b85b] hover:underline">Search current constituency details ↗</a>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
