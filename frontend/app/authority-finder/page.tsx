'use client';

import { useState } from 'react';
import Link from 'next/link';
import { apiFetch } from '@/lib/api';

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
        const timeout = window.setTimeout(() => controller.abort(), 12000);
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
      const geocodeResponse = await fetchWithTimeout(
        `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=25&addressdetails=1&q=${searchArea}`
      );
      const geocodedPlaces: OSMPlace[] = geocodeResponse.ok ? await geocodeResponse.json() : [];
      const location = geocodedPlaces.find((place) => place.lat && place.lon);
      let places: OSMPlace[] = [];
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

  return (
    <div className="min-h-screen bg-[#fbfcf9] dark:bg-[#151414] text-gray-900 dark:text-gray-100 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-5xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-[#252323] text-blue-700 dark:text-[#e7b85b] text-xs font-bold border border-blue-100 dark:border-[#383535]">
            <span>🏛️</span>
            <span>Government Officer & PIO Directory</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Authority Finder
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Locate the exact Public Information Officer (PIO), Rent Controller, or Municipal Ward Commissioner for your city.
          </p>
        </div>

        <section className="bg-[#eaf4f1] dark:bg-[#1b2928] p-6 rounded-3xl border border-[#b9d9d1] dark:border-[#31514d] shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="state" className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">State / Union territory</label>
              <input id="state" value={state} onChange={(event) => setState(event.target.value)} placeholder="e.g. Maharashtra" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-[#333] bg-white dark:bg-[#282626] text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-[#0e6670]" />
            </div>
            <div>
              <label htmlFor="pincode" className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">PIN code</label>
              <input
                id="pincode"
                inputMode="numeric"
                maxLength={6}
                value={pincode}
                onChange={(event) => setPincode(event.target.value.replace(/\D/g, ''))}
                onKeyDown={(event) => event.key === 'Enter' && findByPincode()}
                placeholder="6-digit PIN code"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-[#333] bg-white dark:bg-[#282626] text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-[#0e6670]"
              />
            </div>
            <div>
              <label htmlFor="problem" className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">What is your problem?</label>
              <input id="problem" value={problem} onChange={(event) => setProblem(event.target.value)} onKeyDown={(event) => event.key === 'Enter' && findByPincode()} placeholder="e.g. broken water pipeline" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-[#333] bg-white dark:bg-[#282626] text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-[#0e6670]" />
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button type="button" onClick={findByPincode} disabled={pincodeLoading} className="bg-[#0e6670] hover:bg-[#094d54] disabled:opacity-60 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-all">
              {pincodeLoading ? 'Searching...' : 'Find the right department'}
            </button>
          </div>
          {pincodeError && <p className="mt-3 text-xs font-semibold text-rose-600 dark:text-rose-400">{pincodeError}</p>}
          {pincodeResult && (
            <div className="mt-6 space-y-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-[#0e6670] dark:text-[#e7b85b]">{pincodeResult.pincode}</p>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{pincodeResult.area}</h2>
                <p className="text-sm text-gray-600 dark:text-gray-300">{pincodeResult.district}, {pincodeResult.state}</p>
                <p className="mt-2 text-xs text-gray-600 dark:text-gray-300"><strong>Problem:</strong> {pincodeResult.problem}</p>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-[#201e1e] p-4 rounded-2xl border border-gray-200 dark:border-[#333]">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-3">Recommended authority</h3>
                  <p className="text-sm font-semibold text-[#0e6670] dark:text-[#e7b85b]">{pincodeResult.department}</p>
                  <p className="mt-2 text-xs text-gray-600 dark:text-gray-300">{pincodeResult.authorityLevel}</p>
                  <p className="mt-3 text-xs text-gray-600 dark:text-gray-300">{pincodeResult.complaintGuidance}</p>
                  <Link href={`/application-generator?issue=${encodeURIComponent(pincodeResult.problem)}`} className="inline-block mt-4 text-xs font-bold text-[#0e6670] dark:text-[#e7b85b] hover:underline">File a complaint ↗</Link>
                </div>
                <div className="bg-white dark:bg-[#201e1e] p-4 rounded-2xl border border-gray-200 dark:border-[#333]">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-3">Police stations</h3>
                  {pincodeResult.policeStations.length ? pincodeResult.policeStations.map((place) => (
                    <a key={place.id} href={place.mapsUrl} target="_blank" rel="noreferrer" className="block py-2 border-b last:border-0 border-gray-100 dark:border-[#333] hover:text-[#0e6670] dark:hover:text-[#e7b85b]">
                      <p className="text-sm font-semibold">{place.name}</p><p className="text-[11px] text-gray-500 dark:text-gray-400">{place.address}</p>
                    </a>
                  )) : <p className="text-xs text-gray-500 dark:text-gray-400">No mapped stations found nearby.</p>}
                </div>
                <div className="bg-white dark:bg-[#201e1e] p-4 rounded-2xl border border-gray-200 dark:border-[#333]">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-3">Required local services</h3>
                  <p className="mb-2 text-[11px] text-gray-500 dark:text-gray-400">{pincodeResult.serviceCategories.join(' • ')}</p>
                  {pincodeResult.serviceProviders.length ? pincodeResult.serviceProviders.map((place) => (
                    <a key={place.id} href={place.mapsUrl} target="_blank" rel="noreferrer" className="block py-2 border-b last:border-0 border-gray-100 dark:border-[#333] hover:text-[#0e6670] dark:hover:text-[#e7b85b]">
                      <p className="text-sm font-semibold">{place.name}</p><p className="text-[11px] text-gray-500 dark:text-gray-400">{place.address}</p>
                    </a>
                  )) : <p className="text-xs text-gray-500 dark:text-gray-400">No mapped providers found nearby.</p>}
                </div>
                <div className="bg-white dark:bg-[#201e1e] p-4 rounded-2xl border border-gray-200 dark:border-[#333]">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-3">MLA / constituency</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">The PIN identifies {pincodeResult.district} district. Constituency boundaries and sitting MLAs can change, so verify the current representative through the official election directory.</p>
                  <a href={`https://www.google.com/search?q=${encodeURIComponent(`current MLA ${pincodeResult.area} ${pincodeResult.district} ${pincodeResult.state}`)}`} target="_blank" rel="noreferrer" className="inline-block mt-3 text-xs font-bold text-[#0e6670] dark:text-[#e7b85b] hover:underline">Search current constituency details ↗</a>
                </div>
              </div>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">Area data: India Post. Nearby places: OpenStreetMap contributors. Verify contact details before visiting.</p>
            </div>
          )}
        </section>

      </div>
    </div>
  );
}
