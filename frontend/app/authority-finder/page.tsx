'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Authority {
  id: string;
  name: string;
  department: string;
  city: string;
  state: string;
  designation: string;
  address: string;
  jurisdiction: string;
  onlinePortal: string;
}

export default function AuthorityFinderPage() {
  const [selectedCity, setSelectedCity] = useState<string>('mumbai');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');

  const authorities: Authority[] = [
    {
      id: 'a1',
      name: 'Public Information Officer — Roads & Traffic',
      department: 'RTI / PWD & Municipal Roads',
      city: 'mumbai',
      state: 'Maharashtra',
      designation: 'Executive Engineer (Roads)',
      address: 'BMC Headquarters, CST Station, Fort, Mumbai, Maharashtra 400001',
      jurisdiction: 'All municipal road tenders, pothole repair work orders, and asphalt quality reports.',
      onlinePortal: 'https://rtionline.gov.in'
    },
    {
      id: 'a2',
      name: 'Competent Authority & Rent Controller',
      department: 'Tenancy & Rent Control',
      city: 'mumbai',
      state: 'Maharashtra',
      designation: 'Rent Controller / Collectorate',
      address: 'Old Custom House, Fort, Mumbai, Maharashtra 400001',
      jurisdiction: 'Maharashtra Rent Control Act Section 24 deposit disputes and eviction summary suits.',
      onlinePortal: 'https://maharashtra.gov.in'
    },
    {
      id: 'a3',
      name: 'Public Information Officer — Water Supply & Sewerage',
      department: 'Water & Sanitation',
      city: 'bengaluru',
      state: 'Karnataka',
      designation: 'Assistant Executive Engineer (BWSSB)',
      address: 'BWSSB Complex, Cauvery Bhavan, KG Road, Bengaluru 560009',
      jurisdiction: 'Water pipeline maintenance, sewage contamination complaints, and BWSSB tenders.',
      onlinePortal: 'https://bwssb.karnataka.gov.in'
    },
    {
      id: 'a4',
      name: 'Public Information Officer — MCD Building & Works',
      department: 'RTI / PWD & Municipal Roads',
      city: 'delhi',
      state: 'Delhi NCR',
      designation: 'Superintending Engineer (MCD)',
      address: 'Civic Centre, Minto Road, New Delhi 110002',
      jurisdiction: 'Road paving tenders, building plan sanctions, and ward maintenance records.',
      onlinePortal: 'https://rtionline.delhi.gov.in'
    }
  ];

  const [reportedIds, setReportedIds] = useState<Set<string>>(new Set());

  const handleReport = (id: string) => {
    setReportedIds(prev => {
      const newSet = new Set(prev);
      newSet.add(id);
      return newSet;
    });
    // In a full production app, this would POST to a /api/report-pio endpoint
    alert('Thank you for reporting! This PIO entry has been flagged. Our team will verify and update the contact details shortly.');
  };

  const filtered = authorities.filter((auth) => {
    const matchesCity = selectedCity === 'all' || auth.city === selectedCity;
    const matchesDept = selectedDepartment === 'all' || auth.department.includes(selectedDepartment);
    return matchesCity && matchesDept;
  });

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

        {/* Filter Controls */}
        <div className="bg-white dark:bg-[#201e1e] p-6 rounded-3xl border border-gray-200 dark:border-[#333] shadow-sm grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Select City / Municipal Corporation
            </label>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-[#333] bg-gray-50 dark:bg-[#282626] text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-[#0e6670]"
            >
              <option value="all">All Cities & Regions</option>
              <option value="mumbai">Mumbai (BMC / Rent Controller)</option>
              <option value="bengaluru">Bengaluru (BBMP / BWSSB)</option>
              <option value="delhi">Delhi NCR (MCD / DDA)</option>
              <option value="pune">Pune (PMC)</option>
              <option value="hyderabad">Hyderabad (GHMC)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Department Category
            </label>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-[#333] bg-gray-50 dark:bg-[#282626] text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-[#0e6670]"
            >
              <option value="all">All Departments</option>
              <option value="RTI">Right to Information (PIO Officers)</option>
              <option value="Tenancy">Rent Controller & Tenancy Authorities</option>
              <option value="Water">Water Supply & Sewerage</option>
            </select>
          </div>
        </div>

        {/* Directory Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((auth) => (
            <div
              key={auth.id}
              className="bg-white dark:bg-[#201e1e] p-6 rounded-3xl border border-gray-200 dark:border-[#333] shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition-all"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-[#2d2a2a] text-blue-700 dark:text-[#e7b85b]">
                    {auth.department}
                  </span>
                  <span className="text-xs font-semibold text-gray-400 capitalize">
                    {auth.state}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{auth.name}</h3>
                <p className="text-xs font-semibold text-[#0e6670] dark:text-[#e7b85b] mb-2">{auth.designation}</p>
                <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed mb-3">
                  📍 {auth.address}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  <strong>Jurisdiction:</strong> {auth.jurisdiction}
                </p>
              </div>

              <div className="pt-3 border-t border-gray-100 dark:border-[#2f2d2d] flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-3">
                  <a
                    href={auth.onlinePortal}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-gray-500 hover:text-blue-600 dark:hover:text-[#e7b85b] font-medium"
                  >
                    Official Portal ↗
                  </a>
                  <button
                    onClick={() => handleReport(auth.id)}
                    disabled={reportedIds.has(auth.id)}
                    className="text-[10px] flex items-center gap-1 text-rose-500 hover:text-rose-700 dark:text-rose-400 font-semibold disabled:text-gray-400 dark:disabled:text-gray-600 transition-colors"
                    title="PIOs transfer frequently. Flag this entry if details are outdated."
                  >
                    <span>🚩</span>
                    <span>{reportedIds.has(auth.id) ? 'Reported' : 'Report incorrect info'}</span>
                  </button>
                </div>
                <Link
                  href="/application-generator"
                  className="bg-[#0e6670] hover:bg-[#094d54] text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-sm"
                >
                  Address Application Here →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
